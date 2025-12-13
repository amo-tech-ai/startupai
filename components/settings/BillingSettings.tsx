
import React, { useState, useEffect } from 'react';
import { Check, CreditCard, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { BillingService } from '../../services/billing';
import { useSearchParams } from 'react-router-dom';

export const BillingSettings: React.FC = () => {
  const { profile, updateProfile } = useData();
  const { success, info } = useToast();
  const [searchParams] = useSearchParams();
  
  const [billingPlan, setBillingPlan] = useState<'free' | 'founder' | 'growth'>(profile?.plan || 'free');
  const [isLoading, setIsLoading] = useState<string | null>(null); // 'founder' | 'growth' | null

  useEffect(() => {
    if (profile?.plan) {
      setBillingPlan(profile.plan);
    }
  }, [profile]);

  // Handle Return from Mock Checkout
  useEffect(() => {
      const successParam = searchParams.get('success');
      const planParam = searchParams.get('plan');
      
      if (successParam === 'true' && planParam && profile) {
          if (profile.plan !== planParam) {
              updateProfile({ plan: planParam as any });
              success(`Subscription successfully upgraded to ${planParam.charAt(0).toUpperCase() + planParam.slice(1)}!`);
              // Clear params in a real app
          }
      }
  }, [searchParams, profile]);

  const handleUpgrade = async (planId: 'founder' | 'growth') => {
    setIsLoading(planId);
    info("Redirecting to secure checkout...");
    
    try {
        const url = await BillingService.createCheckoutSession(planId);
        // In a real app: window.location.href = url;
        // For simulation, we just reload the page with params
        window.location.href = url; 
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoading(null);
    }
  };

  const handleManageSubscription = async () => {
      setIsLoading('portal');
      info("Opening billing portal...");
      await BillingService.openCustomerPortal();
      setIsLoading(null);
      success("Portal opened (Mock)");
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
                const isProcessing = isLoading === plan.id;
                
                return (
                    <div 
                        key={plan.id}
                        className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col h-full ${
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
                        
                        {isActive ? (
                            <button 
                                disabled
                                className="w-full py-2 rounded-lg font-bold text-sm bg-indigo-600 text-white opacity-90 cursor-default"
                            >
                                Current Plan
                            </button>
                        ) : plan.id === 'free' ? (
                             <button 
                                disabled
                                className="w-full py-2 rounded-lg font-bold text-sm bg-white border border-slate-200 text-slate-400 cursor-not-allowed"
                            >
                                Downgrade
                            </button>
                        ) : (
                            <button 
                                onClick={() => handleUpgrade(plan.id as any)}
                                disabled={!!isLoading}
                                className="w-full py-2 rounded-lg font-bold text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                            >
                                {isProcessing && <Loader2 size={16} className="animate-spin" />}
                                {isProcessing ? 'Processing...' : 'Upgrade'}
                            </button>
                        )}
                    </div>
                );
            })}
        </div>

        {billingPlan !== 'free' && (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <CreditCard size={24} className="text-slate-600" />
                    </div>
                    <div>
                        <div className="font-bold text-slate-900">Payment Settings</div>
                        <div className="text-sm text-slate-500">Manage invoices and payment methods via Stripe.</div>
                    </div>
                </div>
                <button 
                    onClick={handleManageSubscription}
                    disabled={!!isLoading}
                    className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                    {isLoading === 'portal' ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
                    Manage Subscription
                </button>
            </div>
        )}
    </div>
  );
};
