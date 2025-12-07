
import React from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { PageType } from '../types';

interface PricingProps {
  setPage?: (page: PageType) => void;
}

const Pricing: React.FC<PricingProps> = ({ setPage }) => {
  const { user } = useAuth();
  const { profile } = useData();

  const handleAction = (planId: string) => {
    if (setPage) {
      if (user) {
        // Logged in: Go to billing settings to upgrade
        localStorage.setItem('settings_tab', 'billing');
        setPage('settings'); 
      } else {
        // Visitor: Sign up
        setPage('signup'); 
      }
    }
  };

  const getButtonText = (planId: string) => {
    if (!user) return 'Get Started';
    if (profile?.plan === planId) return 'Current Plan';
    if (planId === 'free' && profile?.plan !== 'free') return 'Downgrade';
    return 'Upgrade Now';
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Simple, transparent pricing</h1>
        <p className="text-xl text-slate-600 mb-12">Start for free, scale as you grow.</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             {/* Free Tier */}
             <div className={`border rounded-2xl p-8 hover:shadow-xl transition-all ${profile?.plan === 'free' ? 'border-indigo-600 bg-indigo-50/10 ring-1 ring-indigo-600' : 'border-slate-200'}`}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">Free</h3>
                    {profile?.plan === 'free' && <CheckCircle2 size={18} className="text-indigo-600" />}
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-6">$0<span className="text-sm font-normal text-slate-500">/mo</span></div>
                <button 
                    onClick={() => handleAction('free')} 
                    className={`w-full py-3 rounded-lg border font-semibold mb-8 transition-colors ${profile?.plan === 'free' ? 'bg-indigo-100 text-indigo-700 border-indigo-200 cursor-default' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    disabled={profile?.plan === 'free'}
                >
                    {getButtonText('free')}
                </button>
                <ul className="space-y-4 text-left text-sm text-slate-600">
                    <li className="flex gap-3"><Check size={16} className="text-green-500" /> 1 AI Pitch Deck</li>
                    <li className="flex gap-3"><Check size={16} className="text-green-500" /> Basic Export</li>
                </ul>
             </div>

             {/* Founder Tier */}
             <div className={`border-2 rounded-2xl p-8 shadow-xl relative transform scale-105 bg-white ${profile?.plan === 'founder' ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-primary-600'}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Most Popular</div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-primary-600">Founder</h3>
                    {profile?.plan === 'founder' && <CheckCircle2 size={20} className="text-indigo-600" />}
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-6">$29<span className="text-sm font-normal text-slate-500">/mo</span></div>
                <button 
                    onClick={() => handleAction('founder')} 
                    className={`w-full py-3 rounded-lg font-semibold mb-8 shadow-lg shadow-primary-600/20 transition-colors ${profile?.plan === 'founder' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-default shadow-none' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                    disabled={profile?.plan === 'founder'}
                >
                    {getButtonText('founder')}
                </button>
                <ul className="space-y-4 text-left text-sm text-slate-600">
                    <li className="flex gap-3"><Check size={16} className="text-green-500" /> Unlimited Decks</li>
                    <li className="flex gap-3"><Check size={16} className="text-green-500" /> Full CRM Access</li>
                    <li className="flex gap-3"><Check size={16} className="text-green-500" /> 5 Generated Docs</li>
                </ul>
             </div>

             {/* Growth Tier */}
             <div className={`border rounded-2xl p-8 hover:shadow-xl transition-all ${profile?.plan === 'growth' ? 'border-indigo-600 bg-indigo-50/10 ring-1 ring-indigo-600' : 'border-slate-200'}`}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">Growth</h3>
                    {profile?.plan === 'growth' && <CheckCircle2 size={18} className="text-indigo-600" />}
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-6">$79<span className="text-sm font-normal text-slate-500">/mo</span></div>
                <button 
                    onClick={() => handleAction('growth')} 
                    className={`w-full py-3 rounded-lg border font-semibold mb-8 transition-colors ${profile?.plan === 'growth' ? 'bg-indigo-100 text-indigo-700 border-indigo-200 cursor-default' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    disabled={profile?.plan === 'growth'}
                >
                    {getButtonText('growth')}
                </button>
                 <ul className="space-y-4 text-left text-sm text-slate-600">
                    <li className="flex gap-3"><Check size={16} className="text-green-500" /> Everything in Founder</li>
                    <li className="flex gap-3"><Check size={16} className="text-green-500" /> Team Collaboration</li>
                    <li className="flex gap-3"><Check size={16} className="text-green-500" /> Secure Data Room</li>
                </ul>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
