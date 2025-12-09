
import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Linkedin, Mail, Globe, Sparkles, Loader2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { WizardService } from '../../services/wizardAI';
import { API_KEY } from '../../lib/env';
import { useToast } from '../../context/ToastContext';
import { Founder } from '../../types';
import { generateShortId } from '../../lib/utils';

interface TeamCardProps {
  viewMode: 'edit' | 'investor';
}

export const TeamCard: React.FC<TeamCardProps> = ({ viewMode }) => {
  const { founders, addFounder, removeFounder, setFounders } = useData();
  const { toast } = useToast();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Founder>>({});
  const [isRewriting, setIsRewriting] = useState(false);

  const handleEdit = (founder: Founder) => {
    setEditingId(founder.id);
    setFormData(founder);
  };

  const handleSave = () => {
    if (editingId && formData.name) {
        const updatedFounders = founders.map(f => f.id === editingId ? { ...f, ...formData } as Founder : f);
        setFounders(updatedFounders);
        setEditingId(null);
    }
  };

  const handleAdd = () => {
      const newId = generateShortId();
      const newFounder: Founder = {
          id: newId,
          startupId: founders[0]?.startupId || 'temp',
          name: '',
          title: '',
          bio: '',
          isPrimaryContact: false
      };
      addFounder(newFounder);
      handleEdit(newFounder); // Immediately edit
  };

  const handleRewriteBio = async () => {
      if (!API_KEY || !formData.name || !formData.bio) return;
      setIsRewriting(true);
      try {
          const newBio = await WizardService.rewriteBio(formData.name, formData.bio, formData.title || 'Founder', API_KEY);
          if (newBio) setFormData(prev => ({ ...prev, bio: newBio }));
      } finally {
          setIsRewriting(false);
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Users size={20} className="text-purple-600"/> Team
            </h2>
            {viewMode === 'edit' && (
                <button onClick={handleAdd} className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors">
                    <Plus size={16} /> Add
                </button>
            )}
        </div>

        <div className="space-y-6">
            {founders.map((founder) => (
                <div key={founder.id} className="relative group border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                    {viewMode === 'edit' && !editingId && (
                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button onClick={() => handleEdit(founder)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded">
                                <Edit2 size={14} />
                            </button>
                            <button onClick={() => removeFounder(founder.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    )}

                    {editingId === founder.id ? (
                        <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-200 animate-in fade-in">
                            <div className="grid grid-cols-2 gap-4">
                                <input 
                                    placeholder="Name" 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                <input 
                                    placeholder="Title" 
                                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="relative">
                                <textarea 
                                    placeholder="Bio..." 
                                    value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}
                                    className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                                />
                                <button 
                                    onClick={handleRewriteBio} 
                                    disabled={isRewriting || !formData.bio}
                                    className="absolute bottom-2 right-2 p-1.5 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 disabled:opacity-50"
                                    title="AI Rewrite"
                                >
                                    {isRewriting ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="relative">
                                    <Linkedin size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"/>
                                    <input placeholder="LinkedIn" value={formData.linkedinProfile || ''} onChange={e => setFormData({...formData, linkedinProfile: e.target.value})} className="w-full pl-7 p-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"/>
                                </div>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"/>
                                    <input placeholder="Email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-7 p-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"/>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                                <button onClick={handleSave} className="px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg border border-slate-300 overflow-hidden">
                                {founder.avatarUrl ? <img src={founder.avatarUrl} className="w-full h-full object-cover"/> : founder.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900">{founder.name}</h3>
                                <div className="text-xs text-indigo-600 font-medium mb-2">{founder.title}</div>
                                <p className="text-sm text-slate-600 leading-relaxed mb-3">{founder.bio}</p>
                                <div className="flex gap-3">
                                    {founder.linkedinProfile && <a href={founder.linkedinProfile} target="_blank" className="text-slate-400 hover:text-[#0077b5]"><Linkedin size={16}/></a>}
                                    {founder.email && <a href={`mailto:${founder.email}`} className="text-slate-400 hover:text-slate-700"><Mail size={16}/></a>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
};
