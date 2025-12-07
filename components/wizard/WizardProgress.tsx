
import React from 'react';
import { motion } from 'framer-motion';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
}

export const WizardProgress: React.FC<WizardProgressProps> = ({ currentStep, totalSteps, stepTitle }) => {
  return (
    <div className="w-full bg-white border-b border-slate-200 py-4 px-6 md:px-12 sticky top-0 z-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-bold text-indigo-600">{stepTitle}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-indigo-600 rounded-full"
                initial={{ width: `${((currentStep-1)/totalSteps)*100}%` }}
                animate={{ width: `${(currentStep/totalSteps)*100}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>
      </div>
    </div>
  );
};
