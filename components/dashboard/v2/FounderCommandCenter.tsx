
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { MetricsSnapshot } from '../../../types';
import { useNavigate } from 'react-router-dom';

interface FounderCommandCenterProps {
  metrics: MetricsSnapshot[];
}

export const FounderCommandCenter: React.FC<FounderCommandCenterProps> = ({ metrics }) => {
  const navigate = useNavigate();
  const latest = metrics[metrics.length - 1] || { 
    mrr: 0, 
    burnRate: 0, 
    runwayMonths: 0, 
    cashBalance: 0 
  };

  // Values with fallbacks
  const burnRate = latest.burnRate || 0;
  const cash = latest.cashBalance || 0;
  
  // Calculate runway if not explicit (Cash / Burn)
  let runway = latest.runwayMonths;
  if (!runway && burnRate > 0) {
      runway = cash / burnRate;
  }
  runway = runway || 0;
  
  // Projection Data (Mocked based on MRR trend if no history)
  const projectionData = metrics.length > 1 
    ? metrics.map((m, i) => ({ month: `M${i}`, value: (m.mrr || 0) * 12 }))
    : Array(12).fill(0).map((_, i) => ({ month: `M${i}`, value: (latest.mrr || 0) * 12 * (1 + i * 0.05) }));

  const isUrgent = runway < 6 && runway > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity size={20} className="text-indigo-600" />
            Founder Command Center
          </h2>
          <p className="text-sm text-slate-500">Financial health snapshot</p>
        </div>
        <button 
            onClick={() => navigate('/startup-profile')} 
            className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          Update Financials
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Burn Rate */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
            <TrendingDown size={14} className="text-rose-500" /> Burn Rate
          </div>
          <div className="text-xl font-bold text-slate-900">${burnRate.toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span></div>
        </div>

        {/* Cash */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
            <DollarSign size={14} className="text-emerald-500" /> Cash in Bank
          </div>
          <div className="text-xl font-bold text-slate-900">${cash.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>

        {/* Runway */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
            {isUrgent ? <AlertTriangle size={14} className="text-amber-500" /> : <Activity size={14} className="text-blue-500" />} 
            Runway
          </div>
          <div className={`text-xl font-bold ${isUrgent ? 'text-amber-600' : 'text-slate-900'}`}>
            {runway === Infinity ? '∞' : runway.toFixed(1)} <span className="text-xs font-normal text-slate-400">months</span>
          </div>
        </div>

        {/* ARR */}
        <div>
           <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
            <TrendingUp size={14} className="text-indigo-500" /> ARR Proj.
          </div>
          <div className="text-xl font-bold text-slate-900">${((latest.mrr || 0) * 12).toLocaleString()}</div>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="h-24 w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative">
         <div className="absolute top-2 left-3 text-[10px] font-bold text-slate-400 uppercase">12-Month Projection</div>
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorArr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'ARR']}
              />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorArr)" />
            </AreaChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
};
