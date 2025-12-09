
import React, { useState, useMemo } from 'react';
import { TrendingUp, Edit2, DollarSign, Users, Plus, Loader2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { WizardService } from '../../services/wizardAI';
import { API_KEY } from '../../lib/env';

interface TractionCardProps {
  viewMode: 'edit' | 'investor';
}

export const TractionCard: React.FC<TractionCardProps> = ({ viewMode }) => {
  const { metrics, profile, updateMetrics, updateProfile } = useData();
  const { success } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [aiValuation, setAiValuation] = useState<any>(null);
  const [isLoadingValuation, setIsLoadingValuation] = useState(false);

  const latestMetric = metrics[metrics.length - 1] || { mrr: 0, activeUsers: 0 };

  const startEdit = () => {
      setFormData({
          mrr: latestMetric.mrr,
          activeUsers: latestMetric.activeUsers,
          fundingGoal: profile?.fundingGoal,
          isRaising: profile?.isRaising,
          fundingHistory: profile?.fundingHistory || []
      });
      setIsEditing(true);
  };

  const handleSave = async () => {
      updateMetrics({ mrr: Number(formData.mrr), activeUsers: Number(formData.activeUsers) });
      await updateProfile({ 
          fundingGoal: Number(formData.fundingGoal), 
          isRaising: formData.isRaising,
          fundingHistory: formData.fundingHistory 
      });
      setIsEditing(false);
      success("Traction updated");
  };

  const handleEstimateValuation = async () => {
      if (!API_KEY || !latestMetric.mrr) return;
      setIsLoadingValuation(true);
      try {
          const result = await WizardService.estimateValuation(profile?.industry || 'Tech', profile?.stage || 'Seed', latestMetric.mrr, API_KEY);
          if (result) setAiValuation(result);
      } finally {
          setIsLoadingValuation(false);
      }
  };

  // Mock chart data generation
  const chartData = useMemo(() => {
      const baseMrr = latestMetric.mrr || 0;
      return Array.from({ length: 6 }, (_, i) => ({
          month: `M${i+1}`,
          value: Math.round(baseMrr * (0.5 + (i * 0.1)))
      }));
  }, [latestMetric.mrr]);

  if (!profile) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-600"/> Traction & Finance
            </h2>
            {viewMode === 'edit' && !isEditing && (
                <button onClick={startEdit} className="text-slate-400 hover:text-indigo-600 transition-colors">
                    <Edit2 size={18} />
                </button>
            )}
        </div>

        {isEditing ? (
            <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">MRR ($)</label>
                        <input 
                            type="number"
                            value={formData.mrr} onChange={e => setFormData({...formData, mrr: e.target.value})}
                            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Active Users</label>
                        <input 
                            type="number"
                            value={formData.activeUsers} onChange={e => setFormData({...formData, activeUsers: e.target.value})}
                            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                    <label className="flex items-center gap-2 mb-4 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={formData.isRaising} 
                            onChange={e => setFormData({...formData, isRaising: e.target.checked})}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-bold text-slate-700">Actively Fundraising</span>
                    </label>
                    {formData.isRaising && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Raise ($)</label>
                            <input 
                                type="number"
                                value={formData.fundingGoal} onChange={e => setFormData({...formData, fundingGoal: e.target.value})}
                                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded">Cancel</button>
                    <button onClick={handleSave} className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700">Save Changes</button>
                </div>
            </div>
        ) : (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
                            <DollarSign size={14} /> MRR
                        </div>
                        <div className="text-2xl font-bold text-slate-900">${latestMetric.mrr?.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
                            <Users size={14} /> Users
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{latestMetric.activeUsers?.toLocaleString()}</div>
                    </div>
                </div>

                {/* Growth Chart */}
                <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" hide />
                            <YAxis hide />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorGrowth)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Valuation Panel */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-indigo-900">Valuation Estimate</h4>
                        {!aiValuation && (
                            <button onClick={handleEstimateValuation} disabled={isLoadingValuation} className="text-xs bg-white text-indigo-600 px-2 py-1 rounded shadow-sm font-medium hover:bg-indigo-50 disabled:opacity-50">
                                {isLoadingValuation ? <Loader2 size={12} className="animate-spin"/> : 'Calculate AI'}
                            </button>
                        )}
                    </div>
                    {aiValuation ? (
                        <div>
                            <div className="text-2xl font-bold text-indigo-700">${aiValuation.min}M - ${aiValuation.max}M</div>
                            <p className="text-xs text-indigo-500 mt-1">{aiValuation.reasoning}</p>
                        </div>
                    ) : (
                        <p className="text-xs text-indigo-400 italic">Based on current MRR and market multiples.</p>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};
