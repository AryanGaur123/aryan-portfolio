import React, { useEffect, useMemo, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 1 → 0
  decay: number;
  size: number;
  color: string;
}

const COLORS = ['#e8e8f0', '#7de8e0', '#4d8dff', '#dbeafe', '#ffffff'];
const MAX_PARTICLES = 200;

/**
 * The cursor is a comet — a fixed 2D canvas draws additive star particles
 * shed by pointer movement, spawn rate proportional to cursor speed.
 * Desktop-pointer only; skipped entirely under prefers-reduced-motion.
 */
const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const enabled = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    let lastX = -1;
    let lastY = -1;

    const onMove = (e: MouseEvent) => {
      if (lastX < 0) {
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.hypot(dx, dy);
      lastX = e.clientX;
      lastY = e.clientY;

      // Faster cursor → more stardust, capped so flicks don't flood the pool
      const n = Math.min(Math.floor(speed * 0.28), 4);
      for (let i = 0; i < n && particles.length < MAX_PARTICLES; i++) {
        const t = Math.random();
        particles.push({
          // Spawn back along the travel direction so the trail hugs the path
          x: e.clientX - dx * t + (Math.random() - 0.5) * 3,
          y: e.clientY - dy * t + (Math.random() - 0.5) * 3,
          vx: -dx * 0.06 + (Math.random() - 0.5) * 0.7,
          vy: -dy * 0.06 + (Math.random() - 0.5) * 0.7,
          life: 1,
          decay: 0.02 + Math.random() * 0.025,
          size: 0.8 + Math.random() * 1.8,
          color: COLORS[(Math.random() * COLORS.length) | 0],
        });
      }
    };
    window.addEventListener('mousemove', onMove);

    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96; // coast to a stop — space has no gravity, just drag
        p.vy *= 0.96;

        const r = p.size * p.life;
        // Soft halo + bright core, no shadowBlur (it wrecks frame time)
        ctx.globalAlpha = p.life * 0.22;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = p.life * 0.85;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />;
};

export default CursorTrail;
