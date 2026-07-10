import { RefObject, useEffect } from 'react';
import { gsap } from '../lib/gsap';

/**
 * Sections dock in like floating panels — reclined in 3D below the fold,
 * scrubbed upright as they enter. Rotation hinges on the bottom edge so it
 * reads as the panel raising toward you, not a card flip.
 *
 * `innerSelector` is scoped to the section ref (gsap.context), so multiple
 * sections can safely share class names.
 */
export function useSectionDrift(
  section: RefObject<HTMLElement | null>,
  innerSelector: string
): void {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerSelector,
        {
          rotateX: 9,
          y: 80,
          scale: 0.955,
          opacity: 0.3,
          transformPerspective: 1100,
          transformOrigin: '50% 100%',
        },
        {
          rotateX: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top 96%',
            end: 'top 42%',
            scrub: true,
          },
        }
      );
    }, section);
    return () => ctx.revert();
  }, [section, innerSelector]);
}
