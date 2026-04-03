import React from 'react';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-inner container">
      <span className="footer-copy">© {new Date().getFullYear()} Aryan Gaur</span>
      <a href="#hero" className="footer-top">↑ Top</a>
    </div>
  </footer>
);

export default Footer;
