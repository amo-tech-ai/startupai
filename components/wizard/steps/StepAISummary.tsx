
import React from 'react';
import { Sparkles, Globe, Search, ArrowRight, Target, CheckCircle2, TrendingUp, AlertCircle, BarChart3, Database } from 'lucide-react';
import { WizardFormData } from '../types';

interface StepAISummaryProps {
  formData: WizardFormData;
  onNext: () => void;
  onBack: () => void;
}

export const StepAISummary: React.FC<StepAISummaryProps> = ({ formData, onNext, onBack }) => {
  const analysis = formData.aiAnalysisResult;
  const summaryScreen = analysis?.summary_screen;
  const workflows = analysis?.workflows;

  if (!summaryScreen) {
      return (
          <div className="text-center py-20">
              <p className="text-slate-500">No analysis results found. Please go back and run the Smart Intake.</p>
              <button onClick={onBack} className="mt-4 text-indigo-600 font-bold hover:underline">Back to Intake</button>
          </div>
      );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8 animate-in slide-in-from-right-4 duration-500">
      
      {/* LEFT COLUMN: Main Summary (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Sparkles size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{summaryScreen.title || "AI Executive Summary"}</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 leading-relaxed">
                    {summaryScreen.summary}
                </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
                {summaryScreen.industry_detected && (
                    <div className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium flex items-center gap-2">
                        <Target size={14} /> {summaryScreen.industry_detected}
                    </div>
                )}
                {workflows?.url_context_ran && (
                    <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2 border border-green-100">
                        <Globe size={14} /> URL Context Extracted
                    </div>
                )}
                {workflows?.search_grounding_ran && (
                    <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 border border-blue-100">
                        <Database size={14} /> Search Grounded
                    </div>
                )}
            </div>
         </div>

         {/* Workflow Status */}
         <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-600"/> Analysis Status
            </h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 flex items-center gap-2"><Globe size={14}/> URLs Analyzed</span>
                    <span className="font-medium text-slate-900">{summaryScreen.urls_used?.length || 0} Sources</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 flex items-center gap-2"><Search size={14}/> Search Queries</span>
                    <span className="font-medium text-slate-900">{summaryScreen.search_queries?.length || 0} Queries Run</span>
                </div>
                {workflows?.missing_inputs && workflows.missing_inputs.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wide flex items-center gap-1 mb-2">
                            <AlertCircle size={12}/> Suggestions
                        </span>
                        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                            {workflows.next_actions?.map((action, i) => (
                                <li key={i}>{action}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
         </div>
      </div>

      {/* RIGHT COLUMN: Detected Signals (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 p-6 rounded-2xl shadow-xl text-white">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <BarChart3 size={20} className="text-purple-400"/> Detected Signals
              </h3>
              
              <div className="space-y-4">
                  {summaryScreen.detected_signals.map((signal, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/15 transition-colors">
                          <div className="text-xs text-purple-300 font-bold uppercase tracking-wide mb-1">{signal.label}</div>
                          <div className="text-sm font-medium text-white leading-relaxed">{signal.value}</div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-3">Next Steps</h3>
              <p className="text-sm text-slate-500 mb-4">
                  Review these insights. In the next steps, you can refine your Team, Business Model, and Traction metrics.
              </p>
              <button 
                onClick={onNext}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              >
                  Continue to Team <ArrowRight size={18}/>
              </button>
          </div>
      </div>

    </div>
  );
};
