
import React from 'react';
import { ArrowRight, Globe, Zap, Presentation, CreditCard, LayoutDashboard, Search } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const cards = [
    {
      name: "Home",
      route: "/",
      purpose: "Brand vision and entry point for new founders.",
      primary: "Get Started",
      secondary: "Watch Demo",
      ai: "No",
      next: "/services"
    },
    {
      name: "Services",
      route: "/features",
      purpose: "Educational hub and feature showcase.",
      primary: "Try for Free",
      secondary: "Compare Plans",
      ai: "No",
      next: "/onboarding"
    },
    {
      name: "AI Brief Wizard",
      route: "/onboarding",
      purpose: "Smart intake using URL Context and Search Grounding.",
      primary: "Generate Brief",
      secondary: "Manual Entry",
      ai: "Yes (Gemini 3 Pro)",
      next: "/pitch-decks/:id"
    },
    {
      name: "Proposal Preview",
      route: "/pitch-decks/:id",
      purpose: "Aha! moment where users see generated deck.",
      primary: "Save & Continue",
      secondary: "Refine with AI",
      ai: "Yes (Structured Output)",
      next: "/pricing"
    },
    {
      name: "Booking & Payment",
      route: "/pricing",
      purpose: "Plan selection and Stripe checkout.",
      primary: "Subscribe Now",
      secondary: "Contact Sales",
      ai: "No",
      next: "/dashboard"
    },
    {
      name: "Dashboard",
      route: "/dashboard",
      purpose: "Founder Command Center for daily ops.",
      primary: "View Insights",
      secondary: "Add Task",
      ai: "Yes (Gemini 3 Flash)",
      next: "/crm, /events"
    }
  ];

  return (
    <div className="space-y-12">
      <header className="mb-12">
        <h1 className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2">Architectural Blueprint</h1>
        <h2 className="text-4xl font-serif font-bold text-slate-900">Site Architecture & Routing</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-brand-500 transition-all group flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded-lg text-slate-500 font-mono uppercase tracking-tighter">
                Route: {card.route}
              </span>
              {card.ai === "Yes (Gemini 3 Pro)" || card.ai === "Yes (Structured Output)" || card.ai === "Yes (Gemini 3 Flash)" ? (
                <span className="text-purple-600 text-[10px] font-bold uppercase flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-100">
                  <Zap size={10} fill="currentColor" /> AI Powered
                </span>
              ) : (
                <span className="text-slate-400 text-[10px] font-bold uppercase bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">Static</span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">{card.name}</h3>
            <p className="text-sm text-slate-500 mb-8 flex-1 leading-relaxed">{card.purpose}</p>
            
            <div className="space-y-3 pt-6 border-t border-slate-50">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase">Primary CTA</span>
                <span className="font-bold text-slate-900">{card.primary}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase">AI Involved</span>
                <span className={`font-bold ${card.ai.includes('Yes') ? 'text-purple-600' : 'text-slate-600'}`}>{card.ai}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase">Next Screen</span>
                <span className="font-bold text-brand-600 flex items-center gap-1">{card.next} <ArrowRight size={10}/></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conversion Flow Bar */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="shrink-0 flex items-center gap-2 ml-4">
           <Zap className="text-brand-500" size={20} fill="currentColor" />
           <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Conversion Flow</span>
        </div>
        <div className="flex-1 flex items-center px-4 w-full overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
           {[
             { label: 'Discovery', route: '/' },
             { label: 'Intelligence', route: '/onboarding' },
             { label: 'Generation', route: '/pitch-decks' },
             { label: 'Transaction', route: '/pricing' },
             { label: 'Operations', route: '/dashboard' }
           ].map((step, idx) => (
             <React.Fragment key={idx}>
               <div className="flex flex-col items-center min-w-[100px]">
                 <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${idx === 4 ? 'text-brand-500' : 'text-slate-500'}`}>{step.label}</span>
                 <div className={`w-2 h-2 rounded-full ${idx === 4 ? 'bg-brand-500 shadow-[0_0_10px_rgba(255,106,61,0.8)]' : 'bg-slate-700'}`}></div>
               </div>
               {idx < 4 && <div className="h-0.5 bg-slate-800 flex-grow mx-2 min-w-[20px]"></div>}
             </React.Fragment>
           ))}
        </div>
      </div>
    </div>
  );
};
