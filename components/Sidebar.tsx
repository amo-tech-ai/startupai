
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CheckSquare, 
  Settings, 
  Zap,
  LogOut,
  Files,
  UserCircle,
  LogIn,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { signOut } = useAuth();
  const { profile } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem('guest_profile'); // Clear guest data on explicit logout
    navigate('/');
  };

  const isGuest = profile?.userId === 'guest' || profile?.userId === 'mock';

  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/startup-profile', icon: <Building size={20} />, label: 'Startup Profile' },
    { path: '/pitch-decks', icon: <FileText size={20} />, label: 'Pitch Decks' },
    { path: '/crm', icon: <Users size={20} />, label: 'CRM' },
    { path: '/documents', icon: <Files size={20} />, label: 'Documents' },
    { path: '/tasks', icon: <CheckSquare size={20} />, label: 'Tasks' },
    { path: '/profile', icon: <UserCircle size={20} />, label: 'My Account' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
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

      {/* Guest Banner */}
      {isGuest && (
        <div className="mx-3 mt-4 p-3 bg-indigo-900/50 border border-indigo-500/30 rounded-xl text-center">
            <p className="text-xs text-indigo-200 mb-2 font-medium">You are in Guest Mode</p>
            <button 
                onClick={() => navigate('/signup')}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
            >
                Create Account
            </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-600/10 text-primary-400 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <div className={`${isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {item.icon}
              </div>
              <span>{item.label}</span>
              
              {/* Active Indicator */}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800/50">
        {isGuest ? (
            <button 
                onClick={() => navigate('/login')}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors"
            >
                <LogIn size={20} />
                <span className="font-medium">Log In</span>
            </button>
        ) : (
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-rose-400 transition-colors"
            >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
            </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
