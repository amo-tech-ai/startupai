
import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';

// Workaround for strict type checking issues with framer-motion
const MotionDiv = motion.div as any;

export const PublicNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-transparent ${
          isScrolled ? 'border-slate-100' : ''
        }`}
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Logo Icon matching screenshot (Orange accent) */}
            <div className="text-brand-500">
              <Sparkles size={28} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              StartupAI
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {['Products', 'Playground', 'Docs', 'Pricing', 'Blog'].map((item) => {
              const path = item === 'Products' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`;
              return (
                <Link 
                  key={item}
                  to={path}
                  className="text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {item}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-500 font-medium text-[15px]">
               <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
               12.4k
            </div>
            <Link 
                to="/signup"
                className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-[15px] font-semibold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
            >
              Sign up
            </Link>
          </div>

          <button 
            className="lg:hidden text-slate-900"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MotionDiv
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white p-6 lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="text-brand-500">
                  <Sparkles size={28} fill="currentColor" />
                </div>
                <span className="text-xl font-bold text-slate-900">StartupAI</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-slate-50 rounded-full hover:bg-slate-100"
              >
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            <div className="flex flex-col gap-6 text-lg font-medium text-slate-900">
              <button onClick={() => handleNav('/')} className="text-left border-b border-slate-100 pb-4">Products</button>
              <button onClick={() => handleNav('/playground')} className="text-left border-b border-slate-100 pb-4">Playground</button>
              <button onClick={() => handleNav('/docs')} className="text-left border-b border-slate-100 pb-4">Docs</button>
              <button onClick={() => handleNav('/pricing')} className="text-left border-b border-slate-100 pb-4">Pricing</button>
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <button onClick={() => handleNav('/login')} className="w-full py-3 text-center text-slate-600 font-medium">Log in</button>
              <button onClick={() => handleNav('/signup')} className="w-full py-3 bg-brand-500 text-white rounded-xl font-bold">
                Sign up
              </button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};
