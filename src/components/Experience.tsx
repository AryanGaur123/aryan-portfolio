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
    role: 'AI Engineering Intern',
    company: 'Tech Company',
    period: 'Summer 2025',
    type: 'Internship',
    description: [
      'Built and deployed LLM-powered features using RAG pipelines, reducing support ticket volume by 30%.',
      'Designed and optimized vector search infrastructure using Pinecone and OpenAI embeddings.',
      'Collaborated with product team to ship AI features used by thousands of users.',
    ],
    tech: ['Python', 'LangChain', 'Pinecone', 'OpenAI', 'FastAPI'],
  },
  {
    role: 'Software Engineering Intern',
    company: 'Startup',
    period: 'Summer 2024',
    type: 'Internship',
    description: [
      'Developed React components and REST APIs for a B2B SaaS platform serving enterprise clients.',
      'Improved frontend performance by 40% through code splitting and memoization.',
      'Implemented CI/CD pipeline with GitHub Actions and containerized services with Docker.',
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    role: 'CS/CE Student',
    company: 'San José State University',
    period: '2022 – Present',
    type: 'Education',
    description: [
      'Studying Computer Engineering with a focus on AI/ML and systems programming.',
      'Built multiple class projects spanning embedded systems, data structures, and machine learning.',
      'Active member of the SJSU Engineering club and open-source community.',
    ],
    tech: ['C++', 'Python', 'Assembly', 'VHDL', 'MATLAB'],
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
