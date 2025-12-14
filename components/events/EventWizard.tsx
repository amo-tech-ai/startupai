import React from 'react';
import { Zap, Loader2, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import { useEventWizard } from '../../hooks/useEventWizard';

// Steps
import { Step1Context } from './wizard/Step1Context';
import { Step2Strategy } from './wizard/Step2Strategy';
import { Step3Logistics } from './wizard/Step3Logistics';
import { Step4Review } from './wizard/Step4Review';

const EventWizard: React.FC = () => {
  const { 
    currentStep, 
    formData, 
    isProcessing, 
    strategyAnalysis, 
    logisticsAnalysis, 
    updateData, 
    nextStep, 
    prevStep,
    checkLogistics 
  } = useEventWizard();

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col font-sans text-slate-900">
      
      {/* FIXED HEADER */}
      <header className="bg-white border-b border-[#E5E5E5] px-6 py-4 sticky top-0 z-40 shadow-sm/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
                <Zap size={18} fill="currentColor" />
             </div>
             <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#1A1A1A]">StartupAI</span>
                <span className="text-[#E5E5E5]">/</span>
                <span className="font-medium text-[#4B5563]">Event Wizard</span>
             </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#F7F7F5] rounded-full border border-[#E5E5E5]">
             <span className="text-xs font-bold text-indigo-600">Step {currentStep} of 4</span>
             <span className="text-xs text-[#9CA3AF]">—</span>
             <span className="text-xs font-medium text-[#6B7280]">
                {currentStep === 1 ? 'Event Context' : 
                 currentStep === 2 ? 'Intelligence' : 
                 currentStep === 3 ? 'Logistics' : 'Review'}
             </span>
          </div>

          <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide hidden sm:block">Powered by Gemini 3 Pro</span>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* PROGRESS BAR */}
      <div className="w-full bg-white border-b border-[#E5E5E5] h-1">
         <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
            style={{ width: `${(currentStep / 4) * 100}%` }}
         ></div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        {currentStep === 1 && (
            <Step1Context data={formData} updateData={updateData} />
        )}
        {currentStep === 2 && (
            <Step2Strategy analysis={strategyAnalysis} isLoading={isProcessing} />
        )}
        {currentStep === 3 && (
            <Step3Logistics 
                date={formData.date} 
                city={formData.city} 
                logistics={logisticsAnalysis} 
                isLoading={isProcessing}
                onUpdate={updateData}
                onCheckConflicts={checkLogistics}
            />
        )}
        {currentStep === 4 && (
            <Step4Review data={formData} />
        )}
      </main>

      {/* STICKY FOOTER */}
      <footer className="sticky bottom-0 bg-white border-t border-[#E5E5E5] p-4 md:px-8 z-30 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
         <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-[#6B7280] font-bold text-sm hover:bg-[#F7F7F5] transition-colors disabled:opacity-50"
            >
                <ArrowLeft size={16} />
                {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>

            <div className="flex flex-col items-end">
                <button 
                    onClick={nextStep}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px] justify-center"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Gemini analyzing...</span>
                        </>
                    ) : (
                        <>
                            <span>{currentStep === 4 ? 'Launch Event' : currentStep === 1 ? 'Generate Strategy' : 'Next Step'}</span>
                            {currentStep === 4 ? <CheckCircle size={16} /> : <Sparkles size={16} />}
                        </>
                    )}
                </button>
            </div>
         </div>
      </footer>

    </div>
  );
};

export default EventWizard;