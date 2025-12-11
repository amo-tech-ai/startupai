
import React, { useState } from 'react';
import { Globe, Wand2, Loader2, Calendar, Image as ImageIcon, Linkedin, Plus, Trash2, Search, Zap } from 'lucide-react';
import { WizardService } from '../../../services/wizardAI';
import { API_KEY } from '../../../lib/env';
import { useToast } from '../../../context/ToastContext';
import { WizardFormData } from '../types';

interface StepContextProps {
  formData: WizardFormData;
  setFormData: (data: any) => void;
  onCoverUpload?: (file: File) => void;
  onNext: () => void;
}

export const StepContext: React.FC<StepContextProps> = ({ formData, setFormData, onCoverUpload, onNext }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const { toast, success, error } = useToast();

  const handleAutofill = async () => {
    // Basic validation
    const hasInput = formData.name || formData.website || formData.socialLinks?.linkedin || formData.searchTerms;
    if (!hasInput) {
        error("Please enter a Name, Website, or Search Term first.");
        return;
    }
    
    if (!API_KEY) { error("API Key missing"); return; }

    setIsAnalyzing(true);
    toast("Running Smart Context Analysis (Gemini 3 Pro)...", "info");

    try {
      const inputs = {
          name: formData.name,
          description: formData.description,
          targetMarket: formData.targetMarket,
          website: formData.website,
          linkedin: formData.socialLinks?.linkedin,
          additionalUrls: formData.additionalUrls,
          searchTerms: formData.searchTerms,
          industry: formData.industry,
      };

      const result = await WizardService.analyzeContext(inputs, API_KEY);
      
      if (result && result.summary_screen) {
        
        // Map detected founders if available
        let mappedFounders = formData.founders;
        if (result.founder_intelligence?.founders && result.founder_intelligence.founders.length > 0) {
            mappedFounders = result.founder_intelligence.founders.map((f: any, idx: number) => ({
                id: Date.now().toString() + idx,
                name: f.name || '',
                title: f.title || '',
                bio: f.bio || '',
                linkedin: f.linkedin || '',
                email: '', // AI usually can't get email reliably
                website: ''
            }));
        }

        // 1. Save AI Analysis Result for Step 2
        const updatedData = {
            ...formData,
            aiAnalysisResult: result, // Store the full result for Step 2
            
            // 2. Autofill Wizard Fields
            industry: result.summary_screen.industry_detected || formData.industry,
            tagline: result.wizard_autofill.product_summary || formData.tagline,
            targetMarket: result.wizard_autofill.target_customers ? result.wizard_autofill.target_customers.join(', ') : formData.targetMarket,
            
            founders: mappedFounders,

            problem: result.wizard_autofill.problem || formData.problem,
            solution: result.wizard_autofill.solution || formData.solution,
            businessModel: formData.businessModel || (result.wizard_autofill.pricing_model?.includes('SaaS') ? 'SaaS' : 'Transactional'), 
            pricingModel: result.wizard_autofill.pricing_model || formData.pricingModel,
            
            customerSegments: result.wizard_autofill.target_customers || formData.customerSegments,
            keyFeatures: result.wizard_autofill.key_features || formData.keyFeatures,
            competitors: result.wizard_autofill.competitors?.map((c: any) => c.name) || formData.competitors,
            coreDifferentiator: result.wizard_autofill.core_differentiator || formData.coreDifferentiator,
            
            aiSummary: result.summary_screen.summary
        };

        setFormData(updatedData);
        success("Analysis Complete! Reviewing insights...");
        
        // 3. Move to Step 2 (Summary Screen)
        onNext();
      } else {
        error("Could not analyze context. Please try manually.");
      }
    } catch (e) {
        console.error("Auto-fill failed", e);
        error("Analysis failed. Please check your inputs.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onCoverUpload) {
      onCoverUpload(e.target.files[0]);
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
                <Zap size={32} className="text-white" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Smart Context Intake</h1>
            <p className="text-slate-500 max-w-lg mx-auto">
                Tell us about your startup. Our AI will analyze your website, LinkedIn, and market context to build your profile automatically.
            </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            {/* 1. Identity */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
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

            {/* 2. Extra Context */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">Additional Links (Press, Docs, Blog)</label>
                <div className="space-y-2 mb-3">
                    {formData.additionalUrls?.map((url: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <Globe size={14} className="text-slate-400" />
                            <span className="flex-1 truncate text-slate-600">{url}</span>
                            <button onClick={() => removeUrl(idx)} className="text-slate-400 hover:text-red-500">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input 
                        type="url" 
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addUrl()}
                        className="flex-1 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="Add another URL..."
                    />
                    <button onClick={addUrl} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            {/* 3. Deep Context */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Startup Description</label>
                    <textarea 
                        value={formData.description}
                        onChange={(e) => update('description', e.target.value)}
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none leading-relaxed"
                        placeholder="Describe your startup in 2-3 sentences. What do you do?"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Target Market</label>
                    <textarea 
                        value={formData.targetMarket}
                        onChange={(e) => update('targetMarket', e.target.value)}
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none h-20 resize-none"
                        placeholder="Who are you selling to? e.g. 'Enterprise HR teams in North America'"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Search Terms / Keywords</label>
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
                    <p className="text-xs text-slate-500 mt-1 ml-1">Helps Gemini find competitors and trends.</p>
                </div>
            </div>

            {/* 4. Metadata */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
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

            {/* 5. Cover Image */}
            <div className="mb-8">
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

            {/* Action */}
            <button 
                onClick={handleAutofill}
                disabled={isAnalyzing}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-purple-600/20 hover:shadow-purple-600/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
                {isAnalyzing ? <Loader2 size={24} className="animate-spin" /> : <Wand2 size={24} />}
                <span>{isAnalyzing ? 'Analyzing Context...' : 'Run Smart Autofill'}</span>
            </button>
        </div>
    </div>
  );
};
