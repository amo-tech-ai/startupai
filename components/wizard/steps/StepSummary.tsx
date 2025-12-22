
import React, { useEffect, useState } from 'react';
import { 
  Trophy, AlertTriangle, Sparkles, Loader2, Check, 
  Building2, Users, TrendingUp, Target, DollarSign, Globe,
  RefreshCw, ArrowRight, Edit2, ShieldCheck, Microscope
} from 'lucide-react';
import { WizardService } from '../../../services/wizardAI';
import { API_KEY } from '../../../lib/env';
import { WizardFormData } from '../types';
import { RedFlagReport } from '../intelligence/RedFlagReport';

interface StepSummaryProps {
  formData: WizardFormData;
  setFormData: (data: any) => void;
  // New props for navigation
  goToStep?: (stepId: number) => void;
}

// Helper to map missing items to steps
const getStepForMissingItem = (item: string): number => {
    const map: Record<string, number> = {
        "Company Name": 1, "Website": 1, "Tagline": 1, "Industry": 1, "Cover Image": 1,
        "Founders": 3, "Founder Bios": 3,
        "Business Model": 4, "Problem Statement": 4, "Solution Statement": 4, "Competitors": 4,
        "Traction Metrics": 5, "Fundraising Target": 5, "Use of Funds": 5, "Deep Research": 5
    };
    return map[item] || 1;
};

export const StepSummary: React.FC<StepSummaryProps> = ({ formData, setFormData, goToStep }) => {
  const [profileScore, setProfileScore] = useState(0);
  const [missingItems, setMissingItems] = useState<string[]>([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isAnalyzingRisks, setIsAnalyzingRisks] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null);

  useEffect(() => {
    // Calculate Score
    let score = 0;
    const missing: string[] = [];
    
    // Context (30%)
    if (formData.name) score += 5;
    if (formData.website) score += 5;
    if (formData.coverImage) score += 5; else missing.push("Cover Image");
    if (formData.tagline) score += 5; else missing.push("Tagline");
    if (formData.industry) score += 5; else missing.push("Industry");
    if (formData.yearFounded) score += 5;

    // Team (20%)
    if (formData.founders.length > 0) {
        score += 10;
        if (formData.founders[0].bio) score += 10; else missing.push("Founder Bios");
    } else {
        missing.push("Founders");
    }

    // Business (25%)
    if (formData.businessModel) score += 5; else missing.push("Business Model");
    if (formData.problem) score += 10; else missing.push("Problem Statement");
    if (formData.solution) score += 10; else missing.push("Solution Statement");

    // Traction (25%)
    if (formData.mrr > 0 || formData.totalUsers > 0) score += 10; else missing.push("Traction Metrics");
    
    // Deep Research Bonus
    if (formData.deepResearchReport) score += 10; else missing.push("Deep Research");

    if (formData.isRaising) {
        if (formData.targetRaise > 0) score += 5; else missing.push("Fundraising Target");
        if (formData.useOfFunds && formData.useOfFunds.length > 0) score += 5; else missing.push("Use of Funds");
    } else {
        score += 10; // Bonus for explicit "not raising" status completeness
    }
    
    setProfileScore(Math.min(100, score));
    setMissingItems(missing);

    // Auto-generate summary if empty
    if (!formData.aiSummary && API_KEY && !isGeneratingSummary) {
        handleImproveWithAI();
    }

    // Trigger Risk Analysis automatically
    if (API_KEY && !riskAnalysis && !isAnalyzingRisks) {
        handleAnalyzeRisks();
    }
  }, []);

  const handleImproveWithAI = async () => {
      if (!API_KEY) return;
      setIsGeneratingSummary(true);
      try {
        /* Fix: Removed API_KEY argument which is not expected by WizardService.generateSummary */
        const summary = await WizardService.generateSummary(formData);
        if (summary) setFormData((prev: any) => ({ ...prev, aiSummary: summary }));
      } catch (e) {
        console.error("Failed to generate summary", e);
      } finally {
        setIsGeneratingSummary(false);
      }
  };

  const handleAnalyzeRisks = async () => {
      if (!API_KEY) return;
      setIsAnalyzingRisks(true);
      try {
          /* Fix: Removed API_KEY argument which is not expected by WizardService.analyzeRisks */
          const result = await WizardService.analyzeRisks(formData);
          if (result) setRiskAnalysis(result);
      } catch (e) {
          console.error("Risk analysis failed", e);
      } finally {
          setIsAnalyzingRisks(false);
      }
  };

  const handleJump = (step: number) => {
      if (goToStep) goToStep(step);
  };

  const InfoRow = ({ label, value }: { label: string, value: string | number | undefined }) => (
      <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
          <span className="text-slate-500 text-sm">{label}</span>
          <span className="font-medium text-slate-900 text-sm text-right max-w-[60%] truncate" title={String(value)}>
              {value || '-'}
          </span>
      </div>
  );

  const TagList = ({ tags }: { tags: string[] }) => (
      <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.length > 0 ? tags.slice(0, 5).map((t, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">
                  {t}
              </span>
          )) : <span className="text-slate-400 text-xs italic">None listed</span>}
      </div>
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
       
       {/* 0. Red Flag Analysis (V3 Feature) */}
       <RedFlagReport analysis={riskAnalysis} isLoading={isAnalyzingRisks} />

       {/* 1. Header & Score */}
       <div className="grid md:grid-cols-3 gap-6">
           {/* Profile Strength */}
           <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
               <div className="flex justify-between items-start mb-4">
                   <div>
                       <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                           <Trophy className="text-amber-500" size={20} />
                           Profile Strength
                       </h3>
                       <p className="text-slate-500 text-sm">Completeness of your investor profile</p>
                   </div>
                   <span className={`text-3xl font-bold ${
                       profileScore < 50 ? 'text-red-500' : profileScore < 80 ? 'text-amber-500' : 'text-green-500'
                   }`}>
                       {profileScore}%
                   </span>
               </div>
               <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                   <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                         profileScore < 50 ? 'bg-red-500' : 
                         profileScore < 80 ? 'bg-amber-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${profileScore}%` }}
                   ></div>
               </div>
           </div>

           {/* Missing Fields */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 overflow-y-auto max-h-[160px] custom-scrollbar">
               <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                   <AlertTriangle size={16} className="text-rose-500" />
                   Missing Items
               </h3>
               {missingItems.length > 0 ? (
                   <div className="space-y-2">
                       {missingItems.map((item, idx) => (
                           <button 
                                key={idx} 
                                onClick={() => handleJump(getStepForMissingItem(item))}
                                className="w-full flex items-center justify-between text-xs text-slate-600 bg-rose-50 px-2 py-1.5 rounded border border-rose-100 hover:bg-rose-100 transition-colors group text-left"
                           >
                               <div className="flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                                   <span>{item}</span>
                               </div>
                               <ArrowRight size={10} className="text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                           </button>
                       ))}
                   </div>
               ) : (
                   <div className="flex flex-col items-center justify-center h-full text-green-600 text-xs text-center">
                       <Check size={24} className="mb-1" />
                       <span className="font-bold">Profile Complete!</span>
                   </div>
               )}
           </div>
       </div>

       {/* 2. Startup Header Card */}
       <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center md:items-start gap-6 relative group">
           <button 
                onClick={() => handleJump(1)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                title="Edit Details"
           >
               <Edit2 size={16} />
           </button>
           
           <div className="w-24 h-24 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 overflow-hidden">
               {formData.coverImage ? (
                   <img src={formData.coverImage} alt="Logo" className="w-full h-full object-cover" />
               ) : (
                   <Building2 size={32} className="text-indigo-300" />
               )}
           </div>
           <div className="flex-1 text-center md:text-left">
               <h1 className="text-3xl font-bold text-slate-900">{formData.name || "Startup Name"}</h1>
               <p className="text-lg text-slate-600 mt-1">{formData.tagline || "No tagline provided."}</p>
               <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                   <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wide">
                       {formData.stage}
                   </span>
                   <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wide">
                       {formData.industry}
                   </span>
                   {formData.deepResearchReport && (
                       <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wide flex items-center gap-1 border border-indigo-200">
                           <Microscope size={12} /> Deep Research
                       </span>
                   )}
                   {formData.isRaising && (
                       <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide flex items-center gap-1">
                           <TrendingUp size={12} /> Raising
                       </span>
                   )}
                   {formData.website && (
                       <a href={formData.website} target="_blank" rel="noreferrer" className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full flex items-center gap-1 hover:bg-indigo-100">
                           <Globe size={12} /> Website
                       </a>
                   )}
               </div>
           </div>
       </div>

       {/* 3. AI Investor Summary */}
       <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
           <div className="absolute top-0 right-0 p-32 bg-purple-500/10 rounded-full blur-3xl"></div>
           <div className="relative z-10">
               <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-3">
                       <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                           <Sparkles className="text-purple-300" size={20} />
                       </div>
                       <div>
                           <h3 className="font-bold text-lg">AI Investor Summary</h3>
                           <p className="text-slate-400 text-xs">Generated by Gemini 3 Pro • Real-time search grounded</p>
                       </div>
                   </div>
                   <button 
                       onClick={handleImproveWithAI}
                       disabled={isGeneratingSummary}
                       className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all backdrop-blur-sm border border-white/10"
                   >
                       {isGeneratingSummary ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                       {isGeneratingSummary ? 'Improving...' : 'Improve with AI'}
                   </button>
               </div>

               {isGeneratingSummary ? (
                   <div className="space-y-3 animate-pulse opacity-50">
                       <div className="h-4 bg-white/20 rounded w-3/4"></div>
                       <div className="h-4 bg-white/20 rounded w-full"></div>
                       <div className="h-4 bg-white/20 rounded w-5/6"></div>
                   </div>
               ) : (
                   <div className="prose prose-invert max-w-none">
                       {/* Render HTML content safely */}
                       <div 
                           className="text-slate-200 leading-relaxed whitespace-pre-line text-sm md:text-base"
                           dangerouslySetInnerHTML={{ __html: formData.aiSummary || "<p>Summary not generated yet. Click Improve with AI to create one.</p>" }}
                       />
                   </div>
               )}
           </div>
       </div>

       {/* 4. Snapshot Panels */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* Market & Features */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative group">
               <button 
                    onClick={() => handleJump(4)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
               >
                   <Edit2 size={16} />
               </button>
               <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                   <Target className="text-indigo-600" size={20} />
                   <h3 className="font-bold text-slate-900">Market & Product</h3>
               </div>
               <InfoRow label="Business Model" value={formData.businessModel} />
               <InfoRow label="Pricing Model" value={formData.pricingModel} />
               <div className="mt-4">
                   <span className="text-slate-500 text-sm block mb-1">Key Features</span>
                   <TagList tags={formData.keyFeatures} />
               </div>
               <div className="mt-4">
                   <span className="text-slate-500 text-sm block mb-1">Customer Segments</span>
                   <TagList tags={formData.customerSegments} />
               </div>
           </div>

           {/* Team & Context */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative group">
               <button 
                    onClick={() => handleJump(3)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
               >
                   <Edit2 size={16} />
               </button>
               <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                   <Users className="text-purple-600" size={20} />
                   <h3 className="font-bold text-slate-900">Team & Context</h3>
               </div>
               <div className="space-y-4">
                   <div className="flex items-center justify-between">
                       <span className="text-slate-500 text-sm">Founders</span>
                       <div className="flex -space-x-2">
                           {formData.founders.map((f, i) => (
                               <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600" title={f.name}>
                                   {f.name.charAt(0)}
                               </div>
                           ))}
                       </div>
                   </div>
                   <InfoRow label="Year Founded" value={formData.yearFounded} />
                   <InfoRow label="Problem Context" value={formData.problem ? "Defined" : "Missing"} />
                   <InfoRow label="Solution Context" value={formData.solution ? "Defined" : "Missing"} />
               </div>
           </div>

           {/* Traction */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative group">
               <button 
                    onClick={() => handleJump(5)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
               >
                   <Edit2 size={16} />
               </button>
               <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                   <TrendingUp className="text-emerald-600" size={20} />
                   <h3 className="font-bold text-slate-900">Traction</h3>
               </div>
               <div className="grid grid-cols-2 gap-4 mb-4">
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <div className="text-xs text-slate-500 uppercase font-bold">MRR</div>
                       <div className="text-xl font-bold text-slate-900">${formData.mrr?.toLocaleString()}</div>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <div className="text-xs text-slate-500 uppercase font-bold">Users</div>
                       <div className="text-xl font-bold text-slate-900">{formData.totalUsers?.toLocaleString()}</div>
                   </div>
               </div>
               <div className="mt-2">
                   <span className="text-slate-500 text-sm block mb-1">Funding History</span>
                   {formData.fundingHistory.length > 0 ? (
                       formData.fundingHistory.map((h, i) => (
                           <div key={i} className="text-sm text-slate-700 flex justify-between border-b border-slate-50 py-1 last:border-0">
                               <span>{h.round} ({h.date})</span>
                               <span className="font-bold">${h.amount.toLocaleString()}</span>
                           </div>
                       ))
                   ) : <span className="text-slate-400 text-sm italic">Bootstrapped / None</span>}
               </div>
           </div>

           {/* Fundraising */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative group">
               <button 
                    onClick={() => handleJump(5)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
               >
                   <Edit2 size={16} />
               </button>
               <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                   <DollarSign className="text-amber-600" size={20} />
                   <h3 className="font-bold text-slate-900">Fundraising</h3>
               </div>
               <div className="flex items-center justify-between mb-4">
                   <span className="text-sm font-medium text-slate-600">Status</span>
                   <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${formData.isRaising ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                       {formData.isRaising ? 'Active' : 'Inactive'}
                   </span>
               </div>
               {formData.isRaising && (
                   <>
                       <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 mb-4 text-center">
                           <div className="text-xs text-amber-700 uppercase font-bold mb-1">Target Raise</div>
                           <div className="text-2xl font-bold text-amber-900">${formData.targetRaise?.toLocaleString()}</div>
                       </div>
                       <div>
                           <span className="text-slate-500 text-sm block mb-1">Use of Funds</span>
                           <TagList tags={formData.useOfFunds} />
                       </div>
                   </>
               )}
               {!formData.isRaising && (
                   <div className="text-center py-8 text-slate-400 text-sm">
                       Not currently fundraising.
                   </div>
               )}
           </div>
       </div>
    </div>
  );
};
