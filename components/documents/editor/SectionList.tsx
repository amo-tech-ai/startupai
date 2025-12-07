
import React from 'react';
import { Plus } from 'lucide-react';
import { DocSection } from '../../../types';

interface SectionListProps {
  sections: DocSection[];
  activeSectionId: string;
  onSelect: (id: string) => void;
  onAddSection: () => void;
}

export const SectionList: React.FC<SectionListProps> = ({ sections, activeSectionId, onSelect, onAddSection }) => {
  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex shrink-0">
       <div className="p-4 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Sections</h3>
          <button 
              onClick={onAddSection}
              className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
          >
             <Plus size={14} /> Add Section
          </button>
       </div>
       <div className="flex-1 overflow-y-auto p-2 space-y-1">
           {sections.map((section, idx) => (
              <div 
                  key={section.id} 
                  onClick={() => onSelect(section.id)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer flex items-center justify-between group transition-colors ${
                      activeSectionId === section.id 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                 <span className="truncate">{idx + 1}. {section.title}</span>
                 {activeSectionId === section.id && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>}
              </div>
           ))}
       </div>
    </div>
  );
};
