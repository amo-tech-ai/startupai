
import React from 'react';
import { 
  Cpu, 
  Plus, 
  ShieldCheck, 
  Settings2, 
  ChevronRight, 
  Zap, 
  BarChart3,
  Bot
} from 'lucide-react';

export const AgentSidebar: React.FC = () => {
  return (
    <div className="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 hidden xl:flex">
      <div className="p-8 space-y-10">
        
        {/* Actions */}
        <section>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Agent Actions</h3>
          <button className="w-full flex items-center justify-between p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all group mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl"><Plus size={18}/></div>
              <span className="font-bold text-sm">Launch New Agent</span>
            </div>
            <Zap size={16} fill="currentColor" className="opacity-40 group-hover:opacity-100 transition-opacity" />
          </button>
        </section>

        {/* Approval Queue */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Approval Queue</h3>
            <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-full">1 Pending</span>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 border-dashed">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-white rounded-xl shadow-sm text-amber-500 border border-amber-100">
                <ShieldCheck size={18}/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">Deck Architect</div>
                <div className="text-[10px] text-slate-500 uppercase mt-0.5">Proposed DB Write</div>
              </div>
            </div>
            <button className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all">
              Inspect Proposal
            </button>
          </div>
        </section>

        {/* Models & Configuration */}
        <section>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Agent Architecture</h3>
          <div className="space-y-4">
            <ConfigRow icon={<Cpu size={14}/>} label="Primary Model" value="Gemini 3 Pro" />
            <ConfigRow icon={<Settings2 size={14}/>} label="Orchestrator" value="Edge (Deno)" />
            <ConfigRow icon={<BarChart3 size={14}/>} label="Token Budget" value="Unlimited" />
          </div>
        </section>

        {/* Mermaid Diagram Area (Visual Placeholder) */}
        <section className="pt-8">
           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">State Lifecycle</h3>
           <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-[10px] font-mono text-indigo-400 space-y-1">
              <div>stateDiagram-v2</div>
              <div className="pl-2">queued --&gt; running</div>
              <div className="pl-2">running --&gt; needs_user</div>
              <div className="pl-2">running --&gt; needs_approval</div>
              <div className="pl-2">needs_approval --&gt; running</div>
              <div className="pl-2">running --&gt; complete</div>
              <div className="text-slate-600 italic mt-4">// Governor: Human gate active</div>
           </div>
        </section>

      </div>
    </div>
  );
};

const ConfigRow = ({ icon, label, value }: any) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
    <div className="flex items-center gap-2 text-slate-500">
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </div>
    <span className="text-xs font-bold text-slate-900">{value}</span>
  </div>
);
