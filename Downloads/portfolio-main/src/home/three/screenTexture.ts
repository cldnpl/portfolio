import * as THREE from "three";

export type ScreenVariant = "ios" | "android";

export type ScreenContent = {
  eyebrow: string;
  title: string;
  items: string[];
  footer: string;
  lock: {
    ios: { date: string; time: string };
    android: { date: string; time: [string, string]; weather: string; caption: string };
  };
};

/** Button hit boxes in normalised screen space (0..1, origin top-left). */
export type HitBox = { x: number; y: number; w: number; h: number };

/** Where the button stack starts when it sits on a real lock screen capture:
 *  below the clock and widgets, above the torch and camera. */
const BUTTON_TOP = 690;

/** The coordinate system everything below is drawn in. Not the size of the
 *  canvas: see `detail`. */
const W = 720;
const H = 1560; // ≈ 19.5:9 — close enough for both handsets

/**
 * How much of that coordinate system is actually rasterised.
 *
 * Every redraw hands the GPU a whole new texture, and 720×1560 in RGBA is four
 * and a half megabytes of upload — on a phone, several frames' worth of work
 * for a picture that is never shown at anything like that size. The renderer
 * caps its own pixel ratio at 1.6, so on a 400-point screen the display is
 * drawn into fewer than five hundred device pixels whatever we do here.
 * Two thirds of the plate is therefore free: the same picture, a third of the
 * bytes.
 */
function detailForDevice(): number {
  if (typeof window === "undefined") return 1;
  const narrow = Math.min(window.innerWidth, window.innerHeight) < 760;
  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  return narrow || coarse ? 0.62 : 1;
}

/**
 * Redrawing the screen and re-uploading it as a texture is expensive, so the
 * entrance is quantised: sixteen steps is well below what anyone can see on a
 * fade this short, and costs sixteen redraws instead of a hundred. On a phone
 * even sixteen is too many — they all land inside one chapter change, which is
 * also when the scroll has to stay smooth — so it drops to nine.
 */
function introStepsForDevice(detail: number): number {
  return detail < 1 ? 9 : 16;
}

const CREAM = "#f3eee4";
const GOLD = "#c9a86a";

type Options = {
  variant: ScreenVariant;
  content: ScreenContent;
  /**
   * A capture of the real lock screen — clock, date, status bar and all. When
   * it loads it becomes the entire display; the painted furniture below is
   * only the fallback for when it does not.
   */
  wallpaper?: string;
  /** Only the iPhone carries the navigation buttons. */
  buttons?: boolean;
};

/**
 * Draws a device lock screen onto a canvas that is used both as the emissive
 * screen texture and as the hit-test surface. Drawing and hit-testing share
 * the same geometry constants, so a button is always exactly where it looks.
 */
export class PhoneScreen {
  readonly canvas: HTMLCanvasElement;
  readonly texture: THREE.CanvasTexture;

  private ctx: CanvasRenderingContext2D;
  private options: Options;
  /** The capture, already fitted and scrimmed, at the backing store's size. */
  private plate: HTMLCanvasElement | null = null;
  private hovered = -1;
  private pressed = -1;
  /** 0..1 entrance progress for the on-screen content */
  private intro = 0;
  private boxes: HitBox[] = [];
  private disposed = false;
  private readonly detail: number;
  private readonly introSteps: number;

  constructor(options: Options) {
    this.options = options;
    this.detail = detailForDevice();
    this.introSteps = introStepsForDevice(this.detail);

    this.canvas = document.createElement("canvas");
    this.canvas.width = Math.round(W * this.detail);
    this.canvas.height = Math.round(H * this.detail);
    this.ctx = this.canvas.getContext("2d")!;

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    // Anisotropy is paid per sample, on a texture the phone's GPU is already
    // re-uploading; four is indistinguishable from eight at this size.
    this.texture.anisotropy = this.detail < 1 ? 4 : 8;

    this.loadWallpaper();
    this.draw();
  }

  setContent(content: ScreenContent) {
    this.options = { ...this.options, content };
    this.draw();
  }

  setIntro(value: number) {
    const clamped = Math.max(0, Math.min(1, value));
    const next = Math.round(clamped * this.introSteps) / this.introSteps;
    if (next === this.intro) return;
    this.intro = next;
    this.draw();
  }

  setHovered(index: number) {
    if (index === this.hovered) return;
    this.hovered = index;
    this.draw();
  }

  setPressed(index: number) {
    if (index === this.pressed) return;
    this.pressed = index;
    this.draw();
  }

  /** Which button is at this UV, or -1. `uv` uses the canvas convention (y down). */
  hitTest(u: number, v: number): number {
    for (let i = 0; i < this.boxes.length; i++) {
      const b = this.boxes[i];
      if (u >= b.x && u <= b.x + b.w && v >= b.y && v <= b.y + b.h) return i;
    }
    return -1;
  }

  dispose() {
    this.disposed = true;
    this.texture.dispose();
  }

  // -- wallpaper -----------------------------------------------------------

  private loadWallpaper() {
    const src = this.options.wallpaper;
    if (!src) return;

    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (this.disposed) return;
      this.preparePlate(image);
      this.draw();
    };
    // A missing wallpaper is not an error worth shouting about: the painted
    // fallback below is a complete screen on its own.
    image.onerror = () => undefined;
    image.src = src;
  }

  /**
   * Fits the capture to the display and lays the scrim on it, once.
   *
   * This is the same picture on every frame of the entrance — the only things
   * that change are the buttons drawn over it — so rescaling a two-megapixel
   * JPEG for each of them was work done nine or sixteen times for one result.
   */
  private preparePlate(image: HTMLImageElement) {
    const plate = document.createElement("canvas");
    plate.width = this.canvas.width;
    plate.height = this.canvas.height;

    const ctx = plate.getContext("2d");
    if (!ctx) return;

    ctx.scale(this.detail, this.detail);

    const scale = Math.max(W / image.naturalWidth, H / image.naturalHeight);
    const w = image.naturalWidth * scale;
    const h = image.naturalHeight * scale;
    ctx.drawImage(image, (W - w) / 2, (H - h) / 2, w, h);

    // A light scrim only: enough to settle the capture into the page's key
    // without hiding what it is a picture of.
    ctx.fillStyle = "rgba(8,7,6,0.20)";
    ctx.fillRect(0, 0, W, H);

    this.plate = plate;
  }

  /** Returns true when a real lock screen capture was drawn. */
  private drawWallpaper(): boolean {
    const ctx = this.ctx;

    if (this.plate) {
      ctx.drawImage(this.plate, 0, 0, W, H);
      return true;
    }

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#2b2721");
    bg.addColorStop(0.55, "#232019");
    bg.addColorStop(1, "#1b1814");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const wash = ctx.createRadialGradient(W * 0.95, H * 0.08, 0, W * 0.95, H * 0.08, W * 1.1);
    wash.addColorStop(0, "rgba(201,168,106,0.10)");
    wash.addColorStop(1, "rgba(201,168,106,0)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, W, H);

    return false;
  }

  // -- drawing -------------------------------------------------------------

  private draw() {
    const ctx = this.ctx;
    // Re-established rather than assumed: everything below is written in the
    // 720x1560 design space, and this is the one place that maps it onto
    // whatever the backing store actually is.
    ctx.setTransform(this.detail, 0, 0, this.detail, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";

    const ease = 1 - Math.pow(1 - this.intro, 3);
    this.boxes = [];

    const hasCapture = this.drawWallpaper();

    if (hasCapture) {
      // The capture already carries the clock, the date and the controls.
      // Drawing our own on top would give the phone two of everything.
      if (this.options.buttons) this.drawButtons(ease, BUTTON_TOP, true);
    } else {
      this.drawStatusBar(ease);
      if (this.options.variant === "ios") this.drawIosFace(ease);
      else this.drawAndroidFace(ease);
      this.drawBottomControls(ease);
    }

    ctx.globalAlpha = 1;
    this.texture.needsUpdate = true;
  }

  /** Eased 0..1 for an element that starts at `delay` through the entrance. */
  private fade(ease: number, delay: number) {
    const t = Math.max(0, Math.min(1, (ease - delay) / (1 - delay || 1)));
    return 1 - Math.pow(1 - t, 3);
  }

  private drawStatusBar(ease: number) {
    const ctx = this.ctx;
    const a = this.fade(ease, 0);
    const y = 62;

    ctx.globalAlpha = a * 0.85;
    ctx.fillStyle = CREAM;

    // Signal bars
    for (let i = 0; i < 4; i++) {
      const h = 7 + i * 5;
      ctx.fillRect(W - 168 + i * 13, y - h, 8, h);
    }

    // Wi-Fi arcs
    ctx.strokeStyle = CREAM;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(W - 96, y + 2, 6 + i * 9, Math.PI * 1.25, Math.PI * 1.75);
      ctx.stroke();
    }

    // Battery
    const bx = W - 62;
    ctx.lineWidth = 3;
    ctx.strokeRect(bx, y - 20, 42, 21);
    ctx.fillRect(bx + 44, y - 13, 4, 8);
    ctx.fillRect(bx + 3, y - 17, 32, 15);

    ctx.globalAlpha = 1;
  }

  private drawIosFace(ease: number) {
    const ctx = this.ctx;
    const { date, time } = this.options.content.lock.ios;

    const aDate = this.fade(ease, 0.04);
    ctx.globalAlpha = aDate * 0.8;
    ctx.textAlign = "center";
    ctx.fillStyle = CREAM;
    ctx.font = "400 30px 'Inter', system-ui, sans-serif";
    ctx.fillText(date, W / 2, 196);

    const aTime = this.fade(ease, 0.08);
    ctx.globalAlpha = aTime;
    ctx.font = "200 168px 'Inter', system-ui, sans-serif";
    ctx.fillText(time, W / 2, 340 + (1 - aTime) * 14);

    ctx.textAlign = "left";

    if (this.options.buttons) this.drawButtons(ease, 660);

    // Owner line, where a lock screen would show its widgets
    const aFooter = this.fade(ease, 0.62);
    ctx.globalAlpha = aFooter * 0.5;
    ctx.fillStyle = CREAM;
    ctx.font = "300 20px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textAlign = "center";
    this.tracked(ctx, this.options.content.footer.toUpperCase(), W / 2, 1268, 5, true);
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;
  }

  private drawAndroidFace(ease: number) {
    const ctx = this.ctx;
    const { date, time, weather, caption } = this.options.content.lock.android;
    const pad = 64;

    const aDate = this.fade(ease, 0.04);
    ctx.globalAlpha = aDate * 0.88;
    ctx.fillStyle = CREAM;
    ctx.font = "400 34px 'Inter', system-ui, sans-serif";
    ctx.fillText(date, pad, 214);

    ctx.globalAlpha = aDate * 0.6;
    ctx.font = "300 30px 'Inter', system-ui, sans-serif";
    ctx.fillText(weather, pad, 266);

    // The stacked, offset clock is what makes an Android lock screen read as
    // Android at a glance.
    const aTime = this.fade(ease, 0.1);
    ctx.globalAlpha = aTime;
    ctx.font = "200 244px 'Inter', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(time[0], W / 2 - 22, 620 + (1 - aTime) * 16);
    ctx.fillText(time[1], W / 2 + 34, 830 + (1 - aTime) * 16);
    ctx.textAlign = "left";

    // Padlock
    const aLock = this.fade(ease, 0.5);
    ctx.globalAlpha = aLock * 0.6;
    ctx.strokeStyle = CREAM;
    ctx.lineWidth = 4;
    ctx.strokeRect(W / 2 - 17, 1218, 34, 28);
    ctx.beginPath();
    ctx.arc(W / 2, 1218, 12, Math.PI, 0);
    ctx.stroke();

    const aCaption = this.fade(ease, 0.62);
    ctx.globalAlpha = aCaption * 0.5;
    ctx.fillStyle = CREAM;
    ctx.font = "300 20px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textAlign = "center";
    this.tracked(ctx, caption.toUpperCase(), W / 2, 1328, 5, true);
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;
  }

  /** The three navigation buttons — iPhone only. */
  private drawButtons(ease: number, top: number, overPhoto = false) {
    const ctx = this.ctx;
    const pad = 58;
    const btnH = overPhoto ? 140 : 118;
    const gap = 26;

    if (overPhoto) {
      // Only a whisper of shade. The cards do their own legibility work with
      // dark glass below; a heavy band here would bury the photograph, which
      // is the thing worth looking at.
      const height = btnH * 3 + gap * 2;
      const band = ctx.createLinearGradient(0, top - 90, 0, top + height + 90);
      band.addColorStop(0, "rgba(8,7,6,0)");
      band.addColorStop(0.3, "rgba(8,7,6,0.22)");
      band.addColorStop(0.7, "rgba(8,7,6,0.22)");
      band.addColorStop(1, "rgba(8,7,6,0)");
      ctx.fillStyle = band;
      ctx.fillRect(0, top - 90, W, height + 180);
    }

    this.options.content.items.forEach((item, i) => {
      const y = top + i * (btnH + gap);
      const a = this.fade(ease, 0.24 + i * 0.1);
      const isHover = this.hovered === i;
      const isPressed = this.pressed === i;

      this.boxes.push({ x: pad / W, y: y / H, w: (W - pad * 2) / W, h: btnH / H });

      ctx.globalAlpha = a;
      const slide = (1 - a) * 22;
      const x = pad + slide;
      const w = W - pad * 2;

      // A lock-screen notification card. Over a photograph it is dark glass —
      // a pale fill would grey the wallpaper out; over the painted fallback it
      // is the pale one, because there the screen is already dark.
      if (overPhoto) {
        ctx.fillStyle = isHover || isPressed ? "rgba(46,36,20,0.66)" : "rgba(14,12,10,0.52)";
      } else {
        ctx.fillStyle =
          isHover || isPressed ? "rgba(201,168,106,0.20)" : "rgba(243,238,228,0.10)";
      }
      this.roundRect(ctx, x, y, w, btnH, 26);
      ctx.fill();

      ctx.strokeStyle =
        isHover || isPressed ? "rgba(201,168,106,0.85)" : "rgba(243,238,228,0.24)";
      ctx.lineWidth = 1.5;
      this.roundRect(ctx, x + 0.75, y + 0.75, w - 1.5, btnH - 1.5, 26);
      ctx.stroke();

      ctx.fillStyle = isHover || isPressed ? CREAM : "rgba(243,238,228,0.92)";
      ctx.font = "400 44px 'Playfair Display', Georgia, serif";
      ctx.fillText(item, x + 36, y + btnH / 2 + 15);

      const arrowX = W - pad - 44 + slide + (isHover ? 8 : 0);
      ctx.strokeStyle = isHover || isPressed ? GOLD : "rgba(201,168,106,0.65)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const ay = y + btnH / 2;
      ctx.moveTo(arrowX - 26, ay);
      ctx.lineTo(arrowX, ay);
      ctx.moveTo(arrowX - 9, ay - 8);
      ctx.lineTo(arrowX, ay);
      ctx.lineTo(arrowX - 9, ay + 8);
      ctx.stroke();
    });

    ctx.globalAlpha = 1;
  }

  private drawBottomControls(ease: number) {
    const ctx = this.ctx;
    const a = this.fade(ease, 0.7);
    const y = 1412;
    const r = 44;

    ctx.globalAlpha = a * 0.24;
    ctx.fillStyle = CREAM;
    for (const cx of [140, W - 140]) {
      ctx.beginPath();
      ctx.arc(cx, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = a * 0.75;
    ctx.strokeStyle = CREAM;
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";

    // Torch
    ctx.beginPath();
    ctx.moveTo(140 - 10, y - 16);
    ctx.lineTo(140 + 10, y - 16);
    ctx.lineTo(140 + 6, y + 2);
    ctx.lineTo(140 - 6, y + 2);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(140, y + 6);
    ctx.lineTo(140, y + 17);
    ctx.stroke();

    // Camera
    const cx = W - 140;
    ctx.beginPath();
    ctx.moveTo(cx - 20, y - 8);
    ctx.lineTo(cx - 12, y - 8);
    ctx.lineTo(cx - 7, y - 16);
    ctx.lineTo(cx + 7, y - 16);
    ctx.lineTo(cx + 12, y - 8);
    ctx.lineTo(cx + 20, y - 8);
    ctx.lineTo(cx + 20, y + 16);
    ctx.lineTo(cx - 20, y + 16);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, y + 3, 9, 0, Math.PI * 2);
    ctx.stroke();

    // Home indicator
    ctx.globalAlpha = a * 0.34;
    ctx.fillStyle = CREAM;
    this.roundRect(ctx, W / 2 - 90, H - 58, 180, 7, 3.5);
    ctx.fill();

    ctx.globalAlpha = 1;
  }

  // -- helpers -------------------------------------------------------------

  /** Canvas has no letter-spacing in older engines — draw it by hand. */
  private tracked(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    spacing: number,
    centred = false
  ) {
    const chars = [...text];
    const width =
      chars.reduce((sum, char) => sum + ctx.measureText(char).width + spacing, 0) - spacing;

    const previousAlign = ctx.textAlign;
    ctx.textAlign = "left";
    let cursor = centred ? x - width / 2 : x;
    for (const char of chars) {
      ctx.fillText(char, cursor, y);
      cursor += ctx.measureText(char).width + spacing;
    }
    ctx.textAlign = previousAlign;
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}
