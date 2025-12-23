
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Cpu, Database, CheckCircle, ArrowRight } from 'lucide-react';

const MotionDiv = motion.div as any;

const AILogicFlow: React.FC = () => {
  return (
    <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <span className="text-brand-500 font-bold uppercase tracking-[0.3em] text-xs mb-4">Under the Hood</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">Agentic Forensics</h2>
          <p className="text-slate-400 max-w-2xl font-medium">How Gemini 3 Pro orchestrates multi-tool reasoning to build your startup's core intelligence.</p>
        </div>

        <div className="max-w-5xl mx-auto space-y-16">
          
          <div className="flex flex-col items-center">
            <MotionDiv
              whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
              className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md text-center"
            >
              <div className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-1">Trigger</div>
              <h4 className="font-bold text-lg">URL Context Injection</h4>
            </MotionDiv>
            <div className="w-px h-12 bg-gradient-to-b from-brand-500 to-indigo-500"></div>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center gap-12 relative">
                <div className="absolute -inset-1 bg-white/20 rounded-[3.5rem] blur-xl opacity-20"></div>
                
                <div className="text-center relative z-10">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Cpu size={32} />
                    </div>
                    <h4 className="font-bold text-xl">Gemini 3 Pro</h4>
                    <p className="text-xs text-indigo-200 mt-1 font-mono">Thinking Level: High</p>
                </div>
                
                <div className="hidden md:block h-20 w-px bg-white/20"></div>

                <div className="grid grid-cols-1 gap-4 relative z-10">
                    <div className="flex items-center gap-4 bg-black/20 p-3 pr-6 rounded-2xl border border-white/10">
                        <div className="p-2 bg-emerald-500 rounded-lg"><Search size={16}/></div>
                        <span className="text-sm font-bold">Search Grounding</span>
                    </div>
                    <div className="flex items-center gap-4 bg-black/20 p-3 pr-6 rounded-2xl border border-white/10">
                        <div className="p-2 bg-blue-500 rounded-lg"><Globe size={16}/></div>
                        <span className="text-sm font-bold">URL Context Analysis</span>
                    </div>
                </div>
            </div>
            <div className="w-px h-12 bg-indigo-500"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <LogicCard 
                icon={<Database size={24} />} 
                title="Data Room" 
                desc="Populates metrics, cap tables, and legal structures." 
                type="Transaction"
            />
            <LogicCard 
                icon={<Presentation size={24} />} 
                title="Deck Suite" 
                desc="Drafts a complete 12-slide narrative with speaker notes." 
                type="Generation"
            />
            <LogicCard 
                icon={<CheckCircle size={24} />} 
                title="Dashboard" 
                desc="Initializes daily founder tasks and roadmap." 
                type="Operation"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

const LogicCard = ({ icon, title, desc, type }: any) => (
    <MotionDiv
        whileHover={{ y: -10 }}
        className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm transition-all text-center group"
    >
        <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-400 group-hover:bg-brand-500 group-hover:text-white transition-colors">
            {icon}
        </div>
        <h5 className="font-bold text-lg mb-2">{title}</h5>
        <p className="text-sm text-slate-400 leading-relaxed mb-6">{desc}</p>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 bg-white/5 py-1.5 rounded-full inline-block px-4">{type}</div>
    </MotionDiv>
);

const Presentation = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>
);

export default AILogicFlow;
