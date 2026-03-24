import React from 'react';
import './Skills.css';

interface SkillGroup {
  category: string;
  icon: string;
  color: string;
  skills: string[];
}

const skillGroups: SkillGroup[] = [
  {
    category: 'AI / ML',
    icon: '🧠',
    color: '#7c3aed',
    skills: ['LangChain', 'LangGraph', 'LangFuse', 'RAG', 'Multi-Agent Systems', 'Prompt Engineering', 'OpenAI API', 'Embeddings', 'ChromaDB', 'Pinecone'],
  },
  {
    category: 'Languages',
    icon: '⌨️',
    color: '#00d4ff',
    skills: ['Python', 'TypeScript', 'JavaScript', 'SQL'],
  },
  {
    category: 'Frontend',
    icon: '🎨',
    color: '#f472b6',
    skills: ['React', 'Next.js', 'Tailwind CSS'],
  },
  {
    category: 'Backend & DevOps',
    icon: '⚙️',
    color: '#06b6d4',
    skills: ['FastAPI', 'Node.js', 'REST APIs', 'Docker', 'Git', 'GitHub Actions', 'Linux', 'PostgreSQL', 'MongoDB', 'Redis'],
  },
];

const Skills: React.FC = () => {
  return (
    <section id="skills" className="skills">
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

        <div className="skills-grid">
          {skillGroups.map((group, i) => (
            <div
              className="skill-card"
              key={group.category}
              data-aos="fade-up"
              data-aos-delay={i * 80}
              style={{ '--accent': group.color } as React.CSSProperties}
            >
              <div className="skill-card-header">
                <span className="skill-icon">{group.icon}</span>
                <h3 className="skill-category">{group.category}</h3>
              </div>
              <div className="skill-tags">
                {group.skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
