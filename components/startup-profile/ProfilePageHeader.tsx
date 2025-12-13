
import React from 'react';
import { Eye, Edit3, Presentation, Share2 } from 'lucide-react';
import { StartupProfile } from '../../types';

interface ProfilePageHeaderProps {
  profile: StartupProfile;
  viewMode: 'edit' | 'investor';
  setViewMode: (mode: 'edit' | 'investor') => void;
  onShare: () => void;
  onGenerateDeck: () => void;
}

export const ProfilePageHeader: React.FC<ProfilePageHeaderProps> = ({ 
  profile, 
  viewMode, 
  setViewMode, 
  onShare, 
  onGenerateDeck 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase border border-slate-200">
              {profile.industry || 'Tech'}
            </span>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded uppercase border border-indigo-100">
              {profile.stage || 'Seed'}
            </span>
          </div>
        </div>
        <p className="text-slate-500">Manage your company profile and investor data.</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-white rounded-lg p-1 border border-slate-200 flex shadow-sm">
          <button 
            onClick={() => setViewMode('edit')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'edit' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Edit3 size={16} /> Edit
          </button>
          <button 
            onClick={() => setViewMode('investor')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'investor' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Eye size={16} /> Investor View
          </button>
        </div>
        <button 
          onClick={onShare}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-all"
        >
          <Share2 size={18} /> Share
        </button>
        <button 
          onClick={onGenerateDeck}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
        >
          <Presentation size={18} /> Generate Deck
        </button>
      </div>
    </div>
  );
};
