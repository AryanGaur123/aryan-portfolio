import { useMemo } from 'react';

export type DeviceTier = 'full' | 'reduced' | 'fallback';

function probeWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    return gl !== null;
  } catch {
    return false;
  }
}

/**
 * One-time capability heuristic.
 * 'fallback' → no WebGL at all: swap the entire galaxy for FallbackBackground.
 * 'reduced'  → WebGL but weak hardware: fewer stars, no bloom/nebula, dpr 1.
 * 'full'     → everything on.
 */
export function useDeviceTier(): DeviceTier {
  return useMemo(() => {
    if (!probeWebGL()) return 'fallback';

    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 8;
    if (cores <= 4 || memory <= 4) return 'reduced';

    return 'full';
  }, []);
}
