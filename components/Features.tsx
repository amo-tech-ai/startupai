
import React from 'react';
import { PenTool, BrainCircuit, BarChart2, Workflow, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

// Workaround for strict type checking issues
const MotionDiv = motion.div as any;

const features = [
  {
    icon: <PenTool size={24} />,
    title: "Generative Decks",
    desc: "Create Sequoia-standard pitch decks in seconds. AI structures your narrative, designs slides, and writes speaker notes.",
    delay: 0.1
  },
  {
    icon: <BrainCircuit size={24} />,
    title: "Market Intelligence",
    desc: "Gemini 3 Pro scans the live web to validate your TAM, find competitors, and benchmark your valuation.",
    delay: 0.2
  },
  {
    icon: <BarChart2 size={24} />,
    title: "Financial Modeling",
    desc: "Project revenue, burn rate, and runway. Our engine builds defensible financial models automatically.",
    delay: 0.3
  },
  {
    icon: <Workflow size={24} />,
    title: "Founder CRM",
    desc: "Track investor conversations and follow-ups. Automated pipeline management for your fundraising round.",
    delay: 0.4
  },
  {
    icon: <Calendar size={24} />,
    title: "Event Operations",
    desc: "Plan demo days and mixers with an AI ops manager. Auto-generate budgets, timelines, and marketing assets.",
    delay: 0.5
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">The Operating System for Founders</h2>
            <p className="text-lg text-slate-600">Everything you need to go from idea to IPO, packed into one intelligent interface.</p>
        </div>

        {/* Using auto-fit grid to handle 5 items gracefully */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 justify-center">
            {features.map((feature, idx) => (
                <MotionDiv
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: feature.delay }}
                    className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-300"
                >
                    <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-6 text-brand-500 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {feature.desc}
                    </p>
                </MotionDiv>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
