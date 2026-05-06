import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";

const MODEL_URL = "/models/iphone-15-pro-max.dae";

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

    let screenGlassMaterial: THREE.MeshPhysicalMaterial | null = null;
    let lensGlassMaterial: THREE.MeshPhysicalMaterial | null = null;
    let edgeMaterial: THREE.LineBasicMaterial | null = null;

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
    renderer.toneMappingExposure = 0.8;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;

    scene.add(new THREE.HemisphereLight(0xf6f1e8, 0xc8bfb3, 1.45));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.75);
    keyLight.position.set(0, 2.6, 5);
    scene.add(keyLight);

    const sideLight = new THREE.DirectionalLight(0xf7efe1, 0.72);
    sideLight.position.set(-4, 2.2, 3);
    scene.add(sideLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.88);
    backLight.position.set(2, 2.5, -5);
    scene.add(backLight);

    const phoneRoot = new THREE.Group();
    phoneRoot.rotation.set(-0.05, Math.PI, 0.08);
    phoneRoot.position.set(0, 0.1, 0.5);
    phoneRoot.scale.setScalar(0.68);
    scene.add(phoneRoot);

    const loader = new ColladaLoader();
    loader.load(MODEL_URL, (collada) => {
      const model = collada.scene;
      screenGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x10131a,
        metalness: 0,
        roughness: 0.06,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        transmission: 0.1,
        thickness: 0.18,
        ior: 1.5,
        transparent: true,
        opacity: 0.9,
        envMapIntensity: 2.1,
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
        color: 0xe5dfd4,
        transparent: true,
        opacity: 0.12,
      });
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.frustumCulled = false;
          const glassType = shouldUseGlassMaterial(child);
          if (glassType === "screen") {
            child.material = screenGlassMaterial;
          } else if (glassType === "lens") {
            child.material = lensGlassMaterial;
          }
          if (child.geometry) {
            const edges = new THREE.EdgesGeometry(child.geometry, 35);
            const outline = new THREE.LineSegments(edges, edgeMaterial);
            child.add(outline);
          }
          if (glassType) {
            child.material.side = THREE.DoubleSide;
          }
          child.material.needsUpdate = true;
        }
      });
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

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

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
      screenGlassMaterial?.dispose();
      lensGlassMaterial?.dispose();
      edgeMaterial?.dispose();
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
