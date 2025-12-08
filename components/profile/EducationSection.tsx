
import React, { useState } from 'react';
import { Plus, GraduationCap, Calendar, Trash2, Edit2 } from 'lucide-react';
import { UserProfileEducation } from '../../types';

interface EducationSectionProps {
  education: UserProfileEducation[];
  onUpdate: (education: UserProfileEducation[]) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education, onUpdate }) => {
  const [isEditing, setIsEditing] = useState<string | null>(null); // 'new' or ID
  const [formData, setFormData] = useState<Partial<UserProfileEducation>>({});

  const handleEdit = (edu: UserProfileEducation) => {
    setFormData(edu);
    setIsEditing(edu.id);
  };

  const handleDelete = (id: string) => {
    if(confirm("Remove this education entry?")) {
      onUpdate(education.filter(e => e.id !== id));
    }
  };

  const handleSave = () => {
    if (formData.school && formData.degree) {
      if (isEditing === 'new') {
        const newEntry: UserProfileEducation = {
          id: Date.now().toString(),
          school: formData.school,
          degree: formData.degree,
          year: formData.year || '',
          logoUrl: ''
        };
        onUpdate([newEntry, ...education]);
      } else {
        const updated = education.map(e => e.id === isEditing ? { ...e, ...formData } as UserProfileEducation : e);
        onUpdate(updated);
      }
      setIsEditing(null);
      setFormData({});
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Education</h2>
        <button 
          onClick={() => { setIsEditing('new'); setFormData({}); }}
          className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add School
        </button>
      </div>

      {isEditing && (
        <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">School / University</label>
                <input 
                type="text" 
                placeholder="e.g. Stanford University"
                className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.school || ''}
                onChange={e => setFormData({...formData, school: e.target.value})}
                autoFocus
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Degree</label>
                <input 
                type="text" 
                placeholder="e.g. BS Computer Science"
                className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.degree || ''}
                onChange={e => setFormData({...formData, degree: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Years Attended</label>
                <input 
                type="text" 
                placeholder="e.g. 2015 - 2019"
                className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.year || ''}
                onChange={e => setFormData({...formData, year: e.target.value})}
                />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsEditing(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Save</button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {education.length === 0 && !isEditing && (
            <div className="text-center py-4 text-slate-400 text-sm italic">No education history added.</div>
        )}
        {education.map((edu) => (
          <div key={edu.id} className="flex gap-4 group relative">
            <div className="mt-1 w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 border border-indigo-100 shrink-0">
              <GraduationCap size={20} />
            </div>
            
            <div className="flex-1 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900">{edu.school}</h3>
                  <div className="text-sm text-slate-600 mt-0.5">{edu.degree}</div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => handleEdit(edu)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button 
                        onClick={() => handleDelete(edu.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
              </div>
              
              <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                <Calendar size={12} />
                <span>{edu.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
