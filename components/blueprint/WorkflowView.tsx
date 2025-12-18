
import React from 'react';
import { User, Cpu, Settings, CheckCircle, Globe, Search, Database, Sparkles, FileText } from 'lucide-react';

export const WorkflowView: React.FC = () => {
  return (
    <div className="space-y-12">
      <header className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2">System Flow View</h1>
        <h2 className="text-4xl font-serif font-bold text-slate-900">Agentic Automation Engine</h2>
        <p className="text-slate-500 mt-4 leading-relaxed">
          How StartupAI transforms raw founder input into an operational business operating system using the Gemini 3 intelligence layer.
        </p>
      </header>

      <div className="space-y-24 relative">
        {/* Connector Line Vertical (Desktop) */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 z-0"></div>

        {/* Workflow Node 1 */}
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="lg:text-right">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 inline-block max-w-md relative">
                <div className="absolute top-4 right-4 bg-indigo-50 text-indigo-600 p-2 rounded-lg"><User size={20}/></div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">User Action</h4>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Context Injection</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Founder enters landing page URL or rough problem statement into the Smart Intake Wizard.</p>
             </div>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">A</div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Model: Gemini 3 Pro</span>
             </div>
             <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-3 text-brand-500 font-bold text-xs uppercase"><Globe size={14}/> URL Context Tool</div>
                <p className="text-sm text-slate-400 leading-relaxed">AI performs real-time scraping and semantic analysis of the founder's online presence to extract industry, stage, and primary problem themes.</p>
             </div>
          </div>
        </div>

        {/* Workflow Node 2 */}
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 lg:text-right space-y-4">
             <div className="flex items-center gap-3 justify-end">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Model: Gemini 3 Pro</span>
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">B</div>
             </div>
             <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-3 text-emerald-500 font-bold text-xs uppercase"><Search size={14}/> Search Grounding</div>
                <p className="text-sm text-slate-400 leading-relaxed">Agent uses Google Search to find 2024/2025 market benchmarks, identifies real competitors, and validates valuation multiples for the sector.</p>
             </div>
          </div>
          <div className="order-1 lg:order-2">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 inline-block max-w-md relative">
                <div className="absolute top-4 left-4 bg-purple-50 text-purple-600 p-2 rounded-lg"><Cpu size={20}/></div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-right">AI Action</h4>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Market Intelligence Brief</h3>
                <p className="text-sm text-slate-500 leading-relaxed">AI synthesizes research into a "Reality Check" document with defensible numbers for investor review.</p>
             </div>
          </div>
        </div>

        {/* Workflow Node 3 */}
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="lg:text-right">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 inline-block max-w-md relative">
                <div className="absolute top-4 right-4 bg-brand-50 text-brand-600 p-2 rounded-lg"><FileText size={20}/></div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Asset Synthesis</h4>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Proposal Generation</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Intelligence Brief is converted into a 12-slide Sequoia-standard pitch deck and GTM roadmap.</p>
             </div>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">C</div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Model: Gemini 3 Pro</span>
             </div>
             <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-3 text-purple-500 font-bold text-xs uppercase"><Sparkles size={14}/> Structured Output</div>
                <p className="text-sm text-slate-400 leading-relaxed">Enforces strict JSON schema to ensure decks follow venture capital best practices without hallucination or formatting errors.</p>
             </div>
          </div>
        </div>

        {/* Final Node */}
        <div className="relative z-10 flex flex-col items-center">
           <div className="bg-emerald-500 text-white p-6 rounded-3xl shadow-2xl flex items-center gap-6 max-w-2xl border border-emerald-400">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm"><CheckCircle size={32} /></div>
              <div>
                  <h4 className="font-bold text-lg">Operational Automation</h4>
                  <p className="text-sm text-emerald-50 leading-relaxed">Founder enters the Dashboard. Gemini 3 Flash initializes the CRM, logs recent activity, and creates the first 10 roadmap tasks automatically.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Feature Table */}
      <section className="mt-32 pt-20 border-t border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">Gemini 3 Feature Mapping</h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                      <tr>
                          <th className="px-6 py-4">Process Step</th>
                          <th className="px-6 py-4">Gemini Model</th>
                          <th className="px-6 py-4">Core Feature</th>
                          <th className="px-6 py-4">Output</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      <tr>
                          <td className="px-6 py-4 font-bold text-slate-900">Smart Intake</td>
                          <td className="px-6 py-4">3 Pro</td>
                          <td className="px-6 py-4">URL Context</td>
                          <td className="px-6 py-4 text-slate-500">StartupDTO (Context)</td>
                      </tr>
                      <tr>
                          <td className="px-6 py-4 font-bold text-slate-900">Reality Check</td>
                          <td className="px-6 py-4">3 Pro</td>
                          <td className="px-6 py-4">Search Grounding</td>
                          <td className="px-6 py-4 text-slate-500">IntelligenceBrief.md</td>
                      </tr>
                      <tr>
                          <td className="px-6 py-4 font-bold text-slate-900">Deck Architect</td>
                          <td className="px-6 py-4">3 Pro</td>
                          <td className="px-6 py-4">Structured Output</td>
                          <td className="px-6 py-4 text-slate-500">PresentationJSON</td>
                      </tr>
                      <tr>
                          <td className="px-6 py-4 font-bold text-slate-900">Ops Manager</td>
                          <td className="px-6 py-4">3 Flash</td>
                          <td className="px-6 py-4">Function Calling</td>
                          <td className="px-6 py-4 text-slate-500">Database Action</td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </section>
    </div>
  );
};
