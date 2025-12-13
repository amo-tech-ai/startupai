
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Search, Layout, FileText, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MotionDiv = motion.div as any;

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Analyze' | 'Deck' | 'Docs' | 'CRM'>('Analyze');

  return (
    <section className="relative pt-32 pb-12 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* 1. Large Block Grid Background */}
      <div className="absolute inset-0 bg-block-grid pointer-events-none mask-gradient-b opacity-40" />
      
      {/* 2. Sparkles (Floating Icons) */}
      <div className="absolute top-40 left-[15%] text-brand-500/80 animate-pulse hidden lg:block">
        <Sparkles size={40} strokeWidth={1.5} />
      </div>
      <div className="absolute top-40 right-[15%] text-brand-500/80 animate-pulse delay-700 hidden lg:block">
        <Sparkles size={40} strokeWidth={1.5} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-16">
          
          {/* Badge */}
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 mb-8 shadow-sm cursor-pointer hover:border-brand-200 hover:text-brand-600 transition-colors group"
          >
            <span className="text-xs font-semibold text-slate-700 group-hover:text-brand-600 transition-colors">
              2 Months Free — Annually
            </span>
            <div className="bg-slate-100 rounded-full p-0.5 group-hover:bg-brand-100 transition-colors">
                <ArrowRight size={12} className="text-slate-600 group-hover:text-brand-600" />
            </div>
          </MotionDiv>
          
          {/* Heading */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Turn startup ideas into <br />
              <span className="text-brand-500">investor-ready</span> assets
            </h1>
          </MotionDiv>
          
          {/* Subheading */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              Power your AI apps with clean web data from any website. <br className="hidden md:block"/>
              <span className="text-slate-400">It's also open source.</span>
            </p>
          </MotionDiv>

          {/* Interactive Input Mockup */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden relative z-20">
                {/* Input Area */}
                <div className="p-3 pl-4 flex flex-col md:flex-row items-center gap-4 bg-white relative z-20">
                    {/* URL Input */}
                    <div className="flex-1 w-full flex items-center gap-3">
                        <Globe className="text-slate-400 shrink-0" size={20} />
                        <input 
                            type="text" 
                            defaultValue="https://example.com"
                            className="w-full py-3 text-slate-700 text-lg outline-none font-medium placeholder-slate-300 bg-transparent"
                        />
                    </div>

                    <div className="h-8 w-px bg-slate-100 hidden md:block"></div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto">
                        {['Analyze', 'Deck', 'Docs', 'CRM'].map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                                        isActive 
                                        ? 'bg-slate-50 text-slate-900 shadow-sm border border-slate-200' 
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    {tab === 'Analyze' && <Search size={14} className={isActive ? 'text-brand-500' : ''} />}
                                    {tab === 'Deck' && <Layout size={14} className={isActive ? 'text-brand-500' : ''} />}
                                    {tab === 'Docs' && <FileText size={14} className={isActive ? 'text-brand-500' : ''} />}
                                    {tab === 'CRM' && <Users size={14} className={isActive ? 'text-brand-500' : ''} />}
                                    {tab}
                                </button>
                            )
                        })}
                    </div>

                    <button 
                        onClick={() => navigate('/onboarding')}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md shadow-brand-500/20 font-bold"
                    >
                        Generate <ArrowRight size={18} />
                    </button>
                </div>

                {/* Output Area Simulation (Faded code) */}
                <div className="border-t border-slate-100 bg-slate-50/50 p-6 text-left font-mono text-xs md:text-sm text-slate-400 overflow-hidden relative h-40">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white pointer-events-none"></div>
                    <div className="opacity-70 space-y-1.5">
                        <p className="flex gap-2"><span className="text-purple-600">const</span> response = <span className="text-purple-600">await</span> ai.analyze(<span className="text-green-600">'https://example.com'</span>);</p>
                        <p className="mb-4">console.log(response);</p>
                        <p className="text-slate-300">// Output</p>
                        <p className="text-slate-600">{`{`}</p>
                        <p className="pl-4 text-slate-600">"status": <span className="text-brand-500">"success"</span>,</p>
                        <p className="pl-4 text-slate-600">"data": {`{`}</p>
                        <p className="pl-8 text-slate-600">"valuation": <span className="text-blue-600">"$4.2M"</span>,</p>
                        <p className="pl-8 text-slate-600">"market_fit": <span className="text-blue-600">"Strong"</span>,</p>
                        <p className="pl-8 text-slate-600">"next_step": <span className="text-brand-500">"Generate Pitch Deck"</span></p>
                        <p className="pl-4 text-slate-600">{`}`}</p>
                        <p className="text-slate-600">{`}`}</p>
                    </div>
                </div>
            </div>
            
            {/* Background "Glow" behind the card */}
            <div className="absolute -inset-1 bg-brand-500/5 rounded-[2rem] blur-xl -z-10 translate-y-4"></div>
          </MotionDiv>

        </div>
      </div>
    </section>
  );
};

export default Hero;
