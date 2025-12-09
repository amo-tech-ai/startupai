
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
  
  // Projection Data
  const projectionData = metrics.length > 1 
    ? metrics.map((m, i) => ({ month: `M${i}`, value: (m.mrr || 0) * 12 }))
    : Array(12).fill(0).map((_, i) => ({ month: `M${i}`, value: (latest.mrr || 0) * 12 * (1 + i * 0.05) }));

  const isUrgent = runway < 6 && runway > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8 relative overflow-hidden">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            Command Center
          </h2>
          <p className="text-sm text-[#6B7280]">Financial health snapshot</p>
        </div>
        <button 
            onClick={() => navigate('/startup-profile')} 
            className="text-xs font-bold text-[#1A1A1A] border border-[#E5E5E5] bg-white px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wider"
        >
          Update Financials
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {/* Burn Rate */}
        <div>
          <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2 flex items-center gap-2">
            <TrendingDown size={14} className="text-[#6B7280]" /> Burn Rate
          </div>
          <div className="text-2xl font-bold text-[#1A1A1A]">${burnRate.toLocaleString()}<span className="text-sm font-normal text-[#6B7280]">/mo</span></div>
        </div>

        {/* Cash */}
        <div>
          <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2 flex items-center gap-2">
            <DollarSign size={14} className="text-[#6B7280]" /> Cash on Hand
          </div>
          <div className="text-2xl font-bold text-[#1A1A1A]">${cash.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>

        {/* Runway */}
        <div>
          <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2 flex items-center gap-2">
            {isUrgent ? <AlertTriangle size={14} className="text-[#991B1B]" /> : <Activity size={14} className="text-[#6B7280]" />} 
            Runway
          </div>
          <div className={`text-2xl font-bold ${isUrgent ? 'text-[#991B1B]' : 'text-[#1A1A1A]'}`}>
            {runway === Infinity ? '∞' : runway.toFixed(1)} <span className="text-sm font-normal text-[#6B7280]">months</span>
          </div>
        </div>

        {/* ARR */}
        <div>
           <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2 flex items-center gap-2">
            <TrendingUp size={14} className="text-[#6B7280]" /> ARR Proj.
          </div>
          <div className="text-2xl font-bold text-[#1A1A1A]">${((latest.mrr || 0) * 12).toLocaleString()}</div>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="h-32 w-full min-w-0 bg-[#F7F7F5] rounded-xl overflow-hidden border border-[#E5E5E5] relative p-4">
         <div className="absolute top-4 left-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">12-Month Projection</div>
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorArr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', backgroundColor: '#FFFFFF', color: '#1A1A1A' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'ARR']}
              />
              <Area type="monotone" dataKey="value" stroke="#1A1A1A" strokeWidth={1.5} fillOpacity={1} fill="url(#colorArr)" />
            </AreaChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
};
