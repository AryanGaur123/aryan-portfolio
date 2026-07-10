import React from 'react';
import { LogoConfig } from './cardData';
import './LogoPlate.css';

interface LogoPlateProps {
  config: LogoConfig;
  hovered: boolean;
}

/**
 * Premium 2D logo treatment — the SVG becomes a mask over a metallic
 * gradient, sitting on a dark plate with a brand-tinted glow. Hover sweeps
 * a sheen across the mark. Replaces the old three.js extruded logos:
 * indistinguishable polish at a fraction of the cost.
 */
const LogoPlate: React.FC<LogoPlateProps> = ({ config, hovered }) => (
  /* Mask URL travels via a CSS var; it MUST be quoted — Vite inlines small
     SVGs as data: URIs, and an unquoted data URI is invalid CSS that the
     browser silently drops (which is exactly what happened to card 01) */
  <div
    className={`logo-plate${hovered ? ' logo-plate--hovered' : ''}`}
    style={{ '--plate-glow': config.accentLight, '--logo-url': `url("${config.svg}")` } as React.CSSProperties}
  >
    <div className="logo-plate__glow" />
    <div className="logo-plate__mark" />
    <div className="logo-plate__sheen" />
  </div>
);

export default LogoPlate;
