import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/language";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const MODEL_URL = "/models/modelloIphone15Sito.glb";

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;

const frameObject = (object: THREE.Object3D) => {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const largestSide = Math.max(size.x, size.y, size.z) || 1;

  const scale = 2.25 / largestSide;
  object.scale.setScalar(scale);
  object.position.copy(center.multiplyScalar(-scale));
};

const createLinearBrushedNormalMap = () => {
  const size = 256;
  const data = new Uint8Array(size * size * 3);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const grain =
        Math.sin(x * 0.42) * 5 +
        Math.sin(x * 1.7 + y * 0.025) * 2 +
        (Math.random() - 0.5) * 3;
      const index = (y * size + x) * 3;
      data[index] = 128 + grain;
      data[index + 1] = 128 + Math.sin(y * 0.08) * 1.5;
      data[index + 2] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 1);
  texture.needsUpdate = true;
  return texture;
};

const createGlassMicroNormalMap = () => {
  const size = 256;
  const data = new Uint8Array(size * size * 3);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const smudge = Math.sin((x + y) * 0.045) * 2 + Math.sin(x * 0.13) * 1.5 + (Math.random() - 0.5) * 3;
      const scratch = Math.sin(x * 2.4 + y * 0.018) * 1.2;
      const index = (y * size + x) * 3;
      data[index] = 128 + smudge + scratch;
      data[index + 1] = 128 + smudge * 0.45;
      data[index + 2] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.4, 2.4);
  texture.needsUpdate = true;
  return texture;
};

const CONTACT_EMAIL = "claudia.napolitano@gmail.com";

const buttonConfigs = [
  { id: "projects", label: "my projects", path: "/projects" },
  { id: "about", label: "about me", path: "/about" },
  { id: "contact", label: "contact me", path: `mailto:${CONTACT_EMAIL}` },
] as const;

type ButtonId = (typeof buttonConfigs)[number]["id"];

type ButtonBounds = {
  id: ButtonId;
  x: number;
  y: number;
  width: number;
  height: number;
};

type RectBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ButtonVisualState = Record<ButtonId, { current: number; target: number }>;

type RevealState = {
  active: boolean;
  progress: number;
  x: number;
  y: number;
};

const ensureMinecraftFontLoaded = (() => {
  let promise: Promise<void> | null = null;
  return () => {
    if (promise) return promise;
    if (typeof document === "undefined" || !("fonts" in document)) {
      promise = Promise.resolve();
      return promise;
    }
    promise = document.fonts
      .load("800 80px Minecraft")
      .then(() => undefined)
      .catch(() => undefined);
    return promise;
  };
})();

const createScreenUi = (
  onReady?: () => void,
  initialLabels?: Partial<Record<ButtonId, string>>
) => {
  const debugScreen = new URLSearchParams(window.location.search).has("debugScreen");
  const canvas = document.createElement("canvas");
  canvas.width = 1536;
  canvas.height = 3328;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to create 2D context for iPhone screen texture");
  }
  const scale = canvas.width / 1536;
  const backgroundImage = new Image();
  // Wallpaper for the phone screen.
  // Must be placed at: public/backgrounds/iphone-screen-background.jpg
  backgroundImage.src = "/backgrounds/iphone-screen-background.jpg";
  backgroundImage.decoding = "async";
  backgroundImage.crossOrigin = "anonymous";
  let backgroundReady = false;

  const buttonBounds: ButtonBounds[] = buttonConfigs.map((config, index) => ({
    id: config.id,
    x: 190 * scale,
    y: (1110 + index * 380) * scale,
    width: 1156 * scale,
    height: 232 * scale,
  }));
  const dynamicIslandBounds: RectBounds = {
    x: canvas.width / 2 - 190 * scale,
    y: 48 * scale,
    width: 380 * scale,
    height: 116 * scale,
  };
  const buttonVisualState = buttonConfigs.reduce((state, config) => {
    state[config.id] = { current: 0, target: 0 };
    return state;
  }, {} as ButtonVisualState);
  // Mutable label map so the labels can be swapped at runtime (language change)
  // without recreating the whole 3D scene.
  const buttonLabels = buttonConfigs.reduce((map, config) => {
    map[config.id] = initialLabels?.[config.id] ?? config.label;
    return map;
  }, {} as Record<ButtonId, string>);
  const revealState: RevealState = {
    active: false,
    progress: 0,
    x: canvas.width / 2,
    y: canvas.height / 2,
  };
  let selectedButtonId: ButtonId | null = null;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  // If the wallpaper loads later, redraw and update texture.
  backgroundImage.onload = () => {
    backgroundReady = true;
    if (debugScreen) {
      console.log("[iPhoneScreen] wallpaper loaded", {
        src: backgroundImage.src,
        naturalWidth: backgroundImage.naturalWidth,
        naturalHeight: backgroundImage.naturalHeight,
      });
    }
    draw();
    texture.needsUpdate = true;
  };
  backgroundImage.onerror = () => {
    // Keep the black fallback background if the asset is missing/invalid.
    backgroundReady = false;
    if (debugScreen) {
      console.log("[iPhoneScreen] wallpaper failed to load", { src: backgroundImage.src });
    }
  };

  const isInDynamicIsland = (x: number, y: number) =>
    x >= dynamicIslandBounds.x &&
    x <= dynamicIslandBounds.x + dynamicIslandBounds.width &&
    y >= dynamicIslandBounds.y &&
    y <= dynamicIslandBounds.y + dynamicIslandBounds.height;

  const drawDynamicIsland = () => {
    const { x, y, width, height } = dynamicIslandBounds;

    ctx.save();
    ctx.shadowColor = "rgba(255,255,255,0.16)";
    ctx.shadowBlur = 4 * scale;
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, height / 2);
    ctx.fill();
    ctx.restore();
  };

  const drawButton = (bounds: ButtonBounds) => {
    const config = buttonConfigs.find((button) => button.id === bounds.id);
    if (!config) return;

    const progress = buttonVisualState[bounds.id].current;
    const selected = bounds.id === selectedButtonId;
    const eased = 1 - Math.pow(1 - progress, 3);
    const grow = 24 * scale * eased;
    const lift = 9 * scale * eased;
    const x = bounds.x - grow / 2;
    const y = bounds.y - grow / 2 - lift;
    const width = bounds.width + grow;
    const height = bounds.height + grow;
    const radius = (58 + 10 * eased) * scale;

    ctx.save();
    ctx.shadowColor = `rgba(63, 20, 136, ${0.18 + 0.16 * eased})`;
    ctx.shadowBlur = (20 + 22 * eased) * scale;
    ctx.shadowOffsetY = (10 + 10 * eased) * scale;
    const buttonGradient = ctx.createLinearGradient(x, y, x + width, y + height);
    const startColor = selected ? "#7440dc" : "#6330c7";
    const endColor = selected ? "#5122b8" : "#5f2bc2";
    buttonGradient.addColorStop(0, progress > 0.01 ? "#8a57ee" : startColor);
    buttonGradient.addColorStop(1, progress > 0.01 ? "#642bd2" : endColor);
    ctx.fillStyle = buttonGradient;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
    ctx.restore();

    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, `rgba(255,255,255,${0.16 + 0.12 * eased})`);
    gradient.addColorStop(1, "rgba(255,255,255,0.02)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x + 4 * scale, y + 4 * scale, width - 8 * scale, height - 8 * scale, radius - 4 * scale);
    ctx.fill();

    if (eased > 0.01) {
      ctx.save();
      ctx.strokeStyle = `rgba(255,255,255,${0.28 + 0.34 * eased})`;
      ctx.lineWidth = (4 + 3 * eased) * scale;
      ctx.shadowColor = "rgba(255,255,255,0.58)";
      ctx.shadowBlur = 28 * scale * eased;
      ctx.beginPath();
      ctx.roundRect(x + 8 * scale, y + 8 * scale, width - 16 * scale, height - 16 * scale, radius - 8 * scale);
      ctx.stroke();
      ctx.restore();
    }

  ctx.fillStyle = "#ffffff";
  ctx.font = `800 ${(80 + 3 * eased) * scale}px Minecraft, "Press Start 2P", "Space Mono", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(buttonLabels[bounds.id] ?? config.label, x + width / 2, y + height / 2 + 3 * scale);
  };

  const drawCircularReveal = () => {
    if (!revealState.active && revealState.progress <= 0) return;

    const eased = 1 - Math.pow(1 - revealState.progress, 3);
    const maxRadius = Math.hypot(canvas.width, canvas.height);
    ctx.save();
    ctx.globalAlpha = Math.max(0, 0.82 * (1 - revealState.progress * 0.72));
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(revealState.x, revealState.y, maxRadius * eased, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width, canvas.height);
    ctx.rotate(Math.PI);

    // Ensure normal compositing.
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    if (backgroundReady) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Debug: show the raw wallpaper without overlays (edge fade / island / etc.).
    if (debugScreen) {
      ctx.restore();
      texture.needsUpdate = true;
      return;
    }

    // Keep the wallpaper edge to edge, then paint the Dynamic Island into the
    // display texture as well. This avoids any GLTF material/UV bleed turning
    // the notch purple on top of the real mesh.
    drawDynamicIsland();

    buttonBounds.forEach((bounds) => drawButton(bounds));
    drawCircularReveal();
    drawDynamicIsland();
    ctx.restore();
    texture.needsUpdate = true;
  };

  const setInteraction = (hoveredId: ButtonId | null, nextSelectedId: ButtonId | null) => {
    selectedButtonId = nextSelectedId;
    buttonConfigs.forEach(({ id }) => {
      buttonVisualState[id].target = id === hoveredId ? 1 : id === selectedButtonId ? 0.58 : 0;
    });
  };

  const startReveal = (buttonId: ButtonId) => {
    const bounds = buttonBounds.find((button) => button.id === buttonId);
    if (!bounds) return;

    revealState.active = true;
    revealState.progress = 0;
    revealState.x = bounds.x + bounds.width / 2;
    revealState.y = bounds.y + bounds.height / 2;
  };

  const update = () => {
    let changed = false;
    buttonConfigs.forEach(({ id }) => {
      const state = buttonVisualState[id];
      const delta = state.target - state.current;
      if (Math.abs(delta) > 0.001) {
        state.current += delta * 0.2;
        changed = true;
      } else if (state.current !== state.target) {
        state.current = state.target;
        changed = true;
      }
    });
    if (revealState.active) {
      revealState.progress = Math.min(1, revealState.progress + 0.035);
      changed = true;
      if (revealState.progress >= 1) {
        revealState.active = false;
      }
    } else if (revealState.progress > 0) {
      revealState.progress = Math.max(0, revealState.progress - 0.08);
      changed = true;
    }
    if (changed) draw();
  };

  draw();
  ensureMinecraftFontLoaded().then(() => {
    draw();
    onReady?.();
  });

  const setLabels = (next: Partial<Record<ButtonId, string>>) => {
    let changed = false;
    (Object.keys(next) as ButtonId[]).forEach((id) => {
      const value = next[id];
      if (typeof value === "string" && buttonLabels[id] !== value) {
        buttonLabels[id] = value;
        changed = true;
      }
    });
    if (changed) draw();
  };

  return {
    buttonBounds,
    canvas,
    draw,
    isInDynamicIsland,
    setInteraction,
    setLabels,
    startReveal,
    texture,
    update,
  };
};

const objectPath = (object: THREE.Object3D) => {
  const names: string[] = [];
  let current: THREE.Object3D | null = object;

  while (current) {
    if (current.name) names.push(current.name);
    current = current.parent;
  }

  return names.reverse().join(" ").toLowerCase();
};

const getPhoneMaterialRole = (mesh: THREE.Mesh) => {
  const name = objectPath(mesh);

  // Check the more specific names first so things like "screen_dynamic_island"
  // are tagged as "island" instead of falling through to the generic "screen".
  if (name.includes("island") || name.includes("notch") || name.includes("dynamic")) return "island";
  if (name.includes("camera glass")) return "removeCameraArtifact";
  if (name.includes("back camera")) return "cameraBase";
  if (name.includes("lens dark face")) return "replaceLensGeometry";
  if (name.includes("flash glass") || name.includes("flash mtl")) return "flash";
  if (name.includes("front camra")) return "lidar";
  if (name.includes("apple logo")) return "appleLogo";
  if (name.includes("screen")) return "screen";
  if (name.includes("back")) return "backGlass";
  if (name.includes("phone case") || name.includes("scroo") || name.includes("sound box")) return "frame";
  if (name.includes("cylinder")) return "replaceLensGeometry";

  return null;
};

const IPhoneScrollScene = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const screenUiRef = useRef<ReturnType<typeof createScreenUi> | null>(null);
  // Keep a ref of the latest labels so the 3D-scene effect (which only mounts
  // once) can read them at setup time without re-running on every lang change.
  const labelsRef = useRef({
    projects: t.phoneProjects,
    about: t.phoneAbout,
    contact: t.phoneContact,
  });
  labelsRef.current = {
    projects: t.phoneProjects,
    about: t.phoneAbout,
    contact: t.phoneContact,
  };

  useEffect(() => {
    screenUiRef.current?.setLabels({
      projects: t.phoneProjects,
      about: t.phoneAbout,
      contact: t.phoneContact,
    });
  }, [t.phoneProjects, t.phoneAbout, t.phoneContact]);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    let lensGlassMaterial: THREE.MeshPhysicalMaterial | null = null;
    let lensBackingMaterial: THREE.MeshPhysicalMaterial | null = null;
    let lensCoverMaterial: THREE.MeshPhysicalMaterial | null = null;
    let frameMaterial: THREE.MeshPhysicalMaterial | null = null;
    let backGlassMaterial: THREE.MeshPhysicalMaterial | null = null;
    let cameraBaseMaterial: THREE.MeshPhysicalMaterial | null = null;
    let lensRingMaterial: THREE.MeshPhysicalMaterial | null = null;
    let flashMaterial: THREE.MeshPhysicalMaterial | null = null;
    let lidarMaterial: THREE.MeshPhysicalMaterial | null = null;
    let appleLogoMaterial: THREE.MeshPhysicalMaterial | null = null;
    let brushedAluminumNormalMap: THREE.DataTexture | null = null;
    let glassMicroNormalMap: THREE.DataTexture | null = null;
    let edgeMaterial: THREE.LineBasicMaterial | null = null;
    let screenMaterial: THREE.MeshBasicMaterial | null = null;
    let screenBlackMaterial: THREE.MeshBasicMaterial | null = null;
    let screenMesh: THREE.Mesh | null = null;
    let screenUi: ReturnType<typeof createScreenUi> | null = null;
    const islandMeshes: THREE.Mesh[] = [];
    const replacementLensGeometries: THREE.BufferGeometry[] = [];
    const lensBackingGeometries: THREE.BufferGeometry[] = [];
    const lensCoverGeometries: THREE.BufferGeometry[] = [];
    let hoveredButtonId: ButtonId | null = null;
    let selectedButtonId: ButtonId | null = null;
    let routeRevealElement: HTMLDivElement | null = null;
    let routeRevealTimer = 0;
    let routeRevealCleanupTimer = 0;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.1, 6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.02).texture;
    scene.environment = environment;
    scene.background = null;

    // Big soft key light (top-left, warm white) — the dominant light source.
    const keyLight = new THREE.RectAreaLight(0xfff4e5, 2.4, 5.2, 5.2);
    keyLight.position.set(-3.2, 3.4, 4.2);
    keyLight.lookAt(0, 0, 0);
    scene.add(keyLight);

    // Cool fill from the opposite side so the titanium reads as metal, not paint.
    const fillLight = new THREE.DirectionalLight(0xcfd9ff, 0.55);
    fillLight.position.set(3.4, -1.8, 2.5);
    scene.add(fillLight);

    // Rim light from behind / above, gives the iPhone its silhouette glow.
    const rimLight = new THREE.RectAreaLight(0xffffff, 2.2, 2.6, 4.4);
    rimLight.position.set(1.4, 1.2, -3.8);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);

    // Catch-light on the camera glass.
    const lensCatchLight = new THREE.PointLight(0xffffff, 1.1, 8);
    lensCatchLight.position.set(-1.35, 2.15, 2.3);
    scene.add(lensCatchLight);

    // Small highlight dedicated to the camera cluster so the glass reads clearly.
    const cameraHighlight = new THREE.PointLight(0xbad0ff, 0.7, 2.2);
    cameraHighlight.position.set(0.65, 1.15, 1.2);
    scene.add(cameraHighlight);

    const phoneRoot = new THREE.Group();
    phoneRoot.rotation.set(-0.05, Math.PI, 0.08);
    phoneRoot.position.set(0, 0.1, 0.5);
    phoneRoot.scale.setScalar(0.68);
    scene.add(phoneRoot);

  const loader = new GLTFLoader();
    loader.load(MODEL_URL, (gltf) => {
      const model = gltf.scene;
      screenUi = createScreenUi(undefined, labelsRef.current);
      screenUiRef.current = screenUi;
      brushedAluminumNormalMap = createLinearBrushedNormalMap();
      glassMicroNormalMap = createGlassMicroNormalMap();
      // Screen: emissive-based so the canvas pixels stay bright/saturated,
      // while a clearcoat on top adds the subtle glass reflection of a real
      // iPhone 15 Pro display.
      screenMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        emissive: 0xffffff,
        emissiveMap: screenUi.texture,
        emissiveIntensity: 1.05,
        toneMapped: false,
        metalness: 0,
        roughness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 0.5,
        side: THREE.DoubleSide,
      });
      screenBlackMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        toneMapped: false,
        side: THREE.DoubleSide,
      });
      // Natural Titanium frame — warm light grey, slightly anisotropic to read
      // as brushed metal under the lights.
      frameMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xb9b2a5,
        metalness: 1,
        roughness: 0.32,
        anisotropy: 0.85,
        anisotropyRotation: 0,
        specularIntensity: 0.95,
        normalMap: brushedAluminumNormalMap,
        normalScale: new THREE.Vector2(0.12, 0.022),
        envMapIntensity: 1.65,
      });
      // Matte/frosted back glass with a Natural Titanium tint.
      backGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xc6bfb1,
        metalness: 0,
        roughness: 0.45,
        specularIntensity: 0.6,
        ior: 1.5,
        transmission: 0,
        clearcoat: 0.7,
        clearcoatRoughness: 0.32,
        normalMap: glassMicroNormalMap,
        normalScale: new THREE.Vector2(0.035, 0.035),
        envMapIntensity: 1.25,
      });
      // The raised plateau that holds the cameras: same titanium as the frame.
      cameraBaseMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xb9b2a5,
        metalness: 1,
        roughness: 0.34,
        anisotropy: 0.7,
        anisotropyRotation: 0,
        specularIntensity: 0.95,
        normalMap: brushedAluminumNormalMap,
        normalScale: new THREE.Vector2(0.085, 0.018),
        envMapIntensity: 1.6,
      });
      // Lens glass — very dark, very glossy, with a soft blue inner attenuation
      // that mimics the multi-element coating you see on real iPhone optics.
      lensGlassMaterial = new THREE.MeshPhysicalMaterial({
        name: "iPhone_Lens_Glass",
        color: new THREE.Color(0x05070d),
        metalness: 0,
        roughness: 0.02,
        ior: 1.74,
        transmission: 0.18,
        thickness: 0.12,
        transparent: false,
        attenuationColor: new THREE.Color(0x0a1530),
        attenuationDistance: 0.04,
        clearcoat: 1,
        clearcoatRoughness: 0.008,
        specularIntensity: 1,
        specularColor: new THREE.Color(0x9bb8ff),
        envMapIntensity: 4.5,
        emissive: new THREE.Color(0x060a16),
        emissiveIntensity: 0.025,
      });
      lensBackingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x010104,
        metalness: 0,
        roughness: 0.16,
        clearcoat: 0.55,
        clearcoatRoughness: 0.02,
        emissive: new THREE.Color(0x050513),
        emissiveIntensity: 0.018,
        envMapIntensity: 1.2,
      });
      lensCoverMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2a2f44,
        specularColor: new THREE.Color(0xffffff),
        specularIntensity: 1,
        metalness: 0,
        roughness: 0.015,
        clearcoat: 1,
        clearcoatRoughness: 0.01,
        transmission: 0.98,
        thickness: 0.018,
        ior: 1.52,
        transparent: true,
        opacity: 0.12,
        envMapIntensity: 13,
        normalMap: glassMicroNormalMap,
        normalScale: new THREE.Vector2(0.14, 0.14),
      });
      // Polished dark chrome ring around each lens (very glossy, almost black).
      lensRingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0c0c10,
        metalness: 1,
        roughness: 0.06,
        anisotropy: 0.25,
        anisotropyRotation: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.015,
        envMapIntensity: 3.2,
      });
      flashMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf0eee8,
        metalness: 0,
        roughness: 0.4,
        transmission: 0.3,
        thickness: 0.12,
        ior: 1.46,
        clearcoat: 0.5,
        clearcoatRoughness: 0.22,
        envMapIntensity: 1.7,
      });
      lidarMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1c1c1c,
        metalness: 0.3,
        roughness: 0.2,
        clearcoat: 0.45,
        clearcoatRoughness: 0.08,
        envMapIntensity: 2.2,
      });
      // Apple logo: same titanium tone but more polished than the brushed
      // frame, so it catches reflections like the real laser-etched inlay.
      appleLogoMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xcec8bb,
        metalness: 1,
        roughness: 0.18,
        specularIntensity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        envMapIntensity: 2.1,
      });
      // Very subtle dark edge outline — just enough to read the panel breaks
      // without making the phone look stylised/comic.
      edgeMaterial = new THREE.LineBasicMaterial({
        color: 0x1a1a1a,
        transparent: true,
        opacity: 0.06,
      });
      const applyStudioEnvironment = (material: THREE.Material) => {
        if ("envMap" in material) {
          material.envMap = environment;
        }
        material.needsUpdate = true;
      };
      if (lensCoverMaterial) {
        applyStudioEnvironment(lensCoverMaterial);
      }
      if (lensBackingMaterial) {
        applyStudioEnvironment(lensBackingMaterial);
      }
      const removedCameraArtifacts: THREE.Object3D[] = [];
      const lensReplacementTargets: Array<{ position: THREE.Vector3; radius: number }> = [];
      model.updateMatrixWorld(true);

      // Pre-pass: among every mesh that matches the "screen" role, the largest
      // is the actual display surface. Everything smaller (inner bezel rings,
      // edge frames) gets pure black so the visible wallpaper area is clean.
      let primaryScreen: THREE.Mesh | null = null;
      let primaryScreenVolume = 0;
      model.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        if (getPhoneMaterialRole(child) !== "screen") return;
        const box = new THREE.Box3().setFromObject(child);
        const size = box.getSize(new THREE.Vector3());
        const volume = size.x * size.y * size.z;
        if (volume > primaryScreenVolume) {
          primaryScreenVolume = volume;
          primaryScreen = child;
        }
      });

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.frustumCulled = false;
          const materialRole = getPhoneMaterialRole(child);
          if (materialRole === "removeCameraArtifact" || materialRole === "replaceLensGeometry") {
            if (materialRole === "replaceLensGeometry") {
              const box = new THREE.Box3().setFromObject(child);
              const size = box.getSize(new THREE.Vector3());
              const radius = Math.max(size.x, size.y) * (objectPath(child).includes("cylinder") ? 0.28 : 0.62);
              if (radius > 0.04) {
                lensReplacementTargets.push({
                  position: box.getCenter(new THREE.Vector3()),
                  radius,
                });
              }
            }
            removedCameraArtifacts.push(child);
            return;
          }
          if (materialRole === "screen") {
            if (child === primaryScreen) {
              // The actual OLED display surface — gets the wallpaper canvas.
              screenMesh = child;
              if (screenMaterial) {
                child.material = screenMaterial;
              }
            } else {
              // Smaller screen-tagged meshes are the inner bezel/frame planes
              // that produced the purple side-band artifacts and that would
              // also visibly scale together with the on-canvas button
              // animations (because they share UV space). Eliminate them
              // entirely.
              child.visible = false;
              return;
            }
          } else if (materialRole === "island" && screenBlackMaterial) {
            child.material = screenBlackMaterial;
            // Dynamic Island sits on top of the screen plane.
            child.renderOrder = 10;
            // Track this mesh so its clicks are consumed by the raycaster and
            // never bleed through to the buttons below.
            islandMeshes.push(child);
          } else if (materialRole === "frame" && frameMaterial) {
            child.material = frameMaterial;
          } else if (materialRole === "backGlass" && backGlassMaterial) {
            child.material = backGlassMaterial;
          } else if (materialRole === "cameraBase" && cameraBaseMaterial) {
            child.material = cameraBaseMaterial;
          } else if (materialRole === "flash" && flashMaterial) {
            child.material = flashMaterial;
          } else if (materialRole === "lidar" && lidarMaterial) {
            child.material = lidarMaterial;
          } else if (materialRole === "appleLogo" && appleLogoMaterial) {
            child.material = appleLogoMaterial;
          } else if (materialRole === null) {
            // Anything we didn't classify still belongs to the phone body
            // (side bezels, antenna lines, hidden internal parts that show at
            // grazing angles). Give them the titanium frame material so they
            // blend into the chassis instead of either disappearing or
            // bleeding the GLTF's authored purple/violet colours.
            if (frameMaterial) {
              child.material = frameMaterial;
            }
          }
          if (child.geometry) {
            const edges = new THREE.EdgesGeometry(child.geometry, 35);
            const outline = new THREE.LineSegments(edges, edgeMaterial);
            child.add(outline);
          }
          if (materialRole === "cameraBase" || materialRole === "flash" || materialRole === "lidar") {
            child.material.side = THREE.DoubleSide;
          }
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            applyStudioEnvironment(material);
          });
        }
      });
      removedCameraArtifacts.forEach((artifact) => {
        artifact.parent?.remove(artifact);
      });
      if (lensGlassMaterial && lensBackingMaterial && lensRingMaterial && lensCoverMaterial) {
        const uniqueTargets = lensReplacementTargets.filter((target, index, targets) =>
          targets.findIndex((candidate) => candidate.position.distanceTo(target.position) < 0.035) === index
        );
        uniqueTargets.slice(0, 3).forEach(({ position, radius }) => {
          const localPosition = model.worldToLocal(position.clone());
          const ringGeometry = new THREE.TorusGeometry(radius * 1.08, radius * 0.08, 18, 112);
          replacementLensGeometries.push(ringGeometry);
          const ring = new THREE.Mesh(ringGeometry, lensRingMaterial);
          ring.name = "recreated lens black chrome ring";
          ring.position.copy(localPosition);
          ring.position.z -= 0.014;
          ring.renderOrder = 5;
          model.add(ring);

          const backingGeometry = new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, 0.004, 112);
          lensBackingGeometries.push(backingGeometry);
          const backing = new THREE.Mesh(backingGeometry, lensBackingMaterial);
          backing.name = "recreated deep black lens backing";
          backing.rotation.x = Math.PI / 2;
          backing.position.copy(localPosition);
          backing.position.z -= 0.028;
          backing.renderOrder = 5;
          model.add(backing);

          const lensGeometry = new THREE.CylinderGeometry(radius * 0.86, radius * 0.86, 0.006, 112);
          replacementLensGeometries.push(lensGeometry);
          const lens = new THREE.Mesh(lensGeometry, lensGlassMaterial);
          lens.name = "recreated iPhone optical lens";
          lens.rotation.x = Math.PI / 2;
          lens.position.copy(localPosition);
          lens.position.z -= 0.025;
          lens.renderOrder = 6;
          model.add(lens);

          const geometry = new THREE.CylinderGeometry(radius * 0.84, radius * 0.84, 0.002, 112);
          lensCoverGeometries.push(geometry);
          const cover = new THREE.Mesh(geometry, lensCoverMaterial);
          cover.name = "lens protective cover";
          cover.rotation.x = Math.PI / 2;
          cover.position.copy(localPosition);
          cover.position.z -= 0.031;
          cover.renderOrder = 7;
          model.add(cover);
        });
      }
      if (screenMesh) {
        screenMesh.renderOrder = 8;
      }
      frameObject(model);
      phoneRoot.add(model);
    });

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const getScrollProgress = () => {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const raw = (viewport - rect.top) / (rect.height + viewport * 0.15);
      return clamp01(raw);
    };

    const setHoveredButton = (nextId: ButtonId | null) => {
      if (hoveredButtonId === nextId) return;
      hoveredButtonId = nextId;
      screenUi?.setInteraction(hoveredButtonId, selectedButtonId);
      container.style.cursor = nextId ? "pointer" : "grab";
    };

    const pickButton = (event: PointerEvent) => {
      if (!screenMesh || !screenUi) return null;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(pointer, camera);
      const islandHit = islandMeshes.length > 0 ? raycaster.intersectObjects(islandMeshes, false)[0] : null;
      const hit = raycaster.intersectObject(screenMesh, false)[0];
      if (!hit?.uv) return null;
      if (islandHit && islandHit.distance <= hit.distance + 0.01) return null;

      const x = (1 - hit.uv.x) * screenUi.canvas.width;
      const y = hit.uv.y * screenUi.canvas.height;
      if (screenUi.isInDynamicIsland(x, y)) return null;

      // Only accept hits that land inside an actual button rectangle.
      return (
        screenUi.buttonBounds.find(
          (bounds) =>
            x >= bounds.x &&
            x <= bounds.x + bounds.width &&
            y >= bounds.y &&
            y <= bounds.y + bounds.height
        )?.id ?? null
      );
    };

    const handlePointerMove = (event: PointerEvent) => {
      setHoveredButton(pickButton(event));
    };

    const handlePointerLeave = () => {
      setHoveredButton(null);
    };

    const handlePointerDown = (event: PointerEvent) => {
      const nextId = pickButton(event);
      if (nextId) {
        const config = buttonConfigs.find((button) => button.id === nextId);
        selectedButtonId = nextId;
        screenUi?.setInteraction(nextId, selectedButtonId);
        setHoveredButton(nextId);
        if (config) {
          // For mailto links, skip the radial reveal animation entirely so the
          // OS mail client opens straight away with no full-screen flash.
          if (config.path.startsWith("mailto:")) {
            window.location.href = config.path;
            return;
          }

          screenUi?.startReveal(nextId);
          window.clearTimeout(routeRevealTimer);
          window.clearTimeout(routeRevealCleanupTimer);
          routeRevealElement?.remove();

          const reveal = document.createElement("div");
          reveal.className = "portfolio-route-reveal";
          reveal.style.setProperty("--reveal-x", `${event.clientX}px`);
          reveal.style.setProperty("--reveal-y", `${event.clientY}px`);
          document.body.appendChild(reveal);
          routeRevealElement = reveal;

          requestAnimationFrame(() => {
            requestAnimationFrame(() => reveal.classList.add("is-active"));
          });
          routeRevealTimer = window.setTimeout(() => {
            navigate(config.path);
            routeRevealCleanupTimer = window.setTimeout(() => {
              reveal.remove();
              if (routeRevealElement === reveal) routeRevealElement = null;
            }, 520);
          }, 880);
        }
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);

    let frame = 0;
    const startedAt = performance.now();

    const animate = () => {
      const progress = easeInOutCubic(getScrollProgress());
      const rotateProgress = easeInOutCubic(clamp01((progress + 0.14) / 0.62));
      const approachProgress = easeInOutCubic(clamp01((progress - 0.52) / 0.48));
      const elapsed = (performance.now() - startedAt) / 1000;
      const idle = Math.sin(elapsed * 1.1) * 0.025;

      phoneRoot.rotation.y = THREE.MathUtils.lerp(Math.PI, Math.PI * 2, rotateProgress);
      phoneRoot.rotation.x = THREE.MathUtils.lerp(-0.06, 0.02, rotateProgress);
      phoneRoot.rotation.z = THREE.MathUtils.lerp(0.12, 0, rotateProgress);
      phoneRoot.position.z = THREE.MathUtils.lerp(0.9, -1.75, approachProgress);
      phoneRoot.position.y = THREE.MathUtils.lerp(0, -0.03, approachProgress) + idle;
      phoneRoot.scale.setScalar(THREE.MathUtils.lerp(0.72, 1.42, approachProgress));

      screenUi?.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      screenUiRef.current = null;
      cancelAnimationFrame(frame);
      window.clearTimeout(routeRevealTimer);
      window.clearTimeout(routeRevealCleanupTimer);
      routeRevealElement?.remove();
      resizeObserver.disconnect();
      environment.dispose();
      pmremGenerator.dispose();
      frameMaterial?.dispose();
      backGlassMaterial?.dispose();
      cameraBaseMaterial?.dispose();
      lensRingMaterial?.dispose();
      flashMaterial?.dispose();
      lidarMaterial?.dispose();
      lensGlassMaterial?.dispose();
      lensBackingMaterial?.dispose();
      lensCoverMaterial?.dispose();
      replacementLensGeometries.forEach((geometry) => geometry.dispose());
      lensBackingGeometries.forEach((geometry) => geometry.dispose());
      lensCoverGeometries.forEach((geometry) => geometry.dispose());
      appleLogoMaterial?.dispose();
      brushedAluminumNormalMap?.dispose();
      glassMicroNormalMap?.dispose();
      edgeMaterial?.dispose();
      screenMaterial?.map?.dispose();
      screenMaterial?.dispose();
      screenBlackMaterial?.dispose();
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [navigate]);

  return (
    <section ref={sectionRef} className="iphone-scroll-section" aria-label="iPhone 3D reveal">
      <div className="iphone-sticky-stage">
        <div ref={containerRef} className="iphone-model" />
      </div>
    </section>
  );
};

export default IPhoneScrollScene;
