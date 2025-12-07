
import React, { useState, useEffect } from 'react';
import { Building2, Globe, DollarSign, Save, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const GeneralSettings: React.FC = () => {
  const { profile, updateProfile, isLoading } = useData();
  const { signOut } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    tagline: '',
    mission: '',
    fundingGoal: 0
  });
  
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        websiteUrl: profile.websiteUrl || '',
        tagline: profile.tagline,
        mission: profile.mission,
        fundingGoal: profile.fundingGoal
      });
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDeleteWorkspace = async () => {
    if (confirm("Are you sure? This will reset all local data and redirect to the home page.")) {
      await signOut();
      window.location.href = '/';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-end mb-4">
        <button 
            onClick={handleSave}
            disabled={isLoading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white transition-all shadow-lg ${isSaved ? 'bg-green-600 shadow-green-600/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'}`}
        >
            {isSaved ? <Check size={18} /> : <Save size={18} />}
            {isSaved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Startup Name</label>
            <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900" 
                />
            </div>
        </div>
        <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
            <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900" 
                />
            </div>
        </div>

        <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
            <input 
                type="text" 
                value={formData.tagline}
                onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900" 
            />
            <p className="text-xs text-slate-500 mt-1">Displayed on your dashboard header.</p>
        </div>

        <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Mission Statement</label>
            <textarea 
                value={formData.mission}
                onChange={(e) => setFormData({...formData, mission: e.target.value})}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 h-24 resize-none" 
            />
        </div>

        <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Funding Goal</label>
            <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="number" 
                    value={formData.fundingGoal}
                    onChange={(e) => setFormData({...formData, fundingGoal: Number(e.target.value)})}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900" 
                />
            </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Danger Zone</h3>
        <button 
            onClick={handleDeleteWorkspace}
            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
        >
            Delete Workspace
        </button>
      </div>
    </div>
  );
};
