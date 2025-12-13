
import React from 'react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

const KPISection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
      {/* Grid Pattern overlay for dark mode */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {[
            { label: 'Faster Creation', value: '75%', suffix: '' },
            { label: 'Investor Meetings', value: '2.5', suffix: 'x' },
            { label: 'Founder Satisfaction', value: '98', suffix: '%' }
          ].map((stat, idx) => (
            <MotionDiv 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                className="pt-8 md:pt-0 px-4"
            >
              <div className="text-5xl md:text-6xl font-bold mb-2 text-white tracking-tight font-mono">
                <span className="text-brand-500">{stat.value}</span>{stat.suffix}
              </div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KPISection;
