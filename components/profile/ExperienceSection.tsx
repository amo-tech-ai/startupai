
import React, { useState } from 'react';
import { Plus, Briefcase, Calendar, Building2, Trash2, Edit2 } from 'lucide-react';
import { UserProfileExperience } from '../../types';
import { generateUUID } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';

interface ExperienceSectionProps {
  experiences: UserProfileExperience[];
  onUpdate: (experiences: UserProfileExperience[]) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null); // 'new' or UUID
  const [formData, setFormData] = useState<Partial<UserProfileExperience>>({});
  const { success } = useToast();

  const handleAddNew = () => {
      setEditingId('new');
      setFormData({});
  }

  const handleEdit = (exp: UserProfileExperience) => {
      setEditingId(exp.id);
      setFormData(exp);
  }

  const handleDelete = (id: string) => {
    if(confirm("Delete this experience?")) {
      onUpdate(experiences.filter(e => e.id !== id));
      success("Experience removed");
    }
  };

  const handleSave = () => {
    if (formData.company && formData.role) {
      if (editingId === 'new') {
          // Create
          const entry: UserProfileExperience = {
            id: generateUUID(),
            company: formData.company,
            role: formData.role,
            startDate: formData.startDate || '',
            endDate: formData.current ? 'Present' : (formData.endDate || ''),
            current: formData.current || false,
            description: formData.description || '',
          };
          onUpdate([entry, ...experiences]);
          success("Experience added");
      } else {
          // Update
          const updated = experiences.map(e => e.id === editingId ? { ...e, ...formData } as UserProfileExperience : e);
          onUpdate(updated);
          success("Experience updated");
      }
      setEditingId(null);
      setFormData({});
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Experience</h2>
        <button 
          onClick={handleAddNew}
          disabled={!!editingId}
          className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <Plus size={16} /> Add Position
        </button>
      </div>

      {editingId && (
        <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2">
          <h3 className="text-sm font-bold text-slate-500 uppercase">{editingId === 'new' ? 'New Position' : 'Edit Position'}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Job Title"
              className="p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.role || ''}
              onChange={e => setFormData({...formData, role: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Company"
              className="p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.company || ''}
              onChange={e => setFormData({...formData, company: e.target.value})}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Start Date (e.g. Jan 2023)"
              className="p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.startDate || ''}
              onChange={e => setFormData({...formData, startDate: e.target.value})}
            />
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="End Date"
                disabled={formData.current}
                className="p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 flex-1 disabled:bg-slate-100 disabled:text-slate-400"
                value={formData.endDate || ''}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
              />
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={formData.current || false}
                  onChange={e => setFormData({...formData, current: e.target.checked})}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                Current
              </label>
            </div>
          </div>
          <textarea 
            placeholder="Description..."
            className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
            value={formData.description || ''}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Save</button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {experiences.length === 0 && !editingId && (
            <div className="text-center py-4 text-slate-400 text-sm italic">No experience added yet.</div>
        )}
        {experiences.map((exp) => (
          <div key={exp.id} className="flex gap-4 group relative">
            <div className="mt-1 w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 border border-indigo-100 shrink-0">
              <Briefcase size={20} />
            </div>
            
            <div className="flex-1 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900">{exp.role}</h3>
                  <div className="flex items-center gap-1 text-slate-600 text-sm mt-0.5">
                    <Building2 size={14} />
                    <span>{exp.company}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => handleEdit(exp)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button 
                        onClick={() => handleDelete(exp.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
              </div>
              
              <div className="text-xs text-slate-500 mt-2 mb-3 flex items-center gap-1.5">
                <Calendar size={12} />
                <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              
              <p className="text-sm text-slate-600 leading-relaxed">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
