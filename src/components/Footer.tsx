import React, { useEffect, useState } from 'react';
import './Footer.css';

const timeFmt = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
  timeZone: 'America/Los_Angeles',
});

const Footer: React.FC = () => {
  const [now, setNow] = useState(() => timeFmt.format(new Date()));

  /* Live San Jose clock — ticks once a second */
  useEffect(() => {
    const id = setInterval(() => setNow(timeFmt.format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="footer">
      <div className="footer__rule" />
      <div className="footer__inner container">
        <div className="footer__left">
          <span className="footer__name">Aryan Gaur</span>
          <span className="footer__year">© {new Date().getFullYear()}</span>
        </div>
        <span className="footer__time" aria-label="Local time in San Jose">
          <span className="footer__time-dot" aria-hidden="true" />
          San Jose, CA · {now} PT
        </span>
        <span className="footer__byline">Built with React · Three.js · GSAP</span>
        <a href="#hero" className="footer__top" data-hover aria-label="Back to top">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          Top
        </a>
      </div>
    </footer>
  );
};

export default Footer;
