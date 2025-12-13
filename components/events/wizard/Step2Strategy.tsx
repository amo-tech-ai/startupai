
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, AlertTriangle, Users, Wallet, Lightbulb, 
  CheckCircle2, ArrowRight, BrainCircuit 
} from 'lucide-react';
import { EventStrategyAnalysis } from '../../../types';

// Workaround for strict type checking
const MotionDiv = motion.div as any;

interface Step2StrategyProps {
  analysis: EventStrategyAnalysis | null;
  isLoading: boolean;
}

export const Step2Strategy: React.FC<Step2StrategyProps> = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
        <BrainCircuit size={48} className="text-indigo-600 mb-6 animate-pulse" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Gemini is analyzing your event strategy...</h3>
        <p className="text-slate-500 max-w-md">Reasoning about budget feasibility, audience alignment, and potential operational risks.</p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 pb-32">
      
      {/* 1. Scorecard Header */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-300 font-bold text-sm uppercase tracking-wide">
              <BrainCircuit size={16} /> Intelligence Brief
            </div>
            <h2 className="text-3xl font-bold mb-4">Strategy Assessment</h2>
            <p className="text-slate-300 leading-relaxed max-w-2xl text-lg">
              {analysis.reasoning}
            </p>
          </div>
          
          {/* Feasibility Score */}
          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 min-w-[160px]">
            <div className={`text-5xl font-bold mb-1 ${analysis.feasibilityScore > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {analysis.feasibilityScore}
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Feasibility</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* 2. Risks Radar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
            <AlertTriangle size={20} className="text-rose-500" /> Risk Analysis
          </h3>
          <div className="space-y-3">
            {analysis.risks.map((risk, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${risk.severity === 'High' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{risk.title}</div>
                  <div className="text-xs font-bold text-rose-700 uppercase mt-1">{risk.severity} Severity</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Budget & Audience */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Wallet size={20} className="text-emerald-600" /> Budget Estimate
            </h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900">
                ${analysis.budgetEstimate.low.toLocaleString()}
              </span>
              <span className="text-slate-400 mb-1">-</span>
              <span className="text-3xl font-bold text-slate-900">
                ${analysis.budgetEstimate.high.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500 mb-1 ml-1">{analysis.budgetEstimate.currency}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Based on city benchmarks and duration.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Users size={20} className="text-blue-600" /> Target Audience
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {analysis.audienceProfile}
            </p>
          </div>
        </div>

      </div>

      {/* 4. Creative Themes */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
        <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-4">
          <Lightbulb size={20} className="text-indigo-600" /> AI Suggested Themes
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {analysis.suggestedThemes.map((theme, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 flex items-start gap-3">
              <div className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">
                {idx + 1}
              </div>
              <span className="text-sm font-medium text-slate-800">{theme}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
