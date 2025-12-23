
import React, { useState, useMemo, useEffect, useRef } from 'react';
/* Added missing ArrowRight to imports from lucide-react */
import { TrendingUp, Edit2, DollarSign, Users, Loader2, FileUp, ArrowRight, Sparkles, CheckCircle2, X, Calculator, Settings2, ShieldCheck, BrainCircuit } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { FinancialForensics } from '../../services/ai/finance/forensics';
import { API_KEY } from '../../lib/env';
import { StartupProfile } from '../../types';
import { useToast } from '../../context/ToastContext';
import { getAI } from '../../lib/ai';

interface TractionCardProps {
  viewMode: 'edit' | 'investor';
  profile: StartupProfile;
  metrics: { monthly_revenue: number; monthly_active_users: number; burn_rate?: number; cash_balance?: number } | null | undefined;
  onSave: (data: Partial<StartupProfile> & { metrics?: any }) => Promise<void>;
}

export const TractionCard: React.FC<TractionCardProps> = ({ viewMode, profile, metrics, onSave }) => {
  const { success, error, toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  // Scenario Sandbox State
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxInputs, setSandboxInputs] = useState({ growth: 15, churn: 3 });
  const [isAnalyzingScenario, setIsAnalyzingScenario] = useState(false);
  const [scenarioAudit, setScenarioAudit] = useState<{ feedback: string; confidence: number; flags: string[] } | null>(null);

  const mrr = metrics?.monthly_revenue || 0;
  const activeUsers = metrics?.monthly_active_users || 0;

  useEffect(() => {
    if (profile) {
        setFormData({
            mrr, activeUsers,
            fundingGoal: profile.fundingGoal,
            isRaising: profile.isRaising,
            fundingHistory: profile.fundingHistory || [],
            useOfFunds: profile.useOfFunds || []
        });
    }
  }, [profile, mrr, activeUsers]);

  const handleSaveClick = async () => {
      const profileUpdates = {
          fundingGoal: Number(formData.fundingGoal),
          isRaising: formData.isRaising,
          fundingHistory: formData.fundingHistory,
          useOfFunds: formData.useOfFunds
      };
      const metricsUpdates = {
          monthly_revenue: Number(formData.mrr),
          monthly_active_users: Number(formData.activeUsers)
      };
      await onSave({ ...profileUpdates, metrics: metricsUpdates });
      setIsEditing(false);
      success("Traction updated");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !API_KEY) return;
      
      setIsAuditing(true);
      toast("Forensic AI is auditing transactions...", "info");
      
      const reader = new FileReader();
      reader.onload = async (event) => {
          const csvText = event.target?.result as string;
          try {
              const result = await FinancialForensics.analyzeTransactions(csvText);
              setAuditResult(result);
              success("Financial audit complete!");
          } catch (e) {
              error("Audit failed. Check file format.");
          } finally {
              setIsAuditing(false);
          }
      };
      reader.readAsText(file);
  };

  const handleRunScenarioAudit = async () => {
      if (!API_KEY || isAnalyzingScenario) return;
      setIsAnalyzingScenario(true);
      toast("Gemini is auditing your growth assumptions...", "info");

      try {
          const ai = getAI();
          const prompt = `
            Startup: ${profile.name} in ${profile.industry}.
            Current MRR: $${mrr}.
            Founder Growth Assumption: ${sandboxInputs.growth}% MoM.
            Founder Churn Assumption: ${sandboxInputs.churn}% MoM.
            
            Mission: Perform a strategic audit of these assumptions. 
            Compare against ${profile.industry} benchmarks for ${profile.stage} stage startups.
            Identify if the 15% growth is "Venture Scale" or "Agressive".
            
            Return JSON:
            { "feedback": "string (concise audit memo)", "confidence": number (0-100), "flags": ["string (e.g. High Growth, Unrealistic Churn)"] }
          `;

          const response = await ai.models.generateContent({
              model: 'gemini-3-pro-preview',
              contents: prompt,
              config: { 
                  responseMimeType: 'application/json',
                  thinkingConfig: { thinkingLevel: 'high' } 
              }
          });

          const result = JSON.parse(response.text || '{}');
          setScenarioAudit(result);
          success("Scenario Audit complete!");
      } catch (e) {
          error("Scenario Audit failed.");
      } finally {
          setIsAnalyzingScenario(false);
      }
  };

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
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setShowSandbox(!showSandbox)}
                    className={`p-2 rounded-lg transition-colors ${showSandbox ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                    title="Scenario Sandbox"
                >
                    <Calculator size={18} />
                </button>
                {viewMode === 'edit' && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <Edit2 size={18} />
                    </button>
                )}
            </div>
        </div>

        {showSandbox && (
            <div className="mb-6 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl animate-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-sm flex items-center gap-2">
                        <Settings2 size={16} className="text-indigo-400" /> Scenario Modeling
                    </h3>
                    <div className="text-[10px] font-bold text-indigo-400 bg-indigo-900/50 px-2 py-1 rounded uppercase tracking-widest border border-indigo-500/20">Agentic Sandbox</div>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-400">Monthly Growth Rate</span>
                            <span className="font-bold text-indigo-400">{sandboxInputs.growth}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="50" step="1"
                            value={sandboxInputs.growth}
                            onChange={e => { setSandboxInputs({...sandboxInputs, growth: Number(e.target.value)}); setScenarioAudit(null); }}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-400">Net Revenue Churn</span>
                            <span className="font-bold text-rose-400">{sandboxInputs.churn}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="15" step="0.5"
                            value={sandboxInputs.churn}
                            onChange={e => { setSandboxInputs({...sandboxInputs, churn: Number(e.target.value)}); setScenarioAudit(null); }}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                    </div>
                </div>

                {scenarioAudit ? (
                    <div className="mt-6 bg-slate-800 rounded-xl p-4 border border-slate-700 animate-in zoom-in-95">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <BrainCircuit size={16} className="text-purple-400" />
                                <span className="text-xs font-bold uppercase text-slate-300">Gemini Strategic Audit</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 border border-emerald-400/30 px-1.5 py-0.5 rounded">{scenarioAudit.confidence}% Confidence</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed italic">"{scenarioAudit.feedback}"</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {scenarioAudit.flags.map(f => (
                                <span key={f} className="text-[9px] font-bold uppercase bg-slate-700 px-2 py-0.5 rounded text-indigo-300 border border-indigo-500/20">{f}</span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-end">
                        <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Projected Valuation (12mo)</div>
                            <div className="text-2xl font-bold text-indigo-400">${Math.round(mrr * 12 * (1 + (sandboxInputs.growth/100) * 12) * (1 - (sandboxInputs.churn/100)) * 5).toLocaleString()}</div>
                        </div>
                        <button 
                            onClick={handleRunScenarioAudit}
                            disabled={isAnalyzingScenario}
                            className="text-[10px] font-bold text-indigo-300 hover:text-white uppercase flex items-center gap-2 group disabled:opacity-50"
                        >
                            {isAnalyzingScenario ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                            Run Gemini Audit <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        )}

        {isEditing ? (
            <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">MRR ($)</label>
                        <input type="number" value={formData.mrr} onChange={e => setFormData({...formData, mrr: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Active Users</label>
                        <input type="number" value={formData.activeUsers} onChange={e => setFormData({...formData, activeUsers: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                </div>

                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center group hover:border-indigo-400 transition-colors">
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".csv" />
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        {isAuditing ? <Loader2 size={32} className="animate-spin text-indigo-500 mb-2"/> : <FileUp size={32} className="text-slate-300 group-hover:text-indigo-500 mb-2" />}
                        <div className="text-sm font-bold text-slate-700">Audit Transactions</div>
                        <div className="text-xs text-slate-400 mt-1">Upload CSV for Anomaly Detection</div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded">Cancel</button>
                    <button onClick={handleSaveClick} className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700">Save Changes</button>
                </div>
            </div>
        ) : (
            <div className="space-y-6">
                {auditResult && (
                    <div className="bg-indigo-900 text-white p-4 rounded-xl border border-indigo-700 animate-in slide-in-from-top-2">
                        <div className="flex items-start gap-3">
                            <Sparkles className="text-indigo-300 mt-1" size={18} />
                            <div className="flex-1">
                                <h4 className="font-bold text-sm">Forensic Audit Summary</h4>
                                <div className="text-xs text-indigo-200 mt-2 space-y-1">
                                    <p>• Anomalies: {auditResult.anomalies?.length || 0} flagged</p>
                                    <p>• Avg Burn: ${auditResult.metrics?.monthly_burn?.toLocaleString()}</p>
                                    <p>• Runway: {auditResult.metrics?.runway_months} Months</p>
                                </div>
                            </div>
                            <button onClick={() => setAuditResult(null)} className="p-1 hover:bg-white/10 rounded"><X size={14}/></button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1"><DollarSign size={14} /> MRR</div>
                        <div className="text-2xl font-bold text-slate-900">${mrr.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1"><Users size={14} /> Users</div>
                        <div className="text-2xl font-bold text-slate-900">{activeUsers.toLocaleString()}</div>
                    </div>
                </div>

                <div className="h-40 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <XAxis dataKey="month" hide />
                            <YAxis hide />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="#10b98120" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}
    </div>
  );
};
