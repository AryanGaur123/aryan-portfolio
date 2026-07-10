import React, { useEffect, useRef } from 'react';

/**
 * Lerped dot cursor with contextual labels. Styles live in App.css (.cursor).
 * Elements opt into a label via data-cursor-label="VIEW" — the dot grows
 * into a small badge naming the action.
 */
const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    const label = labelRef.current;
    if (!el || !label) return;
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let rx = cx, ry = cy;
    let raf: number;

    const onMove = (e: MouseEvent) => { cx = e.clientX; cy = e.clientY; };
    window.addEventListener('mousemove', onMove);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      rx = lerp(rx, cx, 0.12);
      ry = lerp(ry, cy, 0.12);
      el.style.left = `${rx}px`;
      el.style.top  = `${ry}px`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    /* Delegated hover states — survives cards mounting/unmounting */
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>('[data-cursor-label]');
      if (labelled) {
        label.textContent = labelled.dataset.cursorLabel ?? '';
        el.classList.add('cursor--labeled');
        el.classList.remove('cursor--expanded');
        return;
      }
      el.classList.remove('cursor--labeled');
      if (t.closest('a, button, [data-hover]')) el.classList.add('cursor--expanded');
      else el.classList.remove('cursor--expanded');
    };
    document.addEventListener('mouseover', onOver);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <div ref={cursorRef} className="cursor" aria-hidden="true">
      <span ref={labelRef} className="cursor__label" />
    </div>
  );
};

export default CustomCursor;
