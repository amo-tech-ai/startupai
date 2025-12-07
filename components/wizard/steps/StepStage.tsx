
import React from 'react';
import { Rocket } from 'lucide-react';

interface StepStageProps {
  formData: any;
  updateField: (field: string, value: any) => void;
}

export const StepStage: React.FC<StepStageProps> = ({ formData, updateField }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
       <div className="text-center mb-8">
         <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Rocket size={32} />
         </div>
         <h2 className="text-2xl font-bold text-slate-900">Current Stage</h2>
         <p className="text-slate-500">Where are you in the journey?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {['Idea', 'MVP', 'Seed', 'Series A', 'Growth'].map((stage) => (
          <div 
            key={stage}
            onClick={() => updateField('stage', stage)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.stage === stage 
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
              : 'border-slate-100 bg-white hover:border-indigo-200'
            }`}
          >
            <div className="font-bold text-lg">{stage}</div>
          </div>
        ))}
      </div>

       <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">Target Market / Industry</label>
          <input 
            type="text" 
            value={formData.targetMarket}
            onChange={e => updateField('targetMarket', e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. B2B Fintech, Healthcare..."
          />
        </div>
    </div>
  );
};
