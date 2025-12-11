
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

interface WizardStep {
  id: number;
  title: string;
  description: string;
}

interface WizardProgressProps {
  currentStep: number;
  steps: WizardStep[];
}

export const WizardProgress: React.FC<WizardProgressProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full bg-white border-b border-slate-200 py-6 px-4 md:px-8 sticky top-0 z-30 shadow-sm/50">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex justify-between items-center">
          
          {/* Background Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full" />
          
          {/* Active Progress Line */}
          <MotionDiv 
            className="absolute top-1/2 left-0 h-1 bg-indigo-600 -z-10 -translate-y-1/2 rounded-full origin-left"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isPending = step.id > currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center relative group">
                <MotionDiv 
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300 cursor-default ${
                    isCompleted 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : isCurrent 
                        ? 'bg-white border-indigo-600 text-indigo-600 shadow-lg ring-4 ring-indigo-50 scale-110' 
                        : 'bg-white border-slate-200 text-slate-300'
                  }`}
                  layout
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={3} />
                  ) : (
                    <span className="text-xs md:text-sm font-bold">{step.id}</span>
                  )}
                </MotionDiv>
                
                {/* Desktop Label */}
                <div className={`absolute top-12 text-center w-32 hidden md:block transition-all duration-300 ${isCurrent ? 'opacity-100 translate-y-0' : isPending ? 'opacity-40' : 'opacity-80'}`}>
                  <div className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${isCurrent ? 'text-indigo-600' : 'text-slate-500'}`}>
                    {step.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {step.description}
                  </div>
                </div>

                {/* Mobile Label (Only Current) */}
                <div className={`absolute top-10 text-center w-24 md:hidden transition-all duration-300 pointer-events-none ${isCurrent ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                   <div className="text-[10px] font-bold uppercase tracking-wide text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-100 shadow-sm whitespace-nowrap">
                    {step.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
