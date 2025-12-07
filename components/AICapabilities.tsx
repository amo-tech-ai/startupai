
import React from 'react';
import { Wand2, Bot, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

const AICapabilities: React.FC = () => {
  const capabilities = [
    {
      title: "AI Wizard",
      desc: "Instant generation of complex financial models and pitch narratives.",
      icon: <Wand2 size={24} className="text-white" />,
      color: "bg-indigo-500",
      gradient: "from-indigo-500 to-indigo-600"
    },
    {
      title: "Intelligent Copilot",
      desc: "A 24/7 strategic advisor that answers questions about your specific market.",
      icon: <Bot size={24} className="text-white" />,
      color: "bg-purple-500",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Visual Agent",
      desc: "Transforms raw data into board-ready visualizations automatically.",
      icon: <Eye size={24} className="text-white" />,
      color: "bg-teal-500",
      gradient: "from-teal-500 to-teal-600"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
         <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Built on the next-gen AI stack</h2>
          <p className="text-slate-600">Our proprietary models are fine-tuned on thousands of successful startups.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {capabilities.map((cap, idx) => (
            <MotionDiv
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group relative rounded-2xl overflow-hidden border border-slate-100 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Gradient Top Line */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${cap.gradient}`} />
              
              <div className={`w-12 h-12 rounded-xl ${cap.color} shadow-lg shadow-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {cap.icon}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3">{cap.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {cap.desc}
              </p>

              {/* Hover Effect Light */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/0 to-slate-50/50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AICapabilities;
