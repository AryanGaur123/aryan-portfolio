import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Hero.css';

/* ── Canvas 2D particle + geometric field ────────────────────────────────── */
function initCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let W = canvas.offsetWidth;
  let H = canvas.offsetHeight;
  let mouseX = W * 0.75;
  let mouseY = H * 0.5;
  let animId: number;

  const resize = () => {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  };
  resize();
  window.addEventListener('resize', resize);

  const onMove = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    } else {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
  };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove as EventListener, { passive: true });

  /* ── Floating particles ─────────────────────────────────────────────── */
  const PARTICLE_COUNT = 90;
  type Particle = {
    x: number; y: number;
    vx: number; vy: number;
    r: number; alpha: number; speed: number;
  };
  const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
    x:     Math.random() * W,
    y:     Math.random() * H,
    vx:    (Math.random() - 0.5) * 0.25,
    vy:    (Math.random() - 0.5) * 0.25,
    r:     0.5 + Math.random() * 1.8,
    alpha: 0.15 + Math.random() * 0.5,
    speed: 0.3 + Math.random() * 0.7,
  }));

  /* ── Geometric shapes ───────────────────────────────────────────────── */
  type Shape = {
    x: number; y: number;
    size: number;
    sides: number;
    rot: number; rotSpeed: number;
    floatPhase: number; floatAmp: number; floatSpeed: number;
    alpha: number;
    strokeW: number;
  };

  const shapes: Shape[] = [
    { x: W*0.72, y: H*0.42, size: 80, sides: 6, rot: 0, rotSpeed: 0.003, floatPhase: 0,    floatAmp: 12, floatSpeed: 0.6, alpha: 0.18, strokeW: 1   },
    { x: W*0.82, y: H*0.60, size: 44, sides: 3, rot: 0, rotSpeed: 0.005, floatPhase: 1.2,  floatAmp: 8,  floatSpeed: 0.8, alpha: 0.22, strokeW: 0.8 },
    { x: W*0.60, y: H*0.30, size: 32, sides: 8, rot: 0, rotSpeed: 0.004, floatPhase: 2.4,  floatAmp: 10, floatSpeed: 0.5, alpha: 0.16, strokeW: 0.7 },
    { x: W*0.88, y: H*0.28, size: 24, sides: 4, rot: Math.PI/4, rotSpeed: 0.007, floatPhase: 0.6, floatAmp: 6, floatSpeed: 1.0, alpha: 0.20, strokeW: 0.6 },
    { x: W*0.65, y: H*0.70, size: 56, sides: 5, rot: 0, rotSpeed: 0.002, floatPhase: 1.8,  floatAmp: 14, floatSpeed: 0.4, alpha: 0.14, strokeW: 0.9 },
    { x: W*0.78, y: H*0.80, size: 28, sides: 3, rot: Math.PI, rotSpeed: -0.006, floatPhase: 3.0, floatAmp: 7, floatSpeed: 0.9, alpha: 0.18, strokeW: 0.6 },
    { x: W*0.55, y: H*0.55, size: 18, sides: 6, rot: 0, rotSpeed: 0.008, floatPhase: 2.1,  floatAmp: 5,  floatSpeed: 1.1, alpha: 0.12, strokeW: 0.5 },
    { x: W*0.92, y: H*0.50, size: 38, sides: 8, rot: 0, rotSpeed: -0.003, floatPhase: 0.9, floatAmp: 9,  floatSpeed: 0.7, alpha: 0.15, strokeW: 0.7 },
  ];

  /* ── Orbiting rings ─────────────────────────────────────────────────── */
  type Ring = { cx: number; cy: number; rx: number; ry: number; rot: number; rotSpeed: number; alpha: number; };
  const rings: Ring[] = [
    { cx: W*0.72, cy: H*0.42, rx: 120, ry: 48,  rot: 0.4,  rotSpeed: 0.004,  alpha: 0.10 },
    { cx: W*0.72, cy: H*0.42, rx: 160, ry: 32,  rot: -0.6, rotSpeed: -0.003, alpha: 0.07 },
    { cx: W*0.82, cy: H*0.60, rx: 70,  ry: 28,  rot: 1.0,  rotSpeed: 0.006,  alpha: 0.12 },
  ];

  /* ── Connection lines between nearby particles ──────────────────────── */
  const MAX_DIST = 90;

  let t = 0;

  const drawPolygon = (
    cx: number, cy: number, r: number,
    sides: number, rot: number,
    alpha: number, sw: number,
  ) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = (Math.PI * 2 * i) / sides - Math.PI / 2;
      i === 0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r)
              : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
    }
    ctx.closePath();
    const g = ctx.createLinearGradient(-r, -r, r, r);
    g.addColorStop(0,   `rgba(160,160,180,${alpha * 0.6})`);
    g.addColorStop(0.5, `rgba(220,220,240,${alpha})`);
    g.addColorStop(1,   `rgba(100,100,120,${alpha * 0.5})`);
    ctx.strokeStyle = g;
    ctx.lineWidth = sw;
    ctx.stroke();
    ctx.restore();
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    t += 0.01;

    /* Mouse-influenced radial glow */
    const gx = mouseX;
    const gy = mouseY;
    const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, 300);
    glow.addColorStop(0,   'rgba(160,160,200,0.04)');
    glow.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    /* Rings */
    rings.forEach(rn => {
      rn.rot += rn.rotSpeed;
      ctx.save();
      ctx.translate(rn.cx, rn.cy);
      ctx.rotate(rn.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, rn.rx, rn.ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(180,180,210,${rn.alpha})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.restore();
    });

    /* Shapes */
    shapes.forEach(sh => {
      sh.rot += sh.rotSpeed;
      const fy = sh.y + Math.sin(t * sh.floatSpeed + sh.floatPhase) * sh.floatAmp;
      const fx = sh.x + Math.cos(t * sh.floatSpeed * 0.7 + sh.floatPhase) * (sh.floatAmp * 0.3);
      /* Parallax toward mouse */
      const dx = (mouseX - W * 0.5) * 0.012;
      const dy = (mouseY - H * 0.5) * 0.008;
      drawPolygon(fx + dx, fy + dy, sh.size, sh.sides, sh.rot, sh.alpha, sh.strokeW);
    });

    /* Particle connections */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx2 = particles[i].x - particles[j].x;
        const dy2 = particles[i].y - particles[j].y;
        const d   = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (d < MAX_DIST) {
          const a = (1 - d / MAX_DIST) * 0.06;
          ctx.strokeStyle = `rgba(160,160,180,${a})`;
          ctx.lineWidth   = 0.4;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    /* Particles */
    particles.forEach(p => {
      p.x += p.vx * p.speed;
      p.y += p.vy * p.speed;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,200,220,${p.alpha})`;
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  };
  draw();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('touchmove', onMove as EventListener);
  };
}

/* ── Hero Component ─────────────────────────────────────────────────────── */
const Hero: React.FC = () => {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const tagRef      = useRef<HTMLDivElement>(null);
  const line1Ref    = useRef<HTMLDivElement>(null);
  const line2Ref    = useRef<HTMLDivElement>(null);
  const metaRef     = useRef<HTMLDivElement>(null);
  const bioRef      = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);

  /* Canvas 2D — works on every browser */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return initCanvas(canvas);
  }, []);

  /* GSAP entrance */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(tagRef.current,   { y: 16, opacity: 0, duration: 0.7 }, 0.2)
      .from(line1Ref.current, { yPercent: 105, opacity: 0, duration: 1.0 }, 0.35)
      .from(line2Ref.current, { yPercent: 105, opacity: 0, duration: 1.0 }, 0.5)
      .from(metaRef.current,  { y: 16, opacity: 0, duration: 0.7 }, 0.75)
      .from(bioRef.current,   { y: 16, opacity: 0, duration: 0.7 }, 0.88)
      .from(ctaRef.current,   { y: 16, opacity: 0, duration: 0.7 }, 1.0)
      .from(scrollRef.current,{ opacity: 0, duration: 0.6 }, 1.2);
  }, []);

  return (
    <section className="hero" id="hero">
      {/* Background canvas — Canvas 2D, no WebGL */}
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />

      {/* Vignette */}
      <div className="hero__vignette" aria-hidden="true" />

      {/* Watermark */}
      <div className="hero__watermark" aria-hidden="true">AG</div>

      <div className="hero__content container">
        <div className="hero__text">

          {/* Tag */}
          <div ref={tagRef} className="hero__tag">
            <span className="hero__tag-dot" />
            Available · San Jose, CA
          </div>

          {/* Headline */}
          <div className="hero__headline">
            <div className="hero__clip">
              <div ref={line1Ref} className="hero__line">Aryan Gaur</div>
            </div>
            <div className="hero__clip">
              <div ref={line2Ref} className="hero__line hero__line--accent">AI Engineer.</div>
            </div>
          </div>

          {/* Meta badges */}
          <div ref={metaRef} className="hero__meta">
            <span className="hero__badge">SanDisk · GenAI Intern</span>
            <span className="hero__badge">SJSU · CompE · 2027</span>
          </div>

          {/* Bio */}
          <p ref={bioRef} className="hero__bio">
            Computer Engineering student — Verilog, FPGAs, digital design,
            and enough software to bridge both worlds. Currently on the GenAI
            team at SanDisk.
          </p>

          {/* CTA */}
          <div ref={ctaRef} className="hero__cta">
            <a href="#experience" className="hero__btn hero__btn--primary" data-hover>
              View Experience
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#contact" className="hero__btn hero__btn--ghost" data-hover>
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
