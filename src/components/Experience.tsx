import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Experience.css';

gsap.registerPlugin(ScrollTrigger);

interface Role {
  index: string;
  title: string;
  company: string;
  period: string;
  type: string;
  bullets: string[];
  stack: string[];
}

const roles: Role[] = [
  {
    index: '01',
    title: 'AI / Software Engineering Intern',
    company: 'SanDisk',
    period: '2025 — Present',
    type: 'GenAI Team',
    bullets: [
      'Building adaptive RAG pipelines for internal knowledge retrieval across proprietary documentation.',
      'Designing multi-agent architectures with LangGraph — stateful orchestration, memory, planning, tool use.',
      'Integrating LangFuse for end-to-end LLM tracing and evaluation across GenAI workflows.',
      'Shipping full-stack tooling with React + FastAPI to surface AI capabilities to internal teams.',
    ],
    stack: ['Python', 'LangGraph', 'LangChain', 'LangFuse', 'RAG', 'FastAPI', 'React', 'TypeScript'],
  },
  {
    index: '02',
    title: 'B.S. Computer Science',
    company: 'San Jose State University',
    period: '2023 — 2027',
    type: 'Full-time student',
    bullets: [
      'Studying CS with a focus on AI/ML, systems programming, and algorithms.',
      'Coursework spanning Verilog, C++, Assembly, digital design, and data structures.',
    ],
    stack: ['Python', 'C++', 'Java', 'Verilog', 'Assembly', 'Algorithms'],
  },
];

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) return; // vertical on mobile

    const totalWidth = track.scrollWidth - track.clientWidth;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.2,
          end: () => `+=${totalWidth * 1.4}`,
          invalidateOnRefresh: true,
        },
      });

      /* Stagger each card in as it enters */
      const mainST = ScrollTrigger.getAll()[0];
      gsap.utils.toArray<HTMLElement>('.exp__card').forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: mainST as any,
            start: 'left center',
            toggleActions: 'play none none none',
          },
          delay: i * 0.08,
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="exp" ref={sectionRef}>
      <div className="exp__header container">
        <span className="label">Work & Education</span>
        <h2 className="exp__title">Where I've been.</h2>
      </div>

      <div className="exp__track" ref={trackRef}>
        {/* Leading spacer */}
        <div className="exp__spacer" />

        {roles.map((role) => (
          <article key={role.company} className="exp__card" data-hover>
            {/* Card header */}
            <div className="exp__card-top">
              <span className="exp__index">{role.index}</span>
              <span className="exp__period">{role.period}</span>
            </div>

            {/* Type badge */}
            <div className="exp__badge">{role.type}</div>

            {/* Title */}
            <h3 className="exp__role">{role.title}</h3>
            <p className="exp__company">{role.company}</p>

            {/* Divider */}
            <div className="exp__rule" />

            {/* Bullets */}
            <ul className="exp__bullets">
              {role.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            {/* Stack */}
            <div className="exp__stack">
              {role.stack.map(t => (
                <span key={t} className="exp__tag">{t}</span>
              ))}
            </div>
          </article>
        ))}

        {/* Trailing spacer */}
        <div className="exp__spacer" />
      </div>
    </section>
  );
};

export default Experience;
