
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Cpu, FileText, CheckCircle2 } from 'lucide-react';

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

const Workflow: React.FC = () => {
  const steps = [
    {
      id: 1,
      icon: <Database className="text-indigo-600" />,
      label: "Input Data",
      sub: "URLs, PDFs, Notes"
    },
    {
      id: 2,
      icon: <Cpu className="text-purple-600" />,
      label: "AI Processing",
      sub: "Deep Analysis"
    },
    {
      id: 3,
      icon: <FileText className="text-teal-600" />,
      label: "Output Generation",
      sub: "Strategy & Docs"
    },
    {
      id: 4,
      icon: <CheckCircle2 className="text-emerald-600" />,
      label: "CRM Tracking",
      sub: "Execution"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary-600 font-semibold tracking-wider text-sm uppercase">How it works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">From raw chaos to structured success</h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <MotionDiv
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Node */}
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border-2 border-slate-100 flex items-center justify-center mb-6 relative group-hover:border-primary-500 transition-colors duration-300 z-10">
                   {/* Animated ring on hover */}
                   <span className="absolute inset-0 rounded-2xl border-2 border-primary-500 scale-100 opacity-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500"></span>
                   <div className="transform group-hover:scale-110 transition-transform duration-300">
                     {step.icon}
                   </div>
                   
                   {/* Mobile Arrow */}
                   {index < steps.length - 1 && (
                     <div className="md:hidden absolute -bottom-10 left-1/2 -translate-x-1/2 text-slate-300">
                        <ArrowRight size={24} className="rotate-90" />
                     </div>
                   )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{step.label}</h3>
                <p className="text-sm text-slate-500">{step.sub}</p>

                {/* Desktop Arrow Overlay (except last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-slate-300 z-0">
                    <ArrowRight size={24} />
                  </div>
                )}
              </MotionDiv>
            ))}
          </div>

          {/* Decorative pulse moving along the line */}
           <MotionDiv 
            className="hidden md:block absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 z-0 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            initial={{ width: '0%' }}
            whileInView={{ width: '100%' }}
            transition={{ duration: 2, ease: "linear", delay: 0.5 }}
            viewport={{ once: true }}
           />
        </div>
      </div>
    </section>
  );
};

export default Workflow;
