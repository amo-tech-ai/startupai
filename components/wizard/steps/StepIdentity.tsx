
import React from 'react';
import { Target, Sparkles, Loader2 } from 'lucide-react';

interface StepIdentityProps {
  formData: any;
  updateField: (field: string, value: any) => void;
  onRefine: (field: string) => void;
  isAiLoading: boolean;
}

export const StepIdentity: React.FC<StepIdentityProps> = ({ formData, updateField, onRefine, isAiLoading }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-8">
         <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600">
            <Target size={32} />
         </div>
         <h2 className="text-2xl font-bold text-slate-900">Define your identity</h2>
         <p className="text-slate-500">In one sentence, what do you do?</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1">
             <label className="block text-sm font-medium text-slate-700">Tagline / One-Liner</label>
             <button 
                onClick={() => onRefine('tagline')}
                disabled={!formData.tagline || isAiLoading}
                className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 disabled:opacity-50 font-medium"
             >
                {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                AI Refine
             </button>
          </div>
          <input 
            type="text" 
            value={formData.tagline}
            onChange={e => updateField('tagline', e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. The operating system for modern founders."
          />
        </div>
        
         <div>
          <div className="flex justify-between items-center mb-1">
             <label className="block text-sm font-medium text-slate-700">Mission Statement</label>
             <button 
                onClick={() => onRefine('mission')}
                disabled={!formData.mission || isAiLoading}
                className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 disabled:opacity-50 font-medium"
             >
                {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                AI Refine
             </button>
          </div>
          <textarea 
            value={formData.mission}
            onChange={e => updateField('mission', e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
            placeholder="e.g. To democratize access to capital for everyone..."
          />
        </div>
      </div>
    </div>
  );
};
