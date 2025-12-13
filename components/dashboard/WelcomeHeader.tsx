
import React from 'react';
import { Plus, UserPlus, FileText } from 'lucide-react';
import { StartupProfile } from '../../types';
import { useNavigate } from 'react-router-dom';

interface WelcomeHeaderProps {
  profile: StartupProfile | null;
  onNewDeck?: () => void;
  onAddContact?: () => void;
  onCreateDoc?: () => void;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ 
  profile,
  onNewDeck,
  onAddContact,
  onCreateDoc 
}) => {
  const navigate = useNavigate();
  const startupName = profile?.name || "My Startup";

  const handleNewDeck = () => {
      // Navigate with state to trigger modal open
      navigate('/pitch-decks', { state: { openNew: true } });
  };

  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[#E5E5E5]">
      <div>
         <p className="text-sm font-bold tracking-widest text-[#6B7280] uppercase mb-1">Founder Dashboard</p>
         <div className="flex items-baseline gap-3">
           <h1 className="text-4xl font-serif font-bold text-[#1A1A1A]">Good morning, {startupName}</h1>
           {profile?.stage && <span className="px-3 py-1 bg-gray-100 text-[#1A1A1A] text-xs font-bold rounded-full uppercase tracking-wide border border-[#E5E5E5]">{profile.stage}</span>}
         </div>
         <p className="text-[#6B7280] mt-2 font-light">
           {profile?.tagline || "Ready to build something great today?"}
         </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
         <button 
            onClick={handleNewDeck}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-lg font-medium shadow-sm hover:bg-black transition-all hover:-translate-y-0.5"
         >
            <Plus size={18} /> New Deck
         </button>
         <button 
            onClick={onAddContact}
            className="flex items-center gap-2 px-6 py-3 bg-white text-[#1A1A1A] border border-[#E5E5E5] rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
         >
            <UserPlus size={18} /> Add Contact
         </button>
         <button 
            onClick={onCreateDoc}
            className="flex items-center gap-2 px-6 py-3 bg-white text-[#1A1A1A] border border-[#E5E5E5] rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
         >
            <FileText size={18} /> Create Doc
         </button>
      </div>
    </section>
  );
};
