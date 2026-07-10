import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useSectionDrift } from '../hooks/useSectionDrift';
import './Contact.css';

const LINKS = [
  { label: 'Email',    href: 'mailto:gauraryan1027@gmail.com', display: 'gauraryan1027@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/gauraryan', display: 'linkedin.com/in/gauraryan' },
];

/** One statement line split into per-character spans for the scatter assembly. */
const AssembleLine: React.FC<{ text: string; silver?: boolean }> = ({ text, silver }) => (
  <span className="contact__line contact__line--assemble" aria-hidden="true">
    {text.split('').map((ch, i) =>
      ch === ' ' ? (
        <span key={i} className="contact__char contact__char--space" />
      ) : (
        <span
          key={i}
          className={`contact__char${silver ? ' contact__char--silver' : ''}`}
          style={silver ? { animationDelay: `${i * -0.35}s` } : undefined}
        >
          {ch}
        </span>
      )
    )}
  </span>
);

const Contact: React.FC = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const statRef     = useRef<HTMLDivElement>(null);

  /* Whole inner block docks in as a reclined 3D panel */
  useSectionDrift(sectionRef, '.contact__inner');

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Marquee — infinite */
      gsap.to('.contact__marquee-inner', {
        xPercent: -50, ease: 'none', duration: 14, repeat: -1,
      });

      /* Statement assembles from scattered starstuff — every character
         scrubs in from its own random drift position/rotation, so the
         headline literally coalesces as you approach it. */
      gsap.utils.toArray<HTMLElement>('.contact__char:not(.contact__char--space)').forEach((el) => {
        gsap.fromTo(el,
          {
            x: gsap.utils.random(-150, 150),
            y: gsap.utils.random(-170, 110),
            rotation: gsap.utils.random(-75, 75),
            scale: gsap.utils.random(0.3, 1.7),
            opacity: 0,
          },
          {
            x: 0, y: 0, rotation: 0, scale: 1, opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statRef.current, start: 'top 95%', end: 'top 40%', scrub: true,
            },
          }
        );
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
          {/* Big statement — chars assemble on scroll */}
          <div ref={statRef} className="contact__statement" aria-label="Let's build something.">
            <AssembleLine text="Let's build" />
            <AssembleLine text="something." silver />
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
