
import React from 'react';
import { UserPlus, Search, Database, FileText } from 'lucide-react';

export const AIJourney: React.FC = () => {
  return (
    <section className="space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">AI Processing Engine</h3>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">LIVE</span>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {[
                { title: "User Inputs Info", icon: <UserPlus size={18}/>, status: "Completed" },
                { title: "URL Context Analysis", icon: <Search size={18}/>, status: "Completed" },
                { title: "Search Grounding", icon: <Database size={18}/>, status: "Active", active: true },
                { title: "RAG / File Context", icon: <FileText size={18}/>, status: "Pending" },
             ].map((card, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${card.active ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-200'} flex flex-col gap-3 relative overflow-hidden`}>
                   {card.active && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-200/50 to-transparent rounded-bl-full -mr-8 -mt-8"></div>}
                   <div className={`p-2 rounded-lg w-fit ${card.active ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                      {card.icon}
                   </div>
                   <div>
                      <div className={`text-sm font-bold ${card.active ? 'text-indigo-900' : 'text-slate-700'}`}>{card.title}</div>
                      <div className={`text-xs mt-1 ${card.active ? 'text-indigo-600 font-medium' : 'text-slate-400'}`}>{card.status}</div>
                   </div>
                   {idx < 3 && <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-slate-300 z-10"></div>}
                </div>
             ))}
         </div>
      </section>
  );
};
