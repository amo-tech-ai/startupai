
import React from 'react';
import { Plus, ArrowRight, TrendingUp, DollarSign } from 'lucide-react';
import { Deal } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface CRMSnapshotProps {
  deals: Deal[];
}

export const CRMSnapshot: React.FC<CRMSnapshotProps> = ({ deals }) => {
  const navigate = useNavigate();
  
  // Metrics Calculation
  const activeDeals = deals.filter(d => d.stage !== 'Closed');
  const closedDeals = deals.filter(d => d.stage === 'Closed');
  const leadsCount = deals.filter(d => d.stage === 'Lead').length;
  
  // Pipeline Value (Active Deals Only)
  const pipelineValue = activeDeals.reduce((acc, d) => acc + d.value, 0);
  
  // Win Rate (Closed Deals / Total Deals - Simplified approximation)
  // In a real app, this would be Won / (Won + Lost)
  const winRate = deals.length > 0 
    ? Math.round((closedDeals.length / deals.length) * 100) 
    : 0;

  // Chart Data
  const winData = [
    { name: 'Won', value: winRate },
    { name: 'Other', value: 100 - winRate }
  ];
  
  const COLORS = ['#10b981', '#cbd5e1']; // Emerald-500, Slate-300

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-6 flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            CRM Snapshot
        </h3>
        <button 
            onClick={() => navigate('/crm')}
            className="text-xs font-bold text-[#6B7280] hover:text-[#1A1A1A] flex items-center gap-1 uppercase tracking-wide"
        >
            View Pipeline <ArrowRight size={12} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
         {/* Pipeline Value - Prominent */}
         <div className="col-span-2 p-5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between group cursor-pointer hover:bg-indigo-50 transition-colors" onClick={() => navigate('/crm')}>
            <div>
                <div className="text-xs text-indigo-600 font-bold uppercase mb-1 flex items-center gap-1">
                    <DollarSign size={12}/> Active Pipeline
                </div>
                <div className="text-3xl font-bold text-[#1A1A1A] tracking-tight">${(pipelineValue/1000).toFixed(1)}k</div>
            </div>
            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <TrendingUp size={20} />
            </div>
         </div>

         {/* Active Deals Count */}
         <div className="p-4 bg-[#F7F7F5] rounded-xl border border-[#E5E5E5] flex flex-col justify-center">
            <div className="text-xs text-[#6B7280] font-bold uppercase mb-1">Active Deals</div>
            <div className="text-2xl font-bold text-[#1A1A1A]">{activeDeals.length}</div>
         </div>

         {/* Win Rate with Chart */}
         <div className="p-4 bg-[#F7F7F5] rounded-xl border border-[#E5E5E5] relative flex flex-col justify-center overflow-hidden">
            <div className="text-xs text-[#6B7280] font-bold uppercase mb-1 z-10 relative">Win Rate</div>
            <div className="flex items-center gap-2 z-10 relative">
                <div className="text-2xl font-bold text-[#1A1A1A]">{winRate}%</div>
            </div>
            
            {/* Background Chart */}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-16 h-16 opacity-50 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={winData}
                            cx="50%"
                            cy="50%"
                            innerRadius={18}
                            outerRadius={28}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                        >
                            {winData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="mt-auto space-y-3 pt-2">
         <div className="flex justify-between text-sm text-[#6B7280] border-b border-[#E5E5E5] pb-3">
            <span>Leads in Pipeline</span>
            <span className="font-bold text-[#1A1A1A]">{leadsCount}</span>
         </div>
         <button 
            onClick={() => navigate('/crm')}
            className="w-full py-3 border border-[#E5E5E5] rounded-xl text-sm font-bold text-[#1A1A1A] hover:bg-[#F7F7F5] transition-all flex items-center justify-center gap-2"
         >
            <Plus size={16} /> Add Deal
         </button>
      </div>
    </div>
  );
};
