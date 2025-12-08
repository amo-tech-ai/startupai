
import React from 'react';
import { Trophy, Globe, Linkedin, Twitter, Mail, Phone, Settings, Shield } from 'lucide-react';
import { UserProfile } from '../../types';

interface SidebarWidgetsProps {
  user: UserProfile;
}

export const SidebarWidgets: React.FC<SidebarWidgetsProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      
      {/* Profile Completion */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-indigo-700 font-bold">
            <Trophy size={18} />
            <h3>Profile Strength</h3>
          </div>
          <span className="text-lg font-bold text-slate-900">{user.completionScore}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
          <div 
            className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
            style={{ width: `${user.completionScore}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-500">
          Complete your profile to unlock more AI features and investor matching.
        </p>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 mb-4">Social Presence</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#0077b5] flex items-center justify-center text-white">
              <Linkedin size={16} />
            </div>
            {user.socials.linkedin ? (
              <a href={user.socials.linkedin} target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-indigo-600 truncate">
                {user.socials.linkedin.replace('https://linkedin.com/in/', '')}
              </a>
            ) : (
              <span className="text-sm text-slate-400 italic">Not connected</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white">
              <Twitter size={16} />
            </div>
            {user.socials.twitter ? (
              <a href={user.socials.twitter} target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-indigo-600 truncate">
                {user.socials.twitter.replace('https://twitter.com/', '@')}
              </a>
            ) : (
              <span className="text-sm text-slate-400 italic">Not connected</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
              <Globe size={16} />
            </div>
            {user.socials.website ? (
              <a href={user.socials.website} target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-indigo-600 truncate">
                {user.socials.website.replace('https://', '')}
              </a>
            ) : (
              <span className="text-sm text-slate-400 italic">Not connected</span>
            )}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 mb-4">Contact Info</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-slate-400" />
            <a href={`mailto:${user.email}`} className="text-slate-600 hover:text-indigo-600 truncate">{user.email}</a>
          </div>
          {user.phone && (
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-slate-400" />
              <span className="text-slate-600">{user.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Settings Teaser */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
        <button className="w-full flex items-center justify-between text-sm font-medium text-slate-600 hover:text-indigo-600 group">
          <span className="flex items-center gap-2"><Settings size={16}/> AI Preferences</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </button>
        <div className="h-px bg-slate-200 w-full"></div>
        <button className="w-full flex items-center justify-between text-sm font-medium text-slate-600 hover:text-indigo-600 group">
          <span className="flex items-center gap-2"><Shield size={16}/> Security</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </button>
      </div>

    </div>
  );
};
