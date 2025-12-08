
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface SkillsSectionProps {
  skills: string[];
  onUpdate: (skills: string[]) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const handleAdd = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onUpdate([...skills, newSkill.trim()]);
      setNewSkill('');
      setIsAdding(false);
    }
  };

  const handleRemove = (skill: string) => {
    onUpdate(skills.filter(s => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Skills & Endorsements</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 flex gap-2">
          <input 
            type="text" 
            placeholder="e.g. Product Strategy" 
            className="flex-1 p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button 
            onClick={handleAdd}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {skills.map(skill => (
          <div key={skill} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium text-slate-700 flex items-center gap-2 group cursor-default hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
            {skill}
            <button 
              onClick={() => handleRemove(skill)}
              className="text-slate-400 hover:text-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {skills.length === 0 && (
          <div className="text-slate-400 text-sm italic">Add skills to highlight your expertise.</div>
        )}
      </div>
    </div>
  );
};
