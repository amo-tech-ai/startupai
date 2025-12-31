import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Database, 
  Layers, 
  Activity, 
  Globe, 
  Microscope,
  Compass,
  PenTool,
  Image as ImageIcon,
  // Fix: Added Clock to imports
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AgentDefinition } from '../../types';

// Mock data extension for detail view (In production this comes from a service)
const AGENT_CATALOG: Record<string, AgentDefinition> = {
  analyst: {
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
  scout: {
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
  architect: {
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
  visualizer: {
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
  operator: {
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
};

const MotionDiv = motion.div as any;

const AgentDetailView: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const agent = agentId ? AGENT_CATALOG[agentId] : null;

  if (!agent) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold">Agent Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
          >
            <ArrowLeft size={18} /> Back to Agent Hub
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status: Ready</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-10 items-start">
          <div className={`p-6 rounded-2xl border ${agent.colorClass} shrink-0`}>
            {/* Fix: Added type cast to React.isValidElement and React.cloneElement to handle size prop safely */}
            {React.isValidElement(agent.icon) ? React.cloneElement(agent.icon as React.ReactElement<any>, { size: 48 }) : agent.icon}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{agent.name}</h1>
              <p className="text-indigo-600 font-bold uppercase text-xs tracking-widest mt-1">{agent.role}</p>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">{agent.description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {agent.capabilities.map(cap => (
                <span key={cap} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-full text-xs font-bold">{cap}</span>
              ))}
            </div>
          </div>
          <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:bg-black transition-all hover:-translate-y-1 active:scale-95 shrink-0">
            Provision Agent
          </button>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Intelligence Engine */}
          <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Cpu size={20} className="text-indigo-600" /> Intelligence Engine
            </h3>
            <div className="space-y-4">
              <SpecRow label="Specific Model" value={agent.model} icon={<Activity size={14}/>} />
              <SpecRow label="Prompt Strategy" value="Chain of Thought (CoT)" icon={<Layers size={14}/>} />
              <SpecRow label="Search Grounding" value={agent.id === 'scout' ? 'Enabled' : 'Disabled'} icon={<Globe size={14}/>} />
              <SpecRow label="Execution Context" value="Secure V8 Isolate" icon={<ShieldCheck size={14}/>} />
            </div>
          </section>

          {/* Operational Architecture */}
          <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Layers size={20} className="text-indigo-600" /> System Integration
            </h3>
            <div className="space-y-4">
              <SpecRow label="Edge Function" value={`${agent.edgeFunction}.ts`} icon={<Zap size={14}/>} />
              <SpecRow label="Memory Scope" value={agent.memoryScope} icon={<Database size={14}/>} />
              <SpecRow label="Latency SLA" value={agent.id === 'analyst' || agent.id === 'scout' ? '15s - 30s' : '2s - 5s'} icon={<Clock size={14}/>} />
              <SpecRow label="Governance" value="Propose-Approve (Human-Gate)" icon={<ShieldCheck size={14}/>} />
            </div>
          </section>
        </div>

        {/* Security Warning */}
        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-4">
          <div className="p-2 bg-white rounded-lg shadow-sm text-amber-500 shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Governance Protocol v4.1</h4>
            <p className="text-xs text-amber-800 leading-relaxed mt-1">
              This agent operates under "Proposed Action" governance. It has no direct WRITE access to your core database. 
              Every logical change suggested must be reviewed and approved by a workspace administrator in the Agent Hub.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

const SpecRow = ({ label, value, icon }: any) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
    <div className="flex items-center gap-2 text-slate-500">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <span className="text-sm font-bold text-slate-900 font-mono">{value}</span>
  </div>
);

export default AgentDetailView;