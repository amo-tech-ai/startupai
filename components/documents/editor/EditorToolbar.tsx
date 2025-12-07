
import React from 'react';
import { ArrowLeft, Loader2, AlignLeft, Type, Image as ImageIcon, Download } from 'lucide-react';
import { InvestorDoc } from '../../../types';

interface EditorToolbarProps {
  title: string;
  status: string;
  type: string;
  saveStatus: 'saved' | 'saving';
  onTitleChange: (newTitle: string) => void;
  onBack: () => void;
  onExport: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  title, status, type, saveStatus, onTitleChange, onBack, onExport 
}) => {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
       <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
             <ArrowLeft size={20} />
          </button>
          <div>
             <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => onTitleChange(e.target.value)}
                  className="text-sm font-bold text-slate-900 bg-transparent border-none focus:ring-0 p-0 hover:text-indigo-600 transition-colors w-64"
                />
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] uppercase font-bold rounded">{status}</span>
             </div>
             <div className="flex items-center gap-2">
                 <p className="text-xs text-slate-500">{type}</p>
                 {saveStatus === 'saving' && <span className="text-[10px] text-slate-400 flex items-center gap-1"><Loader2 size={8} className="animate-spin"/> Saving...</span>}
             </div>
          </div>
       </div>
       <div className="flex items-center gap-3">
           <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button className="p-1.5 bg-white shadow-sm rounded text-slate-700"><AlignLeft size={16}/></button>
              <button className="p-1.5 text-slate-500 hover:text-slate-700"><Type size={16}/></button>
              <button className="p-1.5 text-slate-500 hover:text-slate-700"><ImageIcon size={16}/></button>
           </div>
           <div className="h-6 w-px bg-slate-200"></div>
           <button onClick={onExport} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors">
              <Download size={16} /> Export
           </button>
       </div>
    </div>
  );
};
