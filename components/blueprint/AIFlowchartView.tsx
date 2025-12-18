
import React from 'react';
import { Database, Search, Globe, Layout, Cpu, Zap, Mail, Calendar, Sparkles } from 'lucide-react';

export const AIFlowchartView: React.FC = () => {
  return (
    <div className="space-y-12">
      <header className="mb-12">
        <h1 className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2">Agentic Logic</h1>
        <h2 className="text-4xl font-serif font-bold text-slate-900">AI Flowchart & Tooling</h2>
      </header>

      <div className="bg-slate-900 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Legend */}
          <div className="absolute top-8 right-8 flex gap-4">
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-brand-500"></div> Trigger
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Intelligence
              </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-16">
              
              {/* Layer 1: Input */}
              <div className="flex flex-col items-center">
                  <div className="bg-white/10 border border-white/20 p-6 rounded-2xl text-center backdrop-blur-md">
                      <div className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-1">Trigger Event</div>
                      <h4 className="font-bold text-lg">User Input (URL / Vision)</h4>
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-white/20 to-indigo-500"></div>
              </div>

              {/* Layer 2: Core Processing */}
              <div className="flex flex-col items-center">
                  <div className="bg-indigo-600 p-8 rounded-3xl shadow-xl flex items-center gap-8 relative">
                      <div className="absolute -inset-1 bg-white/20 rounded-[2rem] blur-xl opacity-20"></div>
                      <div className="text-center relative z-10">
                          <Cpu size={32} className="mx-auto mb-4" />
                          <h4 className="font-bold">Gemini 3 Pro</h4>
                          <p className="text-xs text-indigo-200 mt-1 uppercase tracking-widest">Orchestrator</p>
                      </div>
                      
                      <div className="h-20 w-px bg-white/20"></div>

                      <div className="space-y-4 relative z-10">
                          <div className="flex items-center gap-3 bg-black/20 p-2 pr-4 rounded-xl border border-white/10">
                              <div className="p-2 bg-emerald-500 rounded-lg"><Search size={14}/></div>
                              <span className="text-xs font-bold">Google Search Grounding</span>
                          </div>
                          <div className="flex items-center gap-3 bg-black/20 p-2 pr-4 rounded-xl border border-white/10">
                              <div className="p-2 bg-blue-500 rounded-lg"><Globe size={14}/></div>
                              <span className="text-xs font-bold">URL Context Analysis</span>
                          </div>
                      </div>
                  </div>
                  <div className="w-px h-12 bg-indigo-500"></div>
              </div>

              {/* Layer 3: Decision & Action */}
              <div className="grid md:grid-cols-3 gap-8">
                  <FlowAction 
                    icon={<Presentation size={20}/>} 
                    title="Asset Gen" 
                    desc="Sequoia Decks & Memos"
                    sub="Structured Output"
                  />
                  <FlowAction 
                    icon={<Database size={20}/>} 
                    title="DB Hydration" 
                    desc="CRM & Metrics population"
                    sub="Function Calling"
                  />
                  <FlowAction 
                    icon={<Calendar size={20}/>} 
                    title="Ops Planning" 
                    desc="Event workback schedules"
                    sub="Gemini 3 Flash"
                  />
              </div>

          </div>
      </div>
    </div>
  );
};

const FlowAction = ({ icon, title, desc, sub }: any) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all text-center group">
        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h5 className="font-bold mb-1">{title}</h5>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">{desc}</p>
        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 py-1 rounded-full border border-white/5">{sub}</div>
    </div>
);

const Presentation = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>
);
