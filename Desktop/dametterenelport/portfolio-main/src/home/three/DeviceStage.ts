import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { createStudioEnvironment } from "./environment";
import { PhoneScreen, type ScreenContent, type ScreenVariant } from "./screenTexture";

export type DeviceConfig = {
  key: string;
  url: string;
  /** Largest dimension in world units after normalisation. */
  height: number;
  /**
   * Resting rotation in radians, relative to "display square to the camera".
   * For a device with no display it is relative to the model's own axes.
   */
  rest: [number, number, number];
  /** Name of the mesh that carries the display, if the device has one. */
  screenMesh?: string;
  /** Screen is inset from the panel edge by this fraction on each side. */
  screenInset?: number;
  /** Which lock screen to draw on the display. */
  screenVariant?: ScreenVariant;
  /** Wallpaper behind the lock screen furniture. */
  wallpaper?: string;
  /** Only the interactive device carries the navigation buttons. */
  interactive?: boolean;
  /**
   * The closing device. Instead of sliding out it holds its place and dollies
   * towards the reader, so the buttons on its screen end up close enough to
   * invite a tap.
   */
  approach?: boolean;
};

type Device = {
  config: DeviceConfig;
  /** Outer pivot: scroll position. */
  pivot: THREE.Group;
  /** Inner pivot: idle motion and rest pose. */
  inner: THREE.Group;
  materials: { mat: THREE.Material; transparent: boolean; opacity: number }[];
  screen?: THREE.Mesh;
  screenPanel?: THREE.Mesh;
  screenUi?: PhoneScreen;
  /** 0 when off stage, 1 when it holds the frame. */
  presence: number;
};

/**
 * GLTFLoader runs node names through sanitizeNodeName, which strips dots and
 * brackets outright — the "Cube.014_screen.001_0" a glTF inspector reports
 * arrives as "Cube014_screen001_0", while the material keeps its dots. So
 * compare with every separator removed, and accept a match on either name.
 */
const norm = (name: string) => name.toLowerCase().replace(/[\s._[\]:/-]/g, "");

function matchesScreen(mesh: THREE.Mesh, wanted: string): boolean {
  if (norm(mesh.name) === norm(wanted)) return true;
  const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  return norm(material?.name ?? "") === norm(wanted);
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export type StageCallbacks = {
  onProgress?: (loaded: number, total: number) => void;
  onReady?: () => void;
  onHover?: (deviceKey: string, index: number) => void;
  onSelect?: (deviceKey: string, index: number) => void;
};

export class DeviceStage {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private devices: Device[] = [];
  private clock = new THREE.Clock();
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2(0, 0);
  private pointerActive = false;
  private parallax = new THREE.Vector2(0, 0);
  private parallaxTarget = new THREE.Vector2(0, 0);

  /** Continuous chapter position, 0 .. devices-1 */
  private progress = 0;
  private renderedProgress = 0;

  private raf = 0;
  private running = false;
  private disposed = false;
  private envMap?: THREE.Texture;
  private hoveredIndex = -1;
  private callbacks: StageCallbacks;
  private dpr: number;
  private canvas: HTMLCanvasElement;
  /** How far sideways a device must travel to clear the frame, in world units. */
  private span = 6.6;
  private contextLost = false;
  private onContextLost = (event: Event) => {
    // Without preventDefault the context can never be restored, and without
    // stopping the loop three.js keeps issuing GL calls against a dead
    // context — hundreds of errors a second.
    event.preventDefault();
    this.contextLost = true;
    this.stop();
    console.warn("[stage] WebGL context lost");
  };
  private onContextRestored = () => {
    this.contextLost = false;
    console.warn("[stage] WebGL context restored");
    if (!this.disposed) this.start();
  };
  /** Idle float and pointer parallax are decoration; scroll motion is content. */
  private calm: boolean;

  constructor(canvas: HTMLCanvasElement, callbacks: StageCallbacks = {}) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.calm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    // Cap the pixel ratio hard. A full retina buffer on a fifty-material model
    // is the difference between a smooth scroll and a stuttering one, and at
    // this size, against this background, nobody can tell the two apart.
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.32;
    this.renderer.setClearAlpha(0);

    canvas.addEventListener("webglcontextlost", this.onContextLost, false);
    canvas.addEventListener("webglcontextrestored", this.onContextRestored, false);

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    this.camera.position.set(0, 0, 9.4);

    this.envMap = createStudioEnvironment(this.renderer);
    this.scene.environment = this.envMap;

    // Direct light on top of the environment. Polished aluminium needs an
    // actual source to streak along its chamfer — an env map alone leaves the
    // frame reading as matte plastic against this background.
    const key = new THREE.DirectionalLight(0xfff6e8, 3.4);
    key.position.set(-3.6, 4.6, 5.4);
    this.scene.add(key);

    // Grazing light from the left, almost in the plane of the screen: this is
    // the one that draws the bright edge down the side of the devices.
    const edge = new THREE.DirectionalLight(0xffffff, 2.2);
    edge.position.set(-6.5, 0.8, 1.6);
    this.scene.add(edge);

    const rim = new THREE.DirectionalLight(0xc9a86a, 3.6);
    rim.position.set(5.2, 1.4, -3.2);
    this.scene.add(rim);

    const fill = new THREE.DirectionalLight(0x8fa2c0, 0.85);
    fill.position.set(2.6, -2.8, 3.2);
    this.scene.add(fill);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.24));

    this.resize();
  }

  // -- loading -------------------------------------------------------------

  async load(configs: DeviceConfig[], screenContent: ScreenContent) {
    const draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    let done = 0;

    const loadOne = (config: DeviceConfig) =>
      new Promise<{ config: DeviceConfig; scene: THREE.Group }>((resolve, reject) => {
        loader.load(
          config.url,
          (gltf) => {
            done += 1;
            this.callbacks.onProgress?.(done, configs.length);
            resolve({ config, scene: gltf.scene });
          },
          undefined,
          reject
        );
      });

    const results = await Promise.all(configs.map(loadOne));

    if (this.disposed) {
      draco.dispose();
      return;
    }

    // Keep the declared order, so chapter 01 is always the first device.
    for (const config of configs) {
      const result = results.find((r) => r.config.key === config.key);
      if (result) this.addDevice(config, result.scene, screenContent);
    }

    draco.dispose();

    // Pose and draw once straight away, so the section is correct even if the
    // render loop has not been asked to start yet.
    this.frame();
    this.callbacks.onReady?.();
  }

  private addDevice(config: DeviceConfig, model: THREE.Group, screenContent: ScreenContent) {
    const pivot = new THREE.Group();
    const inner = new THREE.Group();
    pivot.add(inner);
    inner.add(model);

    // Normalise: centre on origin, scale so the tallest axis matches `height`.
    model.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const scale = config.height / Math.max(size.x, size.y, size.z);
    model.scale.setScalar(scale);
    model.position.copy(center).multiplyScalar(-scale);

    inner.rotation.set(...config.rest);

    const materials: Device["materials"] = [];
    const seen = new Set<THREE.Material>();
    let screen: THREE.Mesh | undefined;
    let screenUi: PhoneScreen | undefined;

    model.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;

      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of list) {
        if (!mat || seen.has(mat)) continue;
        seen.add(mat);
        materials.push({ mat, transparent: mat.transparent, opacity: mat.opacity });

        // Switch every material to blended once, here, and never again.
        // Toggling `transparent` at runtime recompiles the shader program, and
        // with fifty materials crossing the threshold on the same frame that
        // is a visible hitch twice per chapter. With opacity at 1 and depth
        // writes kept on, blended output is identical to opaque.
        if (!mat.transparent) {
          mat.transparent = true;
          mat.depthWrite = true;
        }

        const std = mat as THREE.MeshStandardMaterial;
        if (std.isMeshStandardMaterial) {
          std.envMapIntensity = 1.9;
          // Glass and polished metal in these models ship with roughness 0,
          // which reads as a mirror and loses the form entirely.
          if (std.roughness < 0.06) std.roughness = 0.08;
        }
      }

      if (config.screenMesh && matchesScreen(mesh, config.screenMesh)) {
        // Dim the model's own screen so the injected panel is the only thing lit
        const own = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        const ownStd = own as THREE.MeshStandardMaterial;
        if (ownStd?.isMeshStandardMaterial) {
          ownStd.map = null;
          ownStd.color.setHex(0x050505);
          ownStd.roughness = 0.22;
          ownStd.metalness = 0;
          ownStd.needsUpdate = true;
        }
        screen = mesh;
      }
    });

    if (config.screenMesh && !screen) {
      console.warn(`[stage] ${config.key}: no mesh named "${config.screenMesh}"`);
    }

    let screenPanel: THREE.Mesh | undefined;

    if (screen) {
      screenUi = new PhoneScreen({
        variant: config.screenVariant ?? "ios",
        content: screenContent,
        wallpaper: config.wallpaper,
        buttons: config.interactive === true,
      });
      screenPanel = this.buildScreenPanel(screen, inner, screenUi, config) ?? undefined;

      // The injected panel is not part of the imported model, so it has to be
      // registered for the fade by hand — otherwise a lit screen hangs in mid
      // air while the device it belongs to dissolves around it.
      if (screenPanel) {
        const mat = screenPanel.material as THREE.Material;
        materials.push({ mat, transparent: true, opacity: mat.opacity });
      }
    }

    if (!screenPanel) inner.rotation.set(...config.rest);

    this.scene.add(pivot);
    this.devices.push({
      config,
      pivot,
      inner,
      materials,
      screen,
      screenPanel,
      screenUi,
      presence: 0,
    });
  }

  /**
   * Builds a flat panel matched to the model's own screen mesh, and turns the
   * whole device so that panel faces the camera.
   *
   * Two things make the obvious approach fail. The imported screen mesh has a
   * UV island running from -0.97 to 0.82, so a canvas mapped straight onto it
   * lands half off the display; and at least one of these models carries a
   * negative scale on the screen node, which silently mirrors anything
   * parented to it. So the panel is measured in world space, rebuilt on an
   * explicitly right-handed basis, and attached to the device pivot instead of
   * to the mesh. Drawing, hit-testing and orientation then all agree by
   * construction.
   */
  private buildScreenPanel(
    screen: THREE.Mesh,
    inner: THREE.Group,
    ui: PhoneScreen,
    config: DeviceConfig
  ): THREE.Mesh | null {
    // Measure with the device unrotated, so inner-local space is world space.
    inner.rotation.set(0, 0, 0);
    inner.updateWorldMatrix(true, true);

    const geo = screen.geometry;
    geo.computeBoundingBox();
    const bb = geo.boundingBox;
    if (!bb) return null;

    const size = new THREE.Vector3();
    const localCenter = new THREE.Vector3();
    bb.getSize(size);
    bb.getCenter(localCenter);

    // Thinnest axis is the panel normal; of the rest, the longer one is "up".
    const axes: Array<"x" | "y" | "z"> = ["x", "y", "z"];
    const normalAxis = axes.reduce((a, b) => (size[a] <= size[b] ? a : b));
    const planar = axes.filter((a) => a !== normalAxis);
    const upAxis = size[planar[0]] >= size[planar[1]] ? planar[0] : planar[1];
    const rightAxis = planar.find((a) => a !== upAxis)!;

    const offset = (axis: "x" | "y" | "z", amount: number) => {
      const v = localCenter.clone();
      v[axis] += amount;
      return screen.localToWorld(v);
    };

    const worldCenter = screen.localToWorld(localCenter.clone());
    const worldUp = offset(upAxis, size[upAxis] / 2).sub(worldCenter);
    const worldRight = offset(rightAxis, size[rightAxis] / 2).sub(worldCenter);
    const worldOut = offset(normalAxis, Math.max(size[normalAxis] / 2, 1e-5)).sub(worldCenter);

    const height = worldUp.length() * 2;
    const width = worldRight.length() * 2;
    if (height < 1e-6 || width < 1e-6) return null;

    // Outward is whichever face sits further from the device's own centre.
    const deviceCenter = new THREE.Box3().setFromObject(inner).getCenter(new THREE.Vector3());
    const towardsFront = worldCenter.clone().sub(deviceCenter);
    const zAxis = worldOut.clone().normalize();
    if (zAxis.dot(towardsFront) < 0) zAxis.negate();

    // Keep the display the right way up, then force a right-handed basis so a
    // mirrored source node cannot flip the artwork.
    const yAxis = worldUp.clone().normalize();
    if (yAxis.y < 0) yAxis.negate();
    yAxis.addScaledVector(zAxis, -yAxis.dot(zAxis)).normalize();
    const xAxis = new THREE.Vector3().crossVectors(yAxis, zAxis).normalize();

    const inset = config.screenInset ?? 0.018;
    const material = new THREE.MeshBasicMaterial({
      map: ui.texture,
      transparent: true,
      toneMapped: false,
      depthWrite: false,
    });

    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(width * (1 - inset * 2), height * (1 - inset * 2)),
      material
    );
    panel.name = "__screen_panel";
    panel.renderOrder = 4;
    panel.frustumCulled = false;

    const basis = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
    panel.quaternion.setFromRotationMatrix(basis);
    panel.position.copy(worldCenter).addScaledVector(zAxis, Math.max(width * 0.004, 0.0015));

    inner.add(panel);

    // Bring the display square to the camera, then apply the artistic pose on
    // top of it in world axes.
    const upright = panel.quaternion.clone().invert();
    const pose = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(config.rest[0], config.rest[1], config.rest[2], "YXZ")
    );
    inner.quaternion.copy(upright).premultiply(pose);

    return panel;
  }

  // -- driving -------------------------------------------------------------

  setProgress(value: number) {
    this.progress = value;
  }

  setPointer(x: number, y: number, active: boolean) {
    // The pointer still drives the screen hit-test when motion is reduced —
    // only the parallax it would cause is dropped.
    this.pointer.set(x, y);
    this.pointerActive = active;
    if (this.calm) this.parallaxTarget.set(0, 0);
    else this.parallaxTarget.set(active ? x : 0, active ? y : 0);
  }

  /** The device whose screen is currently close enough to accept a tap. */
  private interactiveDevice(): Device | null {
    let best: Device | null = null;
    for (const device of this.devices) {
      if (!device.config.interactive || !device.screenPanel || !device.screenUi) continue;
      if (device.presence < 0.6) continue;
      if (!best || device.presence > best.presence) best = device;
    }
    return best;
  }

  /** Returns the button index under the pointer on the active device, or -1. */
  private updateScreenHover(): number {
    // Gate on presence rather than on the nearest chapter index: the closing
    // device stays interactive through its whole approach, which is precisely
    // the stretch where its buttons are largest.
    const device = this.interactiveDevice();
    if (!device || !this.pointerActive) return -1;

    const panel = device.screenPanel!;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObject(panel, false);
    if (!hits.length || !hits[0].uv) return -1;

    const uv = hits[0].uv;
    return device.screenUi.hitTest(uv.x, 1 - uv.y);
  }

  click() {
    // Resolve the hit here rather than trusting the cached hover state: on a
    // touch screen the pointer arrives and the tap fires within the same
    // frame, so `hoveredIndex` has not been computed yet and every button
    // would appear dead.
    const index = this.updateScreenHover();
    this.hoveredIndex = index;
    if (index < 0) return;
    const device = this.interactiveDevice();
    if (!device) return;
    device.screenUi?.setPressed(index);
    window.setTimeout(() => device.screenUi?.setPressed(-1), 180);
    this.callbacks.onSelect?.(device.config.key, index);
  }

  setScreenContent(content: ScreenContent) {
    for (const device of this.devices) device.screenUi?.setContent(content);
  }

  // -- loop ----------------------------------------------------------------

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.start();
    const tick = () => {
      if (!this.running) return;
      this.frame();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private frame() {
    if (this.contextLost) return;

    // getDelta() must come first: getElapsedTime() consumes the same delta
    // internally, which would leave dt at zero and freeze every easing below.
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.elapsedTime;

    // Ease the scroll value so a trackpad flick still resolves smoothly
    this.renderedProgress += (this.progress - this.renderedProgress) * Math.min(1, dt * 7.5);
    this.parallax.lerp(this.parallaxTarget, Math.min(1, dt * 3.4));

    for (let i = 0; i < this.devices.length; i++) {
      const device = this.devices[i];
      const t = this.renderedProgress - i;
      const dist = Math.abs(t);

      // The window is deliberately narrow. A wider one leaves two devices at
      // three-quarter opacity on top of each other at the handover, which
      // reads as a mistake rather than a transition. The closing device is the
      // exception: it is not being replaced, so it holds and only lets go at
      // the very end of its run.
      // The closing device gets its own curve in both directions. On the way
      // in it must be solid before the half-turn begins — a translucent case
      // is not a case. On the way out it holds while it comes closer, and
      // lets go only at the very end.
      let presence: number;
      if (device.config.approach) {
        presence =
          t < 0 ? 1 - smoothstep(0.5, 0.78, dist) : 1 - smoothstep(0.42, 0.62, dist);
      } else {
        presence = 1 - smoothstep(0.18, 0.62, dist);
      }
      device.presence = presence;

      const visible = presence > 0.002;
      device.pivot.visible = visible;
      if (!visible) continue;

      // Departure curve: nearly still while it holds the frame, then decisive.
      const drift = Math.sign(t) * Math.pow(dist, 1.2);

      // Idle float: the devices are meant to hang in the air, not sit on a
      // shelf. Suppressed entirely when the reader has asked for less motion.
      const float = this.calm ? 0 : 1;

      // The devices travel sideways as the page travels down: the next one
      // waits off to the right, the spent one leaves to the left.
      const approaching = device.config.approach && t >= 0;
      const arriving = device.config.approach && t < 0;

      let slide: number;
      let flip = 0;

      if (approaching) {
        slide = 0;
      } else if (arriving) {
        // The closing device is staged in three beats, in this order: it
        // slides in with its back to the reader, turns a full half-circle on
        // the spot to present the screen, and only then starts coming closer.
        // The windows below do not overlap, so each beat reads separately
        // instead of dissolving into one vague swivel.
        const u = -t;
        slide = smoothstep(0.3, 0.75, u) * this.span;
        flip = smoothstep(0.08, 0.45, u) * Math.PI;
      } else {
        slide = -drift * this.span;
      }

      // Coming closer instead of leaving: a short, bounded dolly towards the
      // reader — enough to bring the buttons within reach, not so much that
      // the device outgrows the frame.
      const dolly = approaching
        ? smoothstep(0, 0.42, dist) * 1.6
        : -Math.pow(dist, 1.6) * 2.4;

      device.pivot.position.set(
        slide + this.parallax.x * 0.34,
        this.parallax.y * 0.2 + Math.sin(time * 0.52 + i) * 0.055 * float,
        dolly
      );

      let yaw: number;
      if (approaching) yaw = t * -0.16;
      else if (arriving) yaw = flip;
      else yaw = t * 0.62;

      device.pivot.rotation.set(
        this.parallax.y * -0.16 + Math.sin(time * 0.31 + i * 1.7) * 0.045 * float,
        yaw + this.parallax.x * 0.3 + Math.sin(time * 0.23 + i) * 0.17 * float,
        device.config.approach ? 0 : drift * 0.05
      );

      const scale = device.config.approach ? 1 : 1 - Math.pow(dist, 1.5) * 0.12;
      device.pivot.scale.setScalar(scale);

      // Fade. Only the opacity moves — `transparent` and `depthWrite` were
      // settled at load precisely so this loop cannot trigger a recompile.
      for (const entry of device.materials) {
        entry.mat.opacity = entry.opacity * presence;
      }

      device.screenUi?.setIntro(smoothstep(0.55, 0.1, dist));
    }

    // Hover state for the interactive screen
    const hovered = this.updateScreenHover();
    if (hovered !== this.hoveredIndex) {
      this.hoveredIndex = hovered;
      const device = this.interactiveDevice();
      device?.screenUi?.setHovered(hovered);
      this.callbacks.onHover?.(device?.config.key ?? "", hovered);
      this.canvas.style.cursor = hovered >= 0 ? "pointer" : "";
    }

    this.renderer.render(this.scene, this.camera);
  }

  /** Development only: describes what the stage actually built. */
  debug() {
    return this.devices.map((d) => ({
      key: d.config.key,
      quat: d.inner.quaternion.toArray().map((v) => Number(v.toFixed(3))),
      panel: d.screenPanel
        ? {
            pos: d.screenPanel.position.toArray().map((v) => Number(v.toFixed(3))),
            parent: d.screenPanel.parent?.type,
          }
        : null,
      pivotRot: d.pivot.rotation.toArray().slice(0, 3).map((v) => Number((v as number).toFixed(3))),
      presence: Number(d.presence.toFixed(3)),
    }));
  }

  // -- lifecycle -----------------------------------------------------------

  resize() {
    const parent = this.canvas.parentElement;
    const width = parent?.clientWidth || window.innerWidth;
    const height = parent?.clientHeight || window.innerHeight;

    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;

    // Pull back on narrow screens so a portrait phone still fits the frame
    const portrait = width / height < 0.9;
    this.camera.position.z = portrait ? 12.4 : 9.4;
    this.camera.fov = portrait ? 32 : 30;
    this.camera.updateProjectionMatrix();

    // Measure how wide the frame actually is at the devices' depth, so they
    // travel exactly far enough to clear it on any viewport.
    const visibleHeight = 2 * this.camera.position.z * Math.tan((this.camera.fov * Math.PI) / 360);
    this.span = visibleHeight * this.camera.aspect * 0.62 + 1.6;
  }

  dispose() {
    this.disposed = true;
    this.stop();

    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.geometry?.dispose();
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of list) {
        if (!mat) continue;
        for (const value of Object.values(mat)) {
          if (value && (value as THREE.Texture).isTexture) (value as THREE.Texture).dispose();
        }
        mat.dispose();
      }
    });

    for (const device of this.devices) device.screenUi?.dispose();
    this.devices = [];
    this.envMap?.dispose();

    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored);

    // dispose() frees three's own resources but leaves the WebGL context
    // itself alive. A browser allows only a handful at a time, so a stage
    // rebuilt on every route change or hot reload quietly exhausts them until
    // the renderer process is killed. forceContextLoss() hands it back.
    this.renderer.forceContextLoss();
    this.renderer.dispose();
  }
}
