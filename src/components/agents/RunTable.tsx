import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Loader2, 
  AlertCircle, 
  ShieldAlert, 
  Cpu, 
  Filter, 
  ArrowUpDown,
  Search,
  ChevronRight,
  XCircle,
  PlayCircle,
  Zap
} from 'lucide-react';
import { AgentRun, AgentRunStatus } from '../../types';

interface RunTableProps {
  runs: AgentRun[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

type SortKey = 'startedAt' | 'agentName' | 'status';

export const RunTable: React.FC<RunTableProps> = ({ runs, selectedId, onSelect }) => {
  const [nameFilter, setNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgentRunStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('startedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedRuns = useMemo(() => {
    let result = [...runs];

    // Filtering
    if (nameFilter) {
      result = result.filter(r => r.agentName.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }

    // Sorting
    result.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [runs, nameFilter, statusFilter, sortKey, sortOrder]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search by agent name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select 
            className="bg-slate-50 border border-slate-200 rounded-xl text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Statuses</option>
            <option value="queued">Queued</option>
            <option value="running">Running</option>
            <option value="needs_user">Needs User</option>
            <option value="approved">Approved</option>
            <option value="executing">Executing</option>
            <option value="complete">Complete</option>
            <option value="error">Error</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort('status')}>
                <div className="flex items-center gap-1">Status <ArrowUpDown size={10}/></div>
              </th>
              <th className="px-6 py-4 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort('agentName')}>
                <div className="flex items-center gap-1">Agent Name <ArrowUpDown size={10}/></div>
              </th>
              <th className="px-6 py-4">Context / Scope</th>
              <th className="px-6 py-4 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort('startedAt')}>
                <div className="flex items-center gap-1">Started <ArrowUpDown size={10}/></div>
              </th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAndSortedRuns.length > 0 ? (
              filteredAndSortedRuns.map((run) => (
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
                      {new Date(run.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-slate-300 group-hover:text-indigo-600 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                  <Filter size={40} className="mx-auto mb-4 opacity-10" />
                  <p className="text-sm font-medium">No runs match your filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const StatusBadge = ({ status }: { status: AgentRunStatus }) => {
  switch (status) {
    case 'complete':
      return <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100"><CheckCircle2 size={12}/> Success</span>;
    case 'running':
      return <span className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px] uppercase bg-blue-50 px-2 py-1 rounded-md border border-blue-100"><Loader2 size={12} className="animate-spin"/> Working</span>;
    case 'queued':
      return <span className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase bg-slate-50 px-2 py-1 rounded-md border border-slate-200"><Clock size={12}/> Queued</span>;
    case 'needs_user':
      return <span className="flex items-center gap-1.5 text-amber-600 font-bold text-[10px] uppercase bg-amber-50 px-2 py-1 rounded-md border border-amber-100"><ShieldAlert size={12}/> Needs Action</span>;
    case 'approved':
      return <span className="flex items-center gap-1.5 text-indigo-600 font-bold text-[10px] uppercase bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100"><PlayCircle size={12}/> Approved</span>;
    case 'executing':
      return <span className="flex items-center gap-1.5 text-purple-600 font-bold text-[10px] uppercase bg-purple-50 px-2 py-1 rounded-md border border-purple-100"><Zap size={12}/> Executing</span>;
    case 'error':
      return <span className="flex items-center gap-1.5 text-rose-600 font-bold text-[10px] uppercase bg-rose-50 px-2 py-1 rounded-md border border-rose-100"><AlertCircle size={12}/> Error</span>;
    case 'canceled':
      return <span className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase bg-slate-100 px-2 py-1 rounded-md border border-slate-200"><XCircle size={12}/> Canceled</span>;
    default:
      return <span className="text-slate-400 font-bold text-[10px] uppercase">{status}</span>;
  }
};
