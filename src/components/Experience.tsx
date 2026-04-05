import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Experience.css';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    num:     '01',
    role:    'GenAI Intern',
    company: 'SanDisk / Western Digital',
    period:  'Summer 2025',
    type:    'Internship',
    bullets: [
      'Building multi-agent AI pipelines for internal tooling using LangGraph and LangChain.',
      'Developing RAG architectures with semantic retrieval and LangFuse observability.',
      'Full-stack integrations with FastAPI backends and React frontends.',
    ],
    stack:   ['Python', 'LangGraph', 'LangChain', 'RAG', 'FastAPI', 'React'],
  },
  {
    num:     '02',
    role:    'B.S. Computer Engineering',
    company: 'San Jose State University',
    period:  '2023 — 2027',
    type:    'Education',
    bullets: [
      'Studying digital systems, FPGA design, EE fundamentals, and embedded software.',
      'Coursework in Verilog, circuit analysis, computer architecture, and C++.',
    ],
    stack:   ['Verilog', 'FPGA', 'C++', 'Assembly', 'Circuit Design', 'Embedded Systems'],
  },
];

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

      /* Card stagger */
      gsap.from('.exp__card', {
        y: 60, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: cardsRef.current, start: 'top 80%' },
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
          {CARDS.map(card => (
            <div key={card.num} className="exp__card" data-hover>
              {/* Card inner shimmer */}
              <div className="exp__card-shine" aria-hidden="true" />

              <div className="exp__card-top">
                <span className="exp__num">{card.num}</span>
                <span className="exp__type">{card.type}</span>
              </div>

              <div className="exp__card-body">
                <p className="exp__period">{card.period}</p>
                <h3 className="exp__role">{card.role}</h3>
                <p className="exp__company">{card.company}</p>
              </div>

              <div className="exp__divider" />

              <ul className="exp__bullets">
                {card.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              <div className="exp__stack">
                {card.stack.map(s => (
                  <span key={s} className="exp__tag">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
