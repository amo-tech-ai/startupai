import React from 'react';
import { CheckCircle2, Clock, Loader2, AlertCircle, ShieldAlert, Cpu } from 'lucide-react';
/* Import correctly typed AgentRun and AgentRunStatus */
import { AgentRun, AgentRunStatus } from '../../types';

interface RunTableProps {
  runs: AgentRun[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const RunTable: React.FC<RunTableProps> = ({ runs, selectedId, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Agent Name</th>
            <th className="px-6 py-4">Context / Scope</th>
            <th className="px-6 py-4">Duration</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {runs.map((run) => (
            <tr 
              key={run.id}
              onClick={() => onSelect(run.id)}
              className={`group cursor-pointer transition-colors ${selectedId === run.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
            >
              <td className="px-6 py-5">
                <StatusBadge status={run.status} />
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                    <Cpu size={18} />
                  </div>
                  <span className="font-bold text-slate-900 text-sm">{run.agentName}</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <span className="text-sm text-slate-500 font-medium">
                  {run.payload.scope || run.payload.city || 'Global'}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Clock size={12} />
                  {run.completedAt ? '5.2s' : '--'}
                </div>
              </td>
              <td className="px-6 py-5 text-right">
                <button className="text-slate-300 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ChevronRight = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

const StatusBadge = ({ status }: { status: AgentRunStatus }) => {
  switch (status) {
    case 'complete':
      return <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100"><CheckCircle2 size={12}/> Success</span>;
    case 'running':
      return <span className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px] uppercase bg-blue-50 px-2 py-1 rounded-md border border-blue-100"><Loader2 size={12} className="animate-spin"/> Working</span>;
    /* Removed unnecessary 'as any' cast now that 'needs_approval' is in AgentRunStatus */
    case 'needs_approval':
      return <span className="flex items-center gap-1.5 text-amber-600 font-bold text-[10px] uppercase bg-amber-50 px-2 py-1 rounded-md border border-amber-100"><ShieldAlert size={12}/> Approval Required</span>;
    case 'error':
      return <span className="flex items-center gap-1.5 text-rose-600 font-bold text-[10px] uppercase bg-rose-50 px-2 py-1 rounded-md border border-rose-100"><AlertCircle size={12}/> Failed</span>;
    default:
      return <span className="text-slate-400 font-bold text-[10px] uppercase">{status}</span>;
  }
};
