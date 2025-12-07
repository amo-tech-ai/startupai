
import React from 'react';
import { PenTool, Workflow, Database, Target, Layout, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

const features = [
  {
    icon: <PenTool size={32} />,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    dot: "bg-indigo-500",
    title: "AI Pitch Deck Generator",
    desc: "Create Sequoia-standard pitch decks in minutes. Our AI analyzes your business model and generates slide content, selects charts, and drafts speaker notes automatically.",
    list: ["Export to PDF & PPTX", "AI-Generated Visuals"]
  },
  {
    icon: <Workflow size={32} />,
    color: "text-purple-600",
    bg: "bg-purple-50",
    dot: "bg-purple-500",
    title: "Intelligent CRM",
    desc: "Manage your fundraising pipeline and sales deals with a Kanban board designed for speed. Track probability, owner, and next actions with zero friction.",
    list: ["Visual Pipeline", "Deal Forecasting"]
  },
  {
    icon: <Layout size={32} />,
    color: "text-teal-600",
    bg: "bg-teal-50",
    dot: "bg-teal-500",
    title: "AI Document Writer",
    desc: "Draft Investment Memos, One-Pagers, and GTM Strategies instantly. Our \"AI Companion\" side-panel helps refine, expand, or simplify text on the fly.",
    list: ["Context-Aware Drafting", "One-Click Refinement"]
  },
  {
    icon: <Database size={32} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    dot: "bg-blue-500",
    title: "Market Intelligence",
    desc: "Powered by Gemini 3, our engine performs real-time web searches to validate your TAM, identify competitors, and find industry valuation multiples.",
    list: ["Real-Time Search Grounding", "Competitor Analysis"]
  },
  {
    icon: <Target size={32} />,
    color: "text-rose-600",
    bg: "bg-rose-50",
    dot: "bg-rose-500",
    title: "Strategic Auto-Pilot",
    desc: "Don't know what to do next? Our AI analyzes your stage and generates a tailored roadmap of high-priority tasks to move the needle.",
    list: ["AI Roadmap Generation", "Priority Scoring"]
  },
  {
    icon: <ShieldCheck size={32} />,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
    title: "Secure & Private",
    desc: "Your proprietary data is safe. We use enterprise-grade encryption and Row Level Security to ensure your startup secrets stay secret.",
    list: ["RLS Architecture", "Encrypted Storage"]
  }
];

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">The Operating System for Founders</h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                StartupAI consolidates the fragmented toolstack of modern founders into one intelligent, cohesive platform.
                </p>
            </MotionDiv>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
                <MotionDiv
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="group bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col md:flex-row gap-6 items-start hover:-translate-y-1"
                >
                    <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center shrink-0 ${feature.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        {feature.icon}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{feature.title}</h3>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            {feature.desc}
                        </p>
                        <ul className="space-y-2">
                            {feature.list.map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                    <div className={`w-1.5 h-1.5 rounded-full ${feature.dot}`}></div> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </MotionDiv>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
