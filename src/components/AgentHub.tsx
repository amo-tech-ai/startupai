
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Search, 
  Filter, 
  Plus, 
  Activity, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight,
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { AgentRun, AgentRunStatus } from '../types';
import { RunTable } from './agents/RunTable';
import { RunDetail } from './agents/RunDetail';
import { AgentSidebar } from './agents/AgentSidebar';

const AgentHub: React.FC = () => {
  const { activities } = useData();
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data for the Hub (In Prod, this pulls from the 'ai_runs' table)
  const [runs] = useState<AgentRun[]>([
    {
      id: 'run_1',
      orgId: 'org_1',
      agentName: 'Market Forensic Analyst',
      status: 'complete',
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3540000).toISOString(),
      payload: { scope: 'SaaS Benchmarking' },
      result: { confidence: 0.92, sources: 14 },
      idempotencyKey: 'abc-123'
    },
    {
      id: 'run_2',
      orgId: 'org_1',
      agentName: 'Pitch Deck Architect',
      status: 'needs_approval',
      startedAt: new Date(Date.now() - 600000).toISOString(),
      payload: { template: 'Sequoia' },
      idempotencyKey: 'def-456'
    },
    {
      id: 'run_3',
      orgId: 'org_1',
      agentName: 'Logistics Scout',
      status: 'running',
      startedAt: new Date(Date.now() - 30000).toISOString(),
      payload: { city: 'NYC', event: 'Demo Day' },
      idempotencyKey: 'ghi-789'
    }
  ]);

  const selectedRun = runs.find(r => r.id === selectedRunId);

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      {/* MAIN CANVAS */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-8 py-6 bg-white border-b border-slate-200 shrink-0">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Bot className="text-indigo-600" size={28} /> Agent Hub
              </h1>
              <p className="text-slate-500 text-sm mt-1">Audit and approve all autonomous agent activity.</p>
            </div>
            
            <div className="flex items-center gap-6">
              <HubStat icon={<Activity size={16}/>} label="Active Agents" value="2" color="text-emerald-600" />
              <HubStat icon={<DollarSign size={16}/>} label="M-T-D Cost" value="$14.20" color="text-slate-600" />
              <HubStat icon={<Clock size={16}/>} label="Avg Duration" value="4.2s" color="text-indigo-600" />
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* List Section */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Filter by agent or scope..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600">
                  <Filter size={20} />
                </button>
              </div>

              <RunTable 
                runs={runs} 
                selectedId={selectedRunId} 
                onSelect={setSelectedRunId} 
              />
            </div>
          </div>

          {/* Details Overlay Panel */}
          <AnimatePresence>
            {selectedRun && (
              <RunDetail 
                run={selectedRun} 
                onClose={() => setSelectedRunId(null)} 
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <AgentSidebar />
    </div>
  );
};

const HubStat = ({ icon, label, value, color }: any) => (
  <div className="flex flex-col items-end">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
      {label} {icon}
    </span>
    <span className={`text-lg font-bold ${color}`}>{value}</span>
  </div>
);

export default AgentHub;
