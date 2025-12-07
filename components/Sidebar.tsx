
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CheckSquare, 
  Settings, 
  Zap,
  LogOut,
  Files
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PageType } from '../types';

interface SidebarProps {
  currentPage: PageType;
  setPage: (page: PageType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage }) => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    setPage('home');
  };

  const menuItems: { id: PageType; icon: React.ReactNode; label: string }[] = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'pitch-decks', icon: <FileText size={20} />, label: 'Pitch Decks' },
    { id: 'crm', icon: <Users size={20} />, label: 'CRM' },
    { id: 'documents', icon: <Files size={20} />, label: 'Documents' },
    { id: 'tasks', icon: <CheckSquare size={20} />, label: 'Tasks' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl z-20 hidden md:flex">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <div className="bg-primary-600 text-white p-1.5 rounded-lg shadow-lg shadow-primary-900/50">
          <Zap size={20} fill="currentColor" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          startupAI
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              currentPage === item.id
                ? 'bg-primary-600/10 text-primary-400 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
            }`}
          >
            <div className={`${currentPage === item.id ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
              {item.icon}
            </div>
            <span>{item.label}</span>
            
            {/* Active Indicator */}
            {currentPage === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
            )}
          </button>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800/50">
        <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-rose-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
