
import React from 'react';
import { DollarSign, AlertCircle, Check, TrendingUp, Info } from 'lucide-react';

interface ValuationWidgetProps {
  data: {
    runway_months: number;
    recommended_stage: string;
    valuation_range: { min: number; max: number; reasoning: string };
    raise_sanity_check: { status: string; message: string };
    benchmark_logic: string;
  } | null;
  targetRaise: number;
  isLoading: boolean;
}

export const ValuationWidget: React.FC<ValuationWidgetProps> = ({ data, targetRaise, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-slate-100 rounded-xl"></div>
        <div className="h-32 bg-slate-100 rounded-xl"></div>
      </div>
    );
  }

  if (!data) return (
    <div className="p-6 text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl">
       Enter metrics to unlock valuation insights.
    </div>
  );

  const runwayColor = data.runway_months < 6 ? 'text-red-600 bg-red-50 border-red-100' : 
                      data.runway_months < 12 ? 'text-amber-600 bg-amber-50 border-amber-100' : 
                      'text-green-600 bg-green-50 border-green-100';

  return (
    <div className="space-y-6">
       
       {/* 1. Runway Status */}
       <div className={`p-4 rounded-xl border flex items-center justify-between ${runwayColor}`}>
          <div className="flex items-center gap-3">
             <AlertCircle size={20} />
             <div>
                <div className="text-xs font-bold uppercase tracking-wide">Implied Runway</div>
                <div className="font-bold text-lg">{data.runway_months > 0 ? data.runway_months.toFixed(1) : '?'} Months</div>
             </div>
          </div>
          {data.runway_months < 9 && (
             <div className="text-xs font-bold px-2 py-1 bg-white/50 rounded uppercase">Raise Needed</div>
          )}
       </div>

       {/* 2. Valuation Range */}
       <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-16 bg-white/20 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none"></div>
          
          <div className="flex items-center gap-2 mb-3 text-indigo-800 font-bold text-sm">
             <TrendingUp size={16} /> Estimated Valuation Range
          </div>
          
          <div className="flex items-end gap-2 mb-2 relative z-10">
             <span className="text-3xl font-bold text-indigo-900">${data.valuation_range.min}M</span>
             <span className="text-lg text-indigo-400 mb-1">-</span>
             <span className="text-3xl font-bold text-indigo-900">${data.valuation_range.max}M</span>
             <span className="text-sm text-indigo-600 mb-1 font-medium ml-1">Pre-Money</span>
          </div>
          
          <p className="text-xs text-indigo-600 leading-relaxed relative z-10">
             {data.valuation_range.reasoning}
          </p>
       </div>

       {/* 3. Raise Sanity Check */}
       <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
             <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <DollarSign size={12} /> Target Raise: ${targetRaise.toLocaleString()}
             </div>
             <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                 data.raise_sanity_check.status.includes('High') ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                 data.raise_sanity_check.status.includes('Low') ? 'bg-blue-50 text-blue-700 border-blue-100' :
                 'bg-green-50 text-green-700 border-green-100'
             }`}>
                 {data.raise_sanity_check.status}
             </span>
          </div>
          <p className="text-xs text-slate-600">
             {data.raise_sanity_check.message}
          </p>
          {data.benchmark_logic && (
             <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2 items-start text-[10px] text-slate-400">
                <Info size={10} className="mt-0.5 shrink-0" />
                {data.benchmark_logic}
             </div>
          )}
       </div>

    </div>
  );
};
