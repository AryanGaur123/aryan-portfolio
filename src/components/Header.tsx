import React, { useState, useEffect } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header className={`hdr ${scrolled ? 'hdr--scrolled' : ''}`}>
      <div className="hdr__inner container">
        <a href="#hero" className="hdr__logo" data-hover>AG</a>
        <nav className="hdr__nav">
          <a href="#experience" className="hdr__link" data-hover>Experience</a>
          <a href="#contact" className="hdr__link" data-hover>Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
