import React from 'react';
import './Contact.css';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-inner" data-aos="fade-up">
          <h2 className="contact-heading">
            Let's talk.
          </h2>
          <p className="contact-sub">
            Whether it's something cool you're building, a question about AI,
            or just want to connect — my inbox is open.
          </p>
          <a href="mailto:gauraryan1027@gmail.com" className="contact-email">
            gauraryan1027@gmail.com
          </a>
          <div className="contact-links">
            <a href="https://github.com/AryanGaur123" target="_blank" rel="noopener noreferrer" className="contact-link">
              GitHub
            </a>
            <span className="contact-dot" />
            <a href="https://linkedin.com/in/gauraryan" target="_blank" rel="noopener noreferrer" className="contact-link">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
