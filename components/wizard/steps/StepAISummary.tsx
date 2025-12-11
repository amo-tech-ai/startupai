
import React from 'react';
import { 
  Sparkles, Globe, Search, ArrowRight, Target, CheckCircle2, 
  AlertCircle, BarChart3, Database, Layers, ShieldCheck, Zap,
  User, Briefcase, GraduationCap, Link as LinkIcon, Cpu
} from 'lucide-react';
import { WizardFormData } from '../types';

interface StepAISummaryProps {
  formData: WizardFormData;
  onNext: () => void;
  onBack: () => void;
}

export const StepAISummary: React.FC<StepAISummaryProps> = ({ formData, onNext, onBack }) => {
  const analysis = formData.aiAnalysisResult;
  const summaryScreen = analysis?.summary_screen;
  const founderData = analysis?.founder_intelligence;
  const website = analysis?.website_analysis;
  const research = analysis?.research_data;
  const signals = analysis?.detected_signals;
  const workflows = analysis?.workflows;

  if (!summaryScreen) {
      return (
          <div className="text-center py-20">
              <p className="text-slate-500">No analysis results found. Please go back and run the Smart Intake.</p>
              <button onClick={onBack} className="mt-4 text-indigo-600 font-bold hover:underline">Back to Intake</button>
          </div>
      );
  }

  const founders = founderData?.founders || [];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-20">
      
      {/* 1. HERO SUMMARY */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
         <div className="relative z-10">
            <div className="flex flex-col md:flex-row gap-6 md:items-start">
               <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 shrink-0 self-start">
                  <Sparkles size={32} className="text-purple-300" />
               </div>
               <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                     {summaryScreen.badges?.map((badge: string, i: number) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 border border-indigo-400/30 text-indigo-100">
                           {badge}
                        </span>
                     ))}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{formData.name}</h2>
                  <p className="text-lg text-slate-300 leading-relaxed max-w-4xl">
                     {summaryScreen.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-6 text-sm font-medium text-slate-400">
                     {summaryScreen.industry_detected && (
                        <div className="flex items-center gap-1.5"><Layers size={14}/> {summaryScreen.industry_detected}</div>
                     )}
                     {summaryScreen.product_category && (
                        <div className="flex items-center gap-1.5"><Target size={14}/> {summaryScreen.product_category}</div>
                     )}
                     {research && (
                        <div className="flex items-center gap-1.5 text-emerald-400"><Search size={14}/> {research.sources_count} Sources Scanned</div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
         
         {/* LEFT COLUMN: Founder & Website Intel (7 Cols) */}
         <div className="lg:col-span-7 space-y-6">
            
            {/* 2. FOUNDER INTELLIGENCE */}
            {founders.length > 0 && (
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                     <div className="flex items-center gap-2 font-bold text-slate-700 text-sm uppercase tracking-wide">
                        <User size={16} className="text-indigo-600"/> Team Intelligence
                     </div>
                     <div className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        <LinkIcon size={10} /> {founders.length} Profiles Found
                     </div>
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    {founders.map((founder, idx) => (
                        <div key={idx} className="p-6">
                            <div className="flex gap-4 items-start mb-4">
                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-xl font-bold border-2 border-white shadow-sm shrink-0">
                                    {founder.name ? founder.name.charAt(0) : '?'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{founder.name || "Founder Name"}</h3>
                                    <div className="text-indigo-600 font-medium text-sm">{founder.title}</div>
                                    <p className="text-xs text-slate-500 mt-1">{founder.headline}</p>
                                </div>
                            </div>
                            
                            <div className="prose prose-sm text-slate-600 mb-4">
                                <p>{founder.bio}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex gap-3 items-start">
                                    <Briefcase size={14} className="text-slate-400 mt-0.5 shrink-0"/>
                                    <div className="flex-1">
                                        <span className="text-[10px] font-bold text-slate-900 uppercase block mb-1">Highlights</span>
                                        <ul className="list-disc list-outside ml-3 text-xs text-slate-600 space-y-0.5">
                                            {founder.experience_bullets?.slice(0, 2).map((exp, i) => (
                                                <li key={i}>{exp}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <Zap size={14} className="text-amber-400 mt-0.5 shrink-0"/>
                                    <div className="flex-1">
                                        <span className="text-[10px] font-bold text-slate-900 uppercase block mb-1">Skills</span>
                                        <div className="flex flex-wrap gap-1">
                                            {founder.skills?.slice(0, 4).map((skill, i) => (
                                                <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded border border-slate-200">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                  </div>
               </div>
            )}

            {/* 3. WEBSITE CONTEXT */}
            {website && (
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                     <Globe size={18} className="text-indigo-600"/> Website Intelligence
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">Value Proposition</div>
                        <p className="text-sm text-slate-800 font-medium leading-relaxed">"{website.value_prop}"</p>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">Target Audience</div>
                        <p className="text-sm text-slate-800 font-medium leading-relaxed">{website.target_audience}</p>
                     </div>
                     <div className="col-span-2">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">Key Features Extracted</div>
                        <div className="flex flex-wrap gap-2">
                           {website.key_features?.map((f, i) => (
                              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm">
                                 <CheckCircle2 size={12} className="text-green-500"/> {f}
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* RIGHT COLUMN: Signals & Actions (5 Cols) */}
         <div className="lg:col-span-5 space-y-6">
            
            {/* 4. DETECTED SIGNALS MATRIX */}
            <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 text-white">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-purple-400"/> Detected Signals
               </h3>
               
               <div className="space-y-4">
                  {[
                     { title: "General", data: signals?.general, icon: <Database size={14}/>, color: "text-blue-400" },
                     { title: "Product", data: signals?.product, icon: <Cpu size={14}/>, color: "text-purple-400" },
                     { title: "Market", data: signals?.market, icon: <Globe size={14}/>, color: "text-emerald-400" },
                     { title: "Founder Fit", data: signals?.founder, icon: <User size={14}/>, color: "text-amber-400" }
                  ].map((cat, idx) => (
                     <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/5">
                        <div className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${cat.color}`}>
                           {cat.icon} {cat.title}
                        </div>
                        <div className="space-y-2">
                           {cat.data?.map((sig: any, i: number) => (
                              <div key={i} className="flex justify-between items-start text-sm">
                                 <span className="text-slate-400">{sig.label}</span>
                                 <span className="font-medium text-slate-100 text-right">{sig.value}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* 5. NEXT ACTIONS */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <Zap size={18} className="text-amber-500"/> Recommended Actions
               </h3>
               <div className="space-y-2">
                  {workflows?.next_actions?.map((action, i) => (
                     <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-900">
                        <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0"/>
                        {action}
                     </div>
                  ))}
                  <div className="flex items-start gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-900">
                     <CheckCircle2 size={16} className="text-indigo-600 mt-0.5 shrink-0"/>
                     Profile auto-filled. Review in next steps.
                  </div>
               </div>
            </div>

            {/* CTA */}
            <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-600/20 text-center">
               <h3 className="font-bold text-lg mb-2">Analysis Complete</h3>
               <p className="text-indigo-100 text-sm mb-4">Your profile has been enriched with 50+ data points.</p>
               <button 
                  onClick={onNext}
                  className="w-full py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
               >
                  Continue to Team <ArrowRight size={18}/>
               </button>
            </div>

         </div>
      </div>

      {/* 6. RESEARCH LOG (Bottom Terminal) */}
      <div className="bg-black/90 rounded-xl p-4 font-mono text-xs text-green-400 border border-slate-800 shadow-inner overflow-hidden">
         <div className="flex items-center gap-2 mb-2 text-slate-500 uppercase tracking-widest text-[10px] font-bold border-b border-slate-800 pb-2">
            <Search size={10}/> AI Research Log
         </div>
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1">
            {research?.queries_used?.map((q, i) => (
               <div key={i} className="truncate">
                  <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  <span className="opacity-80">&gt; searching: "{q}"...</span>
               </div>
            ))}
            <div className="animate-pulse text-green-500">&gt; analysis_complete_</div>
         </div>
      </div>

    </div>
  );
};
