
import React from 'react';
import { Sparkles, ArrowRight, Zap, RefreshCw, Loader2, Check } from 'lucide-react';
import { AICoachInsight } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';

interface AICoachWidgetProps {
  insights: AICoachInsight[];
  onRefresh: () => void;
  isGenerating: boolean;
}

export const AICoachWidget: React.FC<AICoachWidgetProps> = ({ insights, onRefresh, isGenerating }) => {
  const { addTask } = useData();
  const { success } = useToast();

  const handleConvertToTask = (e: React.MouseEvent, insight: AICoachInsight) => {
    e.stopPropagation();
    addTask({
        title: insight.title,
        description: insight.description,
        priority: insight.priority === 'High' ? 'High' : 'Medium',
        status: 'Backlog',
        aiGenerated: true
    });
    success("Task added to backlog!");
  };

  // Take top 3 insights or use placeholders if completely empty (and not just loading)
  // We prefer showing real insights if available
  const displayInsights = insights.length > 0 ? insights.slice(0, 3) : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8 relative overflow-hidden h-full flex flex-col">
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

      <div className="space-y-4 relative z-10 flex-1">
        {displayInsights.length > 0 ? (
            displayInsights.map((item) => (
                <div key={item.id} className="bg-[#F7F7F5] border border-[#E5E5E5] hover:bg-white hover:border-[#A855F7]/30 hover:shadow-sm transition-all p-4 rounded-xl flex items-center justify-between group">
                    <div className="flex items-center gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                            item.type === 'Risk' ? 'bg-[#FEE2E2] text-[#991B1B] border-[#fecaca]' : 
                            item.type === 'Opportunity' ? 'bg-[#DCFCE7] text-[#166534] border-[#bbf7d0]' :
                            'bg-[#F3E8FF] text-[#6B21A8] border-[#e9d5ff]'
                        }`}>
                            <Zap size={16} fill="currentColor" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-[#1A1A1A] line-clamp-1">{item.title}</div>
                            <div className="text-[10px] text-[#6B7280] uppercase tracking-wide font-bold">{item.category}</div>
                        </div>
                    </div>
                    <button 
                        onClick={(e) => handleConvertToTask(e, item)}
                        className="text-xs font-bold text-[#6B21A8] bg-[#F3E8FF] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 transform translate-x-2 group-hover:translate-x-0 duration-200 hover:bg-[#E9D5FF]"
                    >
                        Add Task <Check size={12} />
                    </button>
                </div>
            ))
        ) : (
            <div className="flex flex-col items-center justify-center h-48 text-[#6B7280] text-center p-4">
                {isGenerating ? (
                    <>
                        <Loader2 size={24} className="animate-spin mb-2" />
                        <span className="text-sm">Analyzing your metrics...</span>
                    </>
                ) : (
                    <>
                        <Sparkles size={24} className="mb-2 opacity-50" />
                        <span className="text-sm mb-2">No insights yet. Click refresh to analyze your data.</span>
                    </>
                )}
            </div>
        )}
      </div>
    </div>
  );
};
