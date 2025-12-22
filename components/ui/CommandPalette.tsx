import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Presentation, Users, FileText, CheckSquare, Settings, Home, Zap, Command, Globe, Briefcase, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const MotionDiv = motion.div as any;

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { deals, contacts, docs, decks } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const navigationItems = [
    { icon: <Home size={18}/>, title: 'Go to Dashboard', shortcut: 'G D', path: '/dashboard', type: 'nav' },
    { icon: <Presentation size={18}/>, title: 'Pitch Decks', shortcut: 'G P', path: '/pitch-decks', type: 'nav' },
    { icon: <Users size={18}/>, title: 'CRM & Pipeline', shortcut: 'G C', path: '/crm', type: 'nav' },
    { icon: <FileText size={18}/>, title: 'Documents Hub', shortcut: 'G F', path: '/documents', type: 'nav' },
    { icon: <CheckSquare size={18}/>, title: 'Tasks & Ops', shortcut: 'G T', path: '/tasks', type: 'nav' },
    { icon: <Briefcase size={18}/>, title: 'Startup Profile', shortcut: 'G S', path: '/startup-profile', type: 'nav' },
    { icon: <Zap size={18}/>, title: 'New Event', shortcut: 'N E', path: '/events/new', type: 'nav' },
    { icon: <Settings size={18}/>, title: 'Settings', shortcut: 'G S', path: '/settings', type: 'nav' },
  ];

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase();
    
    // 1. Filter Navigation Shortcuts
    const navs = navigationItems.filter(i => i.title.toLowerCase().includes(q));

    if (!q) return navs;

    // 2. Search Application Data Context
    const dataResults = [
        ...deals.filter(d => d.company.toLowerCase().includes(q)).map(d => ({ 
            icon: <Briefcase size={18} className="text-indigo-500" />, 
            title: `Deal: ${d.company}`, 
            shortcut: d.stage, 
            path: '/crm', 
            type: 'data' 
        })),
        ...contacts.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)).map(c => ({ 
            icon: <Users size={18} className="text-purple-500" />, 
            title: `Contact: ${c.firstName} ${c.lastName}`, 
            shortcut: c.type, 
            path: '/crm', 
            type: 'data' 
        })),
        ...docs.filter(d => d.title.toLowerCase().includes(q)).map(d => ({ 
            icon: <FileText size={18} className="text-rose-500" />, 
            title: `Doc: ${d.title}`, 
            shortcut: 'DOC', 
            path: `/documents/${d.id}`, 
            type: 'data' 
        })),
        ...decks.filter(d => d.title.toLowerCase().includes(q)).map(d => ({ 
            icon: <Presentation size={18} className="text-emerald-500" />, 
            title: `Deck: ${d.title}`, 
            shortcut: 'DECK', 
            path: `/pitch-decks/${d.id}`, 
            type: 'data' 
        })),
    ];

    return [...navs, ...dataResults].slice(0, 10);
  }, [query, deals, contacts, docs, decks]);

  const handleAction = (path: string) => {
    navigate(path);
    onClose();
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
        if (isOpen && e.key === 'Enter' && filteredItems.length > 0) {
            handleAction(filteredItems[0].path);
        }
    }
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [isOpen, filteredItems]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="flex items-center px-4 py-4 border-b border-slate-100">
                <Search className="text-slate-400 mr-3" size={20} />
                <input 
                    autoFocus
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search commands, deals, or documents..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 text-lg outline-none"
                />
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg text-slate-400 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase">Esc</span>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto p-2 custom-scrollbar">
                {filteredItems.length > 0 ? (
                    <div className="space-y-1">
                        {filteredItems.map((item, idx) => (
                            <button 
                                key={idx}
                                onClick={() => handleAction(item.path)}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                        {item.icon}
                                    </div>
                                    <span className="font-bold text-slate-700 group-hover:text-slate-900">{item.title}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {item.shortcut.split(' ').map((s, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase">{s}</span>
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
                        <Command size={32} className="opacity-20" />
                        <p className="font-medium">No results found for "{query}"</p>
                    </div>
                )}
            </div>

            <div className="bg-slate-50 px-6 py-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><ArrowRight size={10}/> Navigate</span>
                    <span className="flex items-center gap-1"><CheckCircle size={10}/> Select</span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                   Cmd + K
                </div>
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};