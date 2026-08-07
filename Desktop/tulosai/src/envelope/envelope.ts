import * as THREE from 'three';
import { paintCard, paintLiner, paintPaper } from './textures';

/* Misure della busta, in unità di scena. */
export const ENV_W = 3.3;
export const ENV_H = 2.25;
/** Spessore della carta. */
const T = 0.014;
/** Profondità della tasca: lo spazio in cui vive il cartoncino. */
const D = 0.055;
/** Altezza della facciata anteriore: più bassa del dorso, così resta l'imboccatura. */
const FRONT_H = ENV_H * 0.66;
/** Sviluppo del lembo dalla cerniera alla punta: la punta deve arrivare
 *  ben sotto il bordo della facciata, altrimenti da chiuso non si vede. */
const FLAP_H = ENV_H * 0.66;

const CARD_W = ENV_W - 0.34;
const CARD_H = 1.4;
const CARD_T = 0.016;

/** Posa del lembo da chiuso e da aperto (rotazione attorno alla cerniera). */
const FLAP_CLOSED = Math.PI * 0.988;
const FLAP_OPEN = -0.66;

export class Envelope {
  readonly group = new THREE.Group();
  /** Zona sensibile al passaggio del cursore. */
  readonly hitArea: THREE.Mesh;

  private flapPivot = new THREE.Group();
  private card = new THREE.Group();
  private openness = 0;
  private target = 0;

  constructor(renderer: THREE.WebGLRenderer) {
    const paper = paintPaper(renderer, '#8f888c');
    paper.map.repeat.set(1.6, 1.1);
    paper.bumpMap.repeat.set(1.6, 1.1);

    const paperMaterial = new THREE.MeshStandardMaterial({
      map: paper.map,
      bumpMap: paper.bumpMap,
      bumpScale: 0.6,
      roughness: 0.92,
      metalness: 0,
    });

    const linerMaterial = new THREE.MeshStandardMaterial({
      map: paintLiner(renderer),
      roughness: 0.88,
      metalness: 0,
      side: THREE.DoubleSide,
    });

    /* ---- dorso ---- */

    const back = new THREE.Mesh(new THREE.BoxGeometry(ENV_W, ENV_H, T), paperMaterial);
    back.position.z = -T / 2;
    back.castShadow = true;
    back.receiveShadow = true;
    this.group.add(back);

    // Fodera a righe incollata dentro: ha la stessa sagoma del lembo, così da
    // chiuso resta nascosta esattamente sotto di esso e non spunta dagli angoli.
    const linerGeometry = new THREE.ShapeGeometry(flapShape(), 24);
    normalizeUv(linerGeometry);
    linerGeometry.scale(0.985, -1, 1);
    const liner = new THREE.Mesh(linerGeometry, linerMaterial);
    liner.position.set(0, ENV_H / 2, 0.002);
    liner.receiveShadow = true;
    this.group.add(liner);

    /* ---- facciata anteriore, con le due pieghe diagonali ---- */

    const front = new THREE.Mesh(new THREE.BoxGeometry(ENV_W, FRONT_H, T), paperMaterial);
    front.position.set(0, -(ENV_H - FRONT_H) / 2, D + T / 2);
    front.castShadow = true;
    front.receiveShadow = true;
    this.group.add(front);

    // Le cuciture: due segni sottili dagli angoli bassi verso il centro.
    const seam = new THREE.LineSegments(
      creaseGeometry(),
      new THREE.LineBasicMaterial({ color: 0x4a4448, transparent: true, opacity: 0.75 }),
    );
    seam.position.z = D + T + 0.0015;
    this.group.add(seam);

    /* ---- lembo incernierato ---- */

    const shape = flapShape();
    const flapGeometry = new THREE.ShapeGeometry(shape, 24);
    normalizeUv(flapGeometry);

    const flapOuter = new THREE.Mesh(flapGeometry, paperMaterial.clone());
    (flapOuter.material as THREE.MeshStandardMaterial).side = THREE.BackSide;
    flapOuter.castShadow = true;

    const flapInner = new THREE.Mesh(flapGeometry, linerMaterial.clone());
    (flapInner.material as THREE.MeshStandardMaterial).side = THREE.FrontSide;
    flapInner.position.z = T;
    flapInner.receiveShadow = true;

    // Il bordo del lembo: su una busta vera lo si riconosce da questa riga
    // sottile, non dall'ombra. Senza, da chiuso la busta sembra un rettangolo.
    const edge = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(
        shape.getPoints(48).map((point) => new THREE.Vector3(point.x, point.y, -0.001)),
      ),
      new THREE.LineBasicMaterial({ color: 0x4a4448, transparent: true, opacity: 0.8 }),
    );

    this.flapPivot.add(flapOuter, flapInner, edge);
    this.flapPivot.position.set(0, ENV_H / 2, -T / 2);
    this.group.add(this.flapPivot);

    /* ---- cartoncino ---- */

    const cardFace = new THREE.MeshStandardMaterial({
      map: paintCard(renderer),
      roughness: 0.86,
      metalness: 0,
    });
    const cardEdge = new THREE.MeshStandardMaterial({ color: 0xe9dfcb, roughness: 0.9, metalness: 0 });
    const cardBack = new THREE.MeshStandardMaterial({ color: 0xefe6d4, roughness: 0.9, metalness: 0 });

    const cardMesh = new THREE.Mesh(new THREE.BoxGeometry(CARD_W, CARD_H, CARD_T), [
      cardEdge,
      cardEdge,
      cardEdge,
      cardEdge,
      cardFace,
      cardBack,
    ]);
    cardMesh.castShadow = true;
    cardMesh.receiveShadow = true;
    this.card.add(cardMesh);
    this.group.add(this.card);

    /* ---- zona sensibile ---- */

    this.hitArea = new THREE.Mesh(
      new THREE.BoxGeometry(ENV_W + 0.5, ENV_H + 1.5, 1.2),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    this.hitArea.position.y = 0.35;
    this.group.add(this.hitArea);

    this.apply(0);
  }

  get isOpen() {
    return this.openness > 0.92;
  }

  open() {
    this.target = 1;
  }

  close() {
    this.target = 0;
  }

  update(delta: number) {
    if (Math.abs(this.target - this.openness) < 0.0004) {
      return;
    }
    // Il lembo pesa: parte deciso e si posa piano.
    const ease = 1 - Math.pow(this.target > this.openness ? 0.055 : 0.02, Math.min(delta, 0.05));
    this.openness += (this.target - this.openness) * ease;
    this.apply(this.openness);
  }

  private apply(open: number) {
    // Il lembo si apre per primo, il cartoncino esce solo quando c'è spazio.
    const flap = smoothstep(0, 0.58, open);
    const slide = smoothstep(0.44, 1, open);

    this.flapPivot.rotation.x = FLAP_CLOSED + (FLAP_OPEN - FLAP_CLOSED) * flap;
    // La cerniera scavalca lo spessore della busta mentre il lembo si ribalta.
    // Da chiuso il lembo appoggia SOPRA la facciata, così stacca con la sua ombra.
    this.flapPivot.position.z = (D + T * 2.4) * (1 - flap) - (T / 2) * flap;

    const rest = -(ENV_H - CARD_H) / 2 + 0.05;
    this.card.position.set(
      0,
      rest + slide * 1.42,
      D / 2 + slide * 0.24,
    );
    // Uscendo si inclina verso chi guarda, come se lo stessi sfilando.
    this.card.rotation.x = slide * 0.16;
  }
}

/** Sagoma del lembo: due lati appena bombati che si incontrano nella punta. */
function flapShape() {
  const half = ENV_W / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-half, 0);
  shape.quadraticCurveTo(-half * 0.62, FLAP_H * 0.66, 0, FLAP_H);
  shape.quadraticCurveTo(half * 0.62, FLAP_H * 0.66, half, 0);
  shape.lineTo(-half, 0);
  return shape;
}

/** Le due pieghe che salgono dagli angoli bassi verso il centro della facciata. */
function creaseGeometry() {
  const half = ENV_W / 2;
  const bottom = -ENV_H / 2;
  const apex = bottom + FRONT_H * 0.62;
  const points = [
    -half, bottom, 0, 0, apex, 0,
    half, bottom, 0, 0, apex, 0,
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  return geometry;
}

/** ShapeGeometry usa le coordinate del disegno come uv: le riportiamo in 0..1. */
function normalizeUv(geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  const uv = geometry.attributes.uv;
  const width = box.max.x - box.min.x;
  const height = box.max.y - box.min.y;
  for (let i = 0; i < uv.count; i += 1) {
    uv.setXY(i, (uv.getX(i) - box.min.x) / width, (uv.getY(i) - box.min.y) / height);
  }
  uv.needsUpdate = true;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}
