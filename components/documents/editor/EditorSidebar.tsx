
import React from 'react';
import { Bot, Sparkles, Loader2, Wand2, Maximize2, Minimize2, Check, ScanEye } from 'lucide-react';
import { StartupProfile } from '../../../types';

interface EditorSidebarProps {
  activeSectionTitle: string;
  docType: string;
  profile: StartupProfile | null;
  isGenerating: boolean;
  refiningAction: string | null;
  onGenerateDraft: () => void;
  onRefine: (action: 'clearer' | 'expand' | 'shorten' | 'grammar') => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  activeSectionTitle,
  docType,
  profile,
  isGenerating,
  refiningAction,
  onGenerateDraft,
  onRefine
}) => {
  return (
    <div className="w-80 bg-white border-l border-slate-200 hidden xl:flex flex-col shrink-0">
       <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 to-white">
          <div className="flex items-center gap-2 text-indigo-700 font-bold">
             <Bot size={18} />
             <span>AI Companion</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Powered by Gemini 3 Pro</p>
       </div>
       
       <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* Block 1: Draft */}
          <div>
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Drafting</h4>
             <button 
                onClick={onGenerateDraft}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 mb-3 transition-colors disabled:opacity-50"
             >
                {isGenerating ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14} />}
                {isGenerating ? 'Drafting...' : `Auto-Generate ${docType}`}
             </button>
             <p className="text-xs text-slate-400 leading-relaxed text-center">
                 Uses your profile data ({profile?.name}) to create a structured draft instantly.
             </p>
          </div>

          {/* Block 2: Refine */}
          <div>
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Refinement Tools</h4>
             <p className="text-[10px] text-slate-400 mb-2">Acting on: <strong>{activeSectionTitle}</strong></p>
             
             <div className="grid grid-cols-2 gap-2">
                <RefineButton 
                  label="Make Clearer" 
                  icon={<Wand2 size={14}/>} 
                  onClick={() => onRefine('clearer')} 
                  loading={refiningAction === 'clearer'}
                />
                <RefineButton 
                  label="Expand" 
                  icon={<Maximize2 size={14}/>} 
                  onClick={() => onRefine('expand')} 
                  loading={refiningAction === 'expand'}
                />
                <RefineButton 
                  label="Shorten" 
                  icon={<Minimize2 size={14}/>} 
                  onClick={() => onRefine('shorten')} 
                  loading={refiningAction === 'shorten'}
                />
                <RefineButton 
                  label="Fix Grammar" 
                  icon={<Check size={14}/>} 
                  onClick={() => onRefine('grammar')} 
                  loading={refiningAction === 'grammar'}
                />
             </div>
          </div>

          {/* Block 3: Context */}
          <div>
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Context Aware</h4>
             <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-sm space-y-3">
                <div className="flex items-start gap-3">
                   <ScanEye size={16} className="text-slate-400 mt-1"/>
                   <p className="text-xs text-slate-600">
                       Based on your metrics, you should emphasize your <strong>${profile?.fundingGoal?.toLocaleString()}</strong> funding goal in the "Ask" section.
                   </p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

interface RefineButtonProps {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    loading: boolean;
}

const RefineButton: React.FC<RefineButtonProps> = ({ label, icon, onClick, loading }) => (
    <button 
        onClick={onClick}
        disabled={loading}
        className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors disabled:opacity-50"
    >
        {loading ? <Loader2 size={14} className="animate-spin"/> : icon}
        {label}
    </button>
);
