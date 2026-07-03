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

    // Touch devices always get the reduced tier: phones report plenty of
    // cores (and Safari hides deviceMemory), but bloom + 8k stars at dpr 2
    // drops frames during touch momentum scroll — the "skipping" feel.
    if (window.matchMedia('(pointer: coarse)').matches) return 'reduced';

    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 8;
    if (cores <= 4 || memory <= 4) return 'reduced';

    return 'full';
  }, []);
}
