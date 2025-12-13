
import React, { useMemo } from 'react';
import { DollarSign, Users } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { BenchmarkCard } from '../../intelligence/BenchmarkCard';

interface TractionMetricsProps {
  mrr: number;
  totalUsers: number;
  fundingHistory: any[];
  onUpdate: (field: string, value: any) => void;
  onAddFunding: () => void;
  tractionData: any;
  isAnalyzing: boolean;
}

export const TractionMetrics: React.FC<TractionMetricsProps> = ({ 
  mrr, totalUsers, fundingHistory, onUpdate, onAddFunding, tractionData, isAnalyzing 
}) => {
  
  // Fake chart data based on MRR
  const chartData = useMemo(() => {
    const baseMrr = mrr || 0;
    return Array.from({ length: 12 }, (_, i) => ({
        month: i,
        value: baseMrr * (0.1 + (i / 12) * 0.9 + Math.random() * 0.1)
    }));
  }, [mrr]);

  return (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Traction Metrics</h2>
                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Revenue (MRR)</label>
                    <div className="relative mb-2">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="number" 
                            value={mrr} 
                            onChange={(e) => onUpdate('mrr', Number(e.target.value))}
                            className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-lg font-mono"
                            placeholder="0"
                        />
                    </div>
                    {/* Mini Chart */}
                    {mrr > 0 && (
                        <div className="h-24 w-full bg-slate-50 rounded-lg overflow-hidden relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#9333ea" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="value" stroke="#9333ea" strokeWidth={2} fillOpacity={1} fill="url(#colorMrr)" />
                                </AreaChart>
                            </ResponsiveContainer>
                            <div className="absolute top-2 right-2 text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded">Growth Trend</div>
                        </div>
                    )}
                    </div>
                    <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Total Users / Waitlist</label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="number" 
                            value={totalUsers} 
                            onChange={(e) => onUpdate('totalUsers', Number(e.target.value))}
                            className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-lg font-mono"
                            placeholder="0"
                        />
                    </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-900">Funding History</h3>
                    <button onClick={onAddFunding} className="text-sm text-purple-600 font-bold hover:bg-purple-50 px-2 py-1 rounded">
                    + Add Round
                    </button>
                </div>
                
                {fundingHistory.length === 0 ? (
                    <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
                    No funding history yet. Bootstrapped?
                    </div>
                ) : (
                    <div className="space-y-3">
                    {fundingHistory.map((round: any, idx: number) => (
                        <div key={idx} className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                            <div>
                                <div className="text-xs text-slate-500">Round</div>
                                <div className="font-bold">{round.round}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500">Amount</div>
                                <div className="font-bold">${round.amount.toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500">Date</div>
                                <div className="font-bold">{round.date || 'N/A'}</div>
                            </div>
                        </div>
                    ))}
                    </div>
                )}
            </div>
        </div>

        {/* Benchmark Card */}
        {(mrr > 0 || totalUsers > 0) && (
            <BenchmarkCard data={tractionData} isLoading={isAnalyzing} />
        )}
    </div>
  );
};
