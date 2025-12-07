
import React, { useEffect, useState } from 'react';
import { Trophy, AlertTriangle, ArrowRight, Sparkles, Loader2, Check } from 'lucide-react';
import { WizardService } from '../../../services/wizardAI';
import { API_KEY } from '../../../lib/env';

interface StepSummaryProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const StepSummary: React.FC<StepSummaryProps> = ({ formData, setFormData }) => {
  const [profileScore, setProfileScore] = useState(0);
  const [missingItems, setMissingItems] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Calculate Score
    let score = 0;
    const missing = [];
    if (formData.name) score += 10;
    if (formData.website) score += 10;
    if (formData.tagline) score += 10;
    if (formData.founders.length > 0 && formData.founders[0].bio) score += 20; else missing.push("Founder Bios");
    if (formData.businessModel) score += 10; else missing.push("Business Model");
    if (formData.mrr > 0 || formData.totalUsers > 0) score += 20; else missing.push("Traction Metrics");
    if (formData.competitors.length > 0) score += 10; else missing.push("Competitors");
    if (formData.coreDifferentiator) score += 10; else missing.push("Differentiator");
    
    setProfileScore(Math.min(100, score));
    setMissingItems(missing);

    // Auto-generate summary if empty
    if (!formData.aiSummary && API_KEY) {
        setIsGenerating(true);
        WizardService.generateSummary(formData, API_KEY).then(summary => {
            if (summary) setFormData((prev:any) => ({...prev, aiSummary: summary}));
            setIsGenerating(false);
        });
    }
  }, []);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
       <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Review & Summary</h2>
          <p className="text-slate-500">Ensure your profile is investor-ready.</p>
       </div>

       {/* PROFILE STRENGTH */}
       <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-8 items-center">
             <div className="flex-1 w-full">
                <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center gap-2">
                      <Trophy className="text-amber-500" />
                      <h3 className="font-bold text-xl text-slate-900">Profile Strength</h3>
                   </div>
                   <span className="text-3xl font-bold text-slate-900">{profileScore}%</span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                   <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                         profileScore < 50 ? 'bg-red-500' : 
                         profileScore < 80 ? 'bg-amber-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${profileScore}%` }}
                   ></div>
                </div>
             </div>
             
             <div className="w-full md:w-1/3 space-y-2">
                {missingItems.length > 0 ? (
                   missingItems.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                         <AlertTriangle size={14} className="text-amber-500" />
                         <span>Add <strong>{item}</strong></span>
                         <ArrowRight size={14} className="ml-auto text-slate-400" />
                      </div>
                   ))
                ) : (
                   <div className="flex items-center gap-2 text-green-700 bg-green-50 p-4 rounded-lg font-bold">
                      <Check size={20} /> All set! Great profile.
                   </div>
                )}
             </div>
          </div>
       </div>

       {/* AI SUMMARY CARD */}
       <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white flex justify-between items-center">
             <div>
                <h3 className="font-bold text-lg">{formData.name}</h3>
                <div className="flex gap-2 mt-2">
                   <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-medium">{formData.industry || 'Tech'}</span>
                   <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-medium">{formData.isRaising ? 'Raising' : 'Active'}</span>
                </div>
             </div>
             <div className="p-3 bg-white/10 rounded-xl">
                <Sparkles className="text-purple-300" />
             </div>
          </div>
          
          <div className="p-8">
             <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Investor Summary (AI Generated)</h4>
             {isGenerating ? (
                <div className="flex items-center gap-3 text-slate-400 py-8">
                   <Loader2 className="animate-spin" /> Generating executive summary...
                </div>
             ) : (
                <div className="prose prose-slate max-w-none">
                   <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-line">
                      {formData.aiSummary || "No summary generated."}
                   </p>
                </div>
             )}
             
             <div className="mt-8 flex justify-end">
                <button 
                   onClick={() => {
                      setIsGenerating(true);
                      WizardService.generateSummary(formData, API_KEY!).then(s => {
                         if(s) setFormData((prev:any) => ({...prev, aiSummary: s}));
                         setIsGenerating(false);
                      });
                   }}
                   className="text-purple-600 font-bold hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                   Regenerate Summary
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};
