
import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Edit2, DollarSign, Users, Loader2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { WizardService } from '../../services/wizardAI';
import { API_KEY } from '../../lib/env';
import { StartupProfile } from '../../types';
import { useToast } from '../../context/ToastContext';

interface TractionCardProps {
  viewMode: 'edit' | 'investor';
  profile: StartupProfile;
  metrics: { monthly_revenue: number; monthly_active_users: number; burn_rate?: number; cash_balance?: number } | null | undefined;
  // Handler accepts combined data structure that the parent page will split
  onSave: (data: Partial<StartupProfile> & { metrics?: any }) => Promise<void>;
}

export const TractionCard: React.FC<TractionCardProps> = ({ viewMode, profile, metrics, onSave }) => {
  const { success } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [aiValuation, setAiValuation] = useState<any>(null);
  const [isLoadingValuation, setIsLoadingValuation] = useState(false);

  // Normalize metrics from props or default to 0
  const mrr = metrics?.monthly_revenue || 0;
  const activeUsers = metrics?.monthly_active_users || 0;
  const burnRate = metrics?.burn_rate || 0;
  const cashBalance = metrics?.cash_balance || 0;

  useEffect(() => {
    if (profile) {
        setFormData({
            mrr: mrr,
            activeUsers: activeUsers,
            burnRate: burnRate,
            cashBalance: cashBalance,
            fundingGoal: profile.fundingGoal,
            isRaising: profile.isRaising,
            fundingHistory: profile.fundingHistory || [],
            useOfFunds: profile.useOfFunds || []
        });
    }
  }, [profile, mrr, activeUsers, burnRate, cashBalance]);

  const handleSaveClick = async () => {
      // Split the data: Profile fields vs Metrics fields
      const profileUpdates = {
          fundingGoal: Number(formData.fundingGoal),
          isRaising: formData.isRaising,
          fundingHistory: formData.fundingHistory,
          useOfFunds: formData.useOfFunds
      };

      const metricsUpdates = {
          monthly_revenue: Number(formData.mrr),
          monthly_active_users: Number(formData.activeUsers),
          burn_rate: Number(formData.burnRate),
          cash_balance: Number(formData.cashBalance)
      };

      await onSave({ 
          ...profileUpdates,
          metrics: metricsUpdates
      });
      
      setIsEditing(false);
      success("Traction updated");
  };

  const handleEstimateValuation = async () => {
      if (!API_KEY || !mrr) return;
      setIsLoadingValuation(true);
      try {
          const result = await WizardService.estimateValuation(profile?.industry || 'Tech', profile?.stage || 'Seed', mrr, API_KEY);
          if (result) setAiValuation(result);
      } finally {
          setIsLoadingValuation(false);
      }
  };

  // Generate chart data for visualization
  const chartData = useMemo(() => {
      const baseMrr = mrr || 0;
      return Array.from({ length: 6 }, (_, i) => ({
          month: `M${i+1}`,
          value: Math.round(baseMrr * (0.5 + (i * 0.1)))
      }));
  }, [mrr]);

  if (!profile) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-600"/> Traction & Finance
            </h2>
            {viewMode === 'edit' && !isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-indigo-600 transition-colors">
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
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cash in Bank ($)</label>
                        <input 
                            type="number"
                            value={formData.cashBalance} onChange={e => setFormData({...formData, cashBalance: e.target.value})}
                            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monthly Burn ($)</label>
                        <input 
                            type="number"
                            value={formData.burnRate} onChange={e => setFormData({...formData, burnRate: e.target.value})}
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
                    <button onClick={handleSaveClick} className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700">Save Changes</button>
                </div>
            </div>
        ) : (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
                            <DollarSign size={14} /> MRR
                        </div>
                        <div className="text-2xl font-bold text-slate-900">${mrr.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
                            <Users size={14} /> Users
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{activeUsers.toLocaleString()}</div>
                    </div>
                    {(burnRate > 0 || cashBalance > 0) && (
                        <>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
                                    <TrendingUp size={14} /> Burn
                                </div>
                                <div className="text-xl font-bold text-slate-900">${burnRate.toLocaleString()}</div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
                                    <DollarSign size={14} /> Cash
                                </div>
                                <div className="text-xl font-bold text-slate-900">${cashBalance.toLocaleString()}</div>
                            </div>
                        </>
                    )}
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
