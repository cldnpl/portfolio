import { Mesh, Program, Renderer, Texture, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// RGB split + row jitter around the pointer, scaled by hover and pointer speed.
const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageSize;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uVelocity;
  uniform float uTime;

  varying vec2 vUv;

  vec2 coverUv(vec2 uv, vec2 plane, vec2 image) {
    vec2 ratio = vec2(
      min((plane.x / plane.y) / (image.x / image.y), 1.0),
      min((plane.y / plane.x) / (image.y / image.x), 1.0)
    );
    return vec2(uv.x * ratio.x + (1.0 - ratio.x) * 0.5, uv.y * ratio.y + (1.0 - ratio.y) * 0.5);
  }

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    vec2 uv = coverUv(vUv, uResolution, uImageSize);
    float amount = uHover * (1.0 + uVelocity * 2.0);

    float band = smoothstep(0.18, 0.0, abs(uv.y - uMouse.y));
    float slice = (hash(floor(uv.y * 40.0) + floor(uTime * 18.0)) - 0.5) * 2.0;
    float jitter = slice * band * amount * 0.06;

    float dir = sign(uMouse.x - 0.5);
    if (dir == 0.0) dir = 1.0;
    float split = amount * 0.012;

    float r = texture2D(uTexture, uv + vec2(split * dir + jitter, 0.0)).r;
    float g = texture2D(uTexture, uv + vec2(jitter * 0.5, 0.0)).g;
    float b = texture2D(uTexture, uv + vec2(-split * dir + jitter, 0.0)).b;

    vec3 color = vec3(r, g, b);
    color -= sin(uv.y * uResolution.y * 1.2 + uTime * 8.0) * 0.03 * uHover;

    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Glitch overlay for the hero portrait. The WebGL context is only created on
 * the first hover, and the render loop stops once the effect has faded out.
 */
export const usePortraitGlitch = ({ src }: { src: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: Renderer | null = null;
    let mesh: Mesh | null = null;
    let texture: Texture | null = null;
    let frameId = 0;
    let running = false;
    let disposed = false;
    let loaded = false;
    let hover = 0;
    let targetHover = 0;
    let velocity = 0;
    let rawVelocity = 0;
    const mouse = { x: 0.5, y: 0.5 };
    let last = { x: 0.5, y: 0.5, t: 0 };

    const uniforms = {
      uTexture: { value: null as Texture | null },
      uResolution: { value: [1, 1] },
      uImageSize: { value: [1, 1] },
      uMouse: { value: [0.5, 0.5] },
      uHover: { value: 0 },
      uVelocity: { value: 0 },
      uTime: { value: 0 },
    };

    const resize = () => {
      if (!renderer) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
      uniforms.uResolution.value = [renderer.gl.drawingBufferWidth, renderer.gl.drawingBufferHeight];
    };

    const observer = new ResizeObserver(() => resize());

    const init = () => {
      if (renderer || disposed) return;
      renderer = new Renderer({
        canvas,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        alpha: false,
        antialias: false,
      });
      const gl = renderer.gl;
      texture = new Texture(gl, { generateMipmaps: false, wrapS: gl.CLAMP_TO_EDGE, wrapT: gl.CLAMP_TO_EDGE });
      uniforms.uTexture.value = texture;

      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = src;
      image.onload = () => {
        if (disposed || !texture) return;
        texture.image = image;
        uniforms.uImageSize.value = [image.naturalWidth, image.naturalHeight];
        loaded = true;
      };

      const program = new Program(gl, { vertex, fragment, uniforms });
      mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
      resize();
      observer.observe(container);
    };

    const frame = (time: number) => {
      if (disposed || !renderer || !mesh) return;
      if (loaded && targetHover === 1) canvas.style.opacity = "1";
      hover += (targetHover - hover) * 0.08;
      rawVelocity *= 0.9;
      velocity += (rawVelocity - velocity) * 0.1;
      uniforms.uHover.value = hover;
      uniforms.uVelocity.value = velocity;
      uniforms.uMouse.value = [mouse.x, mouse.y];
      uniforms.uTime.value = time * 0.001;
      renderer.render({ scene: mesh });
      if (targetHover === 0 && hover < 0.001) {
        hover = 0;
        uniforms.uHover.value = 0;
        renderer.render({ scene: mesh });
        running = false;
        canvas.style.opacity = "0";
        return;
      }
      frameId = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      frameId = requestAnimationFrame(frame);
    };

    const onEnter = () => {
      init();
      targetHover = 1;
      start();
    };

    const onLeave = () => {
      targetHover = 0;
      rawVelocity = 0;
    };

    const onMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      mouse.x = x;
      mouse.y = 1 - y;
      const now = performance.now();
      const dt = Math.max(now - last.t, 1);
      rawVelocity = Math.min((Math.hypot(x - last.x, y - last.y) / dt) * 1000, 2);
      last = { x, y, t: now };
    };

    container.addEventListener("pointerenter", onEnter);
    container.addEventListener("pointerleave", onLeave);
    container.addEventListener("pointermove", onMove);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      observer.disconnect();
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointerleave", onLeave);
      container.removeEventListener("pointermove", onMove);
      renderer?.gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [src]);

  return { containerRef, canvasRef };
};
