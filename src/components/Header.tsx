import React, { useState, useEffect, useRef } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [scrolled, setScrolled]   = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      setScrolled(sy > 40);

      // Progress bar
      const docH   = document.documentElement.scrollHeight - window.innerHeight;
      const pct    = docH > 0 ? (sy / docH) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`hdr ${scrolled ? 'hdr--scrolled' : ''}`}>
      {/* Silver scroll progress bar */}
      <div className="hdr__progress-track" aria-hidden="true">
        <div ref={progressRef} className="hdr__progress-fill" />
      </div>

      <div className="hdr__inner container">
        {/* Animated SVG monogram */}
        <a href="#hero" className="hdr__logo" data-hover aria-label="Aryan Gaur — home">
          <svg
            className="hdr__monogram"
            width="36" height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Outer ring — draws in on load */}
            <circle
              className="hdr__ring"
              cx="18" cy="18" r="16"
              stroke="url(#silverRing)"
              strokeWidth="1"
            />
            {/* A — left stroke, right stroke, crossbar */}
            <path
              className="hdr__letter hdr__letter--a"
              d="M9 27L15 10H18L24 27"
              stroke="url(#silverText)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="hdr__letter hdr__letter--a-bar"
              d="M11 22H22"
              stroke="url(#silverText)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* G — arc */}
            <path
              className="hdr__letter hdr__letter--g"
              d="M30 14a9 9 0 1 0 0 8M30 18h-4.5"
              stroke="url(#silverText)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="silverRing" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#606070" />
                <stop offset="45%"  stopColor="#c8c8d8" />
                <stop offset="100%" stopColor="#484858" />
              </linearGradient>
              <linearGradient id="silverText" x1="0" y1="10" x2="30" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#a0a0b0" />
                <stop offset="50%"  stopColor="#ffffff" />
                <stop offset="100%" stopColor="#808090" />
              </linearGradient>
            </defs>
          </svg>
        </a>

        <nav className="hdr__nav">
          <a href="#experience" className="hdr__link" data-hover>Experience</a>
          <a href="#contact"    className="hdr__link" data-hover>Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
