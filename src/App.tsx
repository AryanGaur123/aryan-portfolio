import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 60, easing: 'ease-out-quart' });
  }, []);

  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
