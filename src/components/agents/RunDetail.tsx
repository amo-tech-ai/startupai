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
  ExternalLink,
  Code,
  Zap,
  Loader2,
  Clock,
  PlayCircle,
  CheckCircle2
} from 'lucide-react';
import { AgentRun, AgentRunStatus } from '../../types';

interface RunDetailProps {
  run: AgentRun;
  onClose: () => void;
}

const MotionDiv = motion.div as any;

// Fix: Added interface for reasoning chain steps to ensure type consistency
interface ChainStep {
  id: string;
  title: string;
  desc: string;
  status: 'complete' | 'active' | 'error';
  toolIcon?: React.ReactNode;
}

export const RunDetail: React.FC<RunDetailProps> = ({ run, onClose }) => {
  const getChainSteps = (status: AgentRunStatus): ChainStep[] => {
    // Fix: Explicitly typed the steps array to allow varied status and optional toolIcon
    const steps: ChainStep[] = [
      { id: 'init', title: "Initialization", desc: "Agent workspace initialized and context loaded.", status: 'complete' },
    ];

    if (status === 'queued') {
      steps.push({ id: 'queue', title: "Wait Queue", desc: "Awaiting available worker process.", status: 'active' });
    } else {
      steps[0].status = 'complete';
    }

    if (status === 'running' || status === 'complete' || status === 'needs_user' || status === 'approved' || status === 'executing') {
      steps.push({ 
        id: 'tool_search', 
        title: "Market Search", 
        desc: "Google Search grounding active for sector benchmarks.", 
        // Fix: Ensured status is within the allowed literal union
        status: status === 'running' ? 'active' : 'complete',
        toolIcon: <Globe size={12}/>
      });
    }

    if (status === 'complete' || status === 'needs_user' || status === 'approved' || status === 'executing') {
      steps.push({ 
        id: 'synthesis', 
        title: "Synthesis", 
        desc: "Constructing proposed data structure and reasoning.", 
        // Fix: Ensured status is within the allowed literal union
        status: (status === 'complete' || status === 'approved' || status === 'executing') ? 'complete' : 'active',
        toolIcon: <Code size={12}/>
      });
    }

    if (status === 'needs_user') {
      steps.push({ id: 'user_wait', title: "Founder Review", desc: "Paused for human oversight. Approval required.", status: 'active' });
    }

    if (status === 'approved' || status === 'executing' || status === 'complete') {
      steps.push({ 
        id: 'approved_step', 
        title: "Action Approved", 
        desc: "Execution signal received from founder.", 
        status: (status === 'executing' || status === 'complete') ? 'complete' : 'active', 
        toolIcon: <PlayCircle size={12}/> 
      });
    }

    if (status === 'executing') {
      steps.push({ id: 'executing_step', title: "Writing to Database", desc: "Committing transactional changes to the startup graph.", status: 'active', toolIcon: <Zap size={12}/> });
    }

    if (status === 'complete') {
      steps.push({ id: 'final', title: "Run Complete", desc: "All artifacts generated and persisted.", status: 'complete', toolIcon: <CheckCircle2 size={12}/> });
    }

    if (status === 'error') {
      steps.push({ id: 'err', title: "Fatal Exception", desc: "Agent encountered a logical block or service timeout.", status: 'error' });
    }

    return steps;
  };

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
            {getChainSteps(run.status).map((step) => (
              <StepNode 
                key={step.id}
                title={step.title} 
                desc={step.desc} 
                status={step.status} 
                toolIcon={step.toolIcon}
              />
            ))}
          </div>
        </section>

        {/* Proposed Writes / Artifacts */}
        {(run.status === 'needs_user' || run.status === 'approved' || run.status === 'executing' || run.status === 'complete') && (
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Database size={14} /> Artifact Manifest
            </h3>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Target Table: Decks</span>
                <ShieldCheck size={16} className="text-indigo-600" />
              </div>
              
              <div className="bg-white rounded-xl p-3 border border-indigo-100 text-xs space-y-2 shadow-sm">
                <div className="flex justify-between text-slate-400 font-bold uppercase tracking-tighter">
                  <span>Draft Update</span>
                  <span className="text-indigo-400">JSON Artifact</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {run.payload.template ? `Applying ${run.payload.template} structure...` : 'Synthesized market findings applied to pitch deck.'}
                </p>
              </div>

              {run.status === 'needs_user' && (
                <button className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  Approve Proposed Write <ArrowRight size={14}/>
                </button>
              )}
            </div>
          </section>
        )}

        {/* Citations */}
        {run.result?.sources && (
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Globe size={14} /> Grounding Citations
            </h3>
            <div className="space-y-2">
              <CitationLink url="https://sequoiacap.com/pitch-deck-guide" title="Sequoia Capital Best Practices" />
              <CitationLink url="https://ycombinator.com/library" title="YC Startup Library 2024" />
            </div>
          </section>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
        <button className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-white transition-all">
          Replay
        </button>
        <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">
          Cancel
        </button>
      </div>
    </MotionDiv>
  );
};

const StepNode = ({ title, desc, status, toolIcon }: any) => {
  const dotColor = status === 'complete' ? 'border-emerald-500 bg-emerald-500' : 
                   status === 'active' ? 'border-indigo-600 bg-white' : 
                   status === 'error' ? 'border-rose-500 bg-rose-500' : 'border-slate-200 bg-white';
  
  return (
    <div className="relative">
      <div className={`absolute -left-[31.5px] top-1 w-2.5 h-2.5 rounded-full border-2 transition-colors ${dotColor}`}>
        {status === 'active' && <div className="w-full h-full rounded-full bg-indigo-600 animate-ping opacity-75"></div>}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className={`text-sm font-bold ${status === 'active' ? 'text-indigo-600' : 'text-slate-900'}`}>{title}</h4>
          {toolIcon && <div className="p-1 bg-slate-100 rounded text-slate-500">{toolIcon}</div>}
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

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
