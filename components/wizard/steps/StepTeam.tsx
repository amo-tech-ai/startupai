
import React, { useState } from 'react';
import { Users, Linkedin, Mail, Globe, Sparkles, Loader2, Plus, Trash2 } from 'lucide-react';
import { WizardService } from '../../../services/wizardAI';
import { API_KEY } from '../../../lib/env';

interface StepTeamProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const StepTeam: React.FC<StepTeamProps> = ({ formData, setFormData }) => {
  const [rewritingId, setRewritingId] = useState<string | null>(null);

  const handleRewriteBio = async (idx: number) => {
    if (!API_KEY) return;
    const founder = formData.founders[idx];
    if (!founder.bio) return;

    setRewritingId(founder.id);
    try {
      const newBio = await WizardService.rewriteBio(founder.name, founder.bio, founder.title, API_KEY);
      const updated = [...formData.founders];
      updated[idx].bio = newBio;
      setFormData((prev: any) => ({ ...prev, founders: updated }));
    } finally {
      setRewritingId(null);
    }
  };

  const updateFounder = (idx: number, field: string, val: string) => {
    const updated = [...formData.founders];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData((prev: any) => ({ ...prev, founders: updated }));
  };

  const addFounder = () => {
    setFormData((prev: any) => ({
      ...prev,
      founders: [...prev.founders, { id: Date.now().toString(), name: '', title: '', bio: '' }]
    }));
  };

  const removeFounder = (idx: number) => {
    if (formData.founders.length <= 1) return;
    const updated = formData.founders.filter((_: any, i: number) => i !== idx);
    setFormData((prev: any) => ({ ...prev, founders: updated }));
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
         <div className="flex justify-between items-start mb-6">
            <div>
               <h2 className="text-2xl font-bold text-slate-900 mb-1">Who is building this?</h2>
               <p className="text-slate-500">Investors back founders with unique insight.</p>
            </div>
            <button 
               onClick={addFounder}
               className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-bold border border-slate-200 hover:bg-slate-100 transition-colors"
            >
               <Plus size={16} /> Add Co-Founder
            </button>
         </div>

         <div className="space-y-8">
            {formData.founders.map((founder: any, idx: number) => (
               <div key={founder.id} className="p-6 border border-slate-200 rounded-2xl bg-slate-50/50 relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => removeFounder(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                     </button>
                  </div>
                  
                  <div className="grid md:grid-cols-12 gap-6">
                     {/* Avatar Col */}
                     <div className="md:col-span-2 flex flex-col items-center gap-3">
                        <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 border-2 border-white shadow-sm">
                           <Users size={32} />
                        </div>
                        <button className="text-xs text-purple-600 font-bold hover:underline">Upload Photo</button>
                     </div>

                     {/* Details Col */}
                     <div className="md:col-span-10 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                           <input 
                              type="text" 
                              placeholder="Full Name" 
                              value={founder.name}
                              onChange={(e) => updateFounder(idx, 'name', e.target.value)}
                              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                           />
                           <input 
                              type="text" 
                              placeholder="Title (e.g. CEO)" 
                              value={founder.title}
                              onChange={(e) => updateFounder(idx, 'title', e.target.value)}
                              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                           />
                        </div>

                        <div className="relative">
                           <textarea 
                              placeholder="Short Bio (2-3 sentences)" 
                              value={founder.bio}
                              onChange={(e) => updateFounder(idx, 'bio', e.target.value)}
                              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none bg-white"
                           />
                           <button 
                              onClick={() => handleRewriteBio(idx)}
                              disabled={!founder.bio || rewritingId === founder.id}
                              className="absolute right-3 bottom-3 p-1.5 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                              title="AI Rewrite Bio"
                           >
                              {rewritingId === founder.id ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                           </button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                           <div className="relative">
                              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                              <input 
                                 type="text" 
                                 placeholder="LinkedIn URL"
                                 value={founder.linkedin}
                                 onChange={(e) => updateFounder(idx, 'linkedin', e.target.value)}
                                 className="w-full pl-9 p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-purple-500"
                              />
                           </div>
                           <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                              <input 
                                 type="email" 
                                 placeholder="Email"
                                 value={founder.email}
                                 onChange={(e) => updateFounder(idx, 'email', e.target.value)}
                                 className="w-full pl-9 p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-purple-500"
                              />
                           </div>
                           <div className="relative">
                              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                              <input 
                                 type="url" 
                                 placeholder="Personal Site"
                                 value={founder.website}
                                 onChange={(e) => updateFounder(idx, 'website', e.target.value)}
                                 className="w-full pl-9 p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-purple-500"
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 items-start">
         <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Users size={20} />
         </div>
         <div>
            <h4 className="text-sm font-bold text-blue-900">Why this matters</h4>
            <p className="text-sm text-blue-700 mt-1">Founder-Market Fit is the #1 thing early stage investors look for. Highlight specific experience that makes you the right person to solve this problem.</p>
         </div>
      </div>
    </div>
  );
};
