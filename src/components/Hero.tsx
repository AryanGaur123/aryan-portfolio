import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Typed from 'typed.js';
import './Hero.css';

const Hero: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);

  // ─── Three.js Neural Network ───────────────────────────────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 14;

    // Nodes
    const nodeCount = 80;
    const nodeGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const nodes: THREE.Mesh[] = [];
    const positions: THREE.Vector3[] = [];
    const velocities: THREE.Vector3[] = [];

    const colors = [0x00d4ff, 0x7c3aed, 0x06b6d4, 0xf472b6];
    for (let i = 0; i < nodeCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.85,
      });
      const mesh = new THREE.Mesh(nodeGeo, mat);
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
      );
      mesh.position.copy(pos);
      scene.add(mesh);
      nodes.push(mesh);
      positions.push(pos.clone());
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.008,
      ));
    }

    // Edges (line segments between close nodes)
    const edgeGroup = new THREE.Group();
    scene.add(edgeGroup);

    const threshold = 7;

    const rebuildEdges = () => {
      edgeGroup.clear();
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dist = positions[i].distanceTo(positions[j]);
          if (dist < threshold) {
            const pts = [positions[i].clone(), positions[j].clone()];
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            const opacity = (1 - dist / threshold) * 0.15;
            const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
              color: 0x00d4ff,
              transparent: true,
              opacity,
            }));
            edgeGroup.add(line);
          }
        }
      }
    };

    rebuildEdges();

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    let frame = 0;
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;

      // Update positions
      for (let i = 0; i < nodeCount; i++) {
        positions[i].add(velocities[i]);
        if (Math.abs(positions[i].x) > 12) velocities[i].x *= -1;
        if (Math.abs(positions[i].y) > 7) velocities[i].y *= -1;
        if (Math.abs(positions[i].z) > 4) velocities[i].z *= -1;
        nodes[i].position.copy(positions[i]);
      }

      // Rebuild edges every 12 frames (perf)
      if (frame % 12 === 0) rebuildEdges();

      // Camera parallax
      camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

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
    };
  }, []);

  // ─── Typed.js ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!typedRef.current) return;
    const typed = new Typed(typedRef.current, {
      strings: [
        'intelligent AI systems.',
        'multi-agent pipelines.',
        'beautiful web apps.',
        'scalable backends.',
        'RAG architectures.',
      ],
      typeSpeed: 48,
      backSpeed: 28,
      backDelay: 1800,
      loop: true,
      cursorChar: '_',
    });
    return () => typed.destroy();
  }, []);

  return (
    <section className="hero" id="hero">
      {/* Three.js canvas mount */}
      <div ref={mountRef} className="hero-three" />

      {/* Ambient blobs */}
      <div className="blob blob-blue" />
      <div className="blob blob-purple" />
      <div className="blob blob-pink" />

      <div className="hero-content container">
        {/* Status pill */}
        <div className="hero-tag">
          <span className="hero-tag-dot" />
          Available for full-time roles · 2027
        </div>

        <h1 className="hero-name">
          Aryan<span className="gradient-text"> Gaur</span>
        </h1>

        <div className="hero-role">
          <span className="hero-role-prefix">I build </span>
          <span ref={typedRef} className="typed-target" />
        </div>

        <p className="hero-bio">
          AI Engineer & Software Developer crafting intelligent systems and immersive web experiences.
          Pushing boundaries at the intersection of machine learning and modern software engineering.
        </p>

        <div className="hero-actions">
          <a href="#projects" className="btn-primary">
            View My Work
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#contact" className="btn-ghost">Get In Touch</a>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number gradient-text">3+</span>
            <span className="stat-label">Years Coding</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number gradient-text">10+</span>
            <span className="stat-label">Projects Built</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number gradient-text">AI</span>
            <span className="stat-label">Focused</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number gradient-text">SDE</span>
            <span className="stat-label">@ SanDisk</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-line" />
        <span>scroll</span>
      </div>
    </section>
  );
};

export default Hero;
