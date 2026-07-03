import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import FloatingCard from './cards/FloatingCard';
import { CARDS } from './cards/cardData';
import SpinningLogo from './scene/SpinningLogo';
import './Experience.css';

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Title reveal */
      gsap.from(headRef.current, {
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
      });

      /* Card entrances — alternating 3D fly-in from the sides, rotating
         into place with depth. Targets the outer wrap so Framer Motion's
         float/tilt transforms on inner layers never fight these tweens. */
      gsap.utils.toArray<HTMLElement>('.fcard-wrap').forEach((el, i) => {
        const fromLeft = i % 2 === 0;

        gsap.from(el, {
          x: fromLeft ? -140 : 140,
          y: 110,
          rotateY: fromLeft ? -22 : 22,
          rotateX: 10,
          scale: 0.82,
          opacity: 0,
          transformPerspective: 1200,
          duration: 1.25,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });

        /* Cascading content reveal once the card lands */
        gsap.from(el.querySelectorAll('.exp__bullets li, .exp__tag'), {
          y: 18, opacity: 0,
          duration: 0.55, stagger: 0.05, ease: 'power2.out', delay: 0.45,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });

        /* Counter-parallax — cards drift at different rates while the
           section scrolls through, so the grid feels alive in space.
           scrub: true (no extra lag) — Lenis already smooths the scroll,
           and stacking a second smoothing pass reads as jitter. */
        gsap.to(el, {
          yPercent: fromLeft ? -4 : 4,
          ease: 'none',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="exp" id="experience" ref={sectionRef}>
      <div className="container">
        <div ref={headRef} className="exp__head">
          <span className="exp__label">Experience</span>
          <h2 className="exp__title">Where I've been.</h2>
        </div>

        <div ref={cardsRef} className="exp__grid">
          {CARDS.map((card, i) => (
            <FloatingCard
              key={card.num}
              card={card}
              index={i}
              media={card.logo ? (hovered) => <SpinningLogo config={card.logo!} hovered={hovered} /> : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
