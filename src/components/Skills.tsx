import React, { useEffect, useRef } from 'react';
import './Skills.css';

interface SkillGroup {
  category: string;
  color: string;
  gradient: string;
  skills: { name: string; level: number }[];
}

const skillGroups: SkillGroup[] = [
  {
    category: 'AI / ML',
    color: '#7c3aed',
    gradient: 'linear-gradient(90deg, #7c3aed, #a855f7)',
    skills: [
      { name: 'LangChain / LangGraph', level: 92 },
      { name: 'RAG Pipelines', level: 90 },
      { name: 'Multi-Agent Systems', level: 88 },
      { name: 'OpenAI / Embeddings', level: 85 },
      { name: 'LangFuse Observability', level: 82 },
      { name: 'ChromaDB / Pinecone', level: 80 },
    ],
  },
  {
    category: 'Languages',
    color: '#00d4ff',
    gradient: 'linear-gradient(90deg, #00d4ff, #06b6d4)',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'TypeScript / JavaScript', level: 88 },
      { name: 'C++ / Assembly', level: 75 },
      { name: 'SQL', level: 80 },
    ],
  },
  {
    category: 'Frontend',
    color: '#f472b6',
    gradient: 'linear-gradient(90deg, #f472b6, #ec4899)',
    skills: [
      { name: 'React / Next.js', level: 88 },
      { name: 'Tailwind CSS', level: 85 },
      { name: 'Three.js / WebGL', level: 70 },
    ],
  },
  {
    category: 'Backend & DevOps',
    color: '#06b6d4',
    gradient: 'linear-gradient(90deg, #06b6d4, #0891b2)',
    skills: [
      { name: 'FastAPI / Node.js', level: 87 },
      { name: 'Docker / GitHub Actions', level: 82 },
      { name: 'PostgreSQL / Redis', level: 78 },
      { name: 'REST / WebSockets', level: 85 },
    ],
  },
];

const techIcons: { name: string; color: string }[] = [
  { name: 'Python', color: '#3b82f6' },
  { name: 'TypeScript', color: '#00d4ff' },
  { name: 'React', color: '#61dafb' },
  { name: 'FastAPI', color: '#009688' },
  { name: 'LangChain', color: '#7c3aed' },
  { name: 'LangGraph', color: '#a855f7' },
  { name: 'OpenAI', color: '#10a37f' },
  { name: 'Docker', color: '#2496ed' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'Redis', color: '#dc382d' },
  { name: 'ChromaDB', color: '#f472b6' },
  { name: 'GitHub Actions', color: '#22c55e' },
  { name: 'Next.js', color: '#ffffff' },
  { name: 'Three.js', color: '#06b6d4' },
  { name: 'LangFuse', color: '#fb923c' },
  { name: 'Pinecone', color: '#38bdf8' },
];

const Skills: React.FC = () => {
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            barRefs.current.forEach((bar, i) => {
              if (bar) {
                const level = bar.getAttribute('data-level') || '0';
                setTimeout(() => {
                  bar.style.width = level + '%';
                }, i * 60);
              }
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  let globalIndex = 0;

  return (
    <section id="skills" className="skills" ref={sectionRef}>
      <div className="container">
        <div data-aos="fade-up">
          <p className="section-label">What I Work With</p>
          <h2 className="section-title">
            My <span className="gradient-text">Tech Stack</span>
          </h2>
          <p className="section-subtitle">
            The tools and technologies I use to build intelligent products.
          </p>
        </div>

        {/* Skill bars grid */}
        <div className="skills-grid">
          {skillGroups.map((group, gi) => {
            const startIdx = globalIndex;
            globalIndex += group.skills.length;
            return (
              <div
                className="skill-card"
                key={group.category}
                data-aos="fade-up"
                data-aos-delay={gi * 80}
                style={{ '--accent': group.color } as React.CSSProperties}
              >
                <div className="skill-card-header">
                  <div className="skill-category-dot" style={{ background: group.color, boxShadow: `0 0 12px ${group.color}` }} />
                  <h3 className="skill-category">{group.category}</h3>
                </div>

                <div className="skill-bars">
                  {group.skills.map((skill, si) => {
                    const idx = startIdx + si;
                    return (
                      <div key={skill.name} className="skill-row">
                        <div className="skill-row-top">
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-pct" style={{ color: group.color }}>{skill.level}%</span>
                        </div>
                        <div className="skill-bar-track">
                          <div
                            className="skill-bar-fill"
                            data-level={skill.level}
                            style={{ background: group.gradient, width: '0%' }}
                            ref={(el) => { barRefs.current[idx] = el; }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="skill-card-glow" style={{ background: group.color }} />
              </div>
            );
          })}
        </div>

        {/* Icon cloud strip */}
        <div className="tech-strip" data-aos="fade-up" data-aos-delay="100">
          <p className="strip-label">Also familiar with</p>
          <div className="tech-icons">
            {techIcons.map((t, i) => (
              <span
                key={t.name}
                className="tech-pill"
                style={{ '--pill-color': t.color, animationDelay: `${i * 0.08}s` } as React.CSSProperties}
              >
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
