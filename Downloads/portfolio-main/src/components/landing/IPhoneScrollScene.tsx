import { useEffect, useRef } from "react";
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

const buttonConfigs = [
  { id: "projects", label: "my projects" },
  { id: "about", label: "about me" },
  { id: "contact", label: "contact me" },
] as const;

type ButtonId = (typeof buttonConfigs)[number]["id"];

type ButtonBounds = {
  id: ButtonId;
  x: number;
  y: number;
  width: number;
  height: number;
};

const createScreenUi = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1536;
  canvas.height = 3328;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to create 2D context for iPhone screen texture");
  }
  const scale = canvas.width / 1536;
  const backgroundImage = new Image();
  backgroundImage.src = "/backgrounds/iphone-screen-background.jpg?v=black-wallpaper";
  backgroundImage.crossOrigin = "anonymous";
  let backgroundReady = false;

  const buttonBounds: ButtonBounds[] = buttonConfigs.map((config, index) => ({
    id: config.id,
    x: 190 * scale,
    y: (1110 + index * 380) * scale,
    width: 1156 * scale,
    height: 232 * scale,
  }));

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const drawStatusBar = () => {
    const statusY = 104 * scale;
    const iconColor = "#050505";
    const pillWidth = 308 * scale;
    const pillHeight = 82 * scale;
    const pillX = canvas.width / 2 - pillWidth / 2;
    const pillY = 56 * scale;

    ctx.fillStyle = iconColor;
    ctx.font = `700 ${58 * scale}px -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("9:41", 110 * scale, statusY);

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 38 * scale);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath();
    ctx.arc(pillX + pillWidth - 46 * scale, pillY + pillHeight / 2, 17 * scale, 0, Math.PI * 2);
    ctx.fill();

    const barsX = canvas.width - 292 * scale;
    const barsBottom = statusY + 18 * scale;
    ctx.fillStyle = iconColor;
    [18, 27, 36, 45].forEach((height, index) => {
      ctx.beginPath();
      ctx.roundRect(barsX + index * 20 * scale, barsBottom - height * scale, 12 * scale, height * scale, 5 * scale);
      ctx.fill();
    });

    ctx.strokeStyle = iconColor;
    ctx.lineWidth = 7 * scale;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(canvas.width - 168 * scale, statusY + 9 * scale, 38 * scale, Math.PI * 1.18, Math.PI * 1.82);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvas.width - 168 * scale, statusY + 9 * scale, 24 * scale, Math.PI * 1.22, Math.PI * 1.78);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvas.width - 168 * scale, statusY + 9 * scale, 10 * scale, Math.PI * 1.3, Math.PI * 1.7);
    ctx.stroke();

    const batteryX = canvas.width - 98 * scale;
    const batteryY = statusY - 18 * scale;
    ctx.strokeStyle = iconColor;
    ctx.lineWidth = 5 * scale;
    ctx.beginPath();
    ctx.roundRect(batteryX, batteryY, 52 * scale, 28 * scale, 8 * scale);
    ctx.stroke();
    ctx.fillStyle = iconColor;
    ctx.beginPath();
    ctx.roundRect(batteryX + 8 * scale, batteryY + 7 * scale, 34 * scale, 14 * scale, 5 * scale);
    ctx.fill();
    ctx.fillRect(batteryX + 55 * scale, batteryY + 9 * scale, 5 * scale, 10 * scale);
  };

  const drawButton = (bounds: ButtonBounds, activeId: ButtonId | null) => {
    const config = buttonConfigs.find((button) => button.id === bounds.id);
    if (!config) return;

    const active = bounds.id === activeId;
    const grow = active ? 38 * scale : 0;
    const x = bounds.x - grow / 2;
    const y = bounds.y - grow / 2;
    const width = bounds.width + grow;
    const height = bounds.height + grow;
    const radius = 58 * scale;

    ctx.save();
    ctx.shadowColor = active ? "rgba(63, 20, 136, 0.34)" : "rgba(63, 20, 136, 0.18)";
    ctx.shadowBlur = active ? 42 * scale : 20 * scale;
    ctx.shadowOffsetY = active ? 20 * scale : 10 * scale;
    ctx.fillStyle = active ? "#6f35de" : "#6330c7";
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
    ctx.restore();

    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, "rgba(255,255,255,0.16)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x + 4 * scale, y + 4 * scale, width - 8 * scale, height - 8 * scale, radius - 4 * scale);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `800 ${active ? 84 * scale : 80 * scale}px -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(config.label, x + width / 2, y + height / 2 + 3 * scale);
  };

  const draw = (activeId: ButtonId | null) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    if (backgroundReady) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const edgeWidth = 78 * scale;
    const edgeFade = ctx.createLinearGradient(0, 0, edgeWidth, 0);
    edgeFade.addColorStop(0, "rgba(0,0,0,0.98)");
    edgeFade.addColorStop(0.45, "rgba(0,0,0,0.9)");
    edgeFade.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = edgeFade;
    ctx.fillRect(0, 0, edgeWidth, canvas.height);

    const rightEdgeFade = ctx.createLinearGradient(canvas.width - edgeWidth, 0, canvas.width, 0);
    rightEdgeFade.addColorStop(0, "rgba(0,0,0,0)");
    rightEdgeFade.addColorStop(0.55, "rgba(0,0,0,0.9)");
    rightEdgeFade.addColorStop(1, "rgba(0,0,0,0.98)");
    ctx.fillStyle = rightEdgeFade;
    ctx.fillRect(canvas.width - edgeWidth, 0, edgeWidth, canvas.height);

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 176 * scale, 48 * scale, 352 * scale, 96 * scale, 42 * scale);
    ctx.fill();

    drawStatusBar();
    buttonBounds.forEach((bounds) => drawButton(bounds, activeId));
    ctx.restore();
    texture.needsUpdate = true;
  };

  draw(null);
  backgroundImage.onload = () => {
    backgroundReady = true;
    draw(null);
  };

  return {
    buttonBounds,
    canvas,
    draw,
    texture,
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

const shouldUseGlassMaterial = (mesh: THREE.Mesh) => {
  const name = objectPath(mesh);

  if (name.includes("screen") || name.includes("island")) {
    return "screen";
  }

  if (
    name.includes("camera glass") ||
    name.includes("camera_glass") ||
    name.includes("front camra") ||
    name.includes("front_camra") ||
    name.includes("sphere") ||
    name.includes("flash glass") ||
    name.includes("flash_glass")
  ) {
    return "lens";
  }

  return null;
};

const IPhoneScrollScene = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    let lensGlassMaterial: THREE.MeshPhysicalMaterial | null = null;
    let edgeMaterial: THREE.LineBasicMaterial | null = null;
    let screenMaterial: THREE.MeshBasicMaterial | null = null;
    let screenBlackMaterial: THREE.MeshBasicMaterial | null = null;
    let screenMesh: THREE.Mesh | null = null;
    let screenUi: ReturnType<typeof createScreenUi> | null = null;
    let hoveredButtonId: ButtonId | null = null;
    let selectedButtonId: ButtonId | null = null;
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
    renderer.toneMappingExposure = 0.7;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.02).texture;
    scene.environment = environment;
    scene.background = null;

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.75);
    keyLight.intensity = 0.08;
    keyLight.position.set(0, 2.6, 5);
    scene.add(keyLight);

    const sideLight = new THREE.DirectionalLight(0xf7efe1, 0.72);
    sideLight.intensity = 0.05;
    sideLight.position.set(-4, 2.2, 3);
    scene.add(sideLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.88);
    backLight.intensity = 0.08;
    backLight.position.set(2, 2.5, -5);
    scene.add(backLight);

    const phoneRoot = new THREE.Group();
    phoneRoot.rotation.set(-0.05, Math.PI, 0.08);
    phoneRoot.position.set(0, 0.1, 0.5);
    phoneRoot.scale.setScalar(0.68);
    scene.add(phoneRoot);

    const loader = new GLTFLoader();
    loader.load(MODEL_URL, (gltf) => {
      const model = gltf.scene;
      screenUi = createScreenUi();
      screenMaterial = new THREE.MeshBasicMaterial({
        map: screenUi.texture,
        color: 0xffffff,
        toneMapped: false,
        side: THREE.DoubleSide,
      });
      screenBlackMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        toneMapped: false,
        side: THREE.DoubleSide,
      });
      lensGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1a1f28,
        metalness: 0,
        roughness: 0.02,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        transmission: 0.42,
        thickness: 0.45,
        ior: 1.5,
        transparent: true,
        opacity: 0.88,
        envMapIntensity: 1.9,
      });
      edgeMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.35,
      });
      const applyStudioEnvironment = (material: THREE.Material) => {
        if ("envMap" in material) {
          material.envMap = environment;
        }
        if ("envMapIntensity" in material) {
          material.envMapIntensity = 2.35;
        }
        material.needsUpdate = true;
      };
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.frustumCulled = false;
          const glassType = shouldUseGlassMaterial(child);
          const name = objectPath(child);
          if (name.includes("screen")) {
            screenMesh = child;
            if (screenMaterial) {
              child.material = screenMaterial;
            }
          } else if (name.includes("island") && screenBlackMaterial) {
            child.material = screenBlackMaterial;
          } else if (glassType === "lens") {
            child.material = lensGlassMaterial;
          }
          if (child.geometry) {
            const edges = new THREE.EdgesGeometry(child.geometry, 35);
            const outline = new THREE.LineSegments(edges, edgeMaterial);
            child.add(outline);
          }
          if (glassType === "lens") {
            child.material.side = THREE.DoubleSide;
          }
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            applyStudioEnvironment(material);
          });
        }
      });
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
      screenUi?.draw(hoveredButtonId ?? selectedButtonId);
      container.style.cursor = nextId ? "pointer" : "grab";
    };

    const pickButton = (event: PointerEvent) => {
      if (!screenMesh || !screenUi) return null;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObject(screenMesh, false)[0];
      if (!hit?.uv) return null;

      const x = (1 - hit.uv.x) * screenUi.canvas.width;
      const y = (1 - hit.uv.y) * screenUi.canvas.height;
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
        selectedButtonId = nextId;
        screenUi?.draw(selectedButtonId);
        setHoveredButton(nextId);
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

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      environment.dispose();
      pmremGenerator.dispose();
      lensGlassMaterial?.dispose();
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
  }, []);

  return (
    <section ref={sectionRef} className="iphone-scroll-section" aria-label="iPhone 3D reveal">
      <div className="iphone-sticky-stage">
        <div ref={containerRef} className="iphone-model" />
      </div>
    </section>
  );
};

export default IPhoneScrollScene;
