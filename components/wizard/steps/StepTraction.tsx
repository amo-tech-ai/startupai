
import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, Plus, Sparkles, Loader2 } from 'lucide-react';
import { WizardService } from '../../../services/wizardAI';
import { API_KEY } from '../../../lib/env';

interface StepTractionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const StepTraction: React.FC<StepTractionProps> = ({ formData, setFormData }) => {
  const [aiValuation, setAiValuation] = useState<any>(null);
  const [isSuggestingFunds, setIsSuggestingFunds] = useState(false);

  const update = (field: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: val }));
  };

  const addFundingRound = () => {
    const newRound = { id: Date.now(), round: 'Seed', date: '', amount: 0, investors: '' };
    update('fundingHistory', [...formData.fundingHistory, newRound]);
  };

  // Trigger valuation estimation
  React.useEffect(() => {
    if (formData.mrr > 0 && API_KEY && !aiValuation) {
        WizardService.estimateValuation(formData.industry || 'Tech', 'Seed', formData.mrr, API_KEY)
            .then(setAiValuation);
    }
  }, [formData.mrr, formData.industry]);

  const handleSuggestFunds = async () => {
    if (!API_KEY) return;
    setIsSuggestingFunds(true);
    try {
        const suggestions = await WizardService.suggestUseOfFunds(formData.targetRaise || 1000000, 'Seed', formData.industry || 'Tech', API_KEY);
        if (suggestions.length > 0) {
            update('useOfFunds', suggestions);
        }
    } finally {
        setIsSuggestingFunds(false);
    }
  };

  // Helper for tag inputs
  const TagInput = ({ label, values, onChange, onSuggest, loading }: any) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-bold text-slate-700">{label}</label>
        {onSuggest && (
            <button 
                onClick={onSuggest}
                disabled={loading}
                className="text-xs flex items-center gap-1 text-purple-600 font-bold hover:bg-purple-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
            >
                {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Suggest Allocation
            </button>
        )}
      </div>
      <div className="p-2 border border-slate-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-purple-500 flex flex-wrap gap-2 min-h-[50px]">
        {values.map((v: string, i: number) => (
          <span key={i} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm flex items-center gap-1">
            {v} <button onClick={() => onChange(values.filter((_:any, idx:number) => idx !== i))} className="hover:text-red-500">×</button>
          </span>
        ))}
        <input 
          type="text" 
          placeholder="Type & Enter..." 
          className="flex-1 outline-none min-w-[100px] text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const val = e.currentTarget.value.trim();
              if (val) {
                onChange([...values, val]);
                e.currentTarget.value = '';
              }
            }
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-500">
       {/* LEFT: METRICS */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-8">
          <div>
             <h2 className="text-xl font-bold text-slate-900 mb-6">Traction Metrics</h2>
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Revenue (MRR)</label>
                   <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                         type="number" 
                         value={formData.mrr} 
                         onChange={(e) => update('mrr', Number(e.target.value))}
                         className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-lg font-mono"
                         placeholder="0"
                      />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Total Users / Waitlist</label>
                   <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                         type="number" 
                         value={formData.totalUsers} 
                         onChange={(e) => update('totalUsers', Number(e.target.value))}
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
                <button onClick={addFundingRound} className="text-sm text-purple-600 font-bold hover:bg-purple-50 px-2 py-1 rounded">
                   + Add Round
                </button>
             </div>
             
             {formData.fundingHistory.length === 0 ? (
                <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
                   No funding history yet. Bootstrapped?
                </div>
             ) : (
                <div className="space-y-3">
                   {formData.fundingHistory.map((round: any, idx: number) => (
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

       {/* RIGHT: FUNDRAISING STATUS */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-bold text-slate-900">Fundraising</h2>
             <label className="flex items-center cursor-pointer">
                <div className="relative">
                   <input type="checkbox" className="sr-only" checked={formData.isRaising} onChange={(e) => update('isRaising', e.target.checked)} />
                   <div className={`block w-14 h-8 rounded-full transition-colors ${formData.isRaising ? 'bg-purple-600' : 'bg-slate-200'}`}></div>
                   <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.isRaising ? 'translate-x-6' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-bold text-slate-700">{formData.isRaising ? 'Active' : 'Inactive'}</span>
             </label>
          </div>

          {formData.isRaising && (
             <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Target Raise Amount</label>
                   <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                         type="number" 
                         value={formData.targetRaise}
                         onChange={(e) => update('targetRaise', Number(e.target.value))}
                         className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-lg font-mono"
                      />
                   </div>
                </div>

                <TagInput 
                    label="Use of Funds" 
                    values={formData.useOfFunds} 
                    onChange={(vals: string[]) => update('useOfFunds', vals)}
                    onSuggest={handleSuggestFunds}
                    loading={isSuggestingFunds}
                />

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                   <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-sm">
                      <TrendingUp size={16} />
                      AI Valuation Estimate
                   </div>
                   {aiValuation ? (
                      <div>
                         <div className="text-2xl font-bold text-indigo-900">
                            ${aiValuation.min}M - ${aiValuation.max}M
                         </div>
                         <p className="text-xs text-indigo-600 mt-1">{aiValuation.reasoning}</p>
                      </div>
                   ) : (
                      <div className="text-sm text-indigo-400 italic">Enter metrics to see estimate...</div>
                   )}
                </div>
             </div>
          )}
       </div>
    </div>
  );
};
