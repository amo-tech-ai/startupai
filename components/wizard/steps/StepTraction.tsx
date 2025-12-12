
import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Users, DollarSign, Plus, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { WizardService } from '../../../services/wizardAI';
import { API_KEY } from '../../../lib/env';
import { BenchmarkCard } from '../intelligence/BenchmarkCard';
import { ValuationWidget } from '../intelligence/ValuationWidget';

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
      {values.map((v: string) => (
        <span key={v} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm flex items-center gap-1">
          {v} <button onClick={() => onChange(values.filter((item: string) => item !== v))} className="hover:text-red-500">×</button>
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
            if (val && !values.includes(val)) {
              onChange([...values, val]);
              e.currentTarget.value = '';
            }
          }
        }}
      />
    </div>
  </div>
);

interface StepTractionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const StepTraction: React.FC<StepTractionProps> = ({ formData, setFormData }) => {
  const [tractionData, setTractionData] = useState<any>(null);
  const [fundraisingData, setFundraisingData] = useState<any>(null);
  
  const [isSuggestingFunds, setIsSuggestingFunds] = useState(false);
  const [analyzingTraction, setAnalyzingTraction] = useState(false);
  const [analyzingFundraising, setAnalyzingFundraising] = useState(false);

  const update = (field: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: val }));
  };

  const addFundingRound = () => {
    const newRound = { id: Date.now().toString(), round: 'Seed', date: '', amount: 0, investors: '' };
    update('fundingHistory', [...formData.fundingHistory, newRound]);
  };

  // --- AI ANALYSIS EFFECTS ---

  // 1. Analyze Traction (When metrics change)
  useEffect(() => {
      const delayDebounceFn = setTimeout(async () => {
          if (formData.mrr > 0 && API_KEY) {
              setAnalyzingTraction(true);
              try {
                  const result = await WizardService.analyzeTraction(
                      { mrr: formData.mrr, users: formData.totalUsers },
                      formData.industry || 'Tech',
                      formData.stage || 'Seed',
                      API_KEY
                  );
                  if (result) setTractionData(result);
              } catch(e) { console.error(e); } 
              finally { setAnalyzingTraction(false); }
          }
      }, 1500); // 1.5s debounce

      return () => clearTimeout(delayDebounceFn);
  }, [formData.mrr, formData.totalUsers, formData.industry, formData.stage]);

  // 2. Calculate Fundraising (When metrics/target change)
  useEffect(() => {
      const delayDebounceFn = setTimeout(async () => {
          // Trigger if explicitly raising OR defaults (implied raising mode per spec)
          // We run it if we have at least some financial context
          if ((formData.targetRaise > 0 || formData.mrr > 0) && API_KEY) {
              setAnalyzingFundraising(true);
              try {
                  const result = await WizardService.calculateFundraising(
                      { 
                          mrr: formData.mrr, 
                          // Mock burn/cash inputs if not in form yet, or infer
                          burnRate: formData.mrr * 1.2, // Implied burn if not set
                          cash: formData.targetRaise * 0.1 // Implied cash if not set
                      },
                      formData.industry || 'Tech',
                      formData.stage || 'Seed',
                      formData.targetRaise || 1000000,
                      API_KEY
                  );
                  if (result) setFundraisingData(result);
              } catch(e) { console.error(e); } 
              finally { setAnalyzingFundraising(false); }
          }
      }, 1500);

      return () => clearTimeout(delayDebounceFn);
  }, [formData.targetRaise, formData.mrr, formData.industry, formData.stage]);


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

  // Fake chart data based on MRR
  const chartData = React.useMemo(() => {
    const baseMrr = formData.mrr || 0;
    return Array.from({ length: 12 }, (_, i) => ({
        month: i,
        value: baseMrr * (0.1 + (i / 12) * 0.9 + Math.random() * 0.1)
    }));
  }, [formData.mrr]);

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-500">
       {/* LEFT: METRICS & TRACTION */}
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
                             value={formData.mrr} 
                             onChange={(e) => update('mrr', Number(e.target.value))}
                             className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-lg font-mono"
                             placeholder="0"
                          />
                       </div>
                       {/* Mini Chart */}
                       {formData.mrr > 0 && (
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

           {/* V3 Feature: Benchmark Card */}
           {(formData.mrr > 0 || formData.totalUsers > 0) && (
               <BenchmarkCard data={tractionData} isLoading={analyzingTraction} />
           )}
       </div>

       {/* RIGHT: FUNDRAISING STATUS & VALUATION */}
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

          <div className={`space-y-6 transition-all ${formData.isRaising ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
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

            {/* V3 Feature: Valuation Widget */}
            <ValuationWidget 
                data={fundraisingData} 
                targetRaise={formData.targetRaise || 0}
                isLoading={analyzingFundraising} 
            />

            <TagInput 
                label="Use of Funds" 
                values={formData.useOfFunds} 
                onChange={(vals: string[]) => update('useOfFunds', vals)}
                onSuggest={handleSuggestFunds}
                loading={isSuggestingFunds}
            />
          </div>
       </div>
    </div>
  );
};
