import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { scrollState } from '../lib/lenis';
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
const SkillsMarquee: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);

  /* Scroll-velocity skew — the strips lean into the scroll like they have
     inertia, then spring back upright as the smoothing settles. Runs on
     gsap.ticker so it stays in lockstep with everything else GSAP drives. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rows = rootRef.current?.querySelectorAll<HTMLElement>('.skills-mq__row');
    if (!rows?.length) return;

    let skew = 0;
    const tick = () => {
      const target = gsap.utils.clamp(-6, 6, scrollState.velocity * 0.14);
      skew += (target - skew) * 0.09;
      // Snap the sub-hundredth remainder so idle frames write a clean 0
      if (Math.abs(skew) < 0.01 && target === 0) skew = 0;
      rows.forEach((r) => { r.style.transform = `skewX(${skew}deg)`; });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <section className="skills-mq" aria-label="Skills" ref={rootRef}>
      <Row items={ROW_AI} />
      <Row items={ROW_HW} reverse hollow />
    </section>
  );
};

export default SkillsMarquee;
