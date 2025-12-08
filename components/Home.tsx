
import React from 'react';
import Hero from './Hero';
import Features from './Features';
import Workflow from './Workflow';
import AICapabilities from './AICapabilities';
import KPISection from './KPISection';
import Testimonials from './Testimonials';
import FinalCTA from './FinalCTA';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      <Workflow />
      <AICapabilities />
      <KPISection />
      <Testimonials />
      <FinalCTA />
    </>
  );
};

export default Home;
