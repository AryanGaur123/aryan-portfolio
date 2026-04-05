import React, { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  /* Lenis smooth scroll */
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  /* Custom cursor */
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
    document.querySelectorAll('a, button, [data-hover]').forEach(node => {
      node.addEventListener('mouseenter', expand);
      node.addEventListener('mouseleave', collapse);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div ref={cursorRef} className="cursor" aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default App;
