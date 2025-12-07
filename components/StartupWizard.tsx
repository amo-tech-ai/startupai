import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Zap,
  Building2,
  Target,
  Users,
  DollarSign,
  Rocket,
  AlertCircle,
  Loader2,
  Globe,
  Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { StartupStage } from '../types';
import { useData } from '../context/DataContext';

interface StartupWizardProps {
  setPage: (page: any) => void;
}

// Wizard Steps Configuration
const STEPS = [
  { id: 1, title: 'Basics', description: 'Company Name & Website' },
  { id: 2, title: 'Identity', description: 'Tagline & Mission' },
  { id: 3, title: 'Stage', description: 'Development Phase' },
  { id: 4, title: 'Problem', description: 'What are you solving?' },
  { id: 5, title: 'Solution', description: 'How do you solve it?' },
  { id: 6, title: 'Business', description: 'Model & Pricing' },
  { id: 7, title: 'Traction', description: 'Key Metrics' },
  { id: 8, title: 'Team', description: 'Founding Members' },
  { id: 9, title: 'Review', description: 'Finalize & Launch' },
];

const StartupWizard: React.FC<StartupWizardProps> = ({ setPage }) => {
  const { updateProfile, updateMetrics, addActivity } = useData();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    tagline: '',
    mission: '',
    stage: 'Idea' as StartupStage,
    targetMarket: '',
    problem: '',
    solution: '',
    businessModel: '',
    pricingModel: '',
    mrr: '',
    users: '',
    fundingGoal: '',
    founders: [{ name: '', role: '' }]
  });

  // --- Actions ---

  const handleNext = () => {
    if (currentStep < 9) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0,0);
    } else {
      // Final Submit
      // 1. Map to Profile Structure
      updateProfile({
        name: formData.name,
        websiteUrl: formData.website,
        tagline: formData.tagline,
        mission: formData.mission,
        stage: formData.stage,
        targetMarket: formData.targetMarket,
        problemStatement: formData.problem,
        solutionStatement: formData.solution,
        businessModel: formData.businessModel,
        fundingGoal: Number(formData.fundingGoal) || 0,
        createdAt: new Date().toISOString(),
      });

      // 2. Map to Metrics Structure
      updateMetrics({
        mrr: Number(formData.mrr) || 0,
        activeUsers: Number(formData.users) || 0,
        period: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });

      // 3. Log Activity
      addActivity({
        type: 'milestone',
        title: 'Profile Setup Complete',
        description: `${formData.name} is now ready to build.`,
      });
      
      // Simulate API delay & Redirect
      setTimeout(() => {
        setPage('dashboard');
      }, 800);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      setPage('home'); // or cancel
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- AI Integration ---

  const analyzeWebsite = async () => {
    if (!formData.name && !formData.website) {
      alert("Please enter a Company Name or Website URL first.");
      return;
    }
    
    if (!process.env.API_KEY) {
      alert("API Key not found.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are an expert startup analyst. Analyze the startup named "${formData.name}" ${formData.website ? `with website ${formData.website}` : ''}.
        
        If the website/company is real and found via Google Search, use real data.
        If it seems hypothetical or new, generate a plausible, high-quality startup profile based on the name and typical industry patterns.

        Return a JSON object with the following fields:
        - tagline (concise, punchy, under 10 words)
        - mission (inspiring, under 20 words)
        - targetMarket (specific industry/niche)
        - problem (2-3 sentences describing the pain point)
        - solution (2-3 sentences describing the product value)
        - businessModel (choose one: SaaS, Marketplace, Ecommerce, Usage, Service)
        
        Ensure the tone is professional, investor-ready, and persuasive.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Using Pro for complex reasoning/search
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }], // Use Search Grounding to find real info
          responseMimeType: 'application/json',
        }
      });

      const text = response.text;
      if (text) {
        const data = JSON.parse(text);
        setFormData(prev => ({
          ...prev,
          tagline: data.tagline || prev.tagline,
          mission: data.mission || prev.mission,
          targetMarket: data.targetMarket || prev.targetMarket,
          problem: data.problem || prev.problem,
          solution: data.solution || prev.solution,
          businessModel: data.businessModel || prev.businessModel,
        }));
        // Move to next step automatically if successful to show off the magic
        if (currentStep === 1) {
            setTimeout(() => setCurrentStep(2), 500);
        }
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      alert("Could not auto-generate profile. Please fill manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const refineWithAI = async (field: 'problem' | 'solution' | 'tagline' | 'mission') => {
    if (!process.env.API_KEY) {
      alert("API Key not found.");
      return;
    }

    // Build context based on what we already know
    const context = `
      Startup Name: ${formData.name}
      Industry: ${formData.targetMarket}
      ${field === 'solution' ? `Problem context: ${formData.problem}` : ''}
      ${field === 'mission' ? `Tagline context: ${formData.tagline}` : ''}
    `;

    const prompt = `
      Context: ${context}
      User Input (${field}): "${formData[field]}"
      
      Task: Rewrite the above ${field} to be more professional, concise, and investor-ready. 
      - If it's a tagline, make it punchy (max 10 words).
      - If it's a problem/solution, use active voice and quantify if possible (max 3 sentences).
      
      Return ONLY the rewritten text. No explanations.
    `;

    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });
      
      const refinedText = response.text?.trim();
      if (refinedText) {
        updateField(field, refinedText);
      }
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- Render Helpers ---

  const renderStepIndicator = () => (
    <div className="w-full bg-white border-b border-slate-200 py-4 px-6 md:px-12 sticky top-0 z-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Step {currentStep} of 9</span>
            <span className="text-sm font-bold text-indigo-600">{STEPS[currentStep-1].title}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-indigo-600 rounded-full"
                initial={{ width: `${((currentStep-1)/9)*100}%` }}
                animate={{ width: `${(currentStep/9)*100}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Basics
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
               <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                  <Building2 size={32} />
               </div>
               <h2 className="text-2xl font-bold text-slate-900">Let's start with the basics</h2>
               <p className="text-slate-500">Enter your URL to auto-fill your entire profile.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Startup Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
                  placeholder="e.g. Acme AI"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Website (Optional)</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                        type="url" 
                        value={formData.website}
                        onChange={e => updateField('website', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="https://..."
                        />
                    </div>
                    <button 
                        onClick={analyzeWebsite}
                        disabled={isAnalyzing || (!formData.name && !formData.website)}
                        className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <Wand2 size={20} />
                                <span>Auto-Fill</span>
                            </>
                        )}
                    </button>
                </div>
                <p className="text-xs text-slate-500 mt-2 ml-1">
                    ✨ <strong>Pro Tip:</strong> Enter your URL and click Auto-Fill. Gemini 3 will research your company and draft your mission, problem, and solution automatically.
                </p>
              </div>
            </div>
          </div>
        );

      case 2: // Identity
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
               <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600">
                  <Target size={32} />
               </div>
               <h2 className="text-2xl font-bold text-slate-900">Define your identity</h2>
               <p className="text-slate-500">In one sentence, what do you do?</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                   <label className="block text-sm font-medium text-slate-700">Tagline / One-Liner</label>
                   <button 
                      onClick={() => refineWithAI('tagline')}
                      disabled={!formData.tagline || isAiLoading}
                      className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 disabled:opacity-50 font-medium"
                   >
                      <Sparkles size={14} /> AI Refine
                   </button>
                </div>
                <input 
                  type="text" 
                  value={formData.tagline}
                  onChange={e => updateField('tagline', e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. The operating system for modern founders."
                />
              </div>
              
               <div>
                <div className="flex justify-between items-center mb-1">
                   <label className="block text-sm font-medium text-slate-700">Mission Statement</label>
                   <button 
                      onClick={() => refineWithAI('mission')}
                      disabled={!formData.mission || isAiLoading}
                      className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 disabled:opacity-50 font-medium"
                   >
                      <Sparkles size={14} /> AI Refine
                   </button>
                </div>
                <textarea 
                  value={formData.mission}
                  onChange={e => updateField('mission', e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                  placeholder="e.g. To democratize access to capital for everyone..."
                />
              </div>
            </div>
          </div>
        );

      case 3: // Stage
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
             <div className="text-center mb-8">
               <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                  <Rocket size={32} />
               </div>
               <h2 className="text-2xl font-bold text-slate-900">Current Stage</h2>
               <p className="text-slate-500">Where are you in the journey?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['Idea', 'MVP', 'Seed', 'Series A', 'Growth'].map((stage) => (
                <div 
                  key={stage}
                  onClick={() => updateField('stage', stage)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.stage === stage 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-100 bg-white hover:border-indigo-200'
                  }`}
                >
                  <div className="font-bold text-lg">{stage}</div>
                </div>
              ))}
            </div>

             <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Market / Industry</label>
                <input 
                  type="text" 
                  value={formData.targetMarket}
                  onChange={e => updateField('targetMarket', e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. B2B Fintech, Healthcare..."
                />
              </div>
          </div>
        );

      case 4: // Problem
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
             <div className="text-center mb-8">
               <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-600">
                  <AlertCircle size={32} />
               </div>
               <h2 className="text-2xl font-bold text-slate-900">The Problem</h2>
               <p className="text-slate-500">What pain point are you solving?</p>
            </div>

             <div className="relative">
                <div className="flex justify-between items-center mb-2">
                   <label className="block text-sm font-medium text-slate-700">Problem Statement</label>
                </div>
                <textarea 
                  value={formData.problem}
                  onChange={e => updateField('problem', e.target.value)}
                  className="w-full p-6 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-64 resize-none leading-relaxed"
                  placeholder="Describe the problem your customers face..."
                />
                
                {/* AI Overlay */}
                <div className="absolute bottom-4 right-4">
                   <button 
                      onClick={() => refineWithAI('problem')}
                      disabled={!formData.problem || isAiLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                      {isAiLoading ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16} />}
                      <span>Refine with Gemini 3</span>
                   </button>
                </div>
             </div>
          </div>
        );

      case 5: // Solution
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
             <div className="text-center mb-8">
               <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
                  <CheckCircle2 size={32} />
               </div>
               <h2 className="text-2xl font-bold text-slate-900">The Solution</h2>
               <p className="text-slate-500">How do you solve it uniquely?</p>
            </div>

             <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">Solution Statement</label>
                <textarea 
                  value={formData.solution}
                  onChange={e => updateField('solution', e.target.value)}
                  className="w-full p-6 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-64 resize-none leading-relaxed"
                  placeholder="Describe your product or service..."
                />
                
                {/* AI Overlay */}
                <div className="absolute bottom-4 right-4">
                   <button 
                      onClick={() => refineWithAI('solution')}
                      disabled={!formData.solution || isAiLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                      {isAiLoading ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16} />}
                      <span>Refine with Gemini 3</span>
                   </button>
                </div>
             </div>
          </div>
        );

      case 6: // Business Model
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
    
      case 7: // Traction
         return (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Traction & Metrics</h2>
                    <p className="text-slate-500">Show us the numbers (estimations ok)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Revenue ($)</label>
                         <input 
                            type="number" 
                            value={formData.mrr}
                            onChange={e => updateField('mrr', e.target.value)}
                            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="0"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Active Users</label>
                         <input 
                            type="number" 
                            value={formData.users}
                            onChange={e => updateField('users', e.target.value)}
                            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="0"
                        />
                    </div>
                     <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Funding Goal ($)</label>
                         <input 
                            type="number" 
                            value={formData.fundingGoal}
                            onChange={e => updateField('fundingGoal', e.target.value)}
                            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. 1000000"
                        />
                    </div>
                </div>
             </div>
         );

      case 8: // Team
         return (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                     <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-600">
                        <Users size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">The Team</h2>
                    <p className="text-slate-500">Who is building this?</p>
                </div>
                
                 <div className="space-y-4">
                    {formData.founders.map((founder, idx) => (
                        <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                            <h4 className="font-bold text-sm text-slate-500 uppercase mb-2">Founder {idx + 1}</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Name"
                                    value={founder.name}
                                    onChange={(e) => {
                                        const newFounders = [...formData.founders];
                                        newFounders[idx].name = e.target.value;
                                        setFormData({...formData, founders: newFounders});
                                    }}
                                    className="p-3 border border-slate-200 rounded-lg"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Role (e.g. CEO)"
                                    value={founder.role}
                                     onChange={(e) => {
                                        const newFounders = [...formData.founders];
                                        newFounders[idx].role = e.target.value;
                                        setFormData({...formData, founders: newFounders});
                                    }}
                                    className="p-3 border border-slate-200 rounded-lg"
                                />
                            </div>
                        </div>
                    ))}
                    <button 
                        onClick={() => setFormData(prev => ({...prev, founders: [...prev.founders, {name: '', role: ''}]}))}
                        className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 font-bold rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                    >
                        + Add Co-Founder
                    </button>
                 </div>
             </div>
         );

      case 9: // Review
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
             <div className="text-center mb-8">
                 <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/30">
                     <CheckCircle2 size={32} className="text-white" />
                 </div>
                <h2 className="text-3xl font-bold text-slate-900">Ready for Liftoff?</h2>
                <p className="text-slate-500">Review your profile before generating your assets.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 max-h-[400px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="block text-slate-500 font-medium">Name</span>
                        <span className="block font-bold text-slate-900">{formData.name}</span>
                    </div>
                    <div>
                        <span className="block text-slate-500 font-medium">Stage</span>
                        <span className="block font-bold text-slate-900">{formData.stage}</span>
                    </div>
                    <div className="col-span-2">
                         <span className="block text-slate-500 font-medium">Tagline</span>
                        <span className="block font-bold text-slate-900">{formData.tagline}</span>
                    </div>
                     <div className="col-span-2">
                         <span className="block text-slate-500 font-medium">Problem</span>
                        <span className="block text-slate-700 italic">"{formData.problem}"</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-2 p-4 bg-indigo-50 text-indigo-800 rounded-lg text-sm">
                <Sparkles size={16} />
                <span>On submit, Gemini 3 will generate your <strong>Pitch Deck</strong> and <strong>Financial Model</strong> automatically.</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 1. Header (Logo & Close) */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
             <div className="bg-slate-900 text-white p-1.5 rounded-lg">
                <Zap size={20} fill="currentColor" />
             </div>
             <span className="font-bold text-xl tracking-tight">startupAI</span>
          </div>
          <button 
             onClick={() => setPage('home')} 
             className="text-slate-400 hover:text-slate-900 font-medium"
          >
             Save & Exit
          </button>
      </header>

      {/* 2. Wizard Progress */}
      {renderStepIndicator()}

      {/* 3. Main Content Form */}
      <main className="flex-1 flex flex-col items-center justify-start pt-8 pb-32 px-6">
        <div className="w-full max-w-2xl">
          {renderStepContent()}
        </div>
      </main>

      {/* 4. Footer Controls */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 z-20">
         <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button 
                onClick={handleBack}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
                {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>

            <button 
                onClick={handleNext}
                className="group flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1"
            >
                {currentStep === 9 ? 'Complete Setup' : 'Continue'}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </footer>
    </div>
  );
};

export default StartupWizard;