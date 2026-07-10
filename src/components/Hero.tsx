import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useTypewriter } from '../hooks/useTypewriter';
import { useMagnetic } from '../hooks/useMagnetic';
import './Hero.css';

const TITLES = [
  'AI Engineer.',
  'FPGA Designer.',
  'Full-Stack Builder.',
  'CompE @ SJSU.',
];

const Hero: React.FC = () => {
  const rootRef     = useRef<HTMLElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const typed       = useTypewriter(TITLES);
  const btnPrimary  = useMagnetic<HTMLAnchorElement>(0.3);
  const btnGhost    = useMagnetic<HTMLAnchorElement>(0.3);

  /* GSAP entrance — gsap.context + revert so StrictMode's double-mount
     restores inline styles (a bare tl.kill() left the headline stuck at
     opacity 0, which is why the name vanished on load). */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero__tag',      { y: 16, opacity: 0, duration: 0.7 }, 0.2)
        .from('.hero__line--name', { yPercent: 105, duration: 1.0 }, 0.35)
        .from('.hero__line--typed', { yPercent: 105, duration: 1.0 }, 0.5)
        .from('.hero__meta',     { y: 16, opacity: 0, duration: 0.7 }, 0.75)
        .from('.hero__bio',      { y: 16, opacity: 0, duration: 0.7 }, 0.88)
        .from('.hero__cta',      { y: 16, opacity: 0, duration: 0.7 }, 1.0)
        .from(scrollRef.current, { opacity: 0, duration: 0.6 }, 1.2);

      /* Scroll-out parallax — content, watermark and scroll cue leave at
         different rates so the fold has depth. Scrub-only tweens: at
         progress 0 they're identity, so they never fight the entrance. */
      gsap.to('.hero__content', {
        yPercent: -16, opacity: 0, ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current, start: 'top top', end: 'bottom 30%', scrub: true,
        },
      });
      gsap.to('.hero__watermark', {
        yPercent: 24, ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true,
        },
      });
      gsap.to(scrollRef.current, {
        opacity: 0, ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current, start: 'top top', end: '25% top', scrub: true,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* Headline leans toward the cursor in 3D — the hero text floats in the
     same space as the galaxy instead of sitting flat on it. quickTo keeps
     it on GSAP's ticker; springy but never re-renders React. */
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = rootRef.current?.querySelector('.hero__text');
    if (!target) return;

    gsap.set(target, { transformPerspective: 900 });
    const toRX = gsap.quickTo(target, 'rotationX', { duration: 0.9, ease: 'power3' });
    const toRY = gsap.quickTo(target, 'rotationY', { duration: 0.9, ease: 'power3' });

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      toRY(nx * 3);
      toRX(-ny * 2.2);
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      gsap.set(target, { clearProps: 'transform' });
    };
  }, []);

  return (
    <section className="hero" id="hero" ref={rootRef}>
      {/* Vignette */}
      <div className="hero__vignette" aria-hidden="true" />

      {/* Watermark */}
      <div className="hero__watermark" aria-hidden="true">AG</div>

      <div className="hero__content container">
        <div className="hero__text">

          {/* Tag */}
          <div className="hero__tag">
            <span className="hero__tag-dot" />
            Available · San Jose, CA
          </div>

          {/* Headline */}
          <h1 className="hero__headline">
            <span className="hero__clip">
              <span className="hero__line hero__line--name">Aryan Gaur</span>
            </span>
            <span className="hero__clip">
              <span className="hero__line hero__line--accent hero__line--typed">
                {typed || ' '}
                <span className="hero__caret" aria-hidden="true" />
              </span>
            </span>
          </h1>

          {/* Meta badges */}
          <div className="hero__meta">
            <span className="hero__badge">SanDisk · GenAI Intern</span>
            <span className="hero__badge">SJSU · CompE · 2027</span>
          </div>

          {/* Bio */}
          <p className="hero__bio">
            Computer Engineering student — Verilog, FPGAs, and digital design,
            with deep professional experience in software and AI architecture
            bridging both worlds. Currently on the GenAI team at SanDisk.
          </p>

          {/* CTA */}
          <div className="hero__cta">
            <a ref={btnPrimary} href="#experience" className="hero__btn hero__btn--primary" data-hover>
              View Experience
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a ref={btnGhost} href="#contact" className="hero__btn hero__btn--ghost" data-hover>
              Get in touch
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
};

export default Hero;
