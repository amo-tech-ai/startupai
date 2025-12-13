
import React from 'react';
import { Globe, Lock, Copy, Share2 } from 'lucide-react';
import { StartupProfile } from '../../types';
import { SummaryCard } from './SummaryCard';
import { useToast } from '../../context/ToastContext';

interface ProfilePageSidebarProps {
  profile: StartupProfile;
  viewMode: 'edit' | 'investor';
  isSaving: boolean;
  onToggleVisibility: () => void;
}

export const ProfilePageSidebar: React.FC<ProfilePageSidebarProps> = ({ 
  profile, 
  viewMode, 
  isSaving, 
  onToggleVisibility 
}) => {
  const { success } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#/s/${profile.id}`);
    success("Link copied!");
  };

  const handleViewPublic = () => {
    window.open(`/#/s/${profile.id}`, '_blank');
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-24 print:hidden">
      <SummaryCard profile={profile} viewMode={viewMode} />
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="font-bold text-slate-900 mb-3">Profile Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Last Synced</span>
            <span className="font-medium flex items-center gap-2">
              {new Date().toLocaleDateString()}
              {isSaving ? <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" /> : <div className="w-2 h-2 bg-green-500 rounded-full" />}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              {profile.isPublic ? (
                <Globe size={16} className="text-green-500" />
              ) : (
                <Lock size={16} className="text-slate-400" />
              )}
              <span>Public Access</span>
            </div>
            <button 
              onClick={onToggleVisibility}
              className={`relative w-10 h-6 rounded-full transition-colors ${profile.isPublic ? 'bg-green-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${profile.isPublic ? 'translate-x-4' : ''}`} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
            <button 
              onClick={handleCopyLink}
              disabled={!profile.isPublic}
              className="py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy size={14} /> Copy Link
            </button>
            <button 
              onClick={handleViewPublic}
              disabled={!profile.isPublic}
              className="py-2 border border-slate-200 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 size={14} /> View Public
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
