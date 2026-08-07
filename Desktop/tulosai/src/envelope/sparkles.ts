import * as THREE from 'three';
import { paintSpark } from './textures';

interface Layer {
  points: THREE.Points;
  speeds: Float32Array;
  phases: Float32Array;
  baseX: Float32Array;
  tint: THREE.Color;
}

const SPREAD_X = 7.2;
const BOTTOM = -3.4;
const TOP = 4.6;

/**
 * Pulviscolo rosa che sale piano e pulsa. Tre strati di grandezze diverse:
 * i più grandi davanti, i più piccoli in fondo, così si legge la profondità.
 */
export class Sparkles {
  readonly group = new THREE.Group();
  private layers: Layer[] = [];
  private time = 0;

  constructor(renderer: THREE.WebGLRenderer) {
    const sprite = paintSpark(renderer);

    const specs = [
      { count: 90, size: 0.055, z: [-3.2, -1.4], speed: 0.075, tint: 0xff9dc4 },
      { count: 60, size: 0.1, z: [-1.4, 0.2], speed: 0.11, tint: 0xffb4d2 },
      { count: 26, size: 0.17, z: [0.6, 2.2], speed: 0.16, tint: 0xffd0e2 },
    ];

    for (const spec of specs) {
      const positions = new Float32Array(spec.count * 3);
      const colors = new Float32Array(spec.count * 3);
      const speeds = new Float32Array(spec.count);
      const phases = new Float32Array(spec.count);
      const baseX = new Float32Array(spec.count);

      for (let i = 0; i < spec.count; i += 1) {
        const x = (Math.random() - 0.5) * SPREAD_X;
        baseX[i] = x;
        positions[i * 3] = x;
        positions[i * 3 + 1] = BOTTOM + Math.random() * (TOP - BOTTOM);
        positions[i * 3 + 2] = spec.z[0] + Math.random() * (spec.z[1] - spec.z[0]);
        speeds[i] = spec.speed * (0.55 + Math.random() * 0.9);
        phases[i] = Math.random() * Math.PI * 2;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const points = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
          size: spec.size,
          map: sprite,
          vertexColors: true,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        }),
      );
      points.frustumCulled = false;
      this.group.add(points);

      this.layers.push({ points, speeds, phases, baseX, tint: new THREE.Color(spec.tint) });
    }

    this.update(0);
  }

  update(delta: number) {
    this.time += delta;

    for (const layer of this.layers) {
      const position = layer.points.geometry.attributes.position as THREE.BufferAttribute;
      const color = layer.points.geometry.attributes.color as THREE.BufferAttribute;
      const array = position.array as Float32Array;
      const colors = color.array as Float32Array;

      for (let i = 0; i < layer.speeds.length; i += 1) {
        const index = i * 3;
        let y = array[index + 1] + layer.speeds[i] * delta;
        if (y > TOP) {
          y = BOTTOM;
        }
        array[index + 1] = y;
        // Deriva laterale lentissima: non salgono mai in linea retta.
        array[index] = layer.baseX[i] + Math.sin(this.time * 0.32 + layer.phases[i]) * 0.28;

        const twinkle = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(this.time * 1.6 + layer.phases[i] * 3.1));
        // Sbiadiscono agli estremi, così non compaiono e spariscono di colpo.
        const fade = Math.min(1, Math.min(y - BOTTOM, TOP - y) / 1.1);
        const level = twinkle * Math.max(fade, 0);
        colors[index] = layer.tint.r * level;
        colors[index + 1] = layer.tint.g * level;
        colors[index + 2] = layer.tint.b * level;
      }

      position.needsUpdate = true;
      color.needsUpdate = true;
    }
  }
}
