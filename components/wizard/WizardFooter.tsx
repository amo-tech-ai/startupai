
import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
}

export const WizardFooter: React.FC<WizardFooterProps> = ({ currentStep, totalSteps, onBack, onNext }) => {
  return (
    <footer className="sticky bottom-0 bg-white border-t border-slate-200 p-4 md:px-8 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
       <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
              onClick={onBack}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
          >
              {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          <button 
              onClick={onNext}
              className="group flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-600/20 transition-all hover:-translate-y-0.5 active:scale-95"
          >
              {currentStep === totalSteps ? 'Finish & Save' : 'Next Step'}
              {currentStep === totalSteps ? <CheckCircle size={20} /> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
       </div>
    </footer>
  );
};
