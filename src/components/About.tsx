import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="about" data-aos="fade-up">
      <div className="container">
        <div className="about-grid">
          {/* ─── Text column ─────────────────────────────── */}
          <div className="about-text">
            <p className="section-label">Who I Am</p>
            <h2 className="section-title">
              Building the future,<br />
              <span className="gradient-text">one line at a time.</span>
            </h2>
            <p className="about-bio">
              Hi, I'm <strong>Aryan Gaur</strong> — an AI Engineer and Software Developer with a passion for
              building intelligent systems that solve real problems. I thrive at the intersection of machine
              learning and software engineering, turning complex ideas into elegant, scalable products.
            </p>
            <p className="about-bio">
              Currently studying Computer Science at SJSU and interning on the GenAI team at SanDisk, I
              spend my time exploring LLMs, multi-agent systems, RAG pipelines, and full-stack development.
              Great software is both technically sound and beautifully crafted.
            </p>

            <div className="about-links">
              <a href="https://github.com/AryanGaur123" target="_blank" rel="noopener noreferrer" className="about-link">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a href="https://linkedin.com/in/gauraryan" target="_blank" rel="noopener noreferrer" className="about-link">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
              <a href="mailto:gauraryan1027@gmail.com" className="about-link">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
            </div>

            {/* GitHub contributions chart */}
            <div className="github-chart" data-aos="fade-up" data-aos-delay="100">
              <p className="chart-label">GitHub Activity</p>
              <img
                src="https://ghchart.rshah.org/00d4ff/AryanGaur123"
                alt="Aryan's GitHub contribution chart"
                className="contrib-chart"
              />
            </div>
          </div>

          {/* ─── Code card ───────────────────────────────── */}
          <div className="about-card" data-aos="fade-left" data-aos-delay="120">
            <div className="about-card-inner">
              <div className="about-card-header">
                <div className="about-card-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <span className="about-card-file">aryan.profile.ts</span>
              </div>
              <div className="about-card-code">
                <div className="code-line">
                  <span className="c-key">const</span> <span className="c-var">aryan</span>
                  <span className="c-punc"> = {'{'}</span>
                </div>
                <div className="code-line indent">
                  <span className="c-prop">role</span><span className="c-punc">:</span>{' '}
                  <span className="c-str">"AI Engineer & SWE"</span><span className="c-punc">,</span>
                </div>
                <div className="code-line indent">
                  <span className="c-prop">company</span><span className="c-punc">:</span>{' '}
                  <span className="c-str">"SanDisk (GenAI)"</span><span className="c-punc">,</span>
                </div>
                <div className="code-line indent">
                  <span className="c-prop">location</span><span className="c-punc">:</span>{' '}
                  <span className="c-str">"San Jose, CA"</span><span className="c-punc">,</span>
                </div>
                <div className="code-line indent">
                  <span className="c-prop">education</span><span className="c-punc">:</span>{' '}
                  <span className="c-str">"SJSU · B.S. CS"</span><span className="c-punc">,</span>
                </div>
                <div className="code-line indent">
                  <span className="c-prop">focus</span><span className="c-punc">: [</span>
                </div>
                <div className="code-line indent2"><span className="c-str">"Machine Learning"</span><span className="c-punc">,</span></div>
                <div className="code-line indent2"><span className="c-str">"LangGraph / RAG"</span><span className="c-punc">,</span></div>
                <div className="code-line indent2"><span className="c-str">"Multi-Agent Systems"</span><span className="c-punc">,</span></div>
                <div className="code-line indent2"><span className="c-str">"Full-Stack Dev"</span><span className="c-punc">,</span></div>
                <div className="code-line indent"><span className="c-punc">],</span></div>
                <div className="code-line indent">
                  <span className="c-prop">openTo</span><span className="c-punc">:</span>{' '}
                  <span className="c-bool">true</span><span className="c-punc">,</span>
                </div>
                <div className="code-line indent">
                  <span className="c-prop">grad</span><span className="c-punc">:</span>{' '}
                  <span className="c-str">"May 2027"</span><span className="c-punc">,</span>
                </div>
                <div className="code-line">
                  <span className="c-punc">{'}'}</span>
                  <span className="c-cursor">|</span>
                </div>
              </div>

              {/* Live status strip */}
              <div className="card-status">
                <span className="status-dot" />
                <span>open to new roles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
