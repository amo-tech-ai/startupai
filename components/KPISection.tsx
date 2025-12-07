
import React from 'react';
import { motion } from 'framer-motion';

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

const KPISection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {[
            { label: 'Faster Creation', value: '75%', color: 'text-emerald-400' },
            { label: 'More Investor Meetings', value: '50%', color: 'text-indigo-400' },
            { label: 'Founder Satisfaction', value: '98%', color: 'text-amber-400' }
          ].map((stat, idx) => (
            <MotionDiv 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                className="pt-8 md:pt-0 px-4"
            >
              <div className={`text-5xl md:text-6xl font-bold mb-2 ${stat.color} tracking-tight`}>
                {stat.value}
              </div>
              <div className="text-lg text-slate-400 font-medium tracking-wide uppercase text-sm">
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
