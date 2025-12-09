
import React, { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';

// Workaround for strict type checking issues with framer-motion
const MotionDiv = motion.div as any;

export const PublicNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const isActive = (path: string) => location.pathname === path;

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
