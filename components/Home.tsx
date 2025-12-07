
import React from 'react';
import Hero from './Hero';
import Features from './Features';
import Workflow from './Workflow';
import AICapabilities from './AICapabilities';
import KPISection from './KPISection';
import Testimonials from './Testimonials';
import FinalCTA from './FinalCTA';
import { PageType } from '../types';

interface HomeProps {
  setPage?: (page: PageType) => void;
}

const Home: React.FC<HomeProps> = ({ setPage }) => {
  return (
    <>
      <Hero />
      <Features />
      <Workflow />
      <AICapabilities />
      <KPISection />
      <Testimonials />
      <FinalCTA setPage={setPage} />
    </>
  );
};

export default Home;
