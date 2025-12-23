import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Mail, Zap, Target, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { Deal, ProposedAction } from '../../types';
import { useToast } from '../../context/ToastContext';

const MotionDiv = motion.div as any;

interface CopilotCommandCenterProps {
  deals: Deal[];
  onDraftEmail: (deal: Deal) => void;
  isEnriching: boolean;
  onRefreshScoring: () => void;
}

export const CopilotCommandCenter: React.FC<CopilotCommandCenterProps> = ({ 
  deals, 
  onDraftEmail, 
  isEnriching, 
  onRefreshScoring 
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const { toast } = useToast();

  // Filter top 3 VCs where AI Score > 80
  const priorityLeads = useMemo(() => {
    return deals
      .filter(d => (d.ai_score || 0) >= 80 && d.stage !== 'Closed')
      .sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0))
      .slice(0, 3);
  }, [deals]);

  if (priorityLeads.length === 0 && !isEnriching) return null;

  return (
    <div className="mb-8 relative z-20">
      <MotionDiv
        layout
        className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden text-white"
        animate={{ height: isMinimized ? '64px' : 'auto' }}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <Sparkles size={20} className={isEnriching ? "animate-spin" : ""} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Investor CRM Copilot</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                {isEnriching ? 'Synthesizing market signals...' : `${priorityLeads.length} High Probability Targets Today`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isMinimized && (
              <button 
                onClick={(e) => { e.stopPropagation(); onRefreshScoring(); }}
                disabled={isEnriching}
                className="text-[10px] font-bold text-indigo-400 border border-indigo-400/30 px-2 py-1 rounded hover:bg-indigo-400 hover:text-white transition-all disabled:opacity-50"
              >
                Refresh Intel
              </button>
            )}
            <div className={`transition-transform duration-300 ${isMinimized ? 'rotate-180' : ''}`}>
               <ArrowRight size={16} className="rotate-90 text-slate-500" />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-6 pb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {priorityLeads.map((deal) => (
                  <LeadActionCard 
                    key={deal.id} 
                    deal={deal} 
                    onAction={() => onDraftEmail(deal)} 
                  />
                ))}
                
                {isEnriching && priorityLeads.length < 3 && (
                   <div className="p-4 rounded-xl border border-slate-800 border-dashed flex flex-col items-center justify-center gap-2 text-slate-500 bg-slate-900/50">
                      <Loader2 size={24} className="animate-spin" />
                      <span className="text-[10px] font-bold uppercase">Scanning Web...</span>
                   </div>
                )}
              </div>

              {/* Research Log Tail */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Search Grounding: Active</span>
                  </div>
                  <span>Thinking Budget: 2048 Tokens</span>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </MotionDiv>
    </div>
  );
};

// Fix: Use React.FC to avoid 'key' prop mismatch error during list mapping on line 86
const LeadActionCard: React.FC<{ deal: Deal; onAction: () => void }> = ({ deal, onAction }) => (
  <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl hover:border-indigo-500/50 transition-all group">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">{deal.company}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {deal.ai_score}% Fit
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Seed • {deal.sector}</span>
        </div>
      </div>
      <div className="p-2 bg-slate-900 rounded-lg">
        <Target size={14} className="text-slate-500" />
      </div>
    </div>
    
    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 italic mb-4">
      "{deal.strategic_hook || 'Analyzing recent investments for strategic overlap...'}"
    </p>

    <button 
      onClick={onAction}
      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
    >
      <Mail size={12} /> Draft Strategic Email
    </button>
  </div>
);
