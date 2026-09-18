import * as THREE from "three";

/**
 * A procedural studio environment.
 *
 * RoomEnvironment is too bright and too neutral for this page — it makes the
 * aluminium read as silver plastic. This builds a dark room with three
 * sources instead: a broad cool key above, a warm bronze rim behind right,
 * and a dim floor bounce. That is what gives the devices their long
 * specular streaks against the marble.
 */
export function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;

  const w = canvas.width;
  const h = canvas.height;

  // Base: near-black room with a slight vertical gradient (ceiling lighter)
  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, "#1a1714");
  base.addColorStop(0.5, "#0a0908");
  base.addColorStop(1, "#050404");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  const softBlob = (
    x: number,
    y: number,
    rx: number,
    ry: number,
    inner: string,
    outer: string
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, inner);
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
    ctx.restore();
  };

  // Key light — a long cool softbox across the ceiling, slightly left
  softBlob(w * 0.34, h * 0.13, w * 0.40, h * 0.24, "rgba(255,252,246,1)", "rgba(255,252,246,0)");
  // A narrow hot core inside it: this is what draws the sharp highlight line
  softBlob(w * 0.34, h * 0.12, w * 0.12, h * 0.045, "rgba(255,255,255,1)", "rgba(255,255,255,0)");

  // Rim — warm bronze, behind and to the right
  softBlob(w * 0.80, h * 0.30, w * 0.26, h * 0.32, "rgba(222,180,112,0.80)", "rgba(222,180,112,0)");

  // Fill — very dim, opposite side, keeps the shadow side from going pure black
  softBlob(w * 0.06, h * 0.50, w * 0.24, h * 0.36, "rgba(178,192,214,0.30)", "rgba(178,192,214,0)");

  // Floor bounce
  softBlob(w * 0.5, h * 0.98, w * 0.5, h * 0.22, "rgba(120,104,84,0.22)", "rgba(120,104,84,0)");

  const equirect = new THREE.CanvasTexture(canvas);
  equirect.mapping = THREE.EquirectangularReflectionMapping;
  equirect.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envMap = pmrem.fromEquirectangular(equirect).texture;

  pmrem.dispose();
  equirect.dispose();

  return envMap;
}
