import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { scrollState } from '../../lib/lenis';

/**
 * Scroll-velocity chromatic aberration — RGB fringing blooms at the screen
 * edges while the page is in motion, the "hyperspace" half of the warp
 * effect (CameraRig's FOV kick is the other half). Mutates the effect's
 * offset vector in place each frame; no React re-renders.
 */
const WarpAberration: React.FC = () => {
  const offset = useMemo(() => new THREE.Vector2(0, 0), []);
  const amount = useRef(0);

  useFrame(() => {
    const target = Math.min(Math.abs(scrollState.velocity) * 0.00007, 0.0032);
    amount.current += (target - amount.current) * 0.075;
    offset.set(amount.current, amount.current * 0.55);
  });

  return (
    <ChromaticAberration
      offset={offset}
      radialModulation
      modulationOffset={0.35} /* keep the centre clean, fringe the edges */
    />
  );
};

/**
 * The ONLY postprocessing composer in the entire app.
 * Battle-tested library pipeline — never hand-roll EffectComposer here
 * (the previous raw-three implementation black-screened Chrome doing that).
 */
const PostFX: React.FC<{ enabled?: boolean; warp?: boolean }> = ({
  enabled = true,
  warp = true,
}) => {
  if (!enabled) return null;
  return (
    <EffectComposer>
      <Bloom
        intensity={0.85}
        luminanceThreshold={0.08}
        luminanceSmoothing={0.22}
        mipmapBlur
        radius={0.72}
      />
      {warp ? <WarpAberration /> : <></>}
    </EffectComposer>
  );
};

export default PostFX;
