import * as THREE from 'three';

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
  return texture;
}

/** Fibre di carta: un rumore fine e allungato, come nella carta vera. */
function drawFibres(ctx: CanvasRenderingContext2D, width: number, height: number, strength: number) {
  for (let i = 0; i < width * height * 0.02; i += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const length = 2 + Math.random() * 9;
    const angle = Math.random() * Math.PI;
    const shade = Math.random() > 0.5 ? 255 : 0;
    ctx.strokeStyle = `rgba(${shade}, ${shade}, ${shade}, ${Math.random() * strength})`;
    ctx.lineWidth = Math.random() < 0.85 ? 1 : 1.8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
  }
}

/** Carta esterna della busta: colore, più una mappa di rilievo con le stesse fibre. */
export function paintPaper(renderer: THREE.WebGLRenderer, base: string) {
  const size = 1024;
  const { canvas, ctx } = makeCanvas(size, size);

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Macchie larghissime: la carta non è mai di un solo tono.
  for (let i = 0; i < 90; i += 1) {
    const gradient = ctx.createRadialGradient(
      Math.random() * size,
      Math.random() * size,
      0,
      Math.random() * size,
      Math.random() * size,
      80 + Math.random() * 260,
    );
    const warm = Math.random() > 0.5;
    gradient.addColorStop(0, warm ? 'rgba(255, 246, 238, 0.022)' : 'rgba(120, 108, 112, 0.03)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  drawFibres(ctx, size, size, 0.13);

  const bump = makeCanvas(size, size);
  bump.ctx.fillStyle = '#808080';
  bump.ctx.fillRect(0, 0, size, size);
  drawFibres(bump.ctx, size, size, 0.5);

  const map = toTexture(canvas, renderer);
  const bumpMap = toTexture(bump.canvas, renderer, false);
  for (const texture of [map, bumpMap]) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  }
  return { map, bumpMap };
}

/** Fodera interna a righe: è quella che si intravede quando la busta si apre. */
export function paintLiner(renderer: THREE.WebGLRenderer) {
  const width = 1024;
  const height = 1024;
  const { canvas, ctx } = makeCanvas(width, height);

  ctx.fillStyle = '#efe6e4';
  ctx.fillRect(0, 0, width, height);

  const stripe = width / 26;
  for (let i = 0; i < 26; i += 1) {
    if (i % 2 === 0) {
      continue;
    }
    const gradient = ctx.createLinearGradient(i * stripe, 0, (i + 1) * stripe, 0);
    gradient.addColorStop(0, '#8d4256');
    gradient.addColorStop(0.5, '#a4566a');
    gradient.addColorStop(1, '#8a4053');
    ctx.fillStyle = gradient;
    ctx.fillRect(i * stripe, 0, stripe, height);
  }

  drawFibres(ctx, width, height, 0.06);

  // Ombra propria verso il fondo: dentro la busta arriva meno luce.
  const shade = ctx.createLinearGradient(0, height, 0, height * 0.35);
  shade.addColorStop(0, 'rgba(24, 10, 16, 0.55)');
  shade.addColorStop(1, 'rgba(24, 10, 16, 0)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, width, height);

  return toTexture(canvas, renderer);
}

/** Il cartoncino con l'invito a cliccare. */
export function paintCard(renderer: THREE.WebGLRenderer) {
  const width = 1024;
  const height = 512;
  const { canvas, ctx } = makeCanvas(width, height);

  ctx.fillStyle = '#f7efdf';
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width * 0.42, height * 0.34, 30, width / 2, height / 2, width * 0.72);
  glow.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
  glow.addColorStop(0.55, 'rgba(246, 236, 220, 0.2)');
  glow.addColorStop(1, 'rgba(198, 176, 154, 0.26)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  drawFibres(ctx, width, height, 0.07);

  // Doppio filetto stampato, come sui biglietti da visita.
  ctx.strokeStyle = 'rgba(126, 100, 86, 0.28)';
  ctx.lineWidth = 6;
  ctx.strokeRect(46, 46, width - 92, height - 92);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 60, width - 120, height - 120);

  ctx.save();
  ctx.translate(width / 2, height / 2 + 12);
  ctx.rotate(-0.02);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '400 148px "Snell Roundhand", "Apple Chancery", "Brush Script MT", cursive';
  ctx.shadowColor = 'rgba(110, 35, 58, 0.18)';
  ctx.shadowBlur = 9;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = '#b23f59';
  ctx.fillText('Click me', 0, 0);
  ctx.restore();

  return toTexture(canvas, renderer);
}

/** Puntino morbido usato per i brillantini. */
export function paintSpark(renderer: THREE.WebGLRenderer) {
  const size = 128;
  const { canvas, ctx } = makeCanvas(size, size);
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.22, 'rgba(255, 228, 240, 0.92)');
  gradient.addColorStop(0.5, 'rgba(255, 150, 195, 0.42)');
  gradient.addColorStop(1, 'rgba(255, 120, 175, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = toTexture(canvas, renderer);
  return texture;
}
