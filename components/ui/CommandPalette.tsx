import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Presentation, Users, FileText, CheckSquare, Settings, Home, Zap, Command, Globe, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const MotionDiv = motion.div as any;

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const items = [
    { icon: <Home size={18}/>, title: 'Go to Dashboard', shortcut: 'G D', path: '/dashboard' },
    { icon: <Presentation size={18}/>, title: 'Pitch Decks', shortcut: 'G P', path: '/pitch-decks' },
    { icon: <Users size={18}/>, title: 'CRM & Pipeline', shortcut: 'G C', path: '/crm' },
    { icon: <FileText size={18}/>, title: 'Documents Hub', shortcut: 'G F', path: '/documents' },
    { icon: <CheckSquare size={18}/>, title: 'Tasks & Ops', shortcut: 'G T', path: '/tasks' },
    { icon: <Briefcase size={18}/>, title: 'Startup Profile', shortcut: 'G S', path: '/startup-profile' },
    { icon: <Globe size={18}/>, title: 'Public Page', shortcut: 'G W', path: '/s/demo' },
    { icon: <Zap size={18}/>, title: 'New Event', shortcut: 'N E', path: '/events/new' },
    { icon: <Settings size={18}/>, title: 'Settings', shortcut: 'G S', path: '/settings' },
  ];

  const filtered = items.filter(i => i.title.toLowerCase().includes(query.toLowerCase()));

  const handleAction = (path: string) => {
    navigate(path);
    onClose();
  };

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
                    placeholder="Search commands or modules..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 text-lg outline-none"
                />
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg text-slate-400 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase">Esc</span>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
                {filtered.length > 0 ? (
                    <div className="space-y-1">
                        {filtered.map((item, idx) => (
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
                        <p className="font-medium">No commands found matching "{query}"</p>
                    </div>
                )}
            </div>

            <div className="bg-slate-50 px-6 py-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><ArrowRight size={10}/> Navigate</span>
                    <span className="flex items-center gap-1"><CheckCircle size={10}/> Select</span>
                </div>
                <div className="flex items-center gap-1">
                   <Command size={10} /> + K to close
                </div>
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

const ArrowRight = ({ size }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const CheckCircle = ({ size }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);