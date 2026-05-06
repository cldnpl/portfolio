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

const phoneMaterials = {
  back: new THREE.MeshPhysicalMaterial({
    color: 0xd8cfaa,
    metalness: 0.14,
    roughness: 0.48,
    clearcoat: 0.38,
    clearcoatRoughness: 0.34,
    envMapIntensity: 1.1,
  }),
  frame: new THREE.MeshStandardMaterial({
    color: 0x14161b,
    metalness: 0.88,
    roughness: 0.14,
    envMapIntensity: 2.2,
  }),
  screenGlass: new THREE.MeshPhysicalMaterial({
    color: 0x05070a,
    metalness: 0,
    roughness: 0.02,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    reflectivity: 1,
    envMapIntensity: 3.4,
  }),
  lensGlass: new THREE.MeshPhysicalMaterial({
    color: 0x080d16,
    metalness: 0,
    roughness: 0.015,
    transmission: 0.28,
    thickness: 0.35,
    ior: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0.01,
    transparent: true,
    opacity: 0.82,
    envMapIntensity: 3.2,
  }),
  cameraRing: new THREE.MeshStandardMaterial({
    color: 0xd0c8a6,
    metalness: 0.82,
    roughness: 0.14,
    envMapIntensity: 2.4,
  }),
  whiteDetail: new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.34,
    roughness: 0.1,
    emissive: 0x1f1b12,
    emissiveIntensity: 0.2,
    envMapIntensity: 2.1,
  }),
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

const materialForMesh = (mesh: THREE.Mesh) => {
  const name = objectPath(mesh);

  if (name.includes("screen") || name.includes("island") || name.includes("sound")) {
    return phoneMaterials.screenGlass;
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
    return phoneMaterials.lensGlass;
  }

  if (name.includes("back camera") || name.includes("back_camera") || name.includes("cylinder")) {
    return phoneMaterials.cameraRing;
  }

  if (name.includes("apple") || name.includes("flash mtl") || name.includes("flash_mtl") || name.includes("scroo")) {
    return phoneMaterials.whiteDetail;
  }

  if (name.includes("back")) {
    return phoneMaterials.back;
  }

  return phoneMaterials.frame;
};

const IPhoneScrollScene = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

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
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;

    scene.add(new THREE.HemisphereLight(0xffffff, 0xe5e7eb, 3.1));

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
    keyLight.position.set(0, 2.6, 5);
    scene.add(keyLight);

    const sideLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sideLight.position.set(-4, 2.2, 3);
    scene.add(sideLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 2.6);
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
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: 0xf0e5b8,
        transparent: true,
        opacity: 0.22,
      });
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.frustumCulled = false;
          child.material = materialForMesh(child);
          if (child.geometry) {
            const edges = new THREE.EdgesGeometry(child.geometry, 35);
            const outline = new THREE.LineSegments(edges, edgeMaterial);
            child.add(outline);
          }
          child.material.side = THREE.DoubleSide;
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
      const rotateProgress = easeInOutCubic(clamp01(progress / 0.62));
      const approachProgress = easeInOutCubic(clamp01((progress - 0.62) / 0.38));
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
