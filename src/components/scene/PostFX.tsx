import React from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

/**
 * The ONLY postprocessing composer in the entire app.
 * Battle-tested library pipeline — never hand-roll EffectComposer here
 * (the previous raw-three implementation black-screened Chrome doing that).
 */
const PostFX: React.FC<{ enabled?: boolean }> = ({ enabled = true }) => {
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
    </EffectComposer>
  );
};

export default PostFX;
