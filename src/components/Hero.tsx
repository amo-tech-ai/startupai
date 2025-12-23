
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Globe, Sparkles, Loader2, Cpu, Search, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MotionDiv = motion.div as any;

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: <Search size={14}/>, label: "Searching Market Comps", color: "text-emerald-500" },
    { icon: <Database size={14}/>, label: "Grounding Traction Data", color: "text-blue-500" },
    { icon: <Cpu size={14}/>, label: "Thinking Level: High", color: "text-purple-500" }
  ];

  const handleStart = () => {
    if (!url) return;
    setIsAnalyzing(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step >= steps.length - 1) {
        clearInterval(interval);
        setTimeout(() => navigate('/onboarding'), 800);
      } else {
        step++;
        setCurrentStep(step);
      }
    }, 1200);
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-block-grid pointer-events-none mask-gradient-b opacity-40" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 mb-8 shadow-sm"
          >
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Introducing StartupExamine v4.0
            </span>
            <div className="bg-brand-100 rounded-full p-0.5">
                <ArrowRight size={12} className="text-brand-600" />
            </div>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-slate-900 tracking-tight leading-[0.95] mb-8 font-serif">
              The <span className="text-brand-500 italic">Audit</span> that <br />
              secures your round.
            </h1>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl"
          >
            <p className="text-xl text-slate-500 mb-12 leading-relaxed font-medium">
              StartupExamine uses Gemini 3 Pro to deep-scan your startup idea, benchmark it against the real world, and build your entire fundraising suite in minutes.
            </p>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-3xl mx-auto relative"
          >
            <div className="bg-slate-900 p-2 rounded-[2rem] shadow-2xl overflow-hidden relative border border-slate-800">
                <div className="bg-white rounded-[1.5rem] p-4 flex items-center gap-4">
                    <div className="flex-1 flex items-center gap-3 pl-4">
                        <Globe className="text-slate-300" size={24} />
                        <input 
                            type="text" 
                            placeholder="Paste your URL or Vision..."
                            className="w-full py-3 text-slate-900 text-xl outline-none font-serif placeholder-slate-300"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleStart}
                        disabled={isAnalyzing}
                        className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-2xl transition-all shadow-xl shadow-brand-500/20 font-bold text-lg flex items-center gap-2 disabled:opacity-50"
                    >
                        {isAnalyzing ? <Loader2 size={24} className="animate-spin" /> : "Examine"}
                    </button>
                </div>

                <AnimatePresence>
                  {isAnalyzing && (
                    <MotionDiv
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="p-6 border-t border-slate-800"
                    >
                      <div className="flex flex-col items-start gap-4">
                        {steps.map((step, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-center gap-3 transition-all duration-500 ${idx === currentStep ? 'opacity-100 scale-105' : idx < currentStep ? 'opacity-50' : 'opacity-20'}`}
                          >
                            <div className={`p-1.5 rounded-lg bg-white/5 ${step.color}`}>
                              {step.icon}
                            </div>
                            <span className="text-sm font-mono font-bold text-slate-300 uppercase tracking-widest">
                              {step.label}
                            </span>
                            {idx === currentStep && <Sparkles size={14} className="text-brand-400 animate-pulse" />}
                          </div>
                        ))}
                      </div>
                    </MotionDiv>
                  )}
                </AnimatePresence>
            </div>
            
            <div className="absolute -inset-10 bg-brand-500/10 rounded-[4rem] blur-3xl -z-10 translate-y-8"></div>
          </MotionDiv>

        </div>
      </div>
    </section>
  );
};

export default Hero;
