
import React from 'react';
import { Plus, UserPlus, FileText } from 'lucide-react';
import { StartupProfile } from '../../types';

interface WelcomeHeaderProps {
  profile: StartupProfile | null;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ profile }) => {
  const startupName = profile?.name || "My Startup";

  return (
    <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
         <div className="flex items-center gap-2 mb-1">
           <h1 className="text-3xl font-bold text-slate-900">Good morning, {startupName} team 👋</h1>
           {profile?.stage && <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded uppercase">{profile.stage}</span>}
         </div>
         <p className="text-slate-500 flex items-center gap-2">
           <span>{profile?.tagline || "Ready to build something great?"}</span>
         </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
         <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
            <Plus size={18} /> New Deck
         </button>
         <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-colors">
            <UserPlus size={18} /> Add Contact
         </button>
         <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-colors">
            <FileText size={18} /> Create Doc
         </button>
      </div>
    </section>
  );
};
