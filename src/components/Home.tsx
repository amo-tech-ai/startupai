
import React from 'react';
import Hero from './Hero';
import ScrollStory from './ScrollStory';
import AILogicFlow from './AILogicFlow';
import Features from './Features';
import AICapabilities from './AICapabilities';
import KPISection from './KPISection';
import Testimonials from './Testimonials';
import FinalCTA from './FinalCTA';

const Home: React.FC = () => {
  return (
    <div className="bg-white overflow-x-hidden">
      <Hero />
      <ScrollStory />
      <AILogicFlow />
      <Features />
      <AICapabilities />
      <KPISection />
      <Testimonials />
      <FinalCTA />
    </div>
  );
};

export default Home;
