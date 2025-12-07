
import React, { useState, useEffect } from 'react';
import { Check, CreditCard, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const BillingSettings: React.FC = () => {
  const { profile, updateProfile } = useData();
  const { success } = useToast();
  const [billingPlan, setBillingPlan] = useState<'free' | 'founder' | 'growth'>(profile?.plan || 'free');

  useEffect(() => {
    if (profile?.plan) {
      setBillingPlan(profile.plan);
    }
  }, [profile]);

  const handleUpdatePlan = (newPlan: 'free' | 'founder' | 'growth') => {
    if (newPlan === billingPlan) return;
    
    // In a real app, this would trigger a Stripe checkout or portal
    setBillingPlan(newPlan);
    updateProfile({ plan: newPlan });
    success(`Subscription updated to ${newPlan.charAt(0).toUpperCase() + newPlan.slice(1)} plan`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
        <div className="grid md:grid-cols-3 gap-6">
            {[
                { id: 'free', name: 'Starter', price: '$0', features: ['1 Project', 'Basic AI Generation', 'Export to PDF'] },
                { id: 'founder', name: 'Founder', price: '$29', features: ['Unlimited Projects', 'Gemini 3 Pro Access', 'CRM & Pipeline', 'Editable Decks'], popular: true },
                { id: 'growth', name: 'Growth', price: '$79', features: ['Everything in Founder', 'Team Collaboration', 'Priority Support', 'Data Room Access'] }
            ].map((plan) => {
                const isActive = billingPlan === plan.id;
                return (
                    <div 
                        key={plan.id}
                        onClick={() => handleUpdatePlan(plan.id as any)}
                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col h-full ${
                            isActive
                            ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-200' 
                            : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg">
                                Popular
                            </div>
                        )}
                        <div className="flex justify-between items-start">
                            <h3 className={`font-bold ${isActive ? 'text-indigo-900' : 'text-slate-900'}`}>{plan.name}</h3>
                            {isActive && <CheckCircle2 className="text-indigo-600" size={20} />}
                        </div>
                        <div className={`text-3xl font-bold my-2 ${isActive ? 'text-indigo-900' : 'text-slate-900'}`}>{plan.price}<span className="text-sm font-normal text-slate-500">/mo</span></div>
                        <ul className="space-y-3 mt-4 mb-6 flex-1">
                            {plan.features.map((f, i) => (
                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                    <Check size={14} className="text-green-500 mt-0.5 shrink-0" /> <span className="leading-snug">{f}</span>
                                </li>
                            ))}
                        </ul>
                        <button 
                            className={`w-full py-2 rounded-lg font-bold text-sm transition-colors ${
                                isActive 
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            {isActive ? 'Current Plan' : plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                        </button>
                    </div>
                );
            })}
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
