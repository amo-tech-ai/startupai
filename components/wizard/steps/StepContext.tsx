
import React, { useState } from 'react';
import { Globe, Wand2, Loader2, Calendar, Target, Tag, AlertCircle, Image as ImageIcon, Upload, Sparkles } from 'lucide-react';
import { WizardService } from '../../../services/wizardAI';
import { API_KEY } from '../../../lib/env';

interface StepContextProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const StepContext: React.FC<StepContextProps> = ({ formData, setFormData }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRefiningTagline, setIsRefiningTagline] = useState(false);
  const [detectedSignals, setDetectedSignals] = useState<{ audience?: string; problem?: string; pricing?: string }>({});

  const handleAutofill = async () => {
    if (!formData.name && !formData.website) return;
    if (!API_KEY) { alert("API Key missing"); return; }

    setIsAnalyzing(true);
    try {
      const result = await WizardService.analyzeContext(formData.name, formData.website, API_KEY);
      if (result) {
        setFormData((prev: any) => ({
          ...prev,
          tagline: result.tagline || prev.tagline,
          industry: result.industry || prev.industry,
          pricingModel: result.pricing_model_hint || prev.pricingModel,
          problem: result.core_problem || prev.problem // Capture inferred problem
        }));
        setDetectedSignals({
          audience: result.target_audience,
          problem: result.core_problem,
          pricing: result.pricing_model_hint
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRefineTagline = async () => {
    if (!formData.tagline) return;
    if (!API_KEY) return;
    
    setIsRefiningTagline(true);
    try {
      const refined = await WizardService.refineText(formData.tagline, 'one-liner / tagline', API_KEY);
      if (refined) update('tagline', refined);
    } finally {
      setIsRefiningTagline(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Convert to Base64 for persistence
      const reader = new FileReader();
      reader.onloadend = () => {
        update('coverImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const update = (field: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4 duration-500">
      {/* LEFT: FORM CARD */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Context</h2>
          <p className="text-slate-500 mb-8">Tell us the basics about your company.</p>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Startup Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => update('name', e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g. StartupAI"
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Website URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="url" 
                      value={formData.website}
                      onChange={(e) => update('website', e.target.value)}
                      className="w-full pl-10 pr-32 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="https://..."
                    />
                    <button 
                      onClick={handleAutofill}
                      disabled={isAnalyzing || !formData.name}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      {isAnalyzing ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12}/>}
                      Smart Autofill
                    </button>
                  </div>
               </div>
            </div>

            <div>
               <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-700">One-Liner Description</label>
                  {formData.tagline && (
                    <button 
                      onClick={handleRefineTagline}
                      disabled={isRefiningTagline}
                      className="text-xs flex items-center gap-1 text-purple-600 font-bold hover:bg-purple-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                    >
                        {isRefiningTagline ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        AI Refine
                    </button>
                  )}
               </div>
               <textarea 
                  value={formData.tagline}
                  onChange={(e) => update('tagline', e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none"
                  placeholder="e.g. The operating system for modern founders."
               />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Industry</label>
                   <select 
                      value={formData.industry}
                      onChange={(e) => update('industry', e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                   >
                      <option value="">Select Industry</option>
                      <option value="SaaS">SaaS</option>
                      <option value="Fintech">Fintech</option>
                      <option value="Healthtech">Healthtech</option>
                      <option value="AI/ML">AI / ML</option>
                      <option value="Ecommerce">Ecommerce</option>
                      <option value="Marketplace">Marketplace</option>
                      <option value="Hardware">Hardware</option>
                      <option value="DeepTech">DeepTech</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Year Founded</label>
                   <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="number" 
                        value={formData.yearFounded}
                        onChange={(e) => update('yearFounded', Number(e.target.value))}
                        className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="2024"
                      />
                   </div>
                </div>
            </div>

            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image (1200x600)</label>
               <div className={`relative w-full h-48 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${formData.coverImage ? 'border-purple-500 bg-purple-50' : 'hover:border-purple-300 hover:bg-slate-50'}`}>
                  {formData.coverImage ? (
                    <div className="relative w-full h-full rounded-xl overflow-hidden group">
                      <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <p className="text-white font-bold">Click to Change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 pointer-events-none">
                       <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                       <p className="text-slate-500 text-sm font-medium">Click to upload or drag and drop</p>
                       <p className="text-slate-400 text-xs mt-1">SVG, PNG, JPG or GIF (max. 3MB)</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: AI PANEL */}
      <div className="lg:col-span-1 space-y-6">
         <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
               <Wand2 size={20} className="text-purple-200" />
               <h3 className="font-bold text-lg">Detected Signals</h3>
            </div>
            <p className="text-purple-100 text-sm mb-6">
               AI analysis of your URL and inputs.
            </p>

            <div className="space-y-4">
               <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wide mb-1">
                     <Target size={12} /> Target Audience
                  </div>
                  <div className="font-medium text-sm">{detectedSignals.audience || '...'}</div>
               </div>
               
               <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wide mb-1">
                     <AlertCircle size={12} /> Core Problem
                  </div>
                  <div className="font-medium text-sm">{detectedSignals.problem || '...'}</div>
               </div>

               <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wide mb-1">
                     <Tag size={12} /> Pricing Model
                  </div>
                  <div className="font-medium text-sm">{detectedSignals.pricing || '...'}</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
