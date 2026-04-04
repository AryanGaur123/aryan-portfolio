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

  /* ── Lenis smooth scroll ─────────────────────────────────────────────── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  /* ── Mix-blend-mode cursor ───────────────────────────────────────────── */
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let x = 0, y = 0, cx = 0, cy = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    const tick = () => {
      cx += (x - cx) * 0.15;
      cy += (y - cy) * 0.15;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    document.addEventListener('mousemove', onMove);

    const onEnter = () => cursor.classList.add('hovering');
    const onLeave = () => cursor.classList.remove('hovering');
    document.querySelectorAll('a, button, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div className="App">
      <div ref={cursorRef} className="cursor" aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
