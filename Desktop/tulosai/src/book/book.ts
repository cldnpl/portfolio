import * as THREE from 'three';
import { pages, sheetCount, coverTitle } from './content';
import { loadImage, paintCover, paintEndpaper, paintPage, paintPageEdge } from './textures';

/* Dimensioni in unità di scena. */
export const PAGE_W = 1.0;
export const PAGE_H = 1.42;
export const COVER_W = PAGE_W + 0.035;
export const COVER_H = PAGE_H + 0.05;
export const COVER_T = 0.028;

/** Distanza fra due fogli modellati della stessa pila. */
const LEAF_GAP = 0.0019;
/** Spessore del blocco di carta "non modellata" che dà corpo al libro. */
const BLOCK_T = 0.052;
const PAGE_BASE = 0.0016;
const SEG_X = 40;
const SEG_Y = 8;

/** Quanto si arriccia il foglio a metà rotazione (radianti sull'intera lunghezza). */
const CURL = 1.55;
/** Sfasamento fra bordo vicino e lontano: è il "peel" dell'angolo. */
const TILT = 0.34;
/** Quanto si solleva il foglio mentre passa da una pila all'altra. */
const LIFT = 0.045;

interface Leaf {
  pivot: THREE.Group;
  rigid: boolean;
  /** indice del foglio di carta, -1 per la copertina */
  sheet: number;
  t: number;
  target: number;
  geometry?: THREE.BufferGeometry;
  rest?: Float32Array;
  dirty: boolean;
}

export class Book {
  readonly group = new THREE.Group();
  readonly leaves: Leaf[] = [];
  /** Indice del prossimo foglio da girare in avanti. */
  current = 0;

  private dragging: { leaf: Leaf; forward: boolean } | null = null;
  private rightBlock!: THREE.Mesh;
  private leftBlock!: THREE.Mesh;
  private spine!: THREE.Mesh;
  private spineRadius = 0;
  private coverRestY = 0;

  get leafCount() {
    return this.leaves.length;
  }

  get openness() {
    return this.leaves[0].t;
  }

  static async create(renderer: THREE.WebGLRenderer) {
    const names = [...new Set(pages.map((page) => page.photo).filter(Boolean))] as string[];

    const [cloth, clothNormal, paper, ...shots] = await Promise.all([
      loadImage('/book-model/textures/cloth_panel.jpg'),
      loadImage('/book-model/textures/cloth_panel_normal.jpg'),
      loadImage('/book-model/textures/paper.jpg'),
      ...names.map((name) => loadImage(`/book-model/photos/${name}`)),
    ]);

    const photos = new Map(names.map((name, index) => [name, shots[index]]));

    // I font di sistema devono essere pronti prima di incidere il titolo.
    if (document.fonts) {
      await document.fonts.ready;
    }

    return new Book(renderer, cloth, clothNormal, paper, photos);
  }

  private constructor(
    renderer: THREE.WebGLRenderer,
    cloth: HTMLImageElement,
    clothNormal: HTMLImageElement,
    paper: HTMLImageElement,
    photos: Map<string, HTMLImageElement>,
  ) {
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const cover = paintCover(cloth, renderer, { title: coverTitle, spineOnLeft: true });

    const clothTexture = new THREE.Texture(cloth);
    clothTexture.colorSpace = THREE.SRGBColorSpace;
    clothTexture.anisotropy = maxAniso;
    clothTexture.needsUpdate = true;

    const clothNormalTexture = new THREE.Texture(clothNormal);
    clothNormalTexture.anisotropy = maxAniso;
    clothNormalTexture.needsUpdate = true;

    const boardEdge = new THREE.MeshStandardMaterial({
      color: 0x27352d,
      roughness: 0.94,
      metalness: 0,
    });

    const coverOutside = new THREE.MeshStandardMaterial({
      map: cover.map,
      normalMap: clothNormalTexture,
      normalScale: new THREE.Vector2(0.9, 0.9),
      roughnessMap: cover.orm,
      metalnessMap: cover.orm,
      roughness: 1,
      metalness: 1,
    });

    const coverInside = new THREE.MeshStandardMaterial({
      map: paintEndpaper(paper, renderer, false),
      roughness: 0.95,
      metalness: 0,
    });

    const backOutside = new THREE.MeshStandardMaterial({
      map: clothTexture,
      normalMap: clothNormalTexture,
      normalScale: new THREE.Vector2(0.9, 0.9),
      roughness: 0.88,
      metalness: 0,
    });

    const backInside = new THREE.MeshStandardMaterial({
      map: paintEndpaper(paper, renderer, true),
      roughness: 0.95,
      metalness: 0,
    });

    const coverOffsetX = COVER_W / 2 - 0.014;

    /* ---- piatto posteriore: fermo, sotto tutto ---- */

    const backCover = new THREE.Mesh(
      new THREE.BoxGeometry(COVER_W, COVER_T, COVER_H),
      [boardEdge, boardEdge, backInside, backOutside, boardEdge, boardEdge],
    );
    backCover.position.set(coverOffsetX, -COVER_T / 2, 0);
    backCover.castShadow = true;
    backCover.receiveShadow = true;
    this.group.add(backCover);

    /* ---- blocco di carta: dà spessore alle due pile ---- */

    const edgeTexture = paintPageEdge(renderer);
    edgeTexture.repeat.set(1, 1);
    const blockEdge = new THREE.MeshStandardMaterial({
      map: edgeTexture,
      roughness: 0.88,
      metalness: 0,
    });
    const blockPaper = new THREE.MeshStandardMaterial({
      color: 0xe6dac0,
      roughness: 0.95,
      metalness: 0,
    });

    const makeBlock = (side: 1 | -1) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(PAGE_W * 0.997, 1, PAGE_H * 0.997),
        [blockEdge, blockEdge, blockPaper, blockPaper, blockEdge, blockEdge],
      );
      mesh.position.x = (side * PAGE_W) / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.group.add(mesh);
      return mesh;
    };
    this.rightBlock = makeBlock(1);
    this.leftBlock = makeBlock(-1);

    /* ---- costola ---- */

    // Guscio a mezzaluna sul lato sinistro: da chiuso è il dorso del libro,
    // da aperto viene schiacciato fino a sparire sotto la piega.
    const spineRadius = (BLOCK_T + sheetCount * LEAF_GAP) / 2 + COVER_T;
    const spine = new THREE.Mesh(
      new THREE.CylinderGeometry(spineRadius, spineRadius, COVER_H, 32, 1, true, Math.PI, Math.PI),
      backOutside,
    );
    spine.rotation.x = Math.PI / 2;
    spine.receiveShadow = true;
    this.group.add(spine);
    this.spine = spine;
    this.spineRadius = spineRadius;

    /* ---- copertina apribile: è il "foglio" numero 0 ---- */

    const coverPivot = new THREE.Group();
    const coverGeometry = new THREE.BoxGeometry(COVER_W, COVER_T, COVER_H);
    const coverMesh = new THREE.Mesh(coverGeometry, [
      boardEdge,
      boardEdge,
      coverOutside,
      coverInside,
      boardEdge,
      boardEdge,
    ]);
    coverMesh.position.set(coverOffsetX, 0, 0);
    coverMesh.castShadow = true;
    coverMesh.receiveShadow = true;
    coverPivot.add(coverMesh);
    this.group.add(coverPivot);

    this.coverRestY = PAGE_BASE + BLOCK_T + sheetCount * LEAF_GAP + COVER_T / 2 + 0.003;

    this.leaves.push({
      pivot: coverPivot,
      rigid: true,
      sheet: -1,
      t: 0,
      target: 0,
      dirty: true,
    });

    /* ---- fogli di carta ---- */

    const template = new THREE.PlaneGeometry(PAGE_W, PAGE_H, SEG_X, SEG_Y);
    template.rotateX(-Math.PI / 2);
    template.translate(PAGE_W / 2, 0, 0);

    for (let sheet = 0; sheet < sheetCount; sheet += 1) {
      const geometry = template.clone();
      const rest = Float32Array.from(geometry.attributes.position.array as Float32Array);

      const rectoMap = paintPage(paper, renderer, pages[sheet * 2] ?? {}, true, photos);
      const versoMap = paintPage(paper, renderer, pages[sheet * 2 + 1] ?? {}, false, photos);
      // La faccia posteriore si guarda da dietro: specchiamo la u.
      versoMap.repeat.x = -1;
      versoMap.offset.x = 1;

      const recto = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({ map: rectoMap, roughness: 0.96, metalness: 0, side: THREE.FrontSide }),
      );
      const verso = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({ map: versoMap, roughness: 0.96, metalness: 0, side: THREE.BackSide }),
      );
      recto.castShadow = true;
      recto.receiveShadow = true;
      verso.receiveShadow = true;

      const pivot = new THREE.Group();
      pivot.add(recto, verso);
      this.group.add(pivot);

      this.leaves.push({
        pivot,
        rigid: false,
        sheet,
        t: 0,
        target: 0,
        geometry,
        rest,
        dirty: true,
      });
    }

    template.dispose();
    this.update(0);
  }

  /* ---------------------------------------------------------------- */
  /* Interazione                                                       */
  /* ---------------------------------------------------------------- */

  /** localX è la x del puntatore nello spazio del libro (0 = costola). */
  beginDrag(localX: number) {
    if (this.dragging) {
      return false;
    }
    if (localX >= 0 && this.current < this.leaves.length) {
      this.dragging = { leaf: this.leaves[this.current], forward: true };
      return true;
    }
    if (localX < 0 && this.current > 0) {
      this.dragging = { leaf: this.leaves[this.current - 1], forward: false };
      return true;
    }
    return false;
  }

  moveDrag(localX: number) {
    if (!this.dragging) {
      return;
    }
    const t = clamp01((PAGE_W - localX) / (2 * PAGE_W));
    this.dragging.leaf.t = t;
    this.dragging.leaf.target = t;
    this.dragging.leaf.dirty = true;
  }

  endDrag() {
    if (!this.dragging) {
      return;
    }
    const { leaf, forward } = this.dragging;
    this.dragging = null;
    if (forward) {
      if (leaf.t > 0.42) {
        leaf.target = 1;
        this.current += 1;
      } else {
        leaf.target = 0;
      }
    } else if (leaf.t < 0.58) {
      leaf.target = 0;
      this.current -= 1;
    } else {
      leaf.target = 1;
    }
  }

  /** Annulla il trascinamento senza far scattare la pagina. */
  cancelDrag() {
    this.dragging = null;
  }

  get isDragging() {
    return this.dragging !== null;
  }

  next() {
    if (this.dragging || this.current >= this.leaves.length) {
      return false;
    }
    this.leaves[this.current].target = 1;
    this.current += 1;
    return true;
  }

  previous() {
    if (this.dragging || this.current <= 0) {
      return false;
    }
    this.current -= 1;
    this.leaves[this.current].target = 0;
    return true;
  }

  /* ---------------------------------------------------------------- */
  /* Aggiornamento                                                     */
  /* ---------------------------------------------------------------- */

  update(delta: number) {
    const smoothing = 1 - Math.pow(0.0022, Math.min(delta, 0.05));

    let flipped = 0;
    for (const leaf of this.leaves) {
      if (Math.abs(leaf.target - leaf.t) > 0.0004) {
        leaf.t += (leaf.target - leaf.t) * smoothing;
        leaf.dirty = true;
      } else if (leaf.t !== leaf.target) {
        leaf.t = leaf.target;
        leaf.dirty = true;
      }
      if (leaf.sheet >= 0) {
        flipped += leaf.t;
      }
    }

    // Le due pile si travasano l'una nell'altra mentre si sfoglia.
    const rightFill = (BLOCK_T * (sheetCount - flipped)) / sheetCount;
    const leftFill = (BLOCK_T * flipped) / sheetCount;
    setBlock(this.rightBlock, rightFill, this.openness);
    setBlock(this.leftBlock, leftFill, this.openness);

    for (const leaf of this.leaves) {
      const yRight =
        leaf.sheet < 0
          ? this.coverRestY
          : PAGE_BASE + rightFill + (sheetCount - 1 - leaf.sheet) * LEAF_GAP;
      const yLeft =
        leaf.sheet < 0 ? -COVER_T / 2 : PAGE_BASE + leftFill + leaf.sheet * LEAF_GAP;

      leaf.pivot.position.y =
        yRight + (yLeft - yRight) * leaf.t + Math.sin(Math.PI * leaf.t) * LIFT;

      if (leaf.dirty) {
        this.applyShape(leaf);
        leaf.dirty = false;
      }
    }

    // Il dorso è bombato da chiuso e si appiattisce sotto la piega da aperto.
    const open = this.openness;
    this.spine.scale.set(1, 1, 1 - 0.78 * open);
    this.spine.position.y =
      (this.spineRadius - COVER_T) * (1 - open) + (-COVER_T / 2) * open;

    // Chiuso il libro sta tutto a destra: lo ricentriamo mentre si apre.
    this.group.position.x = -(COVER_W / 2) * (1 - open);
  }

  private applyShape(leaf: Leaf) {
    const t = leaf.t;

    if (leaf.rigid) {
      leaf.pivot.rotation.z = t * Math.PI;
      return;
    }

    const geometry = leaf.geometry!;
    const rest = leaf.rest!;
    const position = geometry.attributes.position;
    const array = position.array as Float32Array;

    const theta = t * Math.PI;
    const bend = Math.sin(Math.PI * t);
    const k = (CURL / PAGE_W) * bend;

    for (let i = 0; i < rest.length; i += 3) {
      const s = rest[i];
      const z = rest[i + 2];
      const angle = theta + TILT * bend * (z / PAGE_H);
      const curvature = k * (1 + 0.25 * (z / PAGE_H));

      if (Math.abs(curvature) < 1e-4) {
        array[i] = s * Math.cos(angle);
        array[i + 1] = s * Math.sin(angle);
      } else {
        array[i] = (Math.sin(angle + curvature * s) - Math.sin(angle)) / curvature;
        array[i + 1] = -(Math.cos(angle + curvature * s) - Math.cos(angle)) / curvature;
      }
      array[i + 2] = z;
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
  }
}

function setBlock(mesh: THREE.Mesh, height: number, openness: number) {
  const visible = openness > 0.015 || mesh.position.x > 0;
  mesh.visible = visible && height > 0.0008;
  mesh.scale.y = Math.max(height, 0.0008);
  mesh.position.y = Math.max(height, 0.0008) / 2;
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}
