import React, { useRef, useEffect } from 'react';
import './Experience.css';

interface Role {
  title: string;
  company: string;
  period: string;
  bullets: string[];
  tags: string[];
}

const roles: Role[] = [
  {
    title: 'AI / Software Engineering Intern',
    company: 'SanDisk — GenAI Team',
    period: '2025 — Present',
    bullets: [
      'Building RAG pipelines for internal knowledge retrieval across proprietary documentation.',
      'Designing multi-agent architectures with LangGraph — stateful orchestration, memory, planning, tool use.',
      'Integrating LangFuse for end-to-end LLM tracing and evaluation across GenAI workflows.',
      'Shipping full-stack tooling with React, TypeScript, and FastAPI to surface AI capabilities internally.',
    ],
    tags: ['Python', 'LangGraph', 'LangChain', 'LangFuse', 'RAG', 'FastAPI', 'React', 'TypeScript'],
  },
  {
    title: 'B.S. Computer Science',
    company: 'San Jose State University',
    period: '2023 — 2027',
    bullets: [
      'Studying CS with a focus on AI/ML, systems programming, and algorithms.',
      'Coursework spanning Verilog, C++, Assembly, and digital design.',
    ],
    tags: ['Python', 'C++', 'Java', 'Verilog', 'Assembly'],
  },
];

const Experience: React.FC = () => {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && lineRef.current) {
          lineRef.current.classList.add('animate');
        }
      },
      { threshold: 0.1 },
    );
    if (lineRef.current) observer.observe(lineRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="experience">
      <div className="container">
        <div className="exp-header" data-aos="fade-up">
          <span className="section-label">Work & Education</span>
        </div>

        <div className="exp-list">
          {roles.map((role, i) => (
            <div
              key={role.company}
              className="exp-item"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              {/* Left: meta */}
              <div className="exp-meta">
                <span className="exp-period">{role.period}</span>
              </div>

              {/* Right: content */}
              <div className="exp-content">
                <h3 className="exp-title">{role.title}</h3>
                <p className="exp-company">{role.company}</p>
                <ul className="exp-bullets">
                  {role.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
                <div className="exp-tags">
                  {role.tags.map(t => (
                    <span key={t} className="exp-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
