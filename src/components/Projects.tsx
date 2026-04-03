import React, { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import './Projects.css';

interface Project {
  title: string;
  description: string;
  longDesc: string;
  tech: string[];
  github?: string;
  accent: string;
  accentAlt: string;
  icon: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: 'NeuroRAG',
    description: 'Adaptive Multi-Step RAG Agent',
    longDesc:
      'A self-corrective RAG system using LangGraph state machines with query rewriting, hallucination detection, and LangFuse observability. Features a streaming FastAPI backend and React chat UI for real-time document Q&A.',
    tech: ['Python', 'LangGraph', 'LangChain', 'LangFuse', 'ChromaDB', 'FastAPI', 'React', 'TypeScript'],
    github: 'https://github.com/AryanGaur123/NeuroRAG',
    accent: '#7c3aed',
    accentAlt: '#a855f7',
    icon: '🧠',
    featured: true,
  },
  {
    title: 'AgentMesh',
    description: 'Autonomous Multi-Agent Research System',
    longDesc:
      'A LangGraph-orchestrated multi-agent system with specialized Orchestrator, Search, Analyst, Writer, and Critic agents that collaborate in real-time to produce deep research reports via WebSocket streaming.',
    tech: ['Python', 'LangGraph', 'LangChain', 'LangFuse', 'FastAPI', 'WebSockets', 'React', 'TypeScript'],
    github: 'https://github.com/AryanGaur123/AgentMesh',
    accent: '#00d4ff',
    accentAlt: '#06b6d4',
    icon: '⚡',
    featured: true,
  },
  {
    title: 'CodeSentinel',
    description: 'AI-Powered Code Review Agent',
    longDesc:
      'GitHub-integrated AI code review agent using LangGraph pipelines for security analysis, performance review, and architectural feedback. Automatically posts structured inline PR comments on every pull request.',
    tech: ['Python', 'LangGraph', 'LangFuse', 'ChromaDB', 'FastAPI', 'PyGithub', 'React'],
    github: 'https://github.com/AryanGaur123/CodeSentinel',
    accent: '#f472b6',
    accentAlt: '#ec4899',
    icon: '🛡️',
    featured: true,
  },
  {
    title: 'LiftLedger',
    description: 'Powerlifting Analytics Dashboard',
    longDesc:
      'Powerlifting analytics platform that connects to Google Drive, parses training spreadsheets, and calculates weekly volume per lift. Features progressive overload tracking and custom PR visualizations.',
    tech: ['Python', 'React', 'TypeScript', 'Google Drive API', 'FastAPI', 'Chart.js'],
    github: 'https://github.com/AryanGaur123/liftledger',
    accent: '#22c55e',
    accentAlt: '#16a34a',
    icon: '🏋️',
    featured: false,
  },
];

const GitHubIcon = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    VanillaTilt.init(el, {
      max: 8,
      speed: 600,
      glare: true,
      'max-glare': 0.12,
      perspective: 1000,
    });
    return () => {
      if ((el as any).vanillaTilt) (el as any).vanillaTilt.destroy();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`project-card ${project.featured ? 'featured' : ''}`}
      data-aos="fade-up"
      data-aos-delay={index * 90}
      style={{ '--accent': project.accent, '--accent-alt': project.accentAlt } as React.CSSProperties}
    >
      {/* Glow border on hover */}
      <div className="card-glow-border" />

      <div className="project-card-top">
        {/* Header row */}
        <div className="project-icon-row">
          <div className="project-icon-badge">
            <span className="project-icon-emoji">{project.icon}</span>
          </div>
          <div className="project-links">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-link github-btn"
                aria-label="GitHub"
              >
                <GitHubIcon />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>

        <h3 className="project-title">{project.title}</h3>
        <p className="project-short">{project.description}</p>
        <p className="project-desc">{project.longDesc}</p>
      </div>

      <div className="project-tech">
        {project.tech.map((t) => (
          <span key={t} className="tech-badge">{t}</span>
        ))}
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  return (
    <section id="projects" className="projects">
      <div className="container">
        <div data-aos="fade-up">
          <p className="section-label">What I've Built</p>
          <h2 className="section-title">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle">
            AI systems I've engineered — from adaptive RAG agents to autonomous multi-agent pipelines.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        <div className="projects-cta" data-aos="fade-up">
          <a
            href="https://github.com/AryanGaur123"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <GitHubIcon />
            View All on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
