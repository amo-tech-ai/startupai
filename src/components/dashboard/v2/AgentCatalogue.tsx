
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Search, 
  Layout, 
  Zap, 
  BarChart3, 
  Info,
  Microscope,
  Compass,
  PenTool,
  Image as ImageIcon,
  Activity
} from 'lucide-react';

const MotionDiv = motion.div as any;

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  tech: string;
}

const agents: Agent[] = [
  {
    id: 'analyst',
    name: 'The Analyst',
    role: 'Financial Forensics',
    description: 'Scans transaction data and Stripe exports to calculate true burn rate, MRR, and runway with Python-driven precision.',
    icon: <Microscope size={18} />,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    tech: 'Gemini 3 Pro + Code Execution'
  },
  {
    id: 'scout',
    name: 'The Scout',
    role: 'Market Intelligence',
    description: 'Performs real-time competitive analysis and VC thesis matching using live Google Search Grounding for 2025 benchmarks.',
    icon: <Compass size={18} />,
    color: 'text-blue-600 bg-blue-50 border-blue-100',
    tech: 'Gemini 3 Pro + Search Grounding'
  },
  {
    id: 'architect',
    name: 'The Architect',
    role: 'Narrative & Pitch',
    description: 'Structures complex business visions into Sequoia-standard pitch narratives using high-depth thinking models.',
    icon: <PenTool size={18} />,
    color: 'text-purple-600 bg-purple-50 border-purple-100',
    tech: 'Gemini 3 Pro + High Thinking'
  },
  {
    id: 'visualizer',
    name: 'The Visualizer',
    role: 'Asset Generation',
    description: 'Instantly creates 16:9 investor visuals and brand-aligned social assets for demo days and product launches.',
    icon: <ImageIcon size={18} />,
    color: 'text-rose-600 bg-rose-50 border-rose-100',
    tech: 'Gemini 2.5 Flash Image'
  },
  {
    id: 'operator',
    name: 'The Operator',
    role: 'Task Automation',
    description: 'Automates logistics and workback schedules, identifying date conflicts and creating tactical founder roadmaps.',
    icon: <Zap size={18} />,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    tech: 'Gemini 3 Flash'
  }
];

export const AgentCatalogue: React.FC = () => {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
            <Cpu size={20} className="text-indigo-600" />
            <h3 className="font-serif font-bold text-[#1A1A1A]">Your AI Team</h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">
            Agentic OS v4.0
        </span>
      </div>

      <div className="space-y-2">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="relative"
            onMouseEnter={() => setHoveredAgent(agent.id)}
            onMouseLeave={() => setHoveredAgent(null)}
          >
            <MotionDiv
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-help ${
                hoveredAgent === agent.id 
                ? 'bg-slate-50 border-indigo-200 shadow-sm' 
                : 'bg-white border-transparent'
              }`}
            >
              <div className={`p-2 rounded-lg border ${agent.color} shrink-0`}>
                {agent.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#1A1A1A]">{agent.name}</div>
                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{agent.role}</div>
              </div>
              <div className={`transition-opacity duration-300 ${hoveredAgent === agent.id ? 'opacity-100' : 'opacity-0'}`}>
                 <Info size={14} className="text-indigo-400" />
              </div>
            </MotionDiv>

            <AnimatePresence>
              {hoveredAgent === agent.id && (
                <MotionDiv
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 right-0 top-full z-50 mt-2 p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800"
                >
                  <p className="text-xs leading-relaxed text-slate-300 mb-3">
                    {agent.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Engine</span>
                    <span className="text-[10px] font-bold text-slate-400">{agent.tech}</span>
                  </div>
                  {/* Tooltip Arrow */}
                  <div className="absolute -top-1 left-6 w-2 h-2 bg-slate-900 border-l border-t border-slate-800 rotate-45"></div>
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100">
          <button className="w-full py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all flex items-center justify-center gap-2 group">
              Manage Multi-Agent Workflows
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
      </div>
    </div>
  );
};

const ChevronRight = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);
