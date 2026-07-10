import React, { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TRAIL = 28;        // points per comet trail
const TRAIL_SPAN = 0.18; // fraction of the flight path the trail stretches over

interface CometState {
  start: THREE.Vector3;
  travel: THREE.Vector3; // full flight vector
  duration: number;      // seconds of flight
  delay: number;         // idle seconds before (re)launch
  t: number;             // local clock
  color: THREE.Color;
}

/** Reset a comet onto a fresh random path across the upper sky. */
function respawn(c: CometState, first = false): void {
  c.start.set(
    THREE.MathUtils.randFloatSpread(10),   // x: -5..5
    THREE.MathUtils.randFloat(1.8, 4.6),   // y: above the galaxy plane
    THREE.MathUtils.randFloat(-4.5, -1.5)  // z: behind the star cloud
  );
  // Always streak toward centre-screen so it crosses the visible cone
  const dx = THREE.MathUtils.randFloat(2.5, 5.5) * (c.start.x > 0 ? -1 : 1);
  c.travel.set(dx, -THREE.MathUtils.randFloat(1.2, 2.6), THREE.MathUtils.randFloatSpread(0.8));
  c.duration = THREE.MathUtils.randFloat(1.1, 1.9);
  c.delay = first ? THREE.MathUtils.randFloat(1, 8) : THREE.MathUtils.randFloat(3, 10);
  c.t = 0;
  // Icy blue-violet whites — same family as the galaxy palette
  c.color.setHSL(THREE.MathUtils.randFloat(0.58, 0.72), 0.5, 0.82);
}

/**
 * Occasional shooting stars — additive line trails that streak across the
 * sky and catch the bloom pass. All motion is cheap CPU writes into small
 * (TRAIL-point) buffers; one draw call per comet.
 */
const ShootingStars: React.FC<{ count?: number }> = ({ count = 4 }) => {
  const comets = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const c: CometState = {
          start: new THREE.Vector3(),
          travel: new THREE.Vector3(),
          duration: 1,
          delay: 0,
          t: 0,
          color: new THREE.Color(),
        };
        respawn(c, true);
        return c;
      }),
    [count]
  );

  const lines = useMemo(
    () =>
      comets.map(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3));
        geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3));
        const mat = new THREE.LineBasicMaterial({
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        });
        const line = new THREE.Line(geo, mat);
        line.frustumCulled = false; // trails move every frame; skip stale-bounds culling
        return line;
      }),
    [comets]
  );

  useEffect(
    () => () => {
      lines.forEach((l) => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      });
    },
    [lines]
  );

  useFrame((_, delta) => {
    comets.forEach((c, i) => {
      c.t += delta;
      const p = (c.t - c.delay) / c.duration;
      if (p >= 1) respawn(c);

      const active = p > 0 && p < 1;
      // Ease brightness in/out over the flight so comets never pop
      const glow = active ? Math.sin(Math.PI * p) : 0;

      const pos = lines[i].geometry.attributes.position as THREE.BufferAttribute;
      const col = lines[i].geometry.attributes.color as THREE.BufferAttribute;
      for (let j = 0; j < TRAIL; j++) {
        const frac = j / (TRAIL - 1);
        const pj = Math.max(0, (active ? p : 0) - frac * TRAIL_SPAN);
        pos.setXYZ(
          j,
          c.start.x + c.travel.x * pj,
          c.start.y + c.travel.y * pj,
          c.start.z + c.travel.z * pj
        );
        const fade = glow * (1 - frac) * (1 - frac); // quadratic falloff down the tail
        col.setXYZ(j, c.color.r * fade, c.color.g * fade, c.color.b * fade);
      }
      pos.needsUpdate = true;
      col.needsUpdate = true;
    });
  });

  return (
    <group>
      {lines.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
    </group>
  );
};

export default ShootingStars;
