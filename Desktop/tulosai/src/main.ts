import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ENV_H, ENV_W, Envelope } from './envelope/envelope';
import { Sparkles } from './envelope/sparkles';
import './styles.css';

const canvas = document.querySelector<HTMLCanvasElement>('#scene');
const veil = document.querySelector<HTMLDivElement>('.fade-veil');

if (!canvas) {
  throw new Error('Missing page elements');
}

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.92;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x040305);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.34;

const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 60);

/* ------------------------------------------------------------------ */
/* Luci                                                                */
/* ------------------------------------------------------------------ */

scene.add(new THREE.HemisphereLight(0xd8e2ff, 0x1b1014, 0.4));

const key = new THREE.DirectionalLight(0xfff0dc, 2.1);
key.position.set(-2.6, 4.2, 4.4);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = -3.4;
key.shadow.camera.right = 3.4;
key.shadow.camera.top = 3.4;
key.shadow.camera.bottom = -3.4;
key.shadow.camera.near = 1;
key.shadow.camera.far = 14;
key.shadow.bias = -0.0007;
key.shadow.normalBias = 0.02;
scene.add(key);

// Controluce rosa: stacca il bordo della busta dal nero del fondo.
const rim = new THREE.SpotLight(0xff5f92, 26, 14, Math.PI * 0.3, 0.7, 1.6);
rim.position.set(3.6, 1.4, -2.6);
scene.add(rim);

const fill = new THREE.DirectionalLight(0x9fb6ff, 0.4);
fill.position.set(3.2, 0.4, 2.4);
scene.add(fill);

/* ------------------------------------------------------------------ */
/* Piano d'appoggio                                                    */
/* ------------------------------------------------------------------ */

// Piano invisibile che mostra soltanto l'ombra: così la busta appoggia su
// qualcosa senza che compaia una linea d'orizzonte nell'inquadratura.
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.ShadowMaterial({ opacity: 0.62 }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -ENV_H / 2 - 0.02;
floor.receiveShadow = true;
scene.add(floor);

/* ------------------------------------------------------------------ */
/* Busta                                                               */
/* ------------------------------------------------------------------ */

const envelope = new Envelope(renderer);
// Appena inclinata all'indietro: appoggiata, non incollata allo schermo.
envelope.group.rotation.x = -0.16;
envelope.group.position.y = 0.08;
scene.add(envelope.group);

const sparkles = new Sparkles(renderer);
scene.add(sparkles.group);

/* ------------------------------------------------------------------ */
/* Inquadratura                                                        */
/* ------------------------------------------------------------------ */

const target = new THREE.Vector3(0, 0.34, 0);
/** Posizione di riposo della camera, da cui la parallasse si scosta appena. */
const cameraHome = new THREE.Vector3();

function frame() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;

  const width = ENV_W * 2.05;
  const height = (ENV_H + 2.4) * 1.2;
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const distance = Math.max(
    height / 2 / Math.tan(vFov / 2),
    width / 2 / Math.tan(Math.atan(Math.tan(vFov / 2) * aspect)),
  );

  // La camera guarda un po' più in alto della busta: così la busta scende nel
  // fotogramma e il cartoncino, uscendo, non finisce sotto al titolo.
  // Lo scarto è una frazione dell'inquadratura, quindi tiene su ogni schermo.
  const visibleHeight = 2 * distance * Math.tan(vFov / 2);
  target.y = 0.34 + visibleHeight * 0.13;

  camera.position.set(0, target.y + 0.55, distance);
  camera.lookAt(target);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  cameraHome.copy(camera.position);
}

window.addEventListener('resize', frame);
frame();

/* ------------------------------------------------------------------ */
/* Interazione                                                         */
/* ------------------------------------------------------------------ */

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(10, 10);
const parallax = new THREE.Vector2();
let leaving = false;

function goToBook() {
  if (leaving) {
    return;
  }
  leaving = true;
  veil?.classList.add('is-visible');
  window.setTimeout(() => {
    window.location.href = '/letter.html';
  }, 700);
}

function isOverEnvelope() {
  raycaster.setFromCamera(pointer, camera);
  return raycaster.intersectObject(envelope.hitArea, false).length > 0;
}

window.addEventListener('pointermove', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  parallax.set(pointer.x, pointer.y);

  const over = isOverEnvelope();
  if (over) {
    envelope.open();
  } else {
    envelope.close();
  }
  canvas.style.cursor = over && envelope.isOpen ? 'pointer' : 'default';
});

window.addEventListener('pointerleave', () => {
  pointer.set(10, 10);
  envelope.close();
});

canvas.addEventListener('pointerdown', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  if (!isOverEnvelope()) {
    return;
  }
  // Al tocco non c'è passaggio del cursore: il primo tap apre, il secondo entra.
  if (envelope.isOpen) {
    goToBook();
  } else {
    envelope.open();
  }
});

/* ------------------------------------------------------------------ */
/* Loop                                                                */
/* ------------------------------------------------------------------ */

const clock = new THREE.Clock();

function render() {
  const delta = clock.getDelta();
  envelope.update(delta);
  sparkles.update(delta);

  camera.position.x += (cameraHome.x + parallax.x * 0.26 - camera.position.x) * 0.04;
  camera.position.y += (cameraHome.y + parallax.y * 0.16 - camera.position.y) * 0.04;
  camera.lookAt(target);

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
