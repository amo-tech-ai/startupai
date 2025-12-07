
import React, { useState } from 'react';
import { Linkedin, Mail, Trash2, Plus } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Founder } from '../../types';
import { generateShortId } from '../../lib/utils';

export const TeamSettings: React.FC = () => {
  const { profile, founders, addFounder, removeFounder } = useData();
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  const handleAddMember = () => {
    if (newMemberName.trim() && newMemberRole.trim()) {
      const newFounder: Founder = {
        id: generateShortId(),
        startupId: profile?.id || 'temp',
        name: newMemberName,
        title: newMemberRole,
        bio: '',
        isPrimaryContact: false
      };
      addFounder(newFounder);
      setNewMemberName('');
      setNewMemberRole('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900">Founding Team</h3>
            <span className="text-sm text-slate-500">{founders.length} Members</span>
        </div>

        <div className="space-y-3">
            {founders.map((founder) => (
                <div key={founder.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                            {founder.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                {founder.name}
                                {founder.isPrimaryContact && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">Primary</span>}
                            </div>
                            <div className="text-sm text-slate-500">{founder.title}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {founder.linkedinProfile && (
                            <a href={founder.linkedinProfile} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                <Linkedin size={18} />
                            </a>
                        )}
                        {founder.email && (
                            <a href={`mailto:${founder.email}`} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                                <Mail size={18} />
                            </a>
                        )}
                        <button 
                            onClick={() => removeFounder(founder.id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-6">
            <h4 className="text-sm font-bold text-slate-900 mb-3">Add Team Member</h4>
            <div className="flex gap-3">
                <input 
                    type="text" 
                    placeholder="Full Name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                />
                <input 
                    type="text" 
                    placeholder="Role / Title"
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                />
                <button 
                    onClick={handleAddMember}
                    disabled={!newMemberName || !newMemberRole}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Plus size={16} /> Add
                </button>
            </div>
        </div>
    </div>
  );
};
