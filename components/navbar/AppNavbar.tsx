
import React, { useState } from 'react';
import { Menu, X, Zap, Bell, Sparkles, Settings as SettingsIcon, LogOut, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { AIChatDrawer } from '../AIChatDrawer';
import { NavSearch } from './NavSearch';
import { NotificationsMenu } from './NotificationsMenu';

// Workaround for strict type checking issues with framer-motion
const MotionDiv = motion.div as any;

export const AppNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const { user, signOut } = useAuth();
  const { profile } = useData(); // Get startup profile for logo
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const userAvatar = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || 'User')}&background=random`;

  return (
    <>
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between shadow-sm">
        {/* Left: Search Bar (Desktop) */}
        <div className="hidden md:flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 mr-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
                {profile?.logoUrl ? (
                    // Startup Branding
                    <img src={profile.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                    // Default Branding
                    <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                        <Zap size={16} fill="currentColor" />
                    </div>
                )}
                <span className="font-bold text-slate-900 hidden lg:block">
                    {profile?.name || 'startupAI'}
                </span>
            </div>
            <NavSearch />
        </div>

        {/* Mobile Toggle (App Mode) */}
        <div className="md:hidden flex items-center gap-2">
            <div className="bg-primary-600 text-white p-1 rounded-md">
                  <Zap size={16} fill="currentColor" />
            </div>
            <span className="font-bold text-slate-900">startupAI</span>
        </div>

        {/* Right: Utilities */}
        <div className="flex items-center gap-4">
            {/* AI Assistant Button */}
            <button 
                onClick={() => setIsChatOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
            >
                <Sparkles size={16} />
                <span>Ask AI</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <div className="relative">
                <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse"></span>
                    )}
                </button>
                <NotificationsMenu isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
            </div>
            
            <button 
              onClick={() => handleNav('/settings')}
              className="flex items-center gap-2 pl-2 border-l border-slate-100 sm:border-none"
            >
                <img 
                    src={userAvatar} 
                    alt="User" 
                    className="w-8 h-8 rounded-full border border-slate-200 ring-2 ring-transparent hover:ring-primary-100 transition-all object-cover"
                />
            </button>

            <button 
                className="md:hidden text-slate-500"
                onClick={() => setIsMobileMenuOpen(true)}
            >
                <Menu size={24} />
            </button>
        </div>
      </div>

      {/* Chat Drawer */}
      <AIChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Mobile Menu for App Mode */}
      <AnimatePresence>
          {isMobileMenuOpen && (
            <MotionDiv
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[60] bg-white p-6 md:hidden flex flex-col"
            >
                <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">startupAI</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-slate-100 rounded-full"
                >
                  <X size={24} className="text-slate-600" />
                </button>
              </div>
              
              <div className="mb-6">
                  <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                          type="text" 
                          placeholder="Search..." 
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      />
                  </div>
              </div>
              
              <div className="space-y-2">
                  <button onClick={() => handleNav('/dashboard')} className="w-full text-left py-3 px-4 rounded-xl bg-slate-50 font-medium">Dashboard</button>
                  <button onClick={() => handleNav('/pitch-decks')} className="w-full text-left py-3 px-4 text-slate-600 font-medium hover:bg-slate-50 rounded-xl">Pitch Decks</button>
                  <button onClick={() => handleNav('/documents')} className="w-full text-left py-3 px-4 text-slate-600 font-medium hover:bg-slate-50 rounded-xl">Documents</button>
                  <button onClick={() => handleNav('/crm')} className="w-full text-left py-3 px-4 text-slate-600 font-medium hover:bg-slate-50 rounded-xl">CRM</button>
                  <button onClick={() => handleNav('/tasks')} className="w-full text-left py-3 px-4 text-slate-600 font-medium hover:bg-slate-50 rounded-xl">Tasks</button>
                  <button onClick={() => handleNav('/events')} className="w-full text-left py-3 px-4 text-slate-600 font-medium hover:bg-slate-50 rounded-xl">Events</button>
                  <button onClick={() => handleNav('/settings')} className="w-full text-left py-3 px-4 text-slate-600 font-medium hover:bg-slate-50 rounded-xl flex items-center gap-2">
                      <SettingsIcon size={18} /> Settings
                  </button>
              </div>

              <div className="mt-auto border-t border-slate-100 pt-4">
                  <button 
                      onClick={() => { setIsChatOpen(true); setIsMobileMenuOpen(false); }}
                      className="w-full py-3 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                      <Sparkles size={18} /> Ask AI Assistant
                  </button>
                  <div className="flex items-center gap-3 mb-4 px-2">
                      <img src={userAvatar} alt="User" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                      <div>
                          <div className="font-bold text-slate-900 text-sm">{user?.user_metadata?.full_name || 'User'}</div>
                          <div className="text-xs text-slate-500">{user?.email}</div>
                      </div>
                  </div>
                  <button 
                      onClick={handleLogout} 
                      className="w-full py-3 text-rose-500 font-medium text-center bg-rose-50 rounded-xl flex items-center justify-center gap-2"
                  >
                      <LogOut size={18} /> Sign Out
                  </button>
              </div>
            </MotionDiv>
          )}
      </AnimatePresence>
    </>
  );
};
