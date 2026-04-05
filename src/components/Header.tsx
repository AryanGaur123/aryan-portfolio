import React, { useEffect, useRef, useState } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`hdr${scrolled ? ' hdr--scrolled' : ''}`}>
      <div className="hdr__progress">
        <div ref={progressRef} className="hdr__progress-fill" />
      </div>
      <div className="hdr__inner container">
        <a href="#hero" className="hdr__logo" aria-label="Home" data-hover>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14.5" stroke="url(#lg-ring)" strokeWidth="1" className="hdr__ring" />
            <path d="M8 25L13.5 10H16.5L22 25" stroke="url(#lg-letter)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hdr__letter" />
            <path d="M10 20.5H20" stroke="url(#lg-letter)" strokeWidth="1.5" strokeLinecap="round" className="hdr__letter" style={{ animationDelay: '1.1s' }} />
            <defs>
              <linearGradient id="lg-ring" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#484860" />
                <stop offset="50%"  stopColor="#c0c0d0" />
                <stop offset="100%" stopColor="#484860" />
              </linearGradient>
              <linearGradient id="lg-letter" x1="8" y1="10" x2="22" y2="26" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#9090a0" />
                <stop offset="50%"  stopColor="#ffffff" />
                <stop offset="100%" stopColor="#707080" />
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
