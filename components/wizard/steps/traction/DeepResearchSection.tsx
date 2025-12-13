
import React from 'react';
import { Microscope, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { DeepResearchView } from '../../intelligence/DeepResearchView';

interface DeepResearchSectionProps {
  onRunResearch: () => void;
  isResearching: boolean;
  status: string;
  report: any;
}

export const DeepResearchSection: React.FC<DeepResearchSectionProps> = ({ 
  onRunResearch, isResearching, status, report 
}) => {
  return (
    <div className="border-t border-slate-200 pt-10">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Microscope className="text-indigo-600" size={24} /> Investor Reality Check
                </h3>
                <p className="text-slate-500 text-sm">Deep-dive market analysis powered by Gemini 3 Pro Search.</p>
            </div>
            <button 
                onClick={onRunResearch}
                disabled={isResearching}
                className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
            >
                {isResearching ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {isResearching ? 'Analyst Working...' : 'Deep Research & Trends'}
            </button>
        </div>

        {/* Info Box */}
        {!isResearching && !report && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800 mb-6">
                <AlertCircle size={20} className="shrink-0 text-blue-600" />
                <p>
                    This will run a <strong>multi-step agent</strong> that researches your industry, finds real competitor data from 2024/25, and validates your valuation assumptions. It takes about 20-30 seconds.
                </p>
            </div>
        )}

        <DeepResearchView 
          report={report} 
          isLoading={isResearching} 
          loadingStatus={status}
        />
    </div>
  );
};
