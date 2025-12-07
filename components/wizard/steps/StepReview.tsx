
import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface StepReviewProps {
  formData: any;
}

export const StepReview: React.FC<StepReviewProps> = ({ formData }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
       <div className="text-center mb-8">
           <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/30">
               <CheckCircle2 size={32} className="text-white" />
           </div>
          <h2 className="text-3xl font-bold text-slate-900">Ready for Liftoff?</h2>
          <p className="text-slate-500">Review your profile before generating your assets.</p>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 max-h-[400px] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                  <span className="block text-slate-500 font-medium">Name</span>
                  <span className="block font-bold text-slate-900">{formData.name}</span>
              </div>
              <div>
                  <span className="block text-slate-500 font-medium">Stage</span>
                  <span className="block font-bold text-slate-900">{formData.stage}</span>
              </div>
              <div className="col-span-2">
                   <span className="block text-slate-500 font-medium">Tagline</span>
                  <span className="block font-bold text-slate-900">{formData.tagline}</span>
              </div>
               <div className="col-span-2">
                   <span className="block text-slate-500 font-medium">Problem</span>
                  <span className="block text-slate-700 italic">"{formData.problem}"</span>
              </div>
          </div>
      </div>
      
      <div className="flex items-center gap-2 p-4 bg-indigo-50 text-indigo-800 rounded-lg text-sm">
          <Sparkles size={16} />
          <span>On submit, Gemini 3 will generate your <strong>Pitch Deck</strong> and <strong>Financial Model</strong> automatically.</span>
      </div>
    </div>
  );
};
