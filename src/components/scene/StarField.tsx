import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import starVert from '../../assets/shaders/starfield.vert.glsl?raw';
import starFrag from '../../assets/shaders/starfield.frag.glsl?raw';

export interface StarFieldProps {
  count?: number;
  /** false → freeze the differential rotation (prefers-reduced-motion) */
  animate?: boolean;
}

const PARAMS = {
  radius: 5.2,
  branches: 4,
  spin: 1.15,
  randomness: 0.42,
  randomnessPower: 2.9,
  insideColor: '#b8a4ff',
  outsideColor: '#3a5dc9',
  coreColor: '#fff4e0',
};

/**
 * Spiral-galaxy point cloud — one Points object, one draw call.
 * Positions/colors/scales are baked once; all motion happens in the
 * vertex shader (differential rotation), never per-star CPU mutation.
 */
const StarField: React.FC<StarFieldProps> = ({ count = 8000, animate = true }) => {
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    const inside = new THREE.Color(PARAMS.insideColor);
    const outside = new THREE.Color(PARAMS.outsideColor);
    const core = new THREE.Color(PARAMS.coreColor);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 1.5) * PARAMS.radius;
      const branchAngle = ((i % PARAMS.branches) / PARAMS.branches) * Math.PI * 2;
      const spinAngle = r * PARAMS.spin;

      const randX = Math.pow(Math.random(), PARAMS.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * PARAMS.randomness * r;
      const randY = Math.pow(Math.random(), PARAMS.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * PARAMS.randomness * r * 0.55;
      const randZ = Math.pow(Math.random(), PARAMS.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * PARAMS.randomness * r;

      positions[i3]     = Math.cos(branchAngle + spinAngle) * r + randX;
      positions[i3 + 1] = randY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randZ;

      const t = r / PARAMS.radius;
      const c = t < 0.12 ? core.clone().lerp(inside, t / 0.12) : inside.clone().lerp(outside, (t - 0.12) / 0.88);
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;

      scales[i] = 0.4 + Math.random() * 1.6;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    // Precompute the bounding sphere — auto-computation on large clouds is wasted work.
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), PARAMS.radius * 1.5);
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 26 * Math.min(window.devicePixelRatio, 2) },
    }),
    []
  );

  useFrame((state) => {
    if (material.current && animate) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points geometry={geometry} rotation={[0.35, 0, 0.12]}>
      <shaderMaterial
        ref={material}
        vertexShader={starVert}
        fragmentShader={starFrag}
        uniforms={uniforms}
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        transparent
      />
    </points>
  );
};

export default StarField;
