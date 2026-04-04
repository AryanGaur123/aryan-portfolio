import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import './Hero.css';

const Hero: React.FC = () => {
  const canvasRef  = useRef<HTMLDivElement>(null);
  const heroRef    = useRef<HTMLElement>(null);
  const line1Ref   = useRef<HTMLDivElement>(null);
  const line2Ref   = useRef<HTMLDivElement>(null);
  const metaRef    = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);

  /* ── Three.js liquid-metal orb ─────────────────────────────────────────── */
  useEffect(() => {
    const mount = canvasRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.z = 6;

    /* Procedural env — silver studio light */
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(50, 32, 32),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        vertexShader: `varying vec3 vPos; void main(){ vPos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: `
          varying vec3 vPos;
          void main(){
            float y = normalize(vPos).y * .5 + .5;
            vec3 top    = vec3(.22,.22,.24);
            vec3 mid    = vec3(.13,.13,.14);
            vec3 bot    = vec3(.04,.04,.045);
            vec3 col    = mix(bot, mix(mid,top,y), y);
            float rim   = pow(1.-abs(normalize(vPos).y), 6.);
            col += rim * .35;
            gl_FragColor = vec4(col,1.);
          }
        `,
      })
    );
    envScene.add(sky);

    /* Bright key + cool fill in env */
    const addEnvLight = (pos: [number,number,number], intensity: number, col: number) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 8, 8),
        new THREE.MeshBasicMaterial({ color: col })
      );
      (m.material as THREE.MeshBasicMaterial).color.multiplyScalar(intensity);
      m.position.set(...pos);
      envScene.add(m);
    };
    addEnvLight([ 8,  12,  8],  5.0, 0xffffff);
    addEnvLight([-10, 4, -6],  2.2, 0xcccccc);
    addEnvLight([ 0, -8,  4],  1.2, 0x888888);
    addEnvLight([ 4,  0, -12], 1.8, 0xaaaaaa);

    const envTex = pmrem.fromScene(envScene).texture;
    scene.environment = envTex;

    /* Chrome sphere */
    const sphereGeo = new THREE.SphereGeometry(1.5, 256, 256);

    /* Vertex displacement shader for liquid-metal surface */
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.03,
      envMap: envTex,
      envMapIntensity: 3.0,
    });
    const sphere = new THREE.Mesh(sphereGeo, chromeMat);
    scene.add(sphere);

    /* Outer thin torus rings */
    const makeRing = (r: number, tube: number, col: number) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, tube, 6, 280),
        new THREE.MeshStandardMaterial({ color: col, metalness: 1.0, roughness: 0.05, envMap: envTex })
      );
      return m;
    };

    const ring1 = makeRing(2.0, 0.007, 0xdddddd);
    ring1.rotation.x = Math.PI / 2.5;
    scene.add(ring1);

    const ring2 = makeRing(2.3, 0.004, 0xaaaaaa);
    ring2.rotation.x = Math.PI / 6;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    const ring3 = makeRing(1.75, 0.003, 0xbbbbbb);
    ring3.rotation.z = Math.PI / 3;
    ring3.rotation.x = -Math.PI / 5;
    scene.add(ring3);

    /* Scene lights */
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(5, 8, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xbbbbbb, 2);
    rim.position.set(-6, -2, -5);
    scene.add(rim);
    const fill = new THREE.PointLight(0xffffff, 2.5, 20);
    fill.position.set(-2, 4, 4);
    scene.add(fill);

    /* Mouse parallax */
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);

    /* Intro animation — scale from 0 */
    sphere.scale.setScalar(0);
    ring1.scale.setScalar(0);
    ring2.scale.setScalar(0);
    ring3.scale.setScalar(0);
    gsap.to([sphere.scale, ring1.scale, ring2.scale, ring3.scale], {
      x: 1, y: 1, z: 1,
      duration: 1.8,
      delay: 0.6,
      ease: 'expo.out',
      stagger: 0.08,
    });

    let animId: number;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.004;

      sphere.rotation.y = t * 0.25;
      sphere.rotation.x = Math.sin(t * 0.3) * 0.1;

      target.x += (mouse.x * 0.2 - target.x) * 0.05;
      target.y += (mouse.y * 0.12 - target.y) * 0.05;
      sphere.rotation.y += target.x * 0.5;
      sphere.rotation.x += target.y * 0.3;

      ring1.rotation.z = t * 0.18;
      ring2.rotation.z = -t * 0.12;
      ring3.rotation.y = t * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      pmrem.dispose();
    };
  }, []);

  /* ── GSAP entrance ────────────────────────────────────────────────────── */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.2 } });

    tl.from(line1Ref.current,  { yPercent: 110, opacity: 0 }, 0.2)
      .from(line2Ref.current,  { yPercent: 110, opacity: 0 }, 0.35)
      .from(metaRef.current,   { y: 20, opacity: 0, duration: 0.9 }, 0.7)
      .from(ctaRef.current,    { y: 20, opacity: 0, duration: 0.9 }, 0.85);
  }, []);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      {/* Three.js orb */}
      <div ref={canvasRef} className="hero__canvas" aria-hidden="true" />

      {/* Radial glow behind orb */}
      <div className="hero__glow" aria-hidden="true" />

      {/* Content */}
      <div className="hero__content container">
        <div className="hero__text">
          {/* Animated headline — clip-reveal per line */}
          <div className="hero__headline">
            <div className="hero__line-wrap">
              <div ref={line1Ref} className="hero__line">
                <span className="hero__name">Aryan Gaur</span>
              </div>
            </div>
            <div className="hero__line-wrap">
              <div ref={line2Ref} className="hero__line hero__line--italic">
                <span>AI Engineer.</span>
              </div>
            </div>
          </div>

          {/* Meta info */}
          <div ref={metaRef} className="hero__meta">
            <span className="hero__meta-item">
              <span className="hero__dot" />
              SanDisk · GenAI Intern
            </span>
            <span className="hero__meta-sep">—</span>
            <span className="hero__meta-item">San Jose, CA</span>
          </div>

          {/* Bio */}
          <p className="hero__bio">
            Building things with LLMs, agents, and whatever's interesting.
            Currently doing cool stuff on the GenAI team at SanDisk.
          </p>

          {/* CTA */}
          <div ref={ctaRef} className="hero__cta">
            <a href="#experience" className="hero__btn hero__btn--primary" data-hover>
              What I do
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
            <a href="#contact" className="hero__btn hero__btn--ghost" data-hover>
              Say hello
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
};

export default Hero;
