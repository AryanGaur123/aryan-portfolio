import React from 'react';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer__rule" />
    <div className="footer__inner container">
      <div className="footer__left">
        <span className="footer__name">Aryan Gaur</span>
        <span className="footer__year">© {new Date().getFullYear()}</span>
      </div>
      <span className="footer__byline">Built with React · GSAP · Canvas 2D</span>
      <a href="#hero" className="footer__top" data-hover aria-label="Back to top">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
        Top
      </a>
    </div>
  </footer>
);

export default Footer;
