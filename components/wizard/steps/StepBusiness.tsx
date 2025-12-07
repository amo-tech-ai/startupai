
import React, { useState } from 'react';
import { Tag, Globe, Linkedin, Twitter, Github, FileText, Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WizardService } from '../../../services/wizardAI';
import { API_KEY } from '../../../lib/env';

// Helper for tag inputs
const TagInput = ({ label, values, onChange }: any) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
    <div className="p-2 border border-slate-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-purple-500 flex flex-wrap gap-2 min-h-[50px]">
      {values.map((v: string) => (
        <span key={v} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm flex items-center gap-1">
          {v} <button onClick={() => onChange(values.filter((item: string) => item !== v))} className="hover:text-red-500">×</button>
        </span>
      ))}
      <input 
        type="text" 
        placeholder="Type & Enter..." 
        className="flex-1 outline-none min-w-[100px] text-sm"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.currentTarget.value.trim();
            if (val && !values.includes(val)) {
              onChange([...values, val]);
              e.currentTarget.value = '';
            }
          }
        }}
      />
    </div>
  </div>
);

interface StepBusinessProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const StepBusiness: React.FC<StepBusinessProps> = ({ formData, setFormData }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiSuggest = async () => {
    if (!API_KEY) return;
    setIsGenerating(true);
    try {
      const suggestions = await WizardService.analyzeBusiness(formData, API_KEY);
      if (suggestions) {
        setFormData((prev: any) => ({
          ...prev,
          competitors: suggestions.competitors || prev.competitors,
          coreDifferentiator: suggestions.coreDifferentiator || prev.coreDifferentiator,
          keyFeatures: suggestions.keyFeatures || prev.keyFeatures
        }));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const update = (field: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-500">
      {/* LEFT: STRATEGIC NARRATIVE & FUNDAMENTALS */}
      <div className="space-y-6">
        
        {/* Strategic Narrative */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Strategic Narrative</h2>
            
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-red-500" />
                    <label className="block text-sm font-bold text-slate-700">Problem Statement</label>
                </div>
                <textarea 
                    value={formData.problem}
                    onChange={(e) => update('problem', e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none leading-relaxed"
                    placeholder="What pain point are you solving?"
                />
            </div>

            <div>
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <label className="block text-sm font-bold text-slate-700">Solution Statement</label>
                </div>
                <textarea 
                    value={formData.solution}
                    onChange={(e) => update('solution', e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none leading-relaxed"
                    placeholder="How do you solve it uniquely?"
                />
            </div>
        </div>

        {/* Fundamentals */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Fundamentals</h2>
                <button 
                    onClick={handleAiSuggest}
                    disabled={isGenerating}
                    className="text-xs flex items-center gap-1 text-purple-600 font-bold hover:bg-purple-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                >
                    {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Auto-Suggest
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Business Model</label>
                    <select 
                        value={formData.businessModel}
                        onChange={(e) => update('businessModel', e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                    >
                        <option value="">Select...</option>
                        <option value="SaaS">SaaS</option>
                        <option value="Marketplace">Marketplace</option>
                        <option value="Transactional">Transactional</option>
                        <option value="Subscription">Subscription</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Pricing Model</label>
                    <select 
                        value={formData.pricingModel}
                        onChange={(e) => update('pricingModel', e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                    >
                        <option value="">Select...</option>
                        <option value="Freemium">Freemium</option>
                        <option value="Tiered">Tiered</option>
                        <option value="Usage Based">Usage Based</option>
                        <option value="Enterprise">Enterprise</option>
                    </select>
                </div>
            </div>

            <TagInput 
                label="Customer Segments" 
                values={formData.customerSegments} 
                onChange={(vals: string[]) => update('customerSegments', vals)} 
            />
        </div>
      </div>

      {/* RIGHT: DIFFERENTIATION & SOCIAL */}
      <div className="space-y-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Market & Features</h2>

            <TagInput 
                label="Key Features" 
                values={formData.keyFeatures} 
                onChange={(vals: string[]) => update('keyFeatures', vals)} 
            />

            <TagInput 
                label="Competitors" 
                values={formData.competitors} 
                onChange={(vals: string[]) => update('competitors', vals)} 
            />

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Core Differentiator</label>
                <textarea 
                    value={formData.coreDifferentiator}
                    onChange={(e) => update('coreDifferentiator', e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none"
                    placeholder="What makes you 10x better?"
                />
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Social Presence</h2>
            
            <div className="space-y-4">
                <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="url" 
                        value={formData.website} 
                        disabled 
                        className="w-full pl-10 p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500"
                    />
                </div>
                <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="url" 
                        placeholder="LinkedIn Company Page"
                        value={formData.socialLinks.linkedin}
                        onChange={(e) => update('socialLinks', { ...formData.socialLinks, linkedin: e.target.value })}
                        className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                </div>
                <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="url" 
                        placeholder="Twitter / X Handle"
                        value={formData.socialLinks.twitter}
                        onChange={(e) => update('socialLinks', { ...formData.socialLinks, twitter: e.target.value })}
                        className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                </div>
            </div>
         </div>

         <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white text-center shadow-lg">
            <h3 className="font-bold text-lg mb-2">Need a Pitch Deck?</h3>
            <p className="text-purple-100 text-sm mb-4">Our AI can generate a slide deck from your profile in seconds.</p>
            <button className="bg-white text-purple-700 px-6 py-2 rounded-lg font-bold text-sm hover:bg-purple-50 transition-colors shadow-sm">
                Launch Deck Editor
            </button>
         </div>
      </div>
    </div>
  );
};
