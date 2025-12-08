
import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Link as LinkIcon, RefreshCw, Edit3, CheckCircle, X } from 'lucide-react';
import { UserProfile } from '../../types';
import { useToast } from '../../context/ToastContext';
import { EnrichmentService } from '../../services/enrichment';

interface ProfileHeaderProps {
  user: UserProfile;
  isEditing: boolean;
  onToggleEdit: () => void;
  onUpdate: (data: Partial<UserProfile>) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isEditing, onToggleEdit, onUpdate }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { success, error, info } = useToast();
  
  // Local state for editing to avoid global re-renders on every keystroke
  const [editData, setEditData] = useState({
    fullName: user.fullName,
    headline: user.headline,
    location: user.location,
    website: user.socials.website || ''
  });

  // Reset local state when user prop changes or edit mode toggles
  useEffect(() => {
    setEditData({
        fullName: user.fullName,
        headline: user.headline,
        location: user.location,
        website: user.socials.website || ''
    });
  }, [user, isEditing]);

  const handleSave = () => {
    onUpdate({
        fullName: editData.fullName,
        headline: editData.headline,
        location: editData.location,
        socials: { ...user.socials, website: editData.website }
    });
    onToggleEdit();
    success("Profile updated successfully");
  };

  const handleSyncLinkedIn = async () => {
    if (!user.socials.linkedin) {
        error("No LinkedIn URL found. Please add it in the sidebar widgets first.");
        return;
    }

    setIsSyncing(true);
    info("Connecting to LinkedIn...");
    
    try {
        const enrichedData = await EnrichmentService.syncLinkedInProfile(user.socials.linkedin);
        
        // Merge enriched data with existing user data structure
        onUpdate({
            ...enrichedData,
            socials: {
                ...user.socials,
                ...enrichedData.socials
            }
        });
        success("Profile successfully synced from LinkedIn!");
    } catch (err: any) {
        console.error(err);
        error(err.message || "Failed to sync with LinkedIn");
    } finally {
        setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative group">
      {/* Cover Image */}
      <div className="h-40 bg-slate-200 relative overflow-hidden">
        {user.coverImageUrl ? (
          <img src={user.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        )}
        <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100">
          <Camera size={18} />
        </button>
      </div>

      <div className="px-8 pb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative -mt-16 shrink-0">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 shadow-md overflow-hidden relative group/avatar cursor-pointer">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-300">
                  {user.fullName.charAt(0)}
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 w-full">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3 max-w-md">
                    <input 
                      type="text" 
                      value={editData.fullName}
                      onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                      className="text-2xl font-bold text-slate-900 w-full border-b border-slate-300 focus:border-indigo-500 outline-none pb-1 bg-transparent"
                      placeholder="Full Name"
                    />
                    <input 
                      type="text" 
                      value={editData.headline}
                      onChange={(e) => setEditData({ ...editData, headline: e.target.value })}
                      className="text-lg text-slate-600 w-full border-b border-slate-300 focus:border-indigo-500 outline-none pb-1 bg-transparent"
                      placeholder="Headline (e.g. Founder at StartupAI)"
                    />
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        className="text-sm text-slate-500 w-1/2 border-b border-slate-300 focus:border-indigo-500 outline-none pb-1 bg-transparent"
                        placeholder="Location"
                      />
                       <input 
                        type="text" 
                        value={editData.website}
                        onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                        className="text-sm text-slate-500 w-1/2 border-b border-slate-300 focus:border-indigo-500 outline-none pb-1 bg-transparent"
                        placeholder="Website URL"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-slate-900">{user.fullName}</h1>
                    <p className="text-lg text-slate-600 mt-1">{user.headline}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{user.location}</span>
                      </div>
                      {user.socials.website && (
                        <div className="flex items-center gap-1">
                          <LinkIcon size={16} />
                          <a href={user.socials.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                            {user.socials.website.replace('https://', '')}
                          </a>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {isEditing ? (
                    <>
                        <button 
                            onClick={onToggleEdit}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <X size={16} /> Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <CheckCircle size={16} /> Save Changes
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                        onClick={handleSyncLinkedIn}
                        disabled={isSyncing}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors disabled:opacity-70"
                        >
                        <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                        <span className="hidden sm:inline">{isSyncing ? "Syncing..." : "Sync LinkedIn"}</span>
                        </button>
                        <button 
                        onClick={onToggleEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                        >
                        <Edit3 size={16} /> <span>Edit Profile</span>
                        </button>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
