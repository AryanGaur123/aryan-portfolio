import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import SkillsMarquee from './components/SkillsMarquee';
import Contact from './components/Contact';
import Footer from './components/Footer';
import GalaxyBackground from './components/scene/GalaxyBackground';
import FallbackBackground from './components/scene/FallbackBackground';
import CustomCursor from './components/layout/CustomCursor';
import CommandPalette from './components/layout/CommandPalette';
import Preloader from './components/layout/Preloader';
import { initLenis } from './lib/lenis';
import { useDeviceTier } from './hooks/useDeviceTier';
import { useReducedMotion } from './hooks/useReducedMotion';
import './App.css';

const App: React.FC = () => {
  const tier = useDeviceTier();
  const reducedMotion = useReducedMotion();

  useEffect(() => initLenis(), []);

  return (
    <>
      <Preloader />
      <CommandPalette />
      {tier === 'fallback' ? (
        <FallbackBackground />
      ) : (
        <GalaxyBackground tier={tier} reducedMotion={reducedMotion} />
      )}
      <div className="grain" aria-hidden="true" />
      <CustomCursor />
      <Header />
      <main className="site-content">
        <Hero />
        <Experience />
        <SkillsMarquee />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default App;
