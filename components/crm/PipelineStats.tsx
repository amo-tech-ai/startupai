
import React from 'react';
import { DollarSign, Briefcase, TrendingUp, Calendar, ChevronDown } from 'lucide-react';

interface PipelineStatsProps {
  totalValue: number;
  activeDeals: number;
  winRate: number;
}

export const PipelineStats: React.FC<PipelineStatsProps> = ({ totalValue, activeDeals, winRate }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><DollarSign size={18}/></div>
        <div>
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wide">Pipeline Value</div>
          <div className="text-lg font-bold text-slate-900">${(totalValue / 1000000).toFixed(2)}M</div>
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Briefcase size={18}/></div>
        <div>
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wide">Active Deals</div>
          <div className="text-lg font-bold text-slate-900">{activeDeals}</div>
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><TrendingUp size={18}/></div>
        <div>
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wide">Win Rate</div>
          <div className="text-lg font-bold text-slate-900">{winRate}%</div>
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Calendar size={18}/></div>
          <div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wide">Forecast</div>
            <div className="text-lg font-bold text-slate-900">Q4 '24</div>
          </div>
        </div>
        <ChevronDown className="text-slate-400" size={16} />
      </div>
    </div>
  );
};
