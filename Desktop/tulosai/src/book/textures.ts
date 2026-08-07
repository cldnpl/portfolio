import * as THREE from 'three';
import type { PageContent } from './content';

export const PAGE_TEX_W = 700;
export const PAGE_TEX_H = 1000;

/** Interlinea e stacco fra paragrafi, in multipli del corpo. */
const LINE_RATIO = 1.55;
const PARAGRAPH_RATIO = 0.72;

const SCRIPT_FONT = '"Snell Roundhand", "Apple Chancery", "Zapfino", "Segoe Script", "Brush Script MT", cursive';
const SERIF_FONT = 'Didot, "Bodoni 72", Baskerville, Garamond, Georgia, "Times New Roman", serif';

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return { canvas, ctx: canvas.getContext('2d')! };
}

function toTexture(canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderer, srgb = true) {
  const texture = new THREE.CanvasTexture(canvas);
  if (srgb) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/* ------------------------------------------------------------------ */
/* Copertina                                                           */
/* ------------------------------------------------------------------ */

interface CoverPaint {
  title: string;
  /** true = la costola sta a sinistra della texture (u = 0). */
  spineOnLeft: boolean;
}

/**
 * Disegna la scritta "incisa" a caldo sull'oro, dentro l'ovale in rilievo
 * della tela. Restituisce sia la mappa colore sia la mappa metallo/ruvidità,
 * così l'oro brilla davvero quando la luce si muove.
 */
export function paintCover(
  cloth: HTMLImageElement,
  renderer: THREE.WebGLRenderer,
  options: CoverPaint,
) {
  const { canvas, ctx } = makeCanvas(PAGE_TEX_W, PAGE_TEX_H);
  const orm = makeCanvas(PAGE_TEX_W, PAGE_TEX_H);

  ctx.save();
  if (!options.spineOnLeft) {
    ctx.translate(PAGE_TEX_W, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(cloth, 0, 0, PAGE_TEX_W, PAGE_TEX_H);
  ctx.restore();

  // Base ORM: verde tela, opaca e per niente metallica.
  orm.ctx.fillStyle = 'rgb(0, 216, 0)';
  orm.ctx.fillRect(0, 0, PAGE_TEX_W, PAGE_TEX_H);

  const cx = PAGE_TEX_W / 2;
  const cy = PAGE_TEX_H / 2;

  const drawTitle = (target: CanvasRenderingContext2D, mode: 'color' | 'orm') => {
    target.save();
    target.translate(cx, cy);
    target.textAlign = 'center';
    target.textBaseline = 'middle';

    const lines: Array<{ text: string; size: number; y: number; font: string }> = [
      { text: 'happy', size: 118, y: -78, font: SCRIPT_FONT },
      { text: 'birthday!', size: 118, y: 46, font: SCRIPT_FONT },
    ];

    const rules = [
      { y: -168, w: 210 },
      { y: 136, w: 210 },
    ];

    if (mode === 'orm') {
      // g = roughness, b = metalness: la scritta diventa oro lucido.
      target.fillStyle = 'rgb(0, 70, 255)';
      target.strokeStyle = 'rgb(0, 70, 255)';
      for (const line of lines) {
        target.font = `400 ${line.size}px ${line.font}`;
        target.fillText(line.text, 0, line.y);
      }
      target.lineWidth = 4;
      for (const rule of rules) {
        target.beginPath();
        target.moveTo(-rule.w / 2, rule.y);
        target.lineTo(rule.w / 2, rule.y);
        target.stroke();
      }
      target.restore();
      return;
    }

    // 1. incavo: la lamina è pressata nella tela, quindi sotto c'è ombra.
    target.fillStyle = 'rgba(6, 20, 14, 0.62)';
    target.strokeStyle = 'rgba(6, 20, 14, 0.62)';
    target.lineWidth = 4;
    for (const line of lines) {
      target.font = `400 ${line.size}px ${line.font}`;
      target.fillText(line.text, 3.5, line.y + 4.5);
    }
    for (const rule of rules) {
      target.beginPath();
      target.moveTo(-rule.w / 2 + 3.5, rule.y + 4.5);
      target.lineTo(rule.w / 2 + 3.5, rule.y + 4.5);
      target.stroke();
    }

    // 2. bordo alto illuminato.
    target.fillStyle = 'rgba(255, 245, 214, 0.30)';
    target.strokeStyle = 'rgba(255, 245, 214, 0.30)';
    for (const line of lines) {
      target.font = `400 ${line.size}px ${line.font}`;
      target.fillText(line.text, -2, line.y - 2.5);
    }
    for (const rule of rules) {
      target.beginPath();
      target.moveTo(-rule.w / 2 - 2, rule.y - 2.5);
      target.lineTo(rule.w / 2 - 2, rule.y - 2.5);
      target.stroke();
    }

    // 3. la lamina d'oro vera e propria.
    const gold = target.createLinearGradient(0, -190, 0, 150);
    gold.addColorStop(0, '#fff4cd');
    gold.addColorStop(0.26, '#f0cf7c');
    gold.addColorStop(0.5, '#c99a3c');
    gold.addColorStop(0.72, '#ffeeb4');
    gold.addColorStop(1, '#e0b558');
    target.fillStyle = gold;
    target.strokeStyle = gold;
    for (const line of lines) {
      target.font = `400 ${line.size}px ${line.font}`;
      target.fillText(line.text, 0, line.y);
    }
    for (const rule of rules) {
      target.beginPath();
      target.moveTo(-rule.w / 2, rule.y);
      target.lineTo(rule.w / 2, rule.y);
      target.stroke();
    }

    target.restore();
  };

  drawTitle(ctx, 'color');
  drawTitle(orm.ctx, 'orm');

  return {
    map: toTexture(canvas, renderer),
    orm: toTexture(orm.canvas, renderer, false),
  };
}

/* ------------------------------------------------------------------ */
/* Pagine                                                              */
/* ------------------------------------------------------------------ */

function drawGutterShade(ctx: CanvasRenderingContext2D, gutterOnLeft: boolean) {
  const width = PAGE_TEX_W * 0.22;
  const gradient = gutterOnLeft
    ? ctx.createLinearGradient(0, 0, width, 0)
    : ctx.createLinearGradient(PAGE_TEX_W, 0, PAGE_TEX_W - width, 0);
  gradient.addColorStop(0, 'rgba(58, 40, 24, 0.46)');
  gradient.addColorStop(0.35, 'rgba(58, 40, 24, 0.16)');
  gradient.addColorStop(1, 'rgba(58, 40, 24, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, PAGE_TEX_W, PAGE_TEX_H);
}

function drawEdgeWear(ctx: CanvasRenderingContext2D, gutterOnLeft: boolean) {
  const edge = gutterOnLeft ? PAGE_TEX_W : 0;
  const gradient = ctx.createLinearGradient(edge, 0, gutterOnLeft ? PAGE_TEX_W - 90 : 90, 0);
  gradient.addColorStop(0, 'rgba(120, 88, 48, 0.30)');
  gradient.addColorStop(1, 'rgba(120, 88, 48, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, PAGE_TEX_W, PAGE_TEX_H);
}

function drawOrnament(ctx: CanvasRenderingContext2D, x: number, y: number, width: number) {
  ctx.save();
  ctx.strokeStyle = 'rgba(96, 63, 48, 0.5)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x - width / 2, y);
  ctx.lineTo(x - 16, y);
  ctx.moveTo(x + 16, y);
  ctx.lineTo(x + width / 2, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, 4.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function paintPage(
  paper: HTMLImageElement,
  renderer: THREE.WebGLRenderer,
  content: PageContent,
  gutterOnLeft: boolean,
  photos: Map<string, HTMLImageElement>,
) {
  const { canvas, ctx } = makeCanvas(PAGE_TEX_W, PAGE_TEX_H);

  // La scansione di carta ha la piega già a sinistra: la ribaltiamo
  // quando la pagina sta a sinistra del libro.
  ctx.save();
  if (!gutterOnLeft) {
    ctx.translate(PAGE_TEX_W, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(paper, 0, 0, PAGE_TEX_W, PAGE_TEX_H);
  ctx.restore();

  drawGutterShade(ctx, gutterOnLeft);
  drawEdgeWear(ctx, gutterOnLeft);

  const marginInner = gutterOnLeft ? 132 : 92;
  const marginOuter = gutterOnLeft ? 92 : 132;
  const left = gutterOnLeft ? marginInner : marginOuter;
  const right = PAGE_TEX_W - (gutterOnLeft ? marginOuter : marginInner);
  const centerX = (left + right) / 2;
  const ink = 'rgba(58, 36, 28, 0.86)';
  const photo = content.photo ? photos.get(content.photo) : undefined;
  const hasText = Boolean(content.eyebrow || content.body?.length || content.caption);

  ctx.save();
  ctx.textBaseline = 'alphabetic';

  if (photo && !hasText) {
    // Facciata di sola fotografia: margini stretti, la stampa domina la pagina.
    const inner = gutterOnLeft ? 104 : 58;
    const outer = gutterOnLeft ? 58 : 104;
    drawPhoto(
      ctx,
      photo,
      { x: inner, y: 118, w: PAGE_TEX_W - inner - outer, h: PAGE_TEX_H - 236 },
      tiltFor(content.photo!),
    );
  } else if (photo) {
    // Fotografia in alto e poche righe sotto: apertura e chiusura del libro.
    // Misuriamo prima il testo, così la stampa si prende tutto lo spazio che resta.
    const column = right - left;
    const bodySize = 24;
    const captionSize = 36;

    ctx.font = `400 ${bodySize}px ${SERIF_FONT}`;
    let bodyLines = 0;
    for (const paragraph of content.body ?? []) {
      bodyLines += countLines(ctx, paragraph, column);
    }

    let captionLines = 0;
    if (content.caption) {
      ctx.font = `400 ${captionSize}px ${SCRIPT_FONT}`;
      captionLines = countLines(ctx, content.caption, column);
    }

    const ornamentGap = 62;
    const textHeight =
      ornamentGap + bodyLines * bodySize * LINE_RATIO + captionLines * captionSize * 1.34 + (captionLines ? 34 : 0);
    // L'occhiello va in cima, centrato sopra la stampa, e le ruba un po' di spazio.
    const eyebrowHeight = content.eyebrow ? 58 : 0;
    const photoTop = 118 + eyebrowHeight;
    const photoHeight = PAGE_TEX_H - photoTop - textHeight - 92;

    if (content.eyebrow) {
      ctx.textAlign = 'center';
      ctx.font = `400 22px ${SERIF_FONT}`;
      ctx.fillStyle = 'rgba(120, 74, 60, 0.72)';
      ctx.letterSpacing = '6px';
      ctx.fillText(content.eyebrow.toUpperCase(), centerX, 150);
      ctx.letterSpacing = '0px';
    }

    drawPhoto(ctx, photo, { x: left, y: photoTop, w: column, h: photoHeight }, tiltFor(content.photo!));

    let y = photoTop + photoHeight + ornamentGap;
    drawOrnament(ctx, centerX, y - 40, 180);

    ctx.font = `400 ${bodySize}px ${SERIF_FONT}`;
    ctx.fillStyle = ink;
    for (const paragraph of content.body ?? []) {
      y = wrapText(ctx, paragraph, centerX, y, column, bodySize * LINE_RATIO, 'center');
    }
    if (content.caption) {
      ctx.font = `400 ${captionSize}px ${SCRIPT_FONT}`;
      ctx.fillStyle = 'rgba(112, 40, 46, 0.82)';
      wrapText(ctx, content.caption, centerX, y + 34, column, captionSize * 1.34, 'center');
    }
  } else if (hasText) {
    let y = 214;
    ctx.textAlign = 'left';
    if (content.eyebrow) {
      ctx.font = `400 22px ${SERIF_FONT}`;
      ctx.fillStyle = 'rgba(120, 74, 60, 0.72)';
      ctx.letterSpacing = '6px';
      ctx.fillText(content.eyebrow.toUpperCase(), left, y);
      ctx.letterSpacing = '0px';
      y += 26;
      ctx.strokeStyle = 'rgba(120, 74, 60, 0.32)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(left + 96, y);
      ctx.stroke();
      y += 68;
    }
    if (content.heading) {
      ctx.font = `400 52px ${SERIF_FONT}`;
      ctx.fillStyle = 'rgba(70, 40, 32, 0.9)';
      ctx.fillText(content.heading, left, y);
      y += 68;
    }

    // Il testo può essere lungo: rimpiccioliamo finché non entra nello specchio.
    const size = fitFontSize(ctx, content.body ?? [], right - left, 858 - y, 27, SERIF_FONT);
    ctx.font = `400 ${size}px ${SERIF_FONT}`;
    ctx.fillStyle = ink;
    for (const paragraph of content.body ?? []) {
      y = wrapText(ctx, paragraph, left, y, right - left, size * LINE_RATIO);
      y += size * PARAGRAPH_RATIO;
    }
    if (content.folio) {
      ctx.textAlign = 'center';
      ctx.font = `400 24px ${SERIF_FONT}`;
      ctx.fillStyle = 'rgba(96, 63, 48, 0.6)';
      ctx.fillText(content.folio, centerX, PAGE_TEX_H - 90);
    }
  }
  ctx.restore();

  return toTexture(canvas, renderer);
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Ogni foto ha la sua inclinazione, sempre la stessa: sembra incollata a mano. */
function tiltFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 997;
  }
  return (((hash % 100) / 100) * 2 - 1) * 0.022;
}

function drawPhoto(ctx: CanvasRenderingContext2D, image: HTMLImageElement, box: Box, tilt: number) {
  const border = 20;
  const scale = Math.min((box.w - border * 2) / image.width, (box.h - border * 2) / image.height);
  const w = image.width * scale;
  const h = image.height * scale;

  ctx.save();
  ctx.translate(box.x + box.w / 2, box.y + box.h / 2);
  ctx.rotate(tilt);

  ctx.shadowColor = 'rgba(46, 30, 18, 0.45)';
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 11;
  ctx.fillStyle = '#fbf5e9';
  ctx.fillRect(-w / 2 - border, -h / 2 - border, w + border * 2, h + border * 2);
  ctx.shadowColor = 'transparent';

  ctx.drawImage(image, -w / 2, -h / 2, w, h);

  // Patina calda: la stampa è invecchiata come la carta attorno.
  ctx.fillStyle = 'rgba(158, 116, 62, 0.09)';
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = 'rgba(52, 34, 22, 0.28)';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.restore();
}

/** Cerca il corpo più grande che fa stare tutti i paragrafi nell'altezza data. */
function fitFontSize(
  ctx: CanvasRenderingContext2D,
  paragraphs: string[],
  maxWidth: number,
  availableHeight: number,
  startSize: number,
  font: string,
) {
  for (let size = startSize; size >= 15; size -= 1) {
    ctx.font = `400 ${size}px ${font}`;
    let height = 0;
    for (const paragraph of paragraphs) {
      height += countLines(ctx, paragraph, maxWidth) * size * LINE_RATIO + size * PARAGRAPH_RATIO;
    }
    if (height <= availableHeight) {
      return size;
    }
  }
  return 15;
}

function countLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  let lines = 1;
  let line = '';
  for (const word of text.split(' ')) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines += 1;
      line = word;
    } else {
      line = candidate;
    }
  }
  return lines;
}

export function paintEndpaper(
  paper: HTMLImageElement,
  renderer: THREE.WebGLRenderer,
  gutterOnLeft: boolean,
) {
  const { canvas, ctx } = makeCanvas(PAGE_TEX_W, PAGE_TEX_H);
  ctx.save();
  if (!gutterOnLeft) {
    ctx.translate(PAGE_TEX_W, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(paper, 0, 0, PAGE_TEX_W, PAGE_TEX_H);
  ctx.restore();

  // Carta di guardia marmorizzata, nei verdi della tela.
  ctx.fillStyle = 'rgba(38, 58, 48, 0.82)';
  ctx.fillRect(0, 0, PAGE_TEX_W, PAGE_TEX_H);
  ctx.save();
  ctx.filter = 'blur(9px)';
  for (let i = 0; i < 420; i += 1) {
    const x = Math.random() * PAGE_TEX_W;
    const y = Math.random() * PAGE_TEX_H;
    const warm = Math.random() > 0.78;
    ctx.fillStyle = warm
      ? `rgba(${146 + Math.random() * 44}, ${116 + Math.random() * 26}, ${72 + Math.random() * 22}, ${0.03 + Math.random() * 0.07})`
      : `rgba(${52 + Math.random() * 36}, ${88 + Math.random() * 40}, ${72 + Math.random() * 26}, ${0.04 + Math.random() * 0.1})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 26 + Math.random() * 90, 16 + Math.random() * 46, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  // Filetto dorato lungo il bordo interno, come nelle legature vere.
  ctx.strokeStyle = 'rgba(198, 160, 88, 0.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(26, 26, PAGE_TEX_W - 52, PAGE_TEX_H - 52);
  drawGutterShade(ctx, gutterOnLeft);
  return toTexture(canvas, renderer);
}

/** Bordo del blocco pagine: righe sottili che leggono come carta impilata. */
export function paintPageEdge(renderer: THREE.WebGLRenderer) {
  const { canvas, ctx } = makeCanvas(32, 512);
  ctx.fillStyle = '#d9caa8';
  ctx.fillRect(0, 0, 32, 512);
  for (let y = 0; y < 512; y += 1) {
    const shade = Math.random();
    ctx.fillStyle = `rgba(104, 78, 44, ${0.12 + shade * 0.4})`;
    ctx.fillRect(0, y, 32, 1);
  }
  const texture = toTexture(canvas, renderer);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  align: CanvasTextAlign = 'left',
) {
  ctx.textAlign = align;
  const words = text.split(' ');
  let line = '';
  let cursor = y;
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      ctx.fillText(line, x, cursor);
      cursor += lineHeight;
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) {
    ctx.fillText(line, x, cursor);
    cursor += lineHeight;
  }
  return cursor;
}
