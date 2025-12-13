
import React, { useState } from 'react';
import { Microscope, RefreshCw, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { DeepResearchView } from '../wizard/intelligence/DeepResearchView';
import { WizardService } from '../../services/wizardAI';
import { API_KEY } from '../../lib/env';
import { StartupProfile } from '../../types';
import { useToast } from '../../context/ToastContext';

interface ResearchCardProps {
  profile: StartupProfile;
  onSave: (data: Partial<StartupProfile>) => Promise<void>;
  viewMode?: 'edit' | 'investor';
}

export const ResearchCard: React.FC<ResearchCardProps> = ({ profile, onSave, viewMode = 'edit' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [researchStatus, setResearchStatus] = useState("Initializing...");
  const { toast, success, error } = useToast();

  const handleRunResearch = async () => {
    if (!API_KEY) return;
    setIsExpanded(true);
    setIsResearching(true);
    setResearchStatus("Initializing Agent...");
    
    try {
        const result = await WizardService.performDeepResearch(
            profile, 
            API_KEY, 
            (status) => setResearchStatus(status)
        );
        
        if (result) {
            await onSave({ deepResearchReport: result });
            success("Market research updated!");
        } else {
            error("Research failed to complete.");
        }
    } catch (e) {
        console.error(e);
        error("Research error.");
    } finally {
        setIsResearching(false);
    }
  };

  const hasReport = !!profile.deepResearchReport;

  // In investor mode, if there is no report, don't show the card at all
  if (viewMode === 'investor' && !hasReport) {
      return null;
  }

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden">
        <div 
            className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <Microscope size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">Deep Research Report</h3>
                    <p className="text-slate-400 text-sm">
                        {hasReport 
                            ? `Last updated: ${new Date().toLocaleDateString()}` 
                            : "Generate investor-grade market analysis"}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {viewMode === 'edit' && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleRunResearch(); }}
                        disabled={isResearching}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isResearching ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                        {hasReport ? 'Refresh' : 'Run Agent'}
                    </button>
                )}
                {isExpanded ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
            </div>
        </div>

        {isExpanded && (
            <div className="p-6 border-t border-slate-800 bg-slate-950/50">
                <DeepResearchView 
                    report={profile.deepResearchReport} 
                    isLoading={isResearching} 
                    loadingStatus={researchStatus}
                />
            </div>
        )}
    </div>
  );
};
