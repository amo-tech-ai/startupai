
import React, { useState } from 'react';
import { Sparkles, Loader2, Maximize2, Minimize2, Wand2, Zap } from 'lucide-react';
import { Slide } from '../../../types';
import { slideAIEdge } from '../../../services/edgeFunctions';
import { API_KEY } from '../../../lib/env';
import { useToast } from '../../../context/ToastContext';

interface AICopilotSidebarProps {
  slide: Slide;
  onUpdate: (updatedSlide: Slide) => void;
}

export const AICopilotSidebar: React.FC<AICopilotSidebarProps> = ({ slide, onUpdate }) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const { toast, error, success } = useToast();

  const handleAction = async (action: 'refine' | 'expand' | 'shorten') => {
    if (!API_KEY) {
        error("API Key missing");
        return;
    }
    setLoadingAction(action);
    toast(`AI is working to ${action} your content...`, "info");
    
    try {
        const newBullets = await slideAIEdge(API_KEY, slide.bullets, action);
        if (newBullets) {
            onUpdate({ ...slide, bullets: newBullets });
            success("Content updated successfully!");
        } else {
            error("AI didn't return any changes.");
        }
    } catch (e) {
        console.error(e);
        error("AI Error: Could not process text.");
    } finally {
        setLoadingAction(null);
    }
  };

  return (
    <div className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 hidden lg:flex">
        <div className="p-6 border-b border-slate-800 bg-slate-900">
            <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-indigo-500/20 rounded-md">
                    <Sparkles size={16} className="text-indigo-400" />
                </div>
                <h3 className="text-white font-bold">AI Copilot</h3>
            </div>
            <p className="text-xs text-slate-400 pl-8">Gemini 3 Pro enabled</p>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
            {/* Context Card */}
            <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Active Slide</span>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 min-w-[4px] h-4 bg-indigo-500 rounded-full"></div>
                        <div>
                            <p className="text-sm text-white font-medium line-clamp-2">{slide.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{slide.bullets.length} bullet points</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 block">Content Actions</span>
                <div className="space-y-3">
                    <ActionButton 
                        icon={<Wand2 size={18} />}
                        label="Refine Content"
                        sub="Improve clarity & impact"
                        onClick={() => handleAction('refine')}
                        loading={loadingAction === 'refine'}
                    />
                    <ActionButton 
                        icon={<Maximize2 size={18} />}
                        label="Expand Points"
                        sub="Add detail & context"
                        onClick={() => handleAction('expand')}
                        loading={loadingAction === 'expand'}
                    />
                    <ActionButton 
                        icon={<Minimize2 size={18} />}
                        label="Shorten Text"
                        sub="Make concise & punchy"
                        onClick={() => handleAction('shorten')}
                        loading={loadingAction === 'shorten'}
                    />
                </div>
            </div>

            {/* Tips */}
            <div className="p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-xl">
                <div className="flex gap-2 items-start">
                    <Zap size={14} className="text-indigo-400 mt-0.5" />
                    <p className="text-xs text-indigo-200 leading-relaxed">
                        <strong>Pro Tip:</strong> Use "Shorten" for slide titles and "Expand" for speaker notes.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    sub: string;
    onClick: () => void;
    loading: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, sub, onClick, loading }) => (
    <button 
        onClick={onClick}
        disabled={loading}
        className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
    >
        <div className="p-3 rounded-lg bg-slate-900 text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-colors shadow-sm">
            {loading ? <Loader2 size={18} className="animate-spin" /> : icon}
        </div>
        <div>
            <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{label}</div>
            <div className="text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors">{sub}</div>
        </div>
    </button>
);
