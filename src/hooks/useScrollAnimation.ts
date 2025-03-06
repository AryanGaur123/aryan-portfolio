import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAnimation, AnimationControls } from 'framer-motion';

interface UseScrollAnimationReturn {
  ref: React.RefObject<HTMLElement>;
  controls: AnimationControls;
  inView: boolean;
}

export const useScrollAnimation = (threshold = 0.1): UseScrollAnimationReturn => {
  const controls = useAnimation();
  const [inViewRef, inView] = useInView({
    threshold,
    triggerOnce: true,
  });
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return {
    ref: inViewRef as unknown as React.RefObject<HTMLElement>,
    controls,
    inView,
  };
};
