import React, { useEffect, useRef } from 'react';
import './GalaxyBackground.css';

/* ── Canvas 2D particle field — proven cross-browser, zero WebGL risk ─────
   Moved from the previous Hero.tsx. Used when the device tier is 'fallback'
   (no WebGL / very low-end hardware) in place of the R3F galaxy. */
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

  const MAX_DIST = 90;

  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    const glow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 300);
    glow.addColorStop(0, 'rgba(160,160,200,0.04)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
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

const FallbackBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    window.dispatchEvent(new Event('ag:galaxy-ready'));
    return initCanvas(canvas);
  }, []);

  return (
    <div className="galaxy-bg" aria-hidden="true">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default FallbackBackground;
