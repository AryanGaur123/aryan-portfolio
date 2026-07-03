import { useEffect, useRef, RefObject } from 'react';
import { gsap } from '../lib/gsap';

/**
 * Magnetic hover — the element leans toward the cursor while it's near,
 * springs back on leave. Attach the returned ref to any element.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return ref;
}
