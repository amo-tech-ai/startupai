import React from 'react';
import { 
  Cpu, 
  Microscope,
  Compass,
  PenTool,
  Image as ImageIcon,
  Zap,
  ChevronRight
} from 'lucide-react';
import { AgentCard } from '../../agents/AgentCard';
import { AgentDefinition } from '../../../types';

// Fix: Added missing properties (model, edgeFunction, memoryScope, capabilities) to each agent to satisfy the AgentDefinition interface
const agents: AgentDefinition[] = [
  {
    id: 'analyst',
    name: 'The Analyst',
    role: 'Financial Forensics',
    description: 'Scans transaction data and Stripe exports to calculate true burn rate, MRR, and runway with Python-driven precision.',
    icon: <Microscope size={18} />,
    colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    techStack: 'Gemini 3 Pro + Code Execution',
    model: 'gemini-3-pro-preview',
    edgeFunction: 'analyze_financials',
    memoryScope: 'metrics_history',
    capabilities: ['Transaction Parsing', 'Runway Projection', 'Anomaly Detection']
  },
  {
    id: 'scout',
    name: 'The Scout',
    role: 'Market Intelligence',
    description: 'Performs real-time competitive analysis and VC thesis matching using live Google Search Grounding for 2025 benchmarks.',
    icon: <Compass size={18} />,
    colorClass: 'text-blue-600 bg-blue-50 border-blue-100',
    techStack: 'Gemini 3 Pro + Search Grounding',
    model: 'gemini-3-pro-preview',
    edgeFunction: 'market_research',
    memoryScope: 'competitor_landscape',
    capabilities: ['Google Search Grounding', 'VC Thesis Matching', 'Sector Benchmarking']
  },
  {
    id: 'architect',
    name: 'The Architect',
    role: 'Narrative & Pitch',
    description: 'Structures complex business visions into Sequoia-standard pitch narratives using high-depth thinking models.',
    icon: <PenTool size={18} />,
    colorClass: 'text-purple-600 bg-purple-50 border-purple-100',
    techStack: 'Gemini 3 Pro + High Thinking',
    model: 'gemini-3-pro-preview',
    edgeFunction: 'deck_generator',
    memoryScope: 'startup_context',
    capabilities: ['Narrative Architecting', 'High Thinking Depth', 'Slide Structure JSON']
  },
  {
    id: 'visualizer',
    name: 'The Visualizer',
    role: 'Asset Generation',
    description: 'Instantly creates 16:9 investor visuals and brand-aligned social assets for demo days and product launches.',
    icon: <ImageIcon size={18} />,
    colorClass: 'text-rose-600 bg-rose-50 border-rose-100',
    techStack: 'Gemini 2.5 Flash Image',
    model: 'gemini-2.5-flash-image',
    edgeFunction: 'image_gen',
    memoryScope: 'brand_assets',
    capabilities: ['Text-to-Image (16:9)', 'Brand Alignment', 'Infographic Generation']
  },
  {
    id: 'operator',
    name: 'The Operator',
    role: 'Task Automation',
    description: 'Automates logistics and workback schedules, identifying date conflicts and creating tactical founder roadmaps.',
    icon: <Zap size={18} />,
    colorClass: 'text-amber-600 bg-amber-50 border-amber-100',
    techStack: 'Gemini 3 Flash',
    model: 'gemini-3-flash-preview',
    edgeFunction: 'task_orchestration',
    memoryScope: 'operational_tasks',
    capabilities: ['Roadmap Generation', 'Conflict Detection', 'Workback Scheduling']
  }
];

export const AgentCatalogue: React.FC = () => {
  const handleLaunchAgent = (agentId: string) => {
    console.log(`Launching agent: ${agentId}`);
    // Future implementation: Trigger specific agent workflow
  };

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
          <AgentCard 
            key={agent.id} 
            agent={agent} 
            onAction={handleLaunchAgent} 
          />
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