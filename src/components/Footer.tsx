import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <a href="#hero" className="footer-logo">
          <span className="footer-logo-bracket">&lt;</span>AG<span className="footer-logo-bracket">/&gt;</span>
        </a>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Aryan Gaur · Built with React &amp; ❤️
        </p>
        <a href="#hero" className="footer-back">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
};

export default Footer;
