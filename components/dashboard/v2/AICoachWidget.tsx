
import React from 'react';
import { Sparkles, ArrowRight, Zap, RefreshCw, Loader2 } from 'lucide-react';
import { AICoachInsight } from '../../../types';

interface AICoachWidgetProps {
  insights: AICoachInsight[];
  onRefresh: () => void;
  isGenerating: boolean;
}

export const AICoachWidget: React.FC<AICoachWidgetProps> = ({ insights, onRefresh, isGenerating }) => {
  // Take top 3 insights or use placeholders
  const displayInsights = insights.length > 0 ? insights.slice(0, 3) : [
    { id: '1', title: 'Add competitor slide', category: 'Deck', type: 'Action' },
    { id: '2', title: 'Improve pricing model', category: 'Pricing', type: 'Opportunity' },
    { id: '3', title: 'Missing cover image', category: 'Profile', type: 'Risk' }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-24 bg-purple-500/20 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <Sparkles size={18} className="text-purple-300" />
          </div>
          <h3 className="font-bold text-lg">AI Coach</h3>
        </div>
        <button 
            onClick={onRefresh}
            disabled={isGenerating}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white disabled:opacity-50"
        >
            {isGenerating ? <Loader2 size={16} className="animate-spin"/> : <RefreshCw size={16} />}
        </button>
      </div>

      <div className="space-y-3 relative z-10">
        {displayInsights.map((item: any, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors p-3 rounded-xl flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        item.type === 'Risk' ? 'bg-rose-500/20 text-rose-300' : 
                        item.type === 'Opportunity' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-indigo-500/20 text-indigo-300'
                    }`}>
                        <Zap size={14} fill="currentColor" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-100">{item.title}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">{item.category}</div>
                    </div>
                </div>
                <button className="text-xs font-bold bg-white text-indigo-900 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 transform translate-x-2 group-hover:translate-x-0 duration-200">
                    Fix Now <ArrowRight size={12} />
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};
