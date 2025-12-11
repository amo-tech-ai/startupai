
import React, { useState, useRef } from 'react';
import { Globe, Wand2, Loader2, Calendar, Target, Tag, AlertCircle, Image as ImageIcon, Sparkles, Linkedin, Plus, Trash2, Search, TrendingUp, Users } from 'lucide-react';
import { WizardService } from '../../../services/wizardAI';
import { API_KEY } from '../../../lib/env';
import { motion, AnimatePresence } from 'framer-motion';

// Workaround for framer-motion types
const MotionDiv = motion.div as any;

interface StepContextProps {
  formData: any;
  setFormData: (data: any) => void;
  onCoverUpload?: (file: File) => void;
}

export const StepContext: React.FC<StepContextProps> = ({ formData, setFormData, onCoverUpload }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRefiningTagline, setIsRefiningTagline] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  
  // AI Signals State
  const [detectedSignals, setDetectedSignals] = useState<{ 
      audience?: string; 
      problem?: string; 
      pricing?: string;
      competitors?: string[];
      trends?: string[];
  }>({});

  const handleAutofill = async () => {
    // Basic validation
    const hasInput = formData.name || formData.website || formData.socialLinks?.linkedin || formData.searchTerms;
    if (!hasInput) return;
    
    if (!API_KEY) { alert("API Key missing"); return; }

    setIsAnalyzing(true);
    try {
      const inputs = {
          name: formData.name,
          website: formData.website,
          linkedin: formData.socialLinks?.linkedin,
          additionalUrls: formData.additionalUrls,
          searchTerms: formData.searchTerms,
          industry: formData.industry
      };

      const result = await WizardService.analyzeContext(inputs, API_KEY);
      
      if (result) {
        setFormData((prev: any) => ({
          ...prev,
          tagline: result.tagline || prev.tagline,
          industry: result.industry || prev.industry,
          pricingModel: result.pricing_model_hint || prev.pricingModel,
          problem: result.core_problem || prev.problem,
          solution: result.solution_statement || prev.solution, 
          // Merge competitors if found
          competitors: result.competitors || prev.competitors,
          socialLinks: { 
             ...prev.socialLinks,
             linkedin: result.social_links?.linkedin || prev.socialLinks.linkedin,
             twitter: result.social_links?.twitter || prev.socialLinks.twitter,
             github: result.social_links?.github || prev.socialLinks.github,
          }
        }));
        
        setDetectedSignals({
          audience: result.target_audience,
          problem: result.core_problem,
          pricing: result.pricing_model_hint,
          competitors: result.competitors,
          trends: result.trends
        });
      }
    } catch (e) {
        console.error("Auto-fill failed", e);
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
      if (onCoverUpload) {
          onCoverUpload(file);
      } else {
          // Fallback if no uploader passed
          const reader = new FileReader();
          reader.onloadend = () => {
            update('coverImage', reader.result as string);
          };
          reader.readAsDataURL(file);
      }
    }
  };

  const update = (field: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: val }));
  };

  const updateSocial = (network: string, val: string) => {
      setFormData((prev: any) => ({
          ...prev,
          socialLinks: { ...prev.socialLinks, [network]: val }
      }));
  };

  const addUrl = () => {
      if (newUrl.trim()) {
          update('additionalUrls', [...(formData.additionalUrls || []), newUrl.trim()]);
          setNewUrl('');
      }
  };

  const removeUrl = (idx: number) => {
      const newUrls = [...(formData.additionalUrls || [])];
      newUrls.splice(idx, 1);
      update('additionalUrls', newUrls);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4 duration-500 items-start">
      {/* LEFT: FORM CARD */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Smart Context Intake</h2>
                <p className="text-slate-500">Add your links, and Gemini 3 will build your profile.</p>
            </div>
            <button 
                onClick={handleAutofill}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isAnalyzing ? <Loader2 size={18} className="animate-spin"/> : <Wand2 size={18}/>}
                <span>Run Smart Autofill</span>
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
               <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Startup Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => update('name', e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-lg font-medium"
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
                      className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="https://..."
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">LinkedIn URL</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="url" 
                      value={formData.socialLinks?.linkedin || ''}
                      onChange={(e) => updateSocial('linkedin', e.target.value)}
                      className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="https://linkedin.com/..."
                    />
                  </div>
               </div>
            </div>

            {/* Additional URLs */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Additional Links (Blog, Docs, Press)</label>
                <div className="space-y-2">
                    {formData.additionalUrls?.map((url: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <Globe size={14} className="text-slate-400" />
                            <span className="flex-1 truncate text-slate-600">{url}</span>
                            <button onClick={() => removeUrl(idx)} className="text-slate-400 hover:text-red-500">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                    <div className="flex gap-2">
                        <input 
                            type="url" 
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addUrl()}
                            className="flex-1 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Add any other relevant URL..."
                        />
                        <button onClick={addUrl} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Terms */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Context / Search Terms</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        value={formData.searchTerms || ''}
                        onChange={(e) => update('searchTerms', e.target.value)}
                        className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="e.g. AI for law, Compliance automation, CompetitorName"
                    />
                </div>
                <p className="text-xs text-slate-500 mt-1 ml-1">Give Gemini specific terms to research if you are in stealth.</p>
            </div>

            <div className="border-t border-slate-100 my-6"></div>

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
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none h-20 resize-none"
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
               <div className={`relative w-full h-40 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${formData.coverImage ? 'border-purple-500 bg-purple-50' : 'hover:border-purple-300 hover:bg-slate-50'}`}>
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

      {/* RIGHT: DETECTED SIGNALS PANEL */}
      <div className="lg:col-span-1 space-y-6">
         <div className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xl sticky top-24">
            <div className="flex items-center gap-2 mb-4">
               <div className="p-2 bg-white/20 rounded-lg">
                   {isAnalyzing ? <Loader2 size={20} className="animate-spin text-white" /> : <Sparkles size={20} className="text-purple-200" />}
               </div>
               <div>
                   <h3 className="font-bold text-lg leading-tight">Detected Signals</h3>
                   <p className="text-xs text-purple-200">Gemini 3 Pro + Search</p>
               </div>
            </div>
            
            <p className="text-purple-100 text-xs mb-6 leading-relaxed opacity-90">
               We're analyzing your digital footprint to pre-fill your strategy.
            </p>

            <div className="space-y-3">
               <SignalCard icon={<Target size={14} />} label="Target Audience" value={detectedSignals.audience} />
               <SignalCard icon={<AlertCircle size={14} />} label="Core Problem" value={detectedSignals.problem} />
               <SignalCard icon={<Tag size={14} />} label="Pricing Model" value={detectedSignals.pricing} />
               
               {/* Competitors */}
               {detectedSignals.competitors && detectedSignals.competitors.length > 0 && (
                   <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wide mb-2">
                         <Users size={14} /> Competitors
                      </div>
                      <div className="flex flex-wrap gap-1">
                          {detectedSignals.competitors.map((c, i) => (
                              <span key={i} className="text-[10px] bg-black/20 px-2 py-1 rounded text-white">{c}</span>
                          ))}
                      </div>
                   </div>
               )}

               {/* Trends */}
               {detectedSignals.trends && detectedSignals.trends.length > 0 && (
                   <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wide mb-2">
                         <TrendingUp size={14} /> Market Trends
                      </div>
                      <ul className="list-disc list-inside text-xs text-white/90 space-y-1">
                          {detectedSignals.trends.map((t, i) => (
                              <li key={i}>{t}</li>
                          ))}
                      </ul>
                   </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

const SignalCard = ({ icon, label, value }: { icon: any, label: string, value?: string }) => (
    <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 min-h-[60px]">
        <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wide mb-1">
            {icon} {label}
        </div>
        <div className="font-medium text-sm text-white/90 leading-snug">
            {value || <span className="opacity-40 italic text-xs">Waiting for analysis...</span>}
        </div>
    </div>
);
