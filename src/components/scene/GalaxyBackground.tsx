import React from 'react';
import { Canvas } from '@react-three/fiber';
import GalaxyScene from './GalaxyScene';
import { DeviceTier } from '../../hooks/useDeviceTier';
import './GalaxyBackground.css';

interface GalaxyBackgroundProps {
  tier?: Exclude<DeviceTier, 'fallback'>;
  reducedMotion?: boolean;
}

/**
 * The single persistent WebGL canvas for the whole site.
 * Mounted once in App.tsx — never remounts across sections.
 * Relies on R3F's default tone mapping / color management (do not override).
 */
const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({
  tier = 'full',
  reducedMotion = false,
}) => {
  const full = tier === 'full';

  return (
    <div className="galaxy-bg" aria-hidden="true">
      <Canvas
        dpr={full ? [1, 2] : 1}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 1.4, 4.6], fov: 55 }}
        onCreated={() => window.dispatchEvent(new Event('ag:galaxy-ready'))}
      >
        {/* Explicit deep-space base — never rely on DOM showing through the
            postprocessing pipeline's framebuffer */}
        <color attach="background" args={['#050510']} />
        <GalaxyScene
          starCount={full ? 8000 : 2000}
          bloom={full}
          nebula={full}
          animate={!reducedMotion}
        />
      </Canvas>
    </div>
  );
};

export default GalaxyBackground;
