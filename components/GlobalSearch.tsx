
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Users, Briefcase, Presentation, ArrowRight, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';

interface GlobalSearchProps {
  query: string;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ query, onClose }) => {
  const { deals, contacts, docs, decks, events } = useData();
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const hits = [
      ...deals.filter(d => d.company.toLowerCase().includes(q)).map(d => ({ type: 'deal', id: d.id, title: d.company, sub: d.stage, icon: <Briefcase size={16}/>, link: '/crm' })),
      ...contacts.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)).map(c => ({ type: 'contact', id: c.id, title: `${c.firstName} ${c.lastName}`, sub: c.role, icon: <Users size={16}/>, link: '/crm' })),
      ...docs.filter(d => d.title.toLowerCase().includes(q)).map(d => ({ type: 'doc', id: d.id, title: d.title, sub: d.type, icon: <FileText size={16}/>, link: `/documents/${d.id}` })),
      ...decks.filter(d => d.title.toLowerCase().includes(q)).map(d => ({ type: 'deck', id: d.id, title: d.title, sub: d.template, icon: <Presentation size={16}/>, link: `/pitch-decks/${d.id}` })),
      ...(events || []).filter(e => e.name.toLowerCase().includes(q)).map(e => ({ type: 'event', id: e.id, title: e.name, sub: e.type, icon: <Calendar size={16}/>, link: `/events/${e.id}` })),
    ];

    setResults(hits.slice(0, 5)); // Limit to 5
  }, [query, deals, contacts, docs, decks, events]);

  if (!query) return null;

  return (
    <div className="absolute top-14 left-0 w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
      {results.length > 0 ? (
        <div className="py-2">
          {results.map((item) => (
            <div 
              key={`${item.type}-${item.id}`}
              onClick={() => {
                navigate(item.link);
                onClose();
              }}
              className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                  <div className="text-xs text-slate-500 capitalize">{item.sub}</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-slate-500 text-sm">
          No results found for "{query}"
        </div>
      )}
      <div className="bg-slate-50 px-4 py-2 text-[10px] text-slate-400 font-medium border-t border-slate-100">
        Press Enter to see all results
      </div>
    </div>
  );
};
