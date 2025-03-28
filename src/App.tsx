import React, { useEffect } from 'react';
import Layout from './components/layout/Layout';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import { Analytics } from "@vercel/analytics/react"
// import Testimonials from './components/sections/Testimonials';
import Contact from './components/sections/Contact';

const App: React.FC = () => {
  // Preload any necessary assets or data
  useEffect(() => {
    // You can add preloading logic here if needed
    document.title = 'Aryan Gaur | Software Engineer';
  }, []);

  return (
    <Layout>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      {/* <Testimonials /> */}
      <Contact />
    </Layout>
  );
};

export default App;
