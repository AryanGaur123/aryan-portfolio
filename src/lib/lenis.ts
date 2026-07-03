import Lenis from '@studio-freight/lenis';
import { ScrollTrigger } from './gsap';

/**
 * Mutable scroll state read by the R3F render loop (CameraRig) each frame.
 * GSAP/Lenis write to it; useFrame reads it — keeps the animation systems
 * decoupled across the React/three boundary.
 */
export const scrollState = {
  /** 0 → 1 page scroll progress */
  progress: 0,
};

export function initLenis(): () => void {
  const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });

  lenis.on('scroll', () => {
    const limit = (lenis as unknown as { limit: number }).limit;
    scrollState.progress = limit > 0 ? lenis.scroll / limit : 0;
    // Keep GSAP's scroll triggers in lockstep with the smoothed scroll.
    ScrollTrigger.update();
  });

  let rafId: number;
  const raf = (time: number) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(rafId);
    lenis.destroy();
  };
}
