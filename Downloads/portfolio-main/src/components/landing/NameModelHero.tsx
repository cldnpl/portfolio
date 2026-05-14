import { useEffect, useRef } from "react";
import { publicAsset } from "@/lib/assets";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const MODEL_URL = publicAsset("models/claudia-name.glb");

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const applyHardSideDepthToMaterial = (
  material: THREE.MeshPhysicalMaterial,
  sideColor: [number, number, number],
  edgeStart: number,
  edgeEnd: number
) => {
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <normal_fragment_begin>",
        `#include <normal_fragment_begin>
float frontMask = smoothstep(${edgeStart.toFixed(2)}, ${edgeEnd.toFixed(2)}, abs(normal.z));
diffuseColor.rgb = mix(vec3(${sideColor.map((value) => value.toFixed(3)).join(", ")}), diffuseColor.rgb, frontMask);`
      );
  };
  material.needsUpdate = true;
};

const frameObject = (object: THREE.Object3D, camera: THREE.PerspectiveCamera) => {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const largestSide = Math.max(size.x, size.y, size.z) || 1;

  const scale = 4.15 / largestSide;
  object.scale.setScalar(scale);
  object.position.copy(center.multiplyScalar(-scale));

  camera.position.set(0, 0.25, 5);
  camera.lookAt(0, 0, 0);
};

const NameModelHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
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
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;

    const titleMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2b074f,
      metalness: 0.12,
      roughness: 0.18,
      clearcoat: 0.6,
      clearcoatRoughness: 0.1,
      envMapIntensity: 0.95,
    });
    applyHardSideDepthToMaterial(titleMaterial, [0.09, 0.02, 0.18], 0.45, 0.58);

    const taglineMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.02,
      roughness: 0.14,
      clearcoat: 0.55,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.55,
    });
    applyHardSideDepthToMaterial(taglineMaterial, [0.018, 0.012, 0.045], 0.5, 0.58);

    const taglineShadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x1b0027,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      toneMapped: false,
    });

    scene.add(new THREE.HemisphereLight(0xd8c5ff, 0x08030d, 1.7));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.15);
    keyLight.intensity = 1.35;
    keyLight.position.set(2.5, 3, 4.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb98cff, 1.05);
    fillLight.position.set(-2.5, 1.25, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x8f49ff, 1.35);
    rimLight.position.set(-3, 1.5, -2.5);
    scene.add(rimLight);

    const group = new THREE.Group();
    const targetRotation = { x: -0.16, y: 0, z: 0 };
    group.rotation.set(targetRotation.x, targetRotation.y, targetRotation.z);
    scene.add(group);
    const pointer = {
      active: false,
      id: -1,
      startX: 0,
      startY: 0,
      baseX: 0,
      baseY: 0,
      baseZ: 0,
    };

  const loader = new GLTFLoader();
    loader.load(MODEL_URL, (gltf) => {
      const model = gltf.scene;
      const shadowMeshes: Array<{ parent: THREE.Object3D; shadow: THREE.Mesh }> = [];
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.frustumCulled = false;
          const objectName = child.name.toLowerCase();
          const meshName = child.parent?.name.toLowerCase() ?? "";
          const isTagline =
            objectName.includes("let's build") || objectName.includes("testo") || meshName.includes("testo");
          child.material = isTagline ? taglineMaterial : titleMaterial;
          child.material.needsUpdate = true;

          if (isTagline) {
            const shadow = child.clone(false);
            shadow.material = taglineShadowMaterial;
            shadow.position.x += 0.035;
            shadow.position.y -= 0.065;
            shadow.position.z -= 0.045;
            shadow.renderOrder = -1;
            if (child.parent) {
              shadowMeshes.push({ parent: child.parent, shadow });
            }
          }
        }
      });
      shadowMeshes.forEach(({ parent, shadow }) => parent.add(shadow));
      frameObject(model, camera);
      group.add(model);
    });

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const handlePointerDown = (event: PointerEvent) => {
      pointer.active = true;
      pointer.id = event.pointerId;
      pointer.startX = event.clientX;
      pointer.startY = event.clientY;
      pointer.baseX = targetRotation.x;
      pointer.baseY = targetRotation.y;
      pointer.baseZ = targetRotation.z;
      renderer.domElement.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!pointer.active || event.pointerId !== pointer.id) return;
      const dx = (event.clientX - pointer.startX) / Math.max(container.clientWidth, 1);
      const dy = (event.clientY - pointer.startY) / Math.max(container.clientHeight, 1);
      targetRotation.y = pointer.baseY + dx * 4.5;
      targetRotation.x = clamp(pointer.baseX - dy * 3.4, -1.25, 1.05);
      targetRotation.z = pointer.baseZ + dx * 1.15;
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointer.id) return;
      pointer.active = false;
      pointer.id = -1;
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointercancel", handlePointerUp);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let frame = 0;
    const startedAt = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      group.rotation.x += (targetRotation.x + Math.sin(elapsed * 1.2) * 0.04 - group.rotation.x) * 0.11;
      group.rotation.y += (targetRotation.y + Math.cos(elapsed * 1.2) * 0.06 - group.rotation.y) * 0.11;
      group.rotation.z += (targetRotation.z + Math.sin(elapsed * 1.2) * 0.03 - group.rotation.z) * 0.11;
      group.position.x = Math.cos(elapsed * 0.85) * 0.012;
      group.position.y = Math.sin(elapsed * 0.85) * 0.012;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointercancel", handlePointerUp);
      environment.dispose();
      pmremGenerator.dispose();
      titleMaterial.dispose();
      taglineMaterial.dispose();
      taglineShadowMaterial.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="hero-model" aria-label="Claudia Napolitano 3D name" />;
};

export default NameModelHero;
