
import React from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface StepSolutionProps {
  formData: any;
  updateField: (field: string, value: any) => void;
  onRefine: (field: string) => void;
  isAiLoading: boolean;
}

export const StepSolution: React.FC<StepSolutionProps> = ({ formData, updateField, onRefine, isAiLoading }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
       <div className="text-center mb-8">
         <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
            <CheckCircle2 size={32} />
         </div>
         <h2 className="text-2xl font-bold text-slate-900">The Solution</h2>
         <p className="text-slate-500">How do you solve it uniquely?</p>
      </div>

       <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-2">Solution Statement</label>
          <textarea 
            value={formData.solution}
            onChange={e => updateField('solution', e.target.value)}
            className="w-full p-6 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-64 resize-none leading-relaxed"
            placeholder="Describe your product or service..."
          />
          
          <div className="absolute bottom-4 right-4">
             <button 
                onClick={() => onRefine('solution')}
                disabled={!formData.solution || isAiLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
             >
                {isAiLoading ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16} />}
                <span>Refine with Gemini 3</span>
             </button>
          </div>
       </div>
    </div>
  );
};
