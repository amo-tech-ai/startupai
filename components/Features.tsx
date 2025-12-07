import React from 'react';
import { PenTool, BrainCircuit, BarChart2, Workflow } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <PenTool className="w-6 h-6 text-indigo-600" />,
    title: "Creation Tools",
    desc: "Generate pitch decks, business plans, and financial models instantly with guided AI prompts.",
    delay: 0.1
  },
  {
    icon: <BrainCircuit className="w-6 h-6 text-purple-600" />,
    title: "Intelligence Engine",
    desc: "Our neural core analyzes millions of data points to validate your market fit before you launch.",
    delay: 0.2
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-teal-600" />,
    title: "Insights & Analytics",
    desc: "Real-time dashboarding for your startup's health, tracking burn rate, CAC, and LTV automatically.",
    delay: 0.3
  },
  {
    icon: <Workflow className="w-6 h-6 text-rose-600" />,
    title: "Automation & CRM",
    desc: "Connect to your favorite tools. Automate follow-ups, investor updates, and task management.",
    delay: 0.4
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Powerhouse features for serious founders</h2>
            <p className="text-lg text-slate-600">Everything you need to go from idea to IPO, packed into one elegant interface.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: feature.delay }}
                    className="group bg-slate-50 hover:bg-white rounded-2xl p-8 border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                >
                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">
                        {feature.desc}
                    </p>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Features;