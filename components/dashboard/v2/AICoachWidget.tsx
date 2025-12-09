
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
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#F3E8FF] rounded-lg border border-[#e9d5ff]">
            <Sparkles size={18} className="text-[#6B21A8]" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">AI Coach</h3>
        </div>
        <button 
            onClick={onRefresh}
            disabled={isGenerating}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors text-[#6B7280] hover:text-[#1A1A1A] disabled:opacity-50"
        >
            {isGenerating ? <Loader2 size={16} className="animate-spin"/> : <RefreshCw size={16} />}
        </button>
      </div>

      <div className="space-y-4 relative z-10">
        {displayInsights.map((item: any, idx) => (
            <div key={idx} className="bg-[#F7F7F5] border border-[#E5E5E5] hover:bg-white hover:border-[#A855F7]/30 hover:shadow-sm transition-all p-4 rounded-xl flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                        item.type === 'Risk' ? 'bg-[#FEE2E2] text-[#991B1B] border-[#fecaca]' : 
                        item.type === 'Opportunity' ? 'bg-[#DCFCE7] text-[#166534] border-[#bbf7d0]' :
                        'bg-[#F3E8FF] text-[#6B21A8] border-[#e9d5ff]'
                    }`}>
                        <Zap size={16} fill="currentColor" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-[#1A1A1A]">{item.title}</div>
                        <div className="text-[10px] text-[#6B7280] uppercase tracking-wide font-bold">{item.category}</div>
                    </div>
                </div>
                <button className="text-xs font-bold text-[#1A1A1A] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 transform translate-x-2 group-hover:translate-x-0 duration-200">
                    Fix Now <ArrowRight size={12} />
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};
