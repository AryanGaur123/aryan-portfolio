import { useEffect, useRef, useState, RefObject } from 'react';

/**
 * IntersectionObserver mount gate for the per-card logo canvases.
 * Sticky: mounts when the element first approaches the viewport and then
 * STAYS mounted — repeatedly disposing/recreating the WebGL context caused
 * a visible pop-in every time a card scrolled back into view. Two small
 * persistent contexts are far cheaper than the churn.
 */
export function useInViewLazyMount<T extends Element>(
  rootMargin = '600px'
): { ref: RefObject<T | null>; inView: boolean } {
  const ref = useRef<T>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || mounted) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          obs.disconnect();
        }
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin, mounted]);

  return { ref, inView: mounted };
}
