import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bigTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Marquee slow drift */
      gsap.to('.contact__marquee-inner', {
        xPercent: -50,
        ease: 'none',
        duration: 18,
        repeat: -1,
      });

      /* Big text reveal on scroll */
      gsap.from('.contact__statement-line', {
        yPercent: 120,
        opacity: 0,
        stagger: 0.12,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      /* Links fade in */
      gsap.from('.contact__links', {
        y: 30,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
        delay: 0.4,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="contact" ref={sectionRef}>
      {/* Background watermark */}
      <div className="contact__watermark" aria-hidden="true">REACH</div>

      {/* Scrolling marquee */}
      <div className="contact__marquee" aria-hidden="true">
        <div className="contact__marquee-inner">
          {Array(10).fill('GET IN TOUCH · ').join('')}
        </div>
      </div>

      <div className="contact__inner container">
        {/* Big typographic statement */}
        <div className="contact__statement" ref={bigTextRef}>
          <div className="contact__line-wrap">
            <span className="contact__statement-line">Let’s build</span>
          </div>
          <div className="contact__line-wrap">
            <span className="contact__statement-line contact__statement-line--silver">something.</span>
          </div>
          <div className="contact__line-wrap">
            <span className="contact__statement-line contact__statement-line--small">Reach out anytime.</span>
          </div>
        </div>

        {/* Email link */}
        <a
          href="mailto:gauraryan1027@gmail.com"
          className="contact__email"
          data-hover
        >
          gauraryan1027@gmail.com
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>

        {/* Social links */}
        <div className="contact__links">
          <a href="https://github.com/AryanGaur123" target="_blank" rel="noopener noreferrer" className="contact__link" data-hover>
            GitHub
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
          <span className="contact__sep">·</span>
          <a href="https://linkedin.com/in/gauraryan" target="_blank" rel="noopener noreferrer" className="contact__link" data-hover>
            LinkedIn
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
