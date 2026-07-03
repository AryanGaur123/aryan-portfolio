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

let lenisInstance: Lenis | null = null;

/** Smooth-scroll to a selector from anywhere (command palette, buttons). */
export function scrollToTarget(selector: string): void {
  const el = document.querySelector(selector);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el as HTMLElement, { duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

export function initLenis(): () => void {
  const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  lenisInstance = lenis;

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

  /* Anchor links glide via Lenis instead of hard-jumping — a native #hash
     jump reads as a glitch when everything else scrolls smoothly. */
  const onAnchorClick = (e: MouseEvent) => {
    const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!anchor) return;
    const target = document.querySelector(anchor.getAttribute('href')!);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target as HTMLElement, { duration: 1.4 });
  };
  document.addEventListener('click', onAnchorClick);

  return () => {
    document.removeEventListener('click', onAnchorClick);
    cancelAnimationFrame(rafId);
    lenis.destroy();
    lenisInstance = null;
  };
}
