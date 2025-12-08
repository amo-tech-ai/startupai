
import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, Bell, Search, Sparkles, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

interface NavbarProps {
  type?: 'public' | 'app';
}

// Workaround for strict type checking issues with framer-motion
const MotionDiv = motion.div as any;

const Navbar: React.FC<NavbarProps> = ({ type = 'public' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        if (searchQuery.trim()) {
            toast(`Searching for: "${searchQuery}"`, 'info');
            setSearchQuery(''); 
        }
    }
  };

  const userAvatar = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || 'User')}&background=random`;
  
  // Helper to check active link
  const isActive = (path: string) => location.pathname === path;

  // APP MODE: Render as a sticky top bar with utilities
  if (type === 'app') {
    return (
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between shadow-sm">
        {/* Left: Search Bar (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search docs, deals, or ask AI..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
            </div>
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
            <button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5">
                <Sparkles size={16} />
                <span>Ask AI</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
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
                    <button onClick={() => handleNav('/settings')} className="w-full text-left py-3 px-4 text-slate-600 font-medium hover:bg-slate-50 rounded-xl flex items-center gap-2">
                        <SettingsIcon size={18} /> Settings
                    </button>
                </div>

                <div className="mt-auto border-t border-slate-100 pt-4">
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

      </div>
    );
  }

  // PUBLIC MODE
  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              startupAI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
                <Link 
                to="/"
                className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
                >
                Product
                </Link>
                <Link 
                to="/how-it-works"
                className={`text-sm font-medium transition-colors ${isActive('/how-it-works') ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
                >
                How it Works
                </Link>
                <Link 
                to="/features"
                className={`text-sm font-medium transition-colors ${isActive('/features') ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
                >
                Features
                </Link>
                <Link 
                to="/pricing"
                className={`text-sm font-medium transition-colors ${isActive('/pricing') ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
                >
                Pricing
                </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
                <Link 
                    to="/login"
                    className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
                >
                Log in
                </Link>
                <Link 
                    to="/onboarding"
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                >
                Start Free
                </Link>
          </div>

          <button 
            className="md:hidden text-slate-900"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

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

            <div className="flex flex-col gap-6 text-lg font-medium text-slate-900">
              <button onClick={() => handleNav('/')} className="text-left border-b border-slate-100 pb-4">Product</button>
              <button onClick={() => handleNav('/how-it-works')} className="text-left border-b border-slate-100 pb-4">How it Works</button>
              <button onClick={() => handleNav('/features')} className="text-left border-b border-slate-100 pb-4">Features</button>
              <button onClick={() => handleNav('/pricing')} className="text-left border-b border-slate-100 pb-4">Pricing</button>
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <button onClick={() => handleNav('/login')} className="w-full py-3 text-center text-slate-600 font-medium">Log in</button>
              <button onClick={() => handleNav('/onboarding')} className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-600/30">
                Get Started
              </button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
