import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import './Hero.css';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const line1Ref  = useRef<HTMLDivElement>(null);
  const line2Ref  = useRef<HTMLDivElement>(null);
  const metaRef   = useRef<HTMLDivElement>(null);
  const ctaRef    = useRef<HTMLDivElement>(null);

  /* ── Three.js — floating metallic geometry cluster ─────────────────────── */
  useEffect(() => {
    const mount = canvasRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.z = 8;

    /* ── Procedural silver studio environment ────────────────────────────── */
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(
      new THREE.SphereGeometry(50, 32, 32),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        vertexShader: `varying vec3 vPos; void main(){ vPos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `
          varying vec3 vPos;
          void main(){
            float y  = normalize(vPos).y * .5 + .5;
            vec3 top = vec3(.30,.30,.32);
            vec3 mid = vec3(.18,.18,.19);
            vec3 bot = vec3(.06,.06,.065);
            vec3 c   = mix(bot, mix(mid,top,y), y);
            float rim= pow(1.-abs(normalize(vPos).y),5.);
            c += rim * .5; // bright silver horizon
            gl_FragColor = vec4(c,1.);
          }
        `,
      })
    ));
    // Bright key + multiple fill lights baked into env
    const envLights = [
      { p:[10, 14,  8] as [number,number,number], s: 7.0, c: 0xffffff },
      { p:[-12, 6, -6] as [number,number,number], s: 3.5, c: 0xe0e0e0 },
      { p:[ 0, -8,  6] as [number,number,number], s: 2.0, c: 0xbbbbbb },
      { p:[ 6,  2,-12] as [number,number,number], s: 2.5, c: 0xcccccc },
      { p:[-4, -4,  8] as [number,number,number], s: 1.5, c: 0xaaaaaa },
    ];
    envLights.forEach(({ p, s, c }) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.5,8,8), new THREE.MeshBasicMaterial({ color: c }));
      (m.material as THREE.MeshBasicMaterial).color.multiplyScalar(s);
      m.position.set(...p);
      envScene.add(m);
    });
    const envTex = pmrem.fromScene(envScene).texture;
    scene.environment = envTex;

    /* ── Chrome material factory ─────────────────────────────────────────── */
    const chromeMat = (roughness = 0.03, color = 0xffffff) =>
      new THREE.MeshStandardMaterial({
        color,
        metalness: 1.0,
        roughness,
        envMap: envTex,
        envMapIntensity: 3.5,
      });

    /* ── Scene lights ────────────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));
    const key = new THREE.DirectionalLight(0xffffff, 5);
    key.position.set(6, 10, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xdddddd, 2.5);
    rim.position.set(-8, -3, -6);
    scene.add(rim);
    const fill = new THREE.PointLight(0xffffff, 3, 25);
    fill.position.set(-3, 5, 5);
    scene.add(fill);

    /* ── Geometry pieces — smaller decorative cluster ────────────────────── */
    type Piece = {
      mesh: THREE.Mesh;
      ox: number; oy: number; oz: number;  // orbit center
      phase: number;
      speedX: number; speedY: number; speedZ: number;
      floatAmp: number; floatSpeed: number;
    };

    const pieces: Piece[] = [];

    const addPiece = (
      geo: THREE.BufferGeometry,
      rough: number,
      pos: [number, number, number],
      scale: number,
      phase: number,
    ) => {
      const mesh = new THREE.Mesh(geo, chromeMat(rough));
      mesh.position.set(...pos);
      mesh.scale.setScalar(scale);
      mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
      scene.add(mesh);
      pieces.push({
        mesh,
        ox: pos[0], oy: pos[1], oz: pos[2],
        phase,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.6,
        speedZ: (Math.random() - 0.5) * 0.3,
        floatAmp: 0.08 + Math.random() * 0.12,
        floatSpeed: 0.6 + Math.random() * 0.8,
      });
    };

    // Large-ish central icosahedron (replaces sphere but much smaller + angular)
    addPiece(new THREE.IcosahedronGeometry(0.55, 1),  0.02, [ 0.4,  0.2,  0.0], 1.0, 0.0);

    // Medium pieces
    addPiece(new THREE.OctahedronGeometry(0.32, 0),   0.04, [ 1.8,  0.8, -0.5], 1.0, 0.7);
    addPiece(new THREE.IcosahedronGeometry(0.25, 0),  0.03, [-1.6,  0.5,  0.3], 1.0, 1.4);
    addPiece(new THREE.TetrahedronGeometry(0.28, 0),  0.05, [ 1.2, -1.0,  0.4], 1.0, 2.1);
    addPiece(new THREE.OctahedronGeometry(0.22, 0),   0.02, [-1.2, -0.9, -0.3], 1.0, 2.8);

    // Small accent pieces
    addPiece(new THREE.IcosahedronGeometry(0.14, 0),  0.03, [ 2.6, -0.2,  0.2], 1.0, 0.4);
    addPiece(new THREE.OctahedronGeometry(0.12, 0),   0.04, [-2.4,  1.2, -0.4], 1.0, 1.1);
    addPiece(new THREE.TetrahedronGeometry(0.13, 0),  0.05, [ 0.3,  1.8,  0.1], 1.0, 1.8);
    addPiece(new THREE.IcosahedronGeometry(0.10, 0),  0.02, [-0.5, -1.7,  0.3], 1.0, 2.5);
    addPiece(new THREE.OctahedronGeometry(0.09, 0),   0.03, [ 2.0,  1.5, -0.6], 1.0, 3.2);

    // Flat torus rings — very thin
    const addRing = (r: number, pos: [number,number,number], rotX: number, rotZ: number, phase: number) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.012, 6, 120),
        chromeMat(0.04, 0xdddddd),
      );
      mesh.position.set(...pos);
      mesh.rotation.x = rotX;
      mesh.rotation.z = rotZ;
      scene.add(mesh);
      pieces.push({
        mesh,
        ox: pos[0], oy: pos[1], oz: pos[2],
        phase,
        speedX: 0.15, speedY: 0.22, speedZ: 0.1,
        floatAmp: 0.06,
        floatSpeed: 0.5,
      });
    };
    addRing(0.45, [ 0.4, 0.2, 0.0],  Math.PI/2.2, 0.4, 0.0);   // around central ico
    addRing(0.55, [ 0.4, 0.2, 0.0],  Math.PI/6,   1.1, 0.5);   // second ring
    addRing(0.28, [ 1.8, 0.8,-0.5],  Math.PI/3,   0.8, 0.9);
    addRing(0.22, [-1.6, 0.5, 0.3],  Math.PI/4,  -0.5, 1.6);

    /* Entrance — scale from 0 with stagger */
    pieces.forEach(({ mesh }, i) => {
      mesh.scale.setScalar(0);
      gsap.to(mesh.scale, {
        x: i < 5 ? 1.0 : 1.0,
        y: i < 5 ? 1.0 : 1.0,
        z: i < 5 ? 1.0 : 1.0,
        duration: 1.8,
        delay: 0.4 + i * 0.055,
        ease: 'expo.out',
      });
    });

    /* Mouse parallax */
    const mouse  = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);

    /* Group container for parallax */
    const group = new THREE.Group();
    pieces.forEach(p => { scene.remove(p.mesh); group.add(p.mesh); });
    scene.add(group);

    let animId: number;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.01;

      pieces.forEach(p => {
        // Individual rotation
        p.mesh.rotation.x += 0.002 * p.speedX;
        p.mesh.rotation.y += 0.003 * p.speedY;
        p.mesh.rotation.z += 0.001 * p.speedZ;

        // Gentle float
        p.mesh.position.y = p.oy + Math.sin(t * p.floatSpeed + p.phase) * p.floatAmp;
        p.mesh.position.x = p.ox + Math.cos(t * p.floatSpeed * 0.7 + p.phase) * (p.floatAmp * 0.5);
      });

      // Group-level mouse parallax
      target.x += (mouse.x * 0.15 - target.x) * 0.04;
      target.y += (mouse.y * 0.10 - target.y) * 0.04;
      group.rotation.y = target.x * 0.5;
      group.rotation.x = target.y * 0.3;

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
    <section className="hero" id="hero">
      <div ref={canvasRef} className="hero__canvas" aria-hidden="true" />
      <div className="hero__glow"  aria-hidden="true" />

      <div className="hero__content container">
        <div className="hero__text">
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

          <div ref={metaRef} className="hero__meta">
            <span className="hero__meta-item">
              <span className="hero__dot" />
              SanDisk · GenAI Intern
            </span>
            <span className="hero__meta-sep">·</span>
            <span className="hero__meta-item">San Jose, CA</span>
            <span className="hero__meta-sep">·</span>
            <span className="hero__meta-item">SJSU, Class of 2027</span>
          </div>

          <p className="hero__bio">
            I build AI-powered systems — multi-agent pipelines, RAG architectures, and full-stack tooling
            that puts LLMs to practical use. Currently on the GenAI team at SanDisk, and studying
            Computer Science at SJSU.
          </p>

          <div ref={ctaRef} className="hero__cta">
            <a href="#experience" className="hero__btn hero__btn--primary" data-hover>
              Experience
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
            <a href="#contact" className="hero__btn hero__btn--ghost" data-hover>
              Get in touch
            </a>
          </div>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
};

export default Hero;
