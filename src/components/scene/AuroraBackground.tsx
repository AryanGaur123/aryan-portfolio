import React, { useEffect, useRef } from 'react';
import { scrollState } from '../../lib/lenis';
import { GALAXY_READY_EVENT } from '../layout/Preloader';
import './GalaxyBackground.css';

/**
 * LIGHT PAINTING — the site's single background: ribbons of iridescent
 * light flowing through darkness, rendered by one dependency-free WebGL
 * fragment shader (no three.js — the whole scene is ~one fullscreen
 * triangle). The ribbons bend toward the cursor, drift with scroll, and
 * flare with scroll velocity.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;   // shader space: aspect-corrected, centre origin
uniform float uScroll;  // 0..1 page progress
uniform float uVel;     // 0..1 scroll energy
uniform float uIntro;   // 0..1 ignition sweep on load
uniform vec3  uPulse;   // xy: click/tap position, z: seconds since (< 0 = idle)

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * vnoise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return s;
}

/* Electric-steel ramp — deep indigo → electric blue → cyan → ice white.
   Fixed stops (not a cosine palette) so the light can never drift warm
   or pastel: this palette is cold metal only. */
vec3 pal(float t) {
  vec3 c1 = vec3(0.07, 0.13, 0.42);
  vec3 c2 = vec3(0.10, 0.42, 0.96);
  vec3 c3 = vec3(0.16, 0.86, 0.88);
  vec3 c4 = vec3(0.82, 0.94, 1.00);
  float x = fract(t) * 4.0;
  vec3 c = mix(c1, c2, smoothstep(0.0, 1.0, x));
  c = mix(c, c3, smoothstep(1.0, 2.0, x));
  c = mix(c, c4, smoothstep(2.0, 3.0, x));
  return mix(c, c1, smoothstep(3.0, 4.0, x));
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  // Diagonal flow — light never travels level
  float ca = cos(-0.22), sa = sin(-0.22);
  p = mat2(ca, -sa, sa, ca) * p;
  vec2 m = mat2(ca, -sa, sa, ca) * uMouse;

  float t = uTime * 0.1;
  vec3 col = vec3(0.0);

  // Ignition — on load a front sweeps across and lights the ribbons
  float front = uIntro * 2.4 - 1.2;
  float ign = smoothstep(0.0, 0.3, front - p.x);
  // Bright spark riding the ignition front, gone once fully lit
  float spark = exp(-pow(p.x - front, 2.0) * 70.0) * (1.0 - uIntro);

  // Deep mist — barely-there colour so the black has depth
  float mist = pow(fbm(p * 2.2 + vec2(t * 0.4, -t * 0.25)), 2.5);
  col += pal(0.62 + uScroll * 0.4) * mist * 0.055 * uIntro;
  col += pal(0.15 + uScroll * 0.4) * pow(fbm(p * 1.6 - t * 0.3 + 5.0), 3.0) * 0.065 * uIntro;

  // Cursor / touch field
  float md = length(p - m);
  float bend = exp(-md * md * 6.0);

  // Click/tap shockwave — an expanding ring that displaces the ribbons
  float ring = 0.0;
  vec2 pp = mat2(ca, -sa, sa, ca) * uPulse.xy;
  if (uPulse.z >= 0.0) {
    float pd = length(p - pp);
    ring = exp(-pow(pd - uPulse.z * 1.3, 2.0) * 55.0) * exp(-uPulse.z * 1.9);
  }

  // Six ribbons of light
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float seed = fi * 1.618 + 0.7;

    // Vertical placement breathes over time and migrates with scroll
    float y0 = (fi / 5.0 - 0.5) * (0.92 + 0.22 * sin(t * 0.5 + seed))
             + (uScroll - 0.5) * 0.38;

    // Organic path: noise wander + travelling sine
    float wob  = (fbm(vec2(p.x * 1.3 + t * (0.5 + 0.08 * fi) + seed * 7.0, seed)) - 0.5) * 0.9;
    float wob2 = sin(p.x * (1.8 + 0.35 * fi) - t * (0.7 + 0.12 * fi) + seed * 3.0) * 0.16;
    float y = y0 + wob * 0.5 + wob2;

    // The light leans toward the cursor / finger
    y += bend * (m.y - y) * 0.4;
    // The shockwave kicks the ribbons as it passes
    y += ring * 0.06 * sin(seed * 9.0 + uPulse.z * 6.0);

    float d = abs(p.y - y);
    // Ribbon thickness pulses along its length
    float th = 0.004 + 0.045 * pow(fbm(vec2(p.x * 2.0 - t * 0.6 + seed, seed * 2.0)), 2.0);
    float g = min(th / (d + 0.002), 24.0);
    g = pow(g, 1.6);

    float hue = 0.05 + fi * 0.13 + uScroll * 0.45 + p.x * 0.05;
    col += pal(hue) * g * (0.03 + uVel * 0.028 + ring * 0.02) * ign;
  }

  // Ignition spark + shockwave glow
  col += pal(0.55) * spark * 0.35;
  col += pal(0.5 + uScroll * 0.4) * ring * 0.16;

  // Faint aura around the cursor itself
  col += pal(0.8 + uScroll * 0.4) * exp(-md * 9.0) * 0.05 * uIntro;

  // Vignette
  col *= 1.0 - 0.4 * dot(p, p);

  // Soft filmic rolloff + gamma
  col = col / (1.0 + col);
  col = pow(col, vec3(0.4545));

  // Dither — kills gradient banding on the deep blacks
  col += (hash12(gl_FragCoord.xy + fract(uTime)) - 0.5) * (2.0 / 255.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    // eslint-disable-next-line no-console
    console.error('aurora shader:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export interface AuroraBackgroundProps {
  /** 'full' renders at up to 1.75 dpr; anything else at 1 */
  quality?: 'full' | 'reduced';
  reducedMotion?: boolean;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  quality = 'full',
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, depth: false, stencil: false });
    if (!gl) {
      // No WebGL → the page still works on plain black; signal the preloader.
      window.dispatchEvent(new Event(GALAXY_READY_EVENT));
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      window.dispatchEvent(new Event(GALAXY_READY_EVENT));
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uScroll = gl.getUniformLocation(prog, 'uScroll');
    const uVel = gl.getUniformLocation(prog, 'uVel');
    const uIntro = gl.getUniformLocation(prog, 'uIntro');
    const uPulse = gl.getUniformLocation(prog, 'uPulse');

    const dpr = quality === 'full' ? Math.min(window.devicePixelRatio, 1.75) : 1;
    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Pointer in shader space (centre origin, aspect-corrected, y up)
    const toShader = (cx: number, cy: number): [number, number] => [
      (cx - window.innerWidth * 0.5) / window.innerHeight,
      -(cy - window.innerHeight * 0.5) / window.innerHeight,
    ];
    let tx = 0.35, ty = 0.1; // start off-centre so the light has somewhere to lean
    let mx = tx, my = ty;
    const onMove = (e: MouseEvent) => { [tx, ty] = toShader(e.clientX, e.clientY); };
    window.addEventListener('mousemove', onMove);
    // Mobile: the ribbons lean toward the finger while it's on the glass
    const onTouch = (e: TouchEvent) => { [tx, ty] = toShader(e.touches[0].clientX, e.touches[0].clientY); };
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    // Click / tap → shockwave through the ribbons
    let pulseX = 0, pulseY = 0, pulseAt = -1;
    const onDown = (e: PointerEvent) => {
      [pulseX, pulseY] = toShader(e.clientX, e.clientY);
      pulseAt = performance.now();
    };
    window.addEventListener('pointerdown', onDown, { passive: true });

    let lost = false;
    const onLost = (e: Event) => { e.preventDefault(); lost = true; };
    canvas.addEventListener('webglcontextlost', onLost);

    let raf = 0;
    let time = 0;
    let vel = 0;
    let scroll = 0;
    let last = performance.now();
    let announced = false;
    // Ignition: sweep starts shortly after the first frame (under the
    // preloader's lift) and takes ~2.2s. Reduced motion skips straight on.
    const introStart = performance.now() + 500;
    const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (lost) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Reduced motion: the painting still exists, it just barely breathes
      time += dt * (reducedMotion ? 0.12 : 1);

      // Springy cursor + velocity decay
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      const targetVel = reducedMotion ? 0 : Math.min(Math.abs(scrollState.velocity) * 0.02, 1);
      vel += (targetVel - vel) * 0.08;
      scroll += (scrollState.progress - scroll) * 0.075;

      const intro = reducedMotion
        ? 1
        : easeInOut(Math.min(Math.max((now - introStart) / 2200, 0), 1));
      const pulseT = pulseAt < 0 ? -1 : (now - pulseAt) / 1000;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uScroll, scroll);
      gl.uniform1f(uVel, vel);
      gl.uniform1f(uIntro, intro);
      gl.uniform3f(uPulse, pulseX, pulseY, pulseT > 3 ? -1 : pulseT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!announced) {
        announced = true;
        window.dispatchEvent(new Event(GALAXY_READY_EVENT));
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [quality, reducedMotion]);

  return (
    <div className="galaxy-bg" aria-hidden="true">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};

export default AuroraBackground;
