import React from 'react';
import './Experience.css';

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  type: string;
  description: string[];
  tech: string[];
}

const experiences: ExperienceItem[] = [
  {
    role: 'AI Engineer Intern — GenAI Team',
    company: 'SanDisk',
    period: 'May 2025 – Present',
    type: 'Internship',
    description: [
      'Built complex RAG pipelines for internal knowledge retrieval, enabling engineers to query proprietary documentation with high accuracy.',
      'Designed multi-agent architectures using LangGraph with stateful orchestration, supporting memory, planning, and tool-use across deep agent systems.',
      'Integrated LangFuse observability for end-to-end LLM tracing and evaluation across all GenAI workflows.',
      'Developed full-stack tooling with React, TypeScript, and FastAPI to surface AI capabilities to internal teams.',
    ],
    tech: ['Python', 'LangGraph', 'LangChain', 'LangFuse', 'RAG', 'FastAPI', 'React', 'TypeScript'],
  },
  {
    role: 'B.S. Computer Science',
    company: 'San Jose State University (SJSU)',
    period: '2023 – May 2027',
    type: 'Education',
    description: [
      'Studying Computer Science with a focus on AI/ML, algorithms, and systems programming.',
      'Building AI and full-stack projects spanning LLM engineering, multi-agent systems, and web development.',
      'Expected graduation: May 2027.',
    ],
    tech: ['Python', 'C++', 'Java', 'SQL', 'Algorithms', 'Data Structures'],
  },
];

const Experience: React.FC = () => {
  return (
    <section id="experience" className="experience">
      <div className="container">
        <div data-aos="fade-up">
          <p className="section-label">My Journey</p>
          <h2 className="section-title">
            Experience &amp; <span className="gradient-text">Education</span>
          </h2>
          <p className="section-subtitle">
            Where I've worked and what I've studied.
          </p>
        </div>

        <div className="timeline">
          {experiences.map((exp, i) => (
            <div
              className="timeline-item"
              key={exp.role + exp.company}
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="timeline-connector">
                <div className="timeline-dot" />
                {i < experiences.length - 1 && <div className="timeline-line" />}
              </div>

              <div className="timeline-card">
                <div className="timeline-card-header">
                  <div>
                    <span className="timeline-type">{exp.type}</span>
                    <h3 className="timeline-role">{exp.role}</h3>
                    <p className="timeline-company">{exp.company}</p>
                  </div>
                  <span className="timeline-period">{exp.period}</span>
                </div>

                <ul className="timeline-bullets">
                  {exp.description.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>

                <div className="timeline-tech">
                  {exp.tech.map((t) => (
                    <span key={t} className="tech-badge">{t}</span>
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
