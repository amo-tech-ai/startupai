
import React from 'react';

interface StepTractionProps {
  formData: any;
  updateField: (field: string, value: any) => void;
}

export const StepTraction: React.FC<StepTractionProps> = ({ formData, updateField }) => {
  return (
     <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Traction & Metrics</h2>
            <p className="text-slate-500">Show us the numbers (estimations ok)</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Revenue ($)</label>
                 <input 
                    type="number" 
                    value={formData.mrr}
                    onChange={e => updateField('mrr', e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="0"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Active Users</label>
                 <input 
                    type="number" 
                    value={formData.users}
                    onChange={e => updateField('users', e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="0"
                />
            </div>
             <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Funding Goal ($)</label>
                 <input 
                    type="number" 
                    value={formData.fundingGoal}
                    onChange={e => updateField('fundingGoal', e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. 1000000"
                />
            </div>
        </div>
     </div>
  );
};
