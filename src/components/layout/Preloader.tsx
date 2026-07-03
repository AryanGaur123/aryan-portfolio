import React, { useEffect, useState } from 'react';
import './Preloader.css';

export const GALAXY_READY_EVENT = 'ag:galaxy-ready';

/**
 * Branded load veil — holds until the WebGL scene has produced its first
 * frame (or 2.8s worst-case), so visitors never see the galaxy pop in.
 */
const Preloader: React.FC = () => {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setLeaving(true);
      setTimeout(() => setGone(true), 750);
    };

    window.addEventListener(GALAXY_READY_EVENT, finish);
    const failsafe = setTimeout(finish, 2800);
    return () => {
      window.removeEventListener(GALAXY_READY_EVENT, finish);
      clearTimeout(failsafe);
    };
  }, []);

  if (gone) return null;

  return (
    <div className={`preloader${leaving ? ' preloader--leaving' : ''}`} aria-hidden="true">
      <div className="preloader__mark">
        <span className="preloader__mono">AG</span>
        <span className="preloader__bar" />
      </div>
    </div>
  );
};

export default Preloader;
