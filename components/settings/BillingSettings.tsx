
import React, { useState } from 'react';
import { Check, CreditCard } from 'lucide-react';

export const BillingSettings: React.FC = () => {
  const [billingPlan, setBillingPlan] = useState<'free' | 'founder' | 'growth'>('founder');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
        <div className="grid md:grid-cols-3 gap-6">
            {[
                { id: 'free', name: 'Starter', price: '$0', features: ['1 Project', 'Basic AI'] },
                { id: 'founder', name: 'Founder', price: '$29', features: ['Unlimited Projects', 'Full AI Suite', 'CRM Access', 'Export to PDF'], popular: true },
                { id: 'growth', name: 'Growth', price: '$79', features: ['Everything in Founder', 'Team Collaboration', 'Priority Support', 'Data Room'] }
            ].map((plan) => (
                <div 
                    key={plan.id}
                    onClick={() => setBillingPlan(plan.id as any)}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        billingPlan === plan.id 
                        ? 'border-indigo-600 bg-indigo-50 shadow-md transform scale-105' 
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                    {plan.popular && (
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg">
                            Popular
                        </div>
                    )}
                    <h3 className="font-bold text-slate-900">{plan.name}</h3>
                    <div className="text-3xl font-bold text-slate-900 my-2">{plan.price}<span className="text-sm font-normal text-slate-500">/mo</span></div>
                    <ul className="space-y-2 mt-4">
                        {plan.features.map((f, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                <Check size={14} className="text-green-500" /> {f}
                            </li>
                        ))}
                    </ul>
                    <div className={`mt-6 w-full h-2 rounded-full ${billingPlan === plan.id ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                </div>
            ))}
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <CreditCard size={24} className="text-slate-600" />
                </div>
                <div>
                    <div className="font-bold text-slate-900">Payment Method</div>
                    <div className="text-sm text-slate-500">Visa ending in 4242 • Expires 12/25</div>
                </div>
            </div>
            <button className="text-sm font-bold text-indigo-600 hover:underline">Update Card</button>
        </div>
    </div>
  );
};
