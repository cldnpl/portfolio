import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Book, COVER_H, COVER_W, PAGE_H, PAGE_W } from './book/book';
import './styles.css';
import './letter.css';

const canvas = document.querySelector<HTMLCanvasElement>('#scene')!;
const hint = document.querySelector<HTMLElement>('.book-hint');
const back = document.querySelector<HTMLAnchorElement>('.book-back');
const veil = document.querySelector<HTMLElement>('.fade-veil');

back?.addEventListener('click', (event) => {
  event.preventDefault();
  veil?.classList.add('is-visible');
  window.setTimeout(() => {
    window.location.href = '/';
  }, 620);
});

// Canvas trasparente: dietro il libro deve vedersi lo sfondo della pagina.
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.42;

const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.05, 60);

/* ------------------------------------------------------------------ */
/* Luci                                                                */
/* ------------------------------------------------------------------ */

scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x241a16, 0.55));

const key = new THREE.DirectionalLight(0xffe6c6, 2.15);
key.position.set(-1.5, 4.1, 1.15);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = -1.9;
key.shadow.camera.right = 1.9;
key.shadow.camera.top = 1.7;
key.shadow.camera.bottom = -1.7;
key.shadow.camera.near = 0.5;
key.shadow.camera.far = 9;
key.shadow.bias = -0.0006;
key.shadow.normalBias = 0.012;
scene.add(key);

const fill = new THREE.DirectionalLight(0x9db4ff, 0.42);
fill.position.set(2.4, 1.5, -2.1);
scene.add(fill);

// Luce calda ravvicinata: serve a far accendere l'oro della scritta.
const glint = new THREE.PointLight(0xffd6a0, 5.5, 6, 2);
glint.position.set(1.1, 1.05, 1.5);
scene.add(glint);

/* ------------------------------------------------------------------ */
/* Tavolo                                                              */
/* ------------------------------------------------------------------ */

// Piano che mostra soltanto l'ombra: il libro resta appoggiato a qualcosa
// senza coprire lo sfondo a cuori.
const table = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 24),
  new THREE.ShadowMaterial({ opacity: 0.34 }),
);
table.rotation.x = -Math.PI / 2;
table.position.y = -0.031;
table.receiveShadow = true;
scene.add(table);

/* ------------------------------------------------------------------ */
/* Libro                                                               */
/* ------------------------------------------------------------------ */

let book: Book | null = null;

Book.create(renderer).then((created) => {
  book = created;
  scene.add(book.group);
  document.body.classList.add('is-ready');

  // Il libro si presenta chiuso, poi si apre da solo.
  window.setTimeout(() => book?.next(), 1300);
});

/* ------------------------------------------------------------------ */
/* Inquadratura                                                        */
/* ------------------------------------------------------------------ */

const home = new THREE.Vector3(0, 0.05, 0.02);
/** Punto che la camera sta guardando: si sposta verso la pagina sorvolata. */
const focus = home.clone();
const desiredFocus = home.clone();
const cameraTilt = 0.86; // 0 = di lato, 1 = a picco

/** Quanto ci si avvicina al libro quando il cursore ci passa sopra. */
const ZOOM_SCALE = 0.7;
let baseDistance = 4;
let zoom = 0;
let zoomTarget = 0;

function frame() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;

  const width = COVER_W * 2.34;
  const height = COVER_H * 1.42;
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  baseDistance = Math.max(
    height / 2 / Math.tan(vFov / 2),
    width / 2 / Math.tan(Math.atan(Math.tan(vFov / 2) * aspect)),
  );

  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', frame);
frame();

/* ------------------------------------------------------------------ */
/* Interazione                                                         */
/* ------------------------------------------------------------------ */

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const readingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.04);
const hitPoint = new THREE.Vector3();
const parallax = new THREE.Vector2();

let pointerDownAt: { x: number; y: number; time: number } | null = null;
let hintDismissed = false;

/** Converte un evento puntatore in coordinate locali del libro. */
function toBookSpace(event: PointerEvent) {
  ndc.x = (event.clientX / window.innerWidth) * 2 - 1;
  ndc.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(ndc, camera);
  if (!raycaster.ray.intersectPlane(readingPlane, hitPoint)) {
    return null;
  }
  const offsetX = book ? book.group.position.x : 0;
  return { x: hitPoint.x - offsetX, z: hitPoint.z };
}

function isOverBook(point: { x: number; z: number }) {
  return Math.abs(point.x) <= PAGE_W * 1.12 && Math.abs(point.z) <= PAGE_H * 0.62;
}

function dismissHint() {
  if (hintDismissed) {
    return;
  }
  hintDismissed = true;
  hint?.classList.add('is-hidden');
}

canvas.addEventListener('pointerdown', (event) => {
  if (!book) {
    return;
  }
  const point = toBookSpace(event);
  if (!point || !isOverBook(point)) {
    return;
  }
  pointerDownAt = { x: event.clientX, y: event.clientY, time: performance.now() };
  book.beginDrag(point.x);
  canvas.setPointerCapture(event.pointerId);
  canvas.style.cursor = 'grabbing';
});

/**
 * Sorvolando il libro la camera si avvicina e insegue la pagina sotto al
 * cursore, così il testo diventa leggibile senza dover cliccare niente.
 */
function aimAt(point: { x: number; z: number } | null) {
  if (!point || !isOverBook(point)) {
    zoomTarget = 0;
    desiredFocus.copy(home);
    return;
  }
  zoomTarget = 1;
  const offsetX = book ? book.group.position.x : 0;
  desiredFocus.set(home.x + (point.x + offsetX) * 0.5, home.y, home.z + point.z * 0.3);
}

canvas.addEventListener('pointermove', (event) => {
  parallax.x = (event.clientX / window.innerWidth) * 2 - 1;
  parallax.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (!book) {
    return;
  }

  const point = toBookSpace(event);

  if (book.isDragging) {
    if (point) {
      book.moveDrag(point.x);
      dismissHint();
    }
    return;
  }

  aimAt(point);
  canvas.style.cursor = point && isOverBook(point) ? 'grab' : 'default';
});

canvas.addEventListener('pointerleave', () => {
  zoomTarget = 0;
  desiredFocus.copy(home);
});

function releasePointer(event: PointerEvent) {
  if (!book || !pointerDownAt) {
    return;
  }
  const moved = Math.hypot(event.clientX - pointerDownAt.x, event.clientY - pointerDownAt.y);
  const point = toBookSpace(event);
  pointerDownAt = null;

  if (moved < 7) {
    // Tocco secco: gira una pagina invece di trascinare.
    book.cancelDrag();
    if (point && point.x < 0) {
      book.previous();
    } else {
      book.next();
    }
  } else {
    book.endDrag();
  }
  dismissHint();
  canvas.style.cursor = 'grab';
}

canvas.addEventListener('pointerup', releasePointer);
canvas.addEventListener('pointercancel', () => {
  pointerDownAt = null;
  book?.endDrag();
});

window.addEventListener('keydown', (event) => {
  if (!book) {
    return;
  }
  if (event.key === 'ArrowRight' || event.key === ' ') {
    book.next();
    dismissHint();
  }
  if (event.key === 'ArrowLeft') {
    book.previous();
    dismissHint();
  }
});

let wheelLock = 0;
window.addEventListener(
  'wheel',
  (event) => {
    if (!book) {
      return;
    }
    const now = performance.now();
    if (now - wheelLock < 420 || Math.abs(event.deltaY) < 8) {
      return;
    }
    wheelLock = now;
    if (event.deltaY > 0) {
      book.next();
    } else {
      book.previous();
    }
    dismissHint();
  },
  { passive: true },
);

/* ------------------------------------------------------------------ */
/* Loop                                                                */
/* ------------------------------------------------------------------ */

const clock = new THREE.Clock();

function render() {
  const delta = clock.getDelta();
  book?.update(delta);

  // Avvicinamento morbido, senza scatti quando il cursore attraversa il bordo.
  const ease = 1 - Math.pow(0.0015, Math.min(delta, 0.05));
  zoom += (zoomTarget - zoom) * ease;
  focus.lerp(desiredFocus, ease);

  const distance = baseDistance * (1 - (1 - ZOOM_SCALE) * zoom);
  // La parallasse si spegne da vicino: da lì serve fermezza, non movimento.
  const sway = 1 - zoom * 0.8;

  camera.position.set(
    focus.x + parallax.x * 0.16 * sway,
    focus.y + distance * Math.sin(cameraTilt) + parallax.y * 0.1 * sway,
    focus.z + distance * Math.cos(cameraTilt),
  );
  camera.lookAt(focus);

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
