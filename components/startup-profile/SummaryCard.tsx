
import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Copy, Check, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { WizardService } from '../../services/wizardAI';
import { API_KEY } from '../../lib/env';

export const SummaryCard: React.FC = () => {
  const { profile, updateProfile } = useData();
  const { success, toast } = useToast();
  const [score, setScore] = useState(0);
  const [missing, setMissing] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!profile) return;
    let s = 0;
    const m: string[] = [];
    
    if (profile.name) s += 10;
    if (profile.tagline) s += 10; else m.push("Tagline");
    if (profile.problemStatement) s += 15; else m.push("Problem");
    if (profile.solutionStatement) s += 15; else m.push("Solution");
    if (profile.fundingGoal > 0) s += 10;
    if (profile.businessModel) s += 10;
    
    // Check founders via length (mock logic as founders array isn't in profile obj directly here but assume it's loaded in context)
    // For simplicity, relying on profile strength field or recalc
    s = Math.min(s + 30, 100); // Pad for now

    setScore(s);
    setMissing(m);
  }, [profile]);

  const handleRegenerate = async () => {
      if (!API_KEY || !profile) return;
      setIsGenerating(true);
      try {
          const summary = await WizardService.generateSummary(profile, API_KEY);
          if (summary) {
              updateProfile({ description: summary }); // Using description field for summary
              success("Summary regenerated");
          }
      } finally {
          setIsGenerating(false);
      }
  };

  const handleCopy = () => {
      if (profile?.description) {
          navigator.clipboard.writeText(profile.description.replace(/<[^>]+>/g, ''));
          success("Copied to clipboard");
      }
  };

  if (!profile) return null;

  return (
    <div className="space-y-6">
        {/* Strength */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Trophy className="text-amber-500" size={18} /> Profile Strength
                    </h3>
                </div>
                <span className={`text-2xl font-bold ${score < 80 ? 'text-amber-500' : 'text-green-500'}`}>{score}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                <div className={`h-full rounded-full ${score < 80 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${score}%` }}></div>
            </div>
            {missing.length > 0 ? (
                <div className="space-y-2">
                    {missing.map(item => (
                        <div key={item} className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded">
                            <AlertTriangle size={10} /> Add {item}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-xs text-green-600 flex items-center gap-1 font-medium"><Check size={12}/> Ready to share</div>
            )}
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-md p-6 text-white relative overflow-hidden">
            <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-purple-400" size={18} />
                    <h3 className="font-bold">Investor Summary</h3>
                </div>
                <div className="flex gap-1">
                    <button onClick={handleRegenerate} disabled={isGenerating} className="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors">
                        <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""}/>
                    </button>
                    <button onClick={handleCopy} className="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors">
                        <Copy size={14} />
                    </button>
                </div>
            </div>
            
            <div className="relative z-10 text-sm text-slate-300 leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {profile.description ? (
                    <div dangerouslySetInnerHTML={{ __html: profile.description }} />
                ) : (
                    <p className="italic text-slate-500">No summary generated yet.</p>
                )}
            </div>

            {/* Background Blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
    </div>
  );
};
