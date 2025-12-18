
import React from 'react';
import { User, Rocket, Search, Calendar, Shield, ArrowRight, Settings } from 'lucide-react';

export const JourneyView: React.FC = () => {
  const journeys = [
    {
      id: 'alex',
      name: "The First-Time Founder (Alex)",
      entry: "Home Page (Marketing)",
      steps: ["Home", "AI Wizard (Inputs URL)", "Proposal (Sees Deck)", "Pricing (Subscribes)", "Dashboard"],
      ai: "Pro performs 'Reality Check' on market sizing during intake.",
      automation: "Populates CRM with first 3 competitors found via Search.",
      outcome: "Alex goes from an idea to a persistent investor data room in < 10 mins."
    },
    {
      id: 'sarah',
      name: "The Returning Operator (Sarah)",
      entry: "App Dashboard",
      steps: ["Dashboard", "Events Hub", "Event Wizard", "Logistics Review", "Dashboard (Tasks)"],
      ai: "Flash auto-generates 50 operational tasks for her upcoming Demo Day.",
      automation: "Schedules email outreach to CRM contacts automatically.",
      outcome: "Sarah manages a complex physical event without a dedicated ops team."
    },
    {
      id: 'mark',
      name: "The Investor (Mark)",
      entry: "Public Shared Link (/s/:id)",
      steps: ["Public Startup Profile", "AI Brief Summary", "Request Intro"],
      ai: "Read-only Assistant summarizes 'Health Score' & Risks based on latest data.",
      automation: "Triggers a notification to Alex that Mark is viewing the deck.",
      outcome: "Mark makes an informed 'Yes/No' decision on a meeting in < 30 seconds."
    }
  ];

  return (
    <div className="space-y-16">
      <header className="mb-12">
        <h1 className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2">Journey Mapping</h1>
        <h2 className="text-4xl font-serif font-bold text-slate-900">End-to-End User Experience</h2>
      </header>

      <div className="space-y-12">
        {journeys.map((j, i) => (
          <div key={j.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row h-full">
            <div className={`p-8 lg:w-1/3 ${i === 0 ? 'bg-indigo-600' : i === 1 ? 'bg-slate-900' : 'bg-emerald-600'} text-white flex flex-col justify-center`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        {i === 0 ? <Rocket size={24}/> : i === 1 ? <Calendar size={24}/> : <Shield size={24}/>}
                    </div>
                    <h3 className="text-xl font-bold leading-tight">{j.name}</h3>
                </div>
                <div className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-widest opacity-60">Entry Point</div>
                    <div className="text-sm font-medium">{j.entry}</div>
                    <div className="h-px bg-white/10 w-full"></div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-60">Outcome</div>
                    <div className="text-sm font-medium">{j.outcome}</div>
                </div>
            </div>

            <div className="p-8 flex-1 bg-white">
                <div className="mb-10">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Execution Path</h4>
                    <div className="flex flex-wrap items-center gap-4">
                        {j.steps.map((step, idx) => (
                            <React.Fragment key={idx}>
                                <span className={`text-xs font-bold px-4 py-2 rounded-xl border ${idx === 0 ? 'bg-slate-50 border-slate-200' : idx === j.steps.length - 1 ? 'bg-brand-50 border-brand-200 text-brand-600' : 'bg-white border-slate-100'}`}>
                                    {step}
                                </span>
                                {idx < j.steps.length - 1 && <ArrowRight size={14} className="text-slate-300 shrink-0" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                        <div className="flex items-center gap-2 mb-2 text-purple-600 font-bold text-[10px] uppercase tracking-widest">
                            <Cpu size={14} /> AI Intervention
                        </div>
                        <p className="text-sm text-purple-900 leading-relaxed">{j.ai}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                        <div className="flex items-center gap-2 mb-2 text-amber-600 font-bold text-[10px] uppercase tracking-widest">
                            {/* Fixed error: Imported Settings from lucide-react */}
                            <Settings size={14} /> Automation Triggered
                        </div>
                        <p className="text-sm text-amber-900 leading-relaxed">{j.automation}</p>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Cpu = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
);
