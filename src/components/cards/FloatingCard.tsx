import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTilt } from '../../hooks/useTilt';
import { CardData } from './cardData';
import './FloatingCard.css';

interface FloatingCardProps {
  card: CardData;
  /** Position in the grid — drives entrance direction + float phase */
  index: number;
  /** Rendered in the card's media slot (the 3D logo canvas) */
  media?: (hovered: boolean) => React.ReactNode;
}

/**
 * Three nested layers, each owned by exactly one animation system:
 *   .fcard-wrap  — GSAP scroll entrance + parallax (Experience.tsx)
 *   .fcard-float — Framer Motion infinite idle levitation
 *   .exp__card   — Framer Motion pointer tilt springs
 * Separate elements so no two systems ever write the same transform.
 */
const FloatingCard: React.FC<FloatingCardProps> = ({ card, index, media }) => {
  const { rotateX, rotateY, onPointerMove, onPointerLeave } = useTilt(6);
  const [hovered, setHovered] = useState(false);

  /* Tilt + cursor-spotlight share one pointermove: the tilt springs get the
     normalized offset, the spotlight gets raw px via CSS vars. */
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove(e);
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div className="fcard-wrap" data-card-index={index}>
      <motion.div
        className="fcard-float"
        animate={{ y: [0, -9, 0, -4, 0] }}
        transition={{
          duration: 7 + index * 1.6,
          delay: index * 0.9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.div
          className="exp__card fcard"
          data-hover
          style={{ rotateX, rotateY, transformPerspective: 1000 }}
          onPointerMove={handlePointerMove}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => { setHovered(false); onPointerLeave(); }}
        >
          <div className="exp__card-shine" aria-hidden="true" />
          <div className="exp__card-spot" aria-hidden="true" />

          <div className="exp__card-top">
            <span className="exp__num">{card.num}</span>
            <span className="exp__type">{card.type}</span>
          </div>

          {media && <div className="fcard__media">{media(hovered)}</div>}

          <div className="exp__card-body">
            <p className="exp__period">{card.period}</p>
            <h3 className="exp__role">{card.role}</h3>
            <p className="exp__company">{card.company}</p>
          </div>

          <div className="exp__divider" />

          <ul className="exp__bullets">
            {card.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>

          <div className="exp__stack">
            {card.stack.map(s => (
              <span key={s} className="exp__tag">{s}</span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FloatingCard;
