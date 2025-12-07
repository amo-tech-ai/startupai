
import React from 'react';
import { Search, Plus, Presentation, FileText, Rocket, BarChart4, Map, Trash2, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { InvestorDoc } from '../../types';

// Workaround for strict type checking
const MotionDiv = motion.div as any;

interface DocumentDashboardProps {
  docs: InvestorDoc[];
  onStartDoc: (type: string) => void;
  onOpenDoc: (id: string) => void;
  onDeleteDoc: (id: string) => void;
}

export const DocumentDashboard: React.FC<DocumentDashboardProps> = ({ docs, onStartDoc, onOpenDoc, onDeleteDoc }) => {
  const docTemplates = [
    { title: "Pitch Deck", desc: "Secure funding with a compelling story.", icon: <Presentation size={24} className="text-indigo-600"/>, color: "bg-indigo-50" },
    { title: "One-Pager", desc: "Summarize your business in one page.", icon: <FileText size={24} className="text-pink-600"/>, color: "bg-pink-50" },
    { title: "GTM Strategy", desc: "Plan your launch and growth.", icon: <Rocket size={24} className="text-purple-600"/>, color: "bg-purple-50" },
    { title: "Market Research", desc: "Analyze competitors and opportunities.", icon: <Search size={24} className="text-teal-600"/>, color: "bg-teal-50" },
    { title: "Financial Model", desc: "Project revenue, burn rate, and profit.", icon: <BarChart4 size={24} className="text-emerald-600"/>, color: "bg-emerald-50" },
    { title: "Product Roadmap", desc: "Visualize your product’s future.", icon: <Map size={24} className="text-orange-600"/>, color: "bg-orange-50" },
  ];

  return (
    <MotionDiv 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Startup Document Workspace</h1>
          <p className="text-slate-500 mt-2 text-lg">Generate, manage, and edit your startup assets with AI assistance.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm">
              <Search size={18} /> Search
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
              <Plus size={18} /> New Project
           </button>
        </div>
      </div>

      {/* SECTION: START NEW DOCUMENT */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={20} className="text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">Start a New Document</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docTemplates.map((template, idx) => (
            <div 
              key={idx}
              onClick={() => onStartDoc(template.title)}
              className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${template.color} transition-transform group-hover:scale-110 duration-300`}>
                  {template.icon}
                </div>
                <div className="bg-slate-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Plus size={16} className="text-slate-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{template.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{template.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: RECENT DOCUMENTS */}
      <section>
         <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Documents</h2>
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[200px]">
            {docs.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-slate-400 text-sm italic">
                    No documents created yet. Start one above.
                </div>
            ) : (
                docs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4" onClick={() => onOpenDoc(doc.id)}>
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                            {doc.type === 'Pitch Deck' ? <Presentation size={20}/> : <FileText size={20}/>}
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{doc.title}</div>
                            <div className="text-xs text-slate-500">{doc.type} • Edited {new Date(doc.updatedAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className={`px-2 py-1 rounded text-xs font-bold ${
                            doc.status === 'Draft' ? 'bg-slate-100 text-slate-600' :
                            doc.status === 'Review' ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                        }`}>
                            {doc.status}
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteDoc(doc.id); }}
                            className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                        <ChevronRight size={18} className="text-slate-400" />
                    </div>
                </div>
                ))
            )}
         </div>
      </section>
      
      <div className="h-12"></div>
    </MotionDiv>
  );
};
