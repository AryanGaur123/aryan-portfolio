import { useMotionValue, useSpring, MotionValue } from 'framer-motion';
import { PointerEvent } from 'react';

export interface Tilt {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  onPointerMove: (e: PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
}

/**
 * Pointer-relative 3D tilt with spring physics (Framer Motion's lane —
 * GSAP owns scroll choreography, never pointer physics).
 */
export function useTilt(maxDeg = 7): Tilt {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 220, damping: 20, mass: 0.6 });
  const rotateY = useSpring(ry, { stiffness: 220, damping: 20, mass: 0.6 });

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * maxDeg * 2);
    rx.set(-py * maxDeg * 2);
  };

  const onPointerLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return { rotateX, rotateY, onPointerMove, onPointerLeave };
}
