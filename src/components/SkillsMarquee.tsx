import React from 'react';
import './SkillsMarquee.css';

const ROW_AI = ['Python', 'LangGraph', 'LangChain', 'RAG', 'FastAPI', 'React', 'TypeScript', 'GenAI'];
const ROW_HW = ['Verilog', 'FPGA', 'C++', 'Assembly', 'Computer Architecture', 'Embedded Systems', 'Digital Design'];

const Row: React.FC<{ items: string[]; reverse?: boolean; hollow?: boolean }> = ({ items, reverse, hollow }) => {
  const content = (ariaHidden: boolean) => (
    <span className="skills-mq__seq" aria-hidden={ariaHidden || undefined}>
      {items.map(s => (
        <span key={s} className={`skills-mq__item${hollow ? ' skills-mq__item--hollow' : ''}`}>
          {s}<span className="skills-mq__dot">·</span>
        </span>
      ))}
    </span>
  );
  return (
    <div className={`skills-mq__row${reverse ? ' skills-mq__row--reverse' : ''}`}>
      <div className="skills-mq__track">
        {content(false)}
        {content(true) /* duplicate for the seamless -50% loop */}
      </div>
    </div>
  );
};

/** Two counter-scrolling skill strips — the software life and the hardware life. */
const SkillsMarquee: React.FC = () => (
  <section className="skills-mq" aria-label="Skills">
    <Row items={ROW_AI} />
    <Row items={ROW_HW} reverse hollow />
  </section>
);

export default SkillsMarquee;
