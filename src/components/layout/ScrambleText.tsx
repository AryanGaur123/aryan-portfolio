import React, { useEffect, useRef, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01Δ✦';

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** total animation frames (~60/s) */
  frames?: number;
}

/**
 * Decode effect — glyph noise resolves into the real text left-to-right
 * the first time the element scrolls into view.
 */
const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className, frames = 40 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { rootMargin: '-10% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started || !ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let raf: number;
    const el = ref.current;

    const tick = () => {
      frame++;
      const progress = frame / frames;
      el.textContent = text
        .split('')
        .map((ch, i) => {
          if (ch === ' ') return ' ';
          // Each character locks in once the sweep passes its position.
          return progress * 1.25 > i / text.length
            ? ch
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');
      if (frame < frames) {
        raf = requestAnimationFrame(tick);
      } else {
        el.textContent = text;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, text, frames]);

  return <span ref={ref} className={className}>{text}</span>;
};

export default ScrambleText;
