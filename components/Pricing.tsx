
import React from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PageType } from '../types';

interface PricingProps {
  setPage?: (page: PageType) => void;
}

const Pricing: React.FC<PricingProps> = ({ setPage }) => {
  const { user } = useAuth();

  const handleAction = () => {
    if (setPage) {
      if (user) {
        setPage('settings'); // Redirect logged-in users to settings/billing
      } else {
        setPage('signup'); // Redirect visitors to signup
      }
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Simple, transparent pricing</h1>
        <p className="text-xl text-slate-600 mb-12">Start for free, scale as you grow.</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             {/* Free Tier */}
             <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-slate-900 mb-6">$0<span className="text-sm font-normal text-slate-500">/mo</span></div>
                <button onClick={handleAction} className="w-full py-3 rounded-lg border border-slate-200 font-semibold text-slate-700 mb-8 hover:bg-slate-50">
                    {user ? 'Current Plan' : 'Get Started'}
                </button>
                <ul className="space-y-4 text-left text-sm text-slate-600">
                    <li className="flex gap-3"><Check size={16} className="text-green-500" /> 1 AI Pitch Deck</li>
                    <li className="flex gap-3"><Check size={16} className="text-green-500" /> Basic Export</li>
                </ul>
             </div>

             {/* Founder Tier */}
             <div className="border-2 border-primary-600 rounded-2xl p-8 shadow-xl relative transform scale-105 bg-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Most Popular</div>
                <h3 className="text-lg font-semibold text-primary-600 mb-2">Founder</h3>
                <div className="text-4xl font-bold text-slate-900 mb-6">$29<span className="text-sm font-normal text-slate-500">/mo</span></div>
                <button onClick={handleAction} className="w-full py-3 rounded-lg bg-primary-600 text-white font-semibold mb-8 hover:bg-primary-700 shadow-lg shadow-primary-600/20">
                    {user ? 'Upgrade Now' : 'Start Free Trial'}
                </button>
                <ul className="space-y-4 text-left text-sm text-slate-600">
                    <li className="flex gap-3"><Check size={16} className="text-green-500" /> Unlimited Decks</li>
                    <li className="flex gap-3"><Check size={16} className="text-green-500" /> Full CRM Access</li>
                    <li className="flex gap-3"><Check size={16} className="text-green-500" /> 5 Generated Docs</li>
                </ul>
             </div>

             {/* Growth Tier */}
             <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Growth</h3>
                <div className="text-4xl font-bold text-slate-900 mb-6">$79<span className="text-sm font-normal text-slate-500">/mo</span></div>
                <button onClick={handleAction} className="w-full py-3 rounded-lg border border-slate-200 font-semibold text-slate-700 mb-8 hover:bg-slate-50">
                    {user ? 'Upgrade Now' : 'Contact Sales'}
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
