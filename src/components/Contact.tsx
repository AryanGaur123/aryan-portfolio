import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { label: 'Email',    href: 'mailto:gauraryan1027@gmail.com', display: 'gauraryan1027@gmail.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/aryangaur',   display: 'linkedin.com/in/aryangaur' },
];

const Contact: React.FC = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const statRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Marquee — infinite */
      gsap.to('.contact__marquee-inner', {
        xPercent: -50, ease: 'none', duration: 14, repeat: -1,
      });

      /* Statement reveal */
      gsap.from('.contact__line-wrap', {
        yPercent: 110, opacity: 0,
        duration: 1.0, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: statRef.current, start: 'top 80%' },
      });

      /* Links */
      gsap.from('.contact__link-row', {
        y: 24, opacity: 0,
        duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: statRef.current, start: 'top 70%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      {/* Background watermark */}
      <div className="contact__watermark" aria-hidden="true">REACH</div>

      {/* Marquee */}
      <div className="contact__marquee" aria-hidden="true">
        <div className="contact__marquee-inner">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className={i % 2 === 0 ? 'mq-silver' : 'mq-dim'}>
              GET IN TOUCH <span className="mq-sep">·</span>{' '}
            </span>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="contact__inner">
          {/* Big statement */}
          <div ref={statRef} className="contact__statement">
            <div className="contact__line-wrap">
              <span className="contact__line">Let's build</span>
            </div>
            <div className="contact__line-wrap">
              <span className="contact__line contact__line--silver">something.</span>
            </div>
          </div>

          {/* Sub-copy */}
          <p className="contact__sub">
            Reach out anytime — always happy to connect.
          </p>

          {/* Links */}
          <div className="contact__links">
            {LINKS.map(l => (
              <a key={l.label} href={l.href} className="contact__link-row" data-hover target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <span className="contact__link-label">{l.label}</span>
                <span className="contact__link-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
                <span className="contact__link-val">{l.display}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
