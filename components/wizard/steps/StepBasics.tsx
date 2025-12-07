
import React from 'react';
import { Building2, Globe, Loader2, Wand2 } from 'lucide-react';

interface StepBasicsProps {
  formData: any;
  updateField: (field: string, value: any) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const StepBasics: React.FC<StepBasicsProps> = ({ formData, updateField, onAnalyze, isAnalyzing }) => {
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
                  onClick={onAnalyze}
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
};
