
import React, { useState } from 'react';
import { Target, Edit2, Loader2, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WizardService } from '../../services/wizardAI';
import { API_KEY } from '../../lib/env';
import { StartupProfile } from '../../types';
import { useToast } from '../../context/ToastContext';

interface BusinessCardProps {
  viewMode: 'edit' | 'investor';
  profile: StartupProfile;
  onSave: (data: Partial<StartupProfile>) => Promise<void>;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ viewMode, profile, onSave }) => {
  const { success } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSuggesting, setIsSuggesting] = useState(false);

  const startEdit = () => {
      setFormData({
          problemStatement: profile?.problemStatement,
          solutionStatement: profile?.solutionStatement,
          businessModel: profile?.businessModel,
          pricingModel: profile?.pricingModel,
          competitors: profile?.competitors || [],
          keyFeatures: profile?.keyFeatures || []
      });
      setIsEditing(true);
  };

  const handleSaveClick = async () => {
      await onSave(formData);
      setIsEditing(false);
      success("Business model updated");
  };

  const handleSuggestCompetitors = async () => {
      if (!API_KEY) return;
      setIsSuggesting(true);
      try {
          const result = await WizardService.analyzeBusiness({ ...profile, ...formData }, API_KEY);
          if (result && result.competitors) {
              setFormData(prev => ({ ...prev, competitors: result.competitors }));
          }
      } finally {
          setIsSuggesting(false);
      }
  };

  // Helper for tag inputs
  const TagInput = ({ values, onChange, placeholder }: any) => (
    <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-lg bg-white focus-within:ring-2 focus-within:ring-indigo-500">
        {values.map((v: string, i: number) => (
            <span key={i} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                {v} <button onClick={() => onChange(values.filter((_: any, idx: number) => idx !== i))} className="hover:text-red-500">×</button>
            </span>
        ))}
        <input 
            className="flex-1 outline-none text-sm min-w-[100px]" 
            placeholder={placeholder}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val) {
                        onChange([...values, val]);
                        e.currentTarget.value = '';
                    }
                }
            }}
        />
    </div>
  );

  if (!profile) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Target size={20} className="text-blue-600"/> Business & Market
            </h2>
            {viewMode === 'edit' && !isEditing && (
                <button onClick={startEdit} className="text-slate-400 hover:text-indigo-600 transition-colors">
                    <Edit2 size={18} />
                </button>
            )}
        </div>

        {isEditing ? (
            <div className="space-y-6 animate-in fade-in">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Problem</label>
                        <textarea 
                            value={formData.problemStatement} onChange={e => setFormData({...formData, problemStatement: e.target.value})}
                            className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Solution</label>
                        <textarea 
                            value={formData.solutionStatement} onChange={e => setFormData({...formData, solutionStatement: e.target.value})}
                            className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Business Model</label>
                        <select 
                            value={formData.businessModel} onChange={e => setFormData({...formData, businessModel: e.target.value})}
                            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                        >
                            <option value="SaaS">SaaS</option>
                            <option value="Marketplace">Marketplace</option>
                            <option value="Transactional">Transactional</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pricing</label>
                        <select 
                            value={formData.pricingModel} onChange={e => setFormData({...formData, pricingModel: e.target.value})}
                            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                        >
                            <option value="Subscription">Subscription</option>
                            <option value="Freemium">Freemium</option>
                            <option value="Usage Based">Usage Based</option>
                        </select>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase">Competitors</label>
                        <button onClick={handleSuggestCompetitors} disabled={isSuggesting} className="text-xs text-purple-600 font-bold flex items-center gap-1 hover:underline">
                            {isSuggesting ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} Suggest
                        </button>
                    </div>
                    <TagInput values={formData.competitors} onChange={vals => setFormData({...formData, competitors: vals})} placeholder="Add competitor..." />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Key Features</label>
                    <TagInput values={formData.keyFeatures} onChange={vals => setFormData({...formData, keyFeatures: vals})} placeholder="Add feature..." />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded">Cancel</button>
                    <button onClick={handleSaveClick} className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700">Save Changes</button>
                </div>
            </div>
        ) : (
            <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 mb-2 text-rose-600 font-bold text-sm">
                            <AlertCircle size={16} /> Problem
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{profile.problemStatement}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold text-sm">
                            <CheckCircle2 size={16} /> Solution
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{profile.solutionStatement}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    <div>
                        <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Biz Model</span>
                        <span className="text-sm font-medium bg-white border border-slate-200 px-2 py-1 rounded">{profile.businessModel || '-'}</span>
                    </div>
                    <div>
                        <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Pricing</span>
                        <span className="text-sm font-medium bg-white border border-slate-200 px-2 py-1 rounded">{profile.pricingModel || '-'}</span>
                    </div>
                </div>

                <div>
                    <span className="block text-xs text-slate-500 uppercase font-bold mb-2">Competitors</span>
                    <div className="flex flex-wrap gap-2">
                        {profile.competitors && profile.competitors.length > 0 ? (
                            profile.competitors.map((c, i) => (
                                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{c}</span>
                            ))
                        ) : <span className="text-sm text-slate-400 italic">None listed</span>}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
