import React from 'react';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer__inner container">
      <span className="footer__copy">© {new Date().getFullYear()} Aryan Gaur</span>
      <a href="#hero" className="footer__top" data-hover>Back to top ↑</a>
    </div>
  </footer>
);

export default Footer;
