import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Hero.css';

const Hero: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 5);

    // ── Environment (silver/chrome IBL) ──────────────────────────────────────
    // Build a procedural environment map — concentric gradient rings
    const pmremGen = new THREE.PMREMGenerator(renderer);
    pmremGen.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    // Gradient sky sphere
    const skyGeo = new THREE.SphereGeometry(50, 32, 32);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vPos;
        void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }
      `,
      fragmentShader: `
        varying vec3 vPos;
        uniform float uTime;
        void main() {
          float t = normalize(vPos).y * 0.5 + 0.5;
          vec3 top    = vec3(0.18, 0.18, 0.20);
          vec3 mid    = vec3(0.10, 0.10, 0.11);
          vec3 bottom = vec3(0.05, 0.05, 0.055);
          vec3 col = mix(bottom, mix(mid, top, t), t);
          // subtle bright ring at horizon
          float ring = pow(1.0 - abs(normalize(vPos).y), 8.0);
          col += ring * 0.25;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    envScene.add(new THREE.Mesh(skyGeo, skyMat));

    // Add a few point "lights" in env scene as emissive spheres
    const envLightPositions = [
      { pos: [10, 10, 10],   color: 0xffffff, intensity: 3.5 },
      { pos: [-12, 5, -8],   color: 0xc0c0c0, intensity: 2.0 },
      { pos: [0, -10, 5],    color: 0x888888, intensity: 1.0 },
    ];
    envLightPositions.forEach(({ pos, color, intensity }) => {
      const sg = new THREE.SphereGeometry(0.8, 8, 8);
      const sm = new THREE.MeshBasicMaterial({ color });
      const sm2 = sm.clone();
      sm2.color.multiplyScalar(intensity);
      const mesh = new THREE.Mesh(sg, sm2);
      mesh.position.set(...(pos as [number, number, number]));
      envScene.add(mesh);
    });

    const envTexture = pmremGen.fromScene(envScene).texture;
    scene.environment = envTexture;

    // ── Chrome sphere ────────────────────────────────────────────────────────
    const sphereGeo = new THREE.SphereGeometry(1.4, 128, 128);
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.04,
      envMap: envTexture,
      envMapIntensity: 2.5,
    });
    const sphere = new THREE.Mesh(sphereGeo, chromeMat);
    scene.add(sphere);

    // Thin ring around sphere
    const ringGeo = new THREE.TorusGeometry(1.85, 0.006, 8, 200);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 1.0,
      roughness: 0.05,
      envMap: envTexture,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    // Second thinner ring at different angle
    const ring2 = ring.clone();
    ring2.rotation.x = Math.PI / 6;
    ring2.rotation.y = Math.PI / 3;
    scene.add(ring2);

    // Scene lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xaaaaaa, 1.5);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffffff, 2.0, 20);
    fillLight.position.set(-3, 3, 3);
    scene.add(fillLight);

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    let animId: number;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.004;

      // Gentle auto-rotation
      sphere.rotation.y = t * 0.3;
      sphere.rotation.x = Math.sin(t * 0.4) * 0.12;

      // Mouse parallax on group
      target.x += (mouse.x * 0.18 - target.x) * 0.06;
      target.y += (-mouse.y * 0.12 - target.y) * 0.06;
      sphere.rotation.y += target.x * 0.6;
      sphere.rotation.x += target.y * 0.4;

      ring.rotation.z  = t * 0.15;
      ring2.rotation.z = -t * 0.1;

      renderer.render(scene, camera);
    };
    animate();

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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      pmremGen.dispose();
    };
  }, []);

  return (
    <section className="hero" id="hero">
      {/* Text — left column */}
      <div className="hero-text container">
        <p className="hero-eyebrow">Aryan Gaur</p>
        <h1 className="hero-headline">
          AI Engineer.<br />
          <em>Software Dev.</em>
        </h1>
        <p className="hero-sub">
          Interning on the GenAI team at SanDisk.<br />
          Building things with LLMs, agents, and whatever's interesting.
        </p>
        <div className="hero-cta-row">
          <a href="#contact" className="hero-cta">Say hello</a>
          <a href="#experience" className="hero-link">See what I do →</a>
        </div>
      </div>

      {/* Three.js chrome sphere — right side */}
      <div ref={mountRef} className="hero-canvas-wrap" />

      {/* Ambient gradient */}
      <div className="hero-glow" />
    </section>
  );
};

export default Hero;
