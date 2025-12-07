
import React from 'react';
import { Zap } from 'lucide-react';

interface WizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  onExit: () => void;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({ currentStep, totalSteps, onExit }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
         <div className="bg-purple-600 text-white p-1.5 rounded-lg shadow-sm">
            <Zap size={18} fill="currentColor" />
         </div>
         <span className="font-bold text-lg tracking-tight">startupAI</span>
      </div>
      <div className="flex items-center gap-4">
         <div className="hidden md:flex text-sm text-slate-500 font-medium">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
         </div>
         <button onClick={onExit} className="text-sm font-bold text-slate-400 hover:text-slate-600">
            Exit
         </button>
      </div>
    </header>
  );
};
