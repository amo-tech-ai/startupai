
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Globe, Sparkles, Edit2, Save, X, Building2, Loader2, Link as LinkIcon } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { WizardService } from '../../services/wizardAI';
import { API_KEY } from '../../lib/env';

interface OverviewCardProps {
  viewMode: 'edit' | 'investor';
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ viewMode }) => {
  const { profile, updateProfile, uploadFile } = useData();
  const { success, error, toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isRefining, setIsRefining] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        tagline: profile.tagline,
        websiteUrl: profile.websiteUrl,
        industry: profile.industry,
        yearFounded: profile.yearFounded
      });
    }
  }, [profile, isEditing]);

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
    success("Overview updated");
  };

  const handleRefineTagline = async () => {
    if (!API_KEY) return;
    setIsRefining(true);
    try {
      const refined = await WizardService.refineText(formData.tagline, 'tagline', API_KEY);
      if (refined) setFormData({ ...formData, tagline: refined });
    } catch (e) {
      error("AI refinement failed");
    } finally {
      setIsRefining(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'logo') => {
    if (e.target.files && e.target.files[0]) {
        toast(`Uploading ${type}...`, "info");
        try {
            const url = await uploadFile(e.target.files[0], 'startup-assets');
            if (url) {
                if (type === 'cover') updateProfile({ coverImageUrl: url });
                else updateProfile({ logoUrl: url });
                success(`${type === 'cover' ? 'Cover image' : 'Logo'} updated`);
            }
        } catch (e) { error("Upload failed"); }
    }
  };

  if (!profile) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative group/card">
        {/* Cover Image */}
        <div className="h-40 bg-slate-100 relative group/cover">
            {profile.coverImageUrl ? (
                <img src={profile.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-300"></div>
            )}
            {viewMode === 'edit' && (
                <>
                    <div className="absolute inset-0 bg-black/10 group-hover/cover:bg-black/20 transition-colors"></div>
                    <button 
                        onClick={() => coverInputRef.current?.click()}
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-lg opacity-0 group-hover/cover:opacity-100 transition-opacity"
                    >
                        <Camera size={18} />
                    </button>
                    <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                </>
            )}
        </div>

        <div className="px-6 pb-6 relative">
            {/* Logo */}
            <div className="absolute -top-10 left-6">
                <div className="w-20 h-20 rounded-xl border-4 border-white bg-white shadow-md relative group/logo overflow-hidden flex items-center justify-center">
                    {profile.logoUrl ? (
                        <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                        <Building2 size={32} className="text-slate-300" />
                    )}
                    {viewMode === 'edit' && (
                        <div 
                            onClick={() => logoInputRef.current?.click()}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 cursor-pointer transition-opacity"
                        >
                            <Camera size={20} className="text-white" />
                        </div>
                    )}
                    <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
                </div>
            </div>

            {/* Actions Header */}
            <div className="flex justify-end pt-4 h-10">
                {viewMode === 'edit' && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <Edit2 size={18} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="mt-2 space-y-4">
                {isEditing ? (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                                <input 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Year Founded</label>
                                <input 
                                    type="number"
                                    value={formData.yearFounded || ''} onChange={e => setFormData({...formData, yearFounded: Number(e.target.value)})}
                                    className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase">Tagline</label>
                                <button onClick={handleRefineTagline} disabled={isRefining} className="text-xs text-purple-600 font-bold flex items-center gap-1 hover:underline">
                                    {isRefining ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} AI Refine
                                </button>
                            </div>
                            <input 
                                value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})}
                                className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Website</label>
                            <input 
                                value={formData.websiteUrl} onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
                                className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded">Cancel</button>
                            <button onClick={handleSave} className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700">Save</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">{profile.name}</h2>
                        <p className="text-lg text-slate-600 mb-4">{profile.tagline}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                            {profile.websiteUrl && (
                                <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                                    <Globe size={16} /> {profile.websiteUrl.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                            {profile.yearFounded && (
                                <div className="flex items-center gap-1.5">
                                    <span className="font-medium">Est. {profile.yearFounded}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
