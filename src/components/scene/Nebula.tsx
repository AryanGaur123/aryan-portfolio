import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import nebulaVert from '../../assets/shaders/nebula.vert.glsl?raw';
import nebulaFrag from '../../assets/shaders/nebula.frag.glsl?raw';

interface CloudProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  colorA: string;
  colorB: string;
  opacity: number;
  timeOffset: number;
}

const Cloud: React.FC<CloudProps> = ({ position, rotation, scale, colorA, colorB, opacity, timeOffset }) => {
  const material = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uOpacity: { value: opacity },
    }),
    // Colors/opacity are fixed per cloud instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime + timeOffset;
  });

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={nebulaVert}
        fragmentShader={nebulaFrag}
        uniforms={uniforms}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

/** 3 additive noise-cloud planes — the nebula haze behind/inside the star disc. */
const Nebula: React.FC = () => (
  <>
    <Cloud position={[0, -0.4, -2.5]} rotation={[0.35, 0, 0.12]} scale={14} colorA="#2a1a5e" colorB="#4a2a8a" opacity={0.32} timeOffset={0} />
    <Cloud position={[2.5, 0.6, -4]}  rotation={[0.2, 0.4, 0]}   scale={10} colorA="#12275e" colorB="#2a4aa0" opacity={0.26} timeOffset={40} />
    <Cloud position={[-3, 0.2, -5]}   rotation={[0.5, -0.3, 0.3]} scale={12} colorA="#3a1a4e" colorB="#1a2a6e" opacity={0.22} timeOffset={80} />
  </>
);

export default Nebula;
