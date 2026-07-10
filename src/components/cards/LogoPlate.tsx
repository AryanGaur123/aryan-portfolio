import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { LogoConfig } from './cardData';
import './LogoPlate.css';

interface LogoPlateProps {
  config: LogoConfig;
  hovered: boolean;
}

/** Extrusion depth — stacked masked slices, 1.1px apart */
const SLICES = 14;

/**
 * 3D metallic logo — the SVG mask is extruded into real depth (a stack of
 * dark slices behind a polished top face) and the whole block slowly rocks
 * as you scroll, so the metal catches the light without ever spinning.
 * A glint sweeps across the face in sync with the rotation.
 * Pure CSS 3D + one scrubbed GSAP timeline; works identically on touch.
 */
const LogoPlate: React.FC<LogoPlateProps> = ({ config, hovered }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const st = {
        trigger: rootRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      };
      // Rock through the scroll — never a full revolution
      gsap.fromTo(
        '.logo-plate__3d',
        { rotateY: -20, rotateX: 9 },
        { rotateY: 20, rotateX: 3, ease: 'none', scrollTrigger: st }
      );
      // Light travels across the metal as the block turns
      gsap.fromTo(
        '.logo-plate__glint',
        { '--glint': 150 },
        { '--glint': -50, ease: 'none', scrollTrigger: st }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    /* Mask URL travels via a quoted CSS var — Vite inlines small SVGs as
       data: URIs, and an unquoted data URI is invalid CSS */
    <div
      ref={rootRef}
      className={`logo-plate${hovered ? ' logo-plate--hovered' : ''}`}
      style={{ '--plate-glow': config.accentLight, '--logo-url': `url("${config.svg}")` } as React.CSSProperties}
    >
      <div className="logo-plate__glow" />
      <div className="logo-plate__3d">
        {Array.from({ length: SLICES }, (_, i) => (
          <div
            key={i}
            className="logo-plate__slice"
            style={{ '--z': i + 1 } as React.CSSProperties}
          />
        ))}
        <div className="logo-plate__mark" />
        <div className="logo-plate__glint" />
        <div className="logo-plate__sheen" />
      </div>
    </div>
  );
};

export default LogoPlate;
