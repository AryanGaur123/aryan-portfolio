import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '../../lib/lenis';

const BASE = new THREE.Vector3(0, 1.4, 4.6);
const BASE_FOV = 55;

/**
 * Cursor-lerped parallax + scroll-driven drift for the galaxy camera.
 * Listens on window (the canvas wrapper has pointer-events: none, so
 * R3F's own pointer state never updates).
 */
const CameraRig: React.FC = () => {
  const mouse = useRef({ x: 0, y: 0 });
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ camera }, delta) => {
    const p = scrollState.progress;

    // Scroll: camera slowly rises and pulls back, galaxy sinks below the fold.
    const targetX = BASE.x + mouse.current.x * 0.55;
    const targetY = BASE.y + mouse.current.y * 0.35 + p * 1.6;
    const targetZ = BASE.z + p * 1.8;

    const damp = 1 - Math.exp(-3.2 * delta);
    camera.position.x += (targetX - camera.position.x) * damp;
    camera.position.y += (targetY - camera.position.y) * damp;
    camera.position.z += (targetZ - camera.position.z) * damp;

    lookTarget.current.set(mouse.current.x * 0.25, -p * 1.1, 0);
    camera.lookAt(lookTarget.current);

    /* Warp kick — scroll velocity widens the FOV like the ship is
       accelerating, then eases back to cruise when the scroll settles. */
    const cam = camera as THREE.PerspectiveCamera;
    const fovTarget = BASE_FOV + Math.min(Math.abs(scrollState.velocity) * 0.24, 14);
    const nextFov = cam.fov + (fovTarget - cam.fov) * damp;
    if (Math.abs(nextFov - cam.fov) > 0.001) {
      cam.fov = nextFov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
};

export default CameraRig;
