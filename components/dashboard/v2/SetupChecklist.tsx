
import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { StartupProfile } from '../../../types';
import { useNavigate } from 'react-router-dom';

interface SetupChecklistProps {
  profile: StartupProfile | null;
}

export const SetupChecklist: React.FC<SetupChecklistProps> = ({ profile }) => {
  const navigate = useNavigate();
  
  const items = [
    { label: 'Add Website URL', done: !!profile?.websiteUrl, link: '/startup-profile' },
    { label: 'Add Cover Image', done: !!profile?.coverImageUrl, link: '/startup-profile' },
    { label: 'Add Competitors', done: (profile?.competitors?.length || 0) > 0, link: '/startup-profile' },
    { label: 'Set Funding Goal', done: (profile?.fundingGoal || 0) > 0, link: '/startup-profile' },
    { label: 'Generate Pitch Deck', done: false, link: '/pitch-decks' }, 
  ];

  const completed = items.filter(i => i.done).length;
  const progress = Math.round((completed / items.length) * 100);

  if (progress === 100) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-serif font-bold text-[#1A1A1A]">Setup Checklist</h3>
        <span className="text-xs font-bold text-[#1A1A1A] bg-[#F7F7F5] px-2 py-1 rounded border border-[#E5E5E5]">{progress}%</span>
      </div>

      <div className="w-full bg-[#F7F7F5] h-1.5 rounded-full mb-6 overflow-hidden">
        <div className="bg-[#1A1A1A] h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
            <div 
                key={idx} 
                onClick={() => !item.done && navigate(item.link)}
                className={`flex items-center gap-3 text-sm p-2 rounded-lg transition-colors ${item.done ? 'text-[#6B7280]' : 'text-[#1A1A1A] hover:bg-[#F7F7F5] cursor-pointer'}`}
            >
                {item.done ? <CheckCircle2 size={18} className="text-[#166534]" /> : <Circle size={18} className="text-[#E5E5E5]" />}
                <span className={item.done ? 'line-through decoration-[#E5E5E5]' : ''}>{item.label}</span>
            </div>
        ))}
      </div>
    </div>
  );
};
