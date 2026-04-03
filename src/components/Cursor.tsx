import React, { useEffect, useRef } from 'react';
import './Cursor.css';

const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const followerPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    const animate = () => {
      followerPosRef.current.x += (posRef.current.x - followerPosRef.current.x) * 0.12;
      followerPosRef.current.y += (posRef.current.y - followerPosRef.current.y) * 0.12;
      follower.style.left = followerPosRef.current.x + 'px';
      follower.style.top = followerPosRef.current.y + 'px';
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const onEnter = () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    };
    const onLeave = () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    };

    document.addEventListener('mousemove', onMove);
    document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor-dot" />
      <div ref={followerRef} className="cursor-ring" />
    </>
  );
};

export default Cursor;
