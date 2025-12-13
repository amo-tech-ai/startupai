
import React from 'react';
import { StartupProfile } from '../../types';

interface ProfilePrintHeaderProps {
  profile: StartupProfile;
}

export const ProfilePrintHeader: React.FC<ProfilePrintHeaderProps> = ({ profile }) => {
  return (
    <div className="hidden print:block mb-8 border-b border-slate-200 pb-4">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">{profile.name}</h1>
      <p className="text-xl text-slate-600">{profile.tagline}</p>
      <div className="flex gap-4 mt-4 text-sm text-slate-500">
        <span>{profile.industry}</span>
        <span>•</span>
        <span>{profile.stage}</span>
      </div>
    </div>
  );
};
