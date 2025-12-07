
import React from 'react';

interface StepBusinessProps {
  formData: any;
  updateField: (field: string, value: any) => void;
}

export const StepBusiness: React.FC<StepBusinessProps> = ({ formData, updateField }) => {
  return (
     <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Business Model</h2>
            <p className="text-slate-500">How do you make money?</p>
        </div>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select 
                    value={formData.businessModel}
                    onChange={e => updateField('businessModel', e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                    <option value="">Select a model</option>
                    <option value="SaaS">SaaS / Subscription</option>
                    <option value="Marketplace">Marketplace</option>
                    <option value="Ecommerce">E-commerce / D2C</option>
                    <option value="Usage">Usage-based / API</option>
                    <option value="Service">Service / Agency</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pricing Strategy</label>
                 <input 
                    type="text" 
                    value={formData.pricingModel}
                    onChange={e => updateField('pricingModel', e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. Freemium with $29/mo pro plan"
                />
            </div>
        </div>
    </div>
  );
};
