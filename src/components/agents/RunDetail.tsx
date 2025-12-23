
import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Terminal, 
  Play, 
  Database, 
  Globe, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { AgentRun } from '../../types';

interface RunDetailProps {
  run: AgentRun;
  onClose: () => void;
}

const MotionDiv = motion.div as any;

export const RunDetail: React.FC<RunDetailProps> = ({ run, onClose }) => {
  return (
    <MotionDiv
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-[480px] bg-white border-l border-slate-200 shadow-2xl flex flex-col z-20 shrink-0"
    >
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="font-bold text-slate-900">{run.agentName}</h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">ID: {run.id}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Step Timeline */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Terminal size={14} /> Reasoning Chain
          </h3>
          
          <div className="space-y-6 relative ml-3 border-l-2 border-slate-100 pl-6">
            <StepNode 
              title="Initialization" 
              desc="Agent injected with Startup Context and Pitch template." 
              status="complete" 
            />
            <StepNode 
              title="Tool Use: Google Search" 
              desc="Scanning 'Market Benchmarks 2025' for Sequoia alignment." 
              status="complete" 
              toolIcon={<Globe size={12}/>}
            />
            <StepNode 
              title="Drafting Proposal" 
              desc="Synthesizing Problem/Solution narrative into structured JSON." 
              status={run.status === 'needs_approval' ? 'active' : 'complete'} 
              toolIcon={<Sparkles size={12}/>}
            />
            {run.status === 'needs_approval' && (
              <StepNode 
                title="Awaiting Human Oversight" 
                desc="Proposed writes require founder confirmation." 
                status="pending" 
              />
            )}
          </div>
        </section>

        {/* Proposed Writes / Artifacts */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Database size={14} /> Proposed Writes
          </h3>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Target Table: Decks</span>
              <ShieldCheck size={16} className="text-indigo-600" />
            </div>
            
            <div className="bg-white rounded-xl p-3 border border-indigo-100 text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Problem Statement</span>
                <span className="text-indigo-400">Update</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                "Fragmeted data is leading to 40% loss in ops efficiency for early-stage teams..."
              </p>
            </div>

            <button className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              Approve Proposed Write <ArrowRight size={14}/>
            </button>
          </div>
        </section>

        {/* Citations */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Globe size={14} /> Grounding Citations
          </h3>
          <div className="space-y-2">
            <CitationLink url="https://sequoiacap.com/pitch-deck-guide" title="Sequoia Capital Best Practices" />
            <CitationLink url="https://ycombinator.com/library" title="YC Startup Library 2024" />
          </div>
        </section>
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
        <button className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-white transition-all">
          Replay Step
        </button>
        <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">
          Cancel Run
        </button>
      </div>
    </MotionDiv>
  );
};

const StepNode = ({ title, desc, status, toolIcon }: any) => (
  <div className="relative">
    <div className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border-2 bg-white ${
      status === 'complete' ? 'border-emerald-500' : 
      status === 'active' ? 'border-indigo-600' : 'border-slate-200'
    }`}></div>
    <div>
      <div className="flex items-center gap-2 mb-0.5">
        <h4 className={`text-sm font-bold ${status === 'active' ? 'text-indigo-600' : 'text-slate-900'}`}>{title}</h4>
        {toolIcon && <div className="p-1 bg-slate-100 rounded text-slate-500">{toolIcon}</div>}
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const CitationLink = ({ url, title }: any) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noreferrer"
    className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:text-indigo-600 transition-colors">
        <Globe size={14}/>
      </div>
      <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 truncate max-w-[280px]">{title}</span>
    </div>
    <ExternalLink size={12} className="text-slate-300 group-hover:text-indigo-600" />
  </a>
);
