
import React from 'react';
import { Wand2, Bot, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

const AICapabilities: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-6">
         <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Built on Next-Gen AI</h2>
          <p className="text-slate-600">Proprietary models fine-tuned on thousands of successful startups.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "AI Wizard",
              desc: "Instant generation of complex financial models and pitch narratives.",
              icon: <Wand2 size={24} />,
            },
            {
              title: "Intelligent Copilot",
              desc: "A 24/7 strategic advisor that answers questions about your specific market.",
              icon: <Bot size={24} />,
            },
            {
              title: "Visual Agent",
              desc: "Transforms raw data into board-ready visualizations automatically.",
              icon: <Eye size={24} />,
            }
          ].map((cap, idx) => (
            <MotionDiv
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-brand-300 transition-colors shadow-sm group"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 mb-6 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                {cap.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{cap.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {cap.desc}
              </p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AICapabilities;
