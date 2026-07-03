import { useEffect, useRef, useState, RefObject } from 'react';

/**
 * IntersectionObserver mount gate for the per-card logo canvases.
 * Fully mounts/unmounts (WebGL context dispose, not CSS hide) so at most
 * the galaxy + the visible logos ever hold contexts.
 */
export function useInViewLazyMount<T extends Element>(
  rootMargin = '200px'
): { ref: RefObject<T | null>; inView: boolean } {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
