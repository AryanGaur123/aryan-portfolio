import React, { useEffect, useRef } from 'react';

/** Lerped dot cursor — extracted from App.tsx. Styles live in App.css (.cursor). */
const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
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

    const expand   = () => el.classList.add('cursor--expanded');
    const collapse = () => el.classList.remove('cursor--expanded');
    const nodes = document.querySelectorAll('a, button, [data-hover]');
    nodes.forEach(node => {
      node.addEventListener('mouseenter', expand);
      node.addEventListener('mouseleave', collapse);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      nodes.forEach(node => {
        node.removeEventListener('mouseenter', expand);
        node.removeEventListener('mouseleave', collapse);
      });
    };
  }, []);

  return <div ref={cursorRef} className="cursor" aria-hidden="true" />;
};

export default CustomCursor;
