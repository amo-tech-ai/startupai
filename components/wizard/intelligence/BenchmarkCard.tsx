
import React from 'react';
import { TrendingUp, Flag, CheckCircle2, AlertTriangle, Search } from 'lucide-react';

interface BenchmarkCardProps {
  data: {
    investor_interpretation: string;
    stage_alignment: string;
    benchmark_context: string;
    green_flags: string[];
    red_flags: string[];
    recommended_next_metrics: Array<{ metric: string; target: string; timeframe: string }>;
  } | null;
  isLoading: boolean;
}

export const BenchmarkCard: React.FC<BenchmarkCardProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-100 rounded w-full"></div>
          <div className="h-4 bg-slate-100 rounded w-3/4"></div>
          <div className="h-20 bg-slate-100 rounded w-full mt-4"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="text-emerald-600" size={20} />
          Investor Reality Check
        </h3>
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center gap-1">
            <Search size={10} /> Search Grounded
        </span>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="text-sm font-semibold text-slate-900 mb-2">"{data.investor_interpretation}"</div>
        <div className="text-xs text-slate-500 leading-relaxed">{data.benchmark_context}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase mb-2">
            <CheckCircle2 size={14} /> Green Flags
          </div>
          <ul className="space-y-1">
            {data.green_flags?.length > 0 ? data.green_flags.map((flag, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                <span className="mt-1 w-1 h-1 rounded-full bg-emerald-400 shrink-0"></span>
                {flag}
              </li>
            )) : <li className="text-xs text-slate-400 italic">None detected yet</li>}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase mb-2">
            <Flag size={14} /> Risks
          </div>
          <ul className="space-y-1">
            {data.red_flags?.length > 0 ? data.red_flags.map((flag, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                <span className="mt-1 w-1 h-1 rounded-full bg-rose-400 shrink-0"></span>
                {flag}
              </li>
            )) : <li className="text-xs text-slate-400 italic">None detected</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <div className="text-xs font-bold text-slate-500 uppercase mb-2">Recommended Next Milestones</div>
        <div className="space-y-2">
            {data.recommended_next_metrics?.map((m, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-medium text-slate-700">{m.metric}</span>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-600">{m.target}</span>
                        <span className="text-slate-400 text-[10px]">in {m.timeframe}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
