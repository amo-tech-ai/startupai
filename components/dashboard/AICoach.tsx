
import React from 'react';
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AICoachInsight } from '../../types';

interface AICoachProps {
  insights: AICoachInsight[];
  isGenerating: boolean;
  onRefresh: () => void;
}

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

export const AICoach: React.FC<AICoachProps> = ({ insights, isGenerating, onRefresh }) => {
  return (
    <div>
        <div className="flex items-center justify-between mb-3">
           <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900">AI Coach</h3>
           </div>
           <button 
              onClick={onRefresh}
              disabled={isGenerating}
              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors disabled:opacity-50"
              title="Refresh Insights"
           >
              <RefreshCw size={16} className={isGenerating ? "animate-spin" : ""} />
           </button>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-1">
           <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 space-y-6 min-h-[300px]">
              {isGenerating ? (
                 <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                    <Loader2 size={24} className="animate-spin text-purple-600" />
                    <span className="text-sm">Analyzing startup metrics...</span>
                 </div>
              ) : insights.length > 0 ? (
                insights.map((insight) => (
                  <MotionDiv 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={insight.id} 
                    className="flex gap-4 p-3 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-purple-100 hover:shadow-sm"
                  >
                      <div className="mt-1 shrink-0">
                          <span className={`flex h-2.5 w-2.5 rounded-full ${
                             insight.type === 'Risk' ? 'bg-rose-500 shadow-rose-500/50' :
                             insight.type === 'Opportunity' ? 'bg-emerald-500 shadow-emerald-500/50' : 
                             'bg-indigo-500 shadow-indigo-500/50'
                          } shadow-[0_0_8px_rgba(0,0,0,0.3)]`}></span>
                      </div>
                      <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                                insight.type === 'Risk' ? 'bg-rose-100 text-rose-700' :
                                insight.type === 'Opportunity' ? 'bg-emerald-100 text-emerald-700' : 
                                'bg-indigo-100 text-indigo-700'
                             }`}>
                                {insight.type}
                             </span>
                             <span className="text-sm font-bold text-slate-900">{insight.title}</span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            {insight.description}
                          </p>
                          <button className="text-xs mt-2 bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-md font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                            View Action Plan
                          </button>
                      </div>
                  </MotionDiv>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                   <Sparkles size={32} className="text-slate-300" />
                   <p className="text-sm text-center">No insights yet.<br/>Click refresh to analyze your data.</p>
                   <button onClick={onRefresh} className="text-xs text-indigo-600 font-bold hover:underline">Generate Now</button>
                </div>
              )}
           </div>
           <button 
              onClick={onRefresh}
              disabled={isGenerating}
              className="w-full py-3 text-center text-xs font-bold text-indigo-600 uppercase tracking-wide hover:bg-white/50 rounded-b-xl transition-colors"
           >
              {isGenerating ? 'Analyzing...' : 'Refresh AI Analysis'}
           </button>
        </div>
    </div>
  );
};
