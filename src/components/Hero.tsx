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

  /* ── Three.js — silver metallic geometry, no EffectComposer ────────────── */
  useEffect(() => {
    const mount = canvasRef.current;
    if (!mount) return;

    const W = mount.clientWidth  || window.innerWidth;
    const H = mount.clientHeight || window.innerHeight;

    /* ── Renderer — plain WebGLRenderer, no composer ─────────────────────── */
    const renderer = new THREE.WebGLRenderer({
      antialias:    true,
      alpha:        true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.outputColorSpace   = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(-1.8, 0, 8);

    /* ── Procedural PMREM env map ─────────────────────────────────────────── */
    const pmrem    = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(
      new THREE.SphereGeometry(50, 32, 32),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        vertexShader: `
          varying vec3 vPos;
          void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }
        `,
        fragmentShader: `
          varying vec3 vPos;
          void main(){
            float y  = normalize(vPos).y * .5 + .5;
            vec3 top = vec3(.82,.82,.84);
            vec3 mid = vec3(.45,.45,.47);
            vec3 bot = vec3(.04,.04,.045);
            vec3 c   = mix(bot, mix(mid, top, y * 1.3), y);
            float rim = pow(1. - abs(normalize(vPos).y), 6.);
            c += rim * vec3(.95,.93,.90);
            gl_FragColor = vec4(c, 1.);
          }
        `,
      })
    ));

    const envLights: { p: [number,number,number]; s: number; c: number }[] = [
      { p: [ 12,  18,   8], s: 10.0, c: 0xffffff },
      { p: [-14,   5,  -6], s:  4.0, c: 0xe8e8e8 },
      { p: [  0, -10,   8], s:  2.5, c: 0xd0d0d0 },
      { p: [  8,   2, -14], s:  3.0, c: 0xcccccc },
      { p: [ -5,  -5,  10], s:  2.0, c: 0xb8b8b8 },
      { p: [  0,  20,   0], s:  5.0, c: 0xffffff },
    ];
    envLights.forEach(({ p, s, c }) => {
      const mat = new THREE.MeshBasicMaterial({ color: c });
      mat.color.multiplyScalar(s);
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), mat);
      m.position.set(...p);
      envScene.add(m);
    });

    const envTex = pmrem.fromScene(envScene).texture;
    scene.environment = envTex;

    /* ── Materials ────────────────────────────────────────────────────────── */
    const silverMat = (roughness = 0.07, tint = 0xc8c8d0) =>
      new THREE.MeshPhysicalMaterial({
        color:              new THREE.Color(tint),
        metalness:          1.0,
        roughness,
        envMap:             envTex,
        envMapIntensity:    2.8,
        clearcoat:          0.6,
        clearcoatRoughness: 0.08,
      });

    const darkSilver = (roughness = 0.15) =>
      new THREE.MeshPhysicalMaterial({
        color:              new THREE.Color(0x909098),
        metalness:          1.0,
        roughness,
        envMap:             envTex,
        envMapIntensity:    2.2,
        clearcoat:          0.3,
        clearcoatRoughness: 0.2,
      });

    /* ── Lights ───────────────────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));

    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(7, 12, 6);
    scene.add(key);

    const rim1 = new THREE.DirectionalLight(0xe0e8ff, 1.8);
    rim1.position.set(-10, -4, -8);
    scene.add(rim1);

    const rim2 = new THREE.DirectionalLight(0xfff0e8, 1.0);
    rim2.position.set(4, -8, 8);
    scene.add(rim2);

    const fill = new THREE.PointLight(0xffffff, 2.5, 30);
    fill.position.set(-3, 6, 6);
    scene.add(fill);

    const sparkle = new THREE.PointLight(0xe8f0ff, 2.0, 18);
    sparkle.position.set(3, -2, 4);
    scene.add(sparkle);

    const pulse = new THREE.PointLight(0xd0d8ff, 0, 12);
    pulse.position.set(0.4, 0.2, 2);
    scene.add(pulse);

    /* ── Particle dust ────────────────────────────────────────────────────── */
    const dustCount = 280;
    const dustPos   = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3]     = (Math.random() - 0.5) * 9;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 7;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustCloud = new THREE.Points(dustGeo, new THREE.PointsMaterial({
      color: 0xd0d0d8, size: 0.018, sizeAttenuation: true,
      transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    scene.add(dustCloud);

    /* ── Geometry cluster ─────────────────────────────────────────────────── */
    type Piece = {
      mesh: THREE.Mesh;
      ox: number; oy: number;
      phase: number;
      speedX: number; speedY: number; speedZ: number;
      floatAmp: number; floatSpeed: number;
    };
    const pieces: Piece[] = [];

    const addPiece = (
      geo: THREE.BufferGeometry, mat: THREE.Material,
      pos: [number, number, number], phase: number,
    ) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      );
      scene.add(mesh);
      pieces.push({
        mesh, ox: pos[0], oy: pos[1], phase,
        speedX:    (Math.random() - 0.5) * 0.5,
        speedY:    (Math.random() - 0.5) * 0.7,
        speedZ:    (Math.random() - 0.5) * 0.35,
        floatAmp:  0.07 + Math.random() * 0.13,
        floatSpeed: 0.55 + Math.random() * 0.9,
      });
    };

    addPiece(new THREE.IcosahedronGeometry(0.52, 1),  silverMat(0.04),  [ 0.4,  0.2,  0.0], 0.0);
    addPiece(new THREE.OctahedronGeometry(0.30, 0),   silverMat(0.06),  [ 1.9,  0.9, -0.5], 0.7);
    addPiece(new THREE.IcosahedronGeometry(0.24, 0),  darkSilver(0.10), [-1.7,  0.5,  0.3], 1.4);
    addPiece(new THREE.TetrahedronGeometry(0.27, 0),  silverMat(0.03),  [ 1.3, -1.1,  0.4], 2.1);
    addPiece(new THREE.DodecahedronGeometry(0.22, 0), darkSilver(0.12), [-1.3, -1.0, -0.3], 2.8);
    addPiece(new THREE.OctahedronGeometry(0.19, 0),   silverMat(0.05),  [ 0.0,  1.7,  0.2], 3.5);
    addPiece(new THREE.IcosahedronGeometry(0.13, 0),  silverMat(0.04),  [ 2.7, -0.3,  0.2], 0.4);
    addPiece(new THREE.OctahedronGeometry(0.11, 0),   darkSilver(0.08), [-2.5,  1.3, -0.4], 1.1);
    addPiece(new THREE.TetrahedronGeometry(0.12, 0),  silverMat(0.06),  [ 0.3,  2.0,  0.1], 1.8);
    addPiece(new THREE.IcosahedronGeometry(0.09, 0),  silverMat(0.03),  [-0.6, -1.9,  0.3], 2.5);
    addPiece(new THREE.DodecahedronGeometry(0.10, 0), darkSilver(0.15), [ 2.1,  1.6, -0.6], 3.2);
    addPiece(new THREE.TetrahedronGeometry(0.08, 0),  silverMat(0.04),  [-0.9,  1.2,  0.5], 0.9);

    // Torus rings
    const addRing = (
      r: number, tube: number,
      pos: [number, number, number],
      rotX: number, rotZ: number, phase: number,
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(r, tube, 8, 120),
        silverMat(0.05, 0xe0e0e8),
      );
      mesh.position.set(...pos);
      mesh.rotation.x = rotX;
      mesh.rotation.z = rotZ;
      scene.add(mesh);
      pieces.push({
        mesh, ox: pos[0], oy: pos[1], phase,
        speedX: 0.12, speedY: 0.18, speedZ: 0.08,
        floatAmp: 0.05, floatSpeed: 0.45,
      });
    };
    addRing(0.44, 0.011, [ 0.4,  0.2,  0.0], Math.PI / 2.2, 0.4,  0.0);
    addRing(0.56, 0.009, [ 0.4,  0.2,  0.0], Math.PI / 6,   1.1,  0.5);
    addRing(0.27, 0.009, [ 1.9,  0.9, -0.5], Math.PI / 3,   0.8,  0.9);
    addRing(0.21, 0.008, [-1.7,  0.5,  0.3], Math.PI / 4,  -0.5,  1.6);
    addRing(0.18, 0.007, [-1.3, -1.0, -0.3], Math.PI / 5,   0.3,  2.2);

    // Wireframe ghosts
    const ghost = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.6, 1),
      new THREE.MeshBasicMaterial({ color: 0x707080, wireframe: true, transparent: true, opacity: 0.08 }),
    );
    ghost.position.set(0.4, 0.2, -0.5);
    scene.add(ghost);

    const ghost2 = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.0, 0),
      new THREE.MeshBasicMaterial({ color: 0x808090, wireframe: true, transparent: true, opacity: 0.06 }),
    );
    ghost2.position.set(1.2, -0.4, -1.0);
    scene.add(ghost2);

    /* Entrance animation */
    pieces.forEach(({ mesh }, i) => {
      mesh.scale.setScalar(0);
      gsap.to(mesh.scale, {
        x: 1, y: 1, z: 1,
        duration: 2.0,
        delay: 0.3 + i * 0.045,
        ease: 'expo.out',
      });
    });

    /* ── Mouse parallax ───────────────────────────────────────────────────── */
    const mouse  = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);

    const group = new THREE.Group();
    pieces.forEach(p => { scene.remove(p.mesh); group.add(p.mesh); });
    scene.add(group);

    /* ── Animate — direct renderer.render(), no composer ─────────────────── */
    let animId: number;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.01;

      pieces.forEach(p => {
        p.mesh.rotation.x += 0.0012 * p.speedX;
        p.mesh.rotation.y += 0.0017 * p.speedY;
        p.mesh.rotation.z += 0.0008 * p.speedZ;
        p.mesh.position.y  = p.oy + Math.sin(t * p.floatSpeed + p.phase) * p.floatAmp;
        p.mesh.position.x  = p.ox + Math.cos(t * p.floatSpeed * 0.7 + p.phase) * (p.floatAmp * 0.45);
      });

      dustCloud.rotation.y += 0.00025;
      dustCloud.rotation.x += 0.00012;

      ghost.rotation.y  += 0.0008;
      ghost.rotation.x  += 0.0003;
      ghost2.rotation.y -= 0.0006;
      ghost2.rotation.z += 0.0004;

      pulse.intensity = 1.0 + Math.sin(t * 0.8) * 0.8;

      camera.position.x = -1.8 + Math.sin(t * 0.18) * 0.12;
      camera.position.y =        Math.cos(t * 0.13) * 0.08;

      target.x += (mouse.x * 0.15 - target.x) * 0.04;
      target.y += (mouse.y * 0.10 - target.y) * 0.04;
      group.rotation.y = target.x * 0.5;
      group.rotation.x = target.y * 0.3;

      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize ───────────────────────────────────────────────────────────── */
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
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

  /* ── GSAP text entrance ───────────────────────────────────────────────── */
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
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__watermark" aria-hidden="true">ARYAN</div>

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

          <div className="hero__rule" aria-hidden="true" />

          <p className="hero__bio">
            Computer Engineering student at SJSU — Verilog, FPGAs, digital design, and enough software
            to bridge both worlds. Currently interning on the GenAI team at SanDisk.
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
