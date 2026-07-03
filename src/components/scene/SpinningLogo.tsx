import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import * as THREE from 'three';
import { useSvgExtrude } from '../../hooks/useSvgExtrude';
import { useInViewLazyMount } from '../../hooks/useInViewLazyMount';
import { LogoConfig, CARDS } from '../cards/cardData';

// Warm the SVGLoader cache at module load so the geometry is ready the
// moment a logo canvas mounts — no fetch/parse pop-in on first scroll.
CARDS.forEach(c => c.logo && useLoader.preload(SVGLoader, c.logo.svg));

interface LogoMeshProps {
  config: LogoConfig;
  hovered: boolean;
}

const BASE_SPIN = 0.55; // rad/s
const HOVER_MULT = 3.4;

const LogoMesh: React.FC<LogoMeshProps> = ({ config, hovered }) => {
  const geometry = useSvgExtrude(config.svg, 0.09);
  const group = useRef<THREE.Group>(null);
  const speed = useRef(BASE_SPIN);

  useFrame((state, delta) => {
    const target = hovered ? BASE_SPIN * HOVER_MULT : BASE_SPIN;
    // Ease toward the target speed — hover ramps up, never snaps.
    speed.current += (target - speed.current) * (1 - Math.exp(-4 * delta));
    if (group.current) {
      group.current.rotation.y += speed.current * delta;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.07;
    }
  });

  return (
    <group ref={group} scale={config.scale ?? 1.5}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={config.color}
          metalness={0.92}
          roughness={0.26}
          envMapIntensity={1.1}
        />
      </mesh>
    </group>
  );
};

interface SpinningLogoProps {
  config: LogoConfig;
  hovered: boolean;
}

/**
 * A small, isolated, lazily-mounted 3D logo canvas.
 * Transparent background so the galaxy bleeds through behind the card —
 * deliberately NO postprocessing here; brightness comes from the light rig.
 */
const SpinningLogo: React.FC<SpinningLogoProps> = ({ config, hovered }) => {
  const { ref, inView } = useInViewLazyMount<HTMLDivElement>('600px');

  return (
    <div
      ref={ref}
      className={`spinning-logo${inView ? ' spinning-logo--in' : ''}`}
      aria-hidden="true"
    >
      {inView && (
        <Canvas
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0, 2.1], fov: 40 }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[2.5, 2.5, 3]} intensity={1.6} color="#ffffff" />
          <pointLight position={[-2.2, -1, 2.4]} intensity={7} color={config.accentLight} />
          <pointLight position={[2.2, 1.2, -2]} intensity={4.5} color={config.fillLight} />
          <Suspense fallback={null}>
            <LogoMesh config={config} hovered={hovered} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default SpinningLogo;
