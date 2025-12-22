
import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, ChevronDown, Zap, Presentation, FileText, Users, CheckSquare, Search, Activity, BookOpen, MessageCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

// Workaround for strict type checking
const MotionDiv = motion.div as any;

// Fix: Defined interfaces for helper components to ensure correct prop typing
interface NavLinkProps {
  to: string;
  label: string;
}

interface MobileNavLinkProps {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}

// Fix: Moved helper components to the top and typed them as React.FC
const NavLink: React.FC<NavLinkProps> = ({ to, label }) => (
  <Link 
    to={to} 
    className="px-4 py-2 text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
  >
    {label}
  </Link>
);

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, onClick, children }) => (
  <Link 
    to={to} 
    onClick={onClick} 
    className="block w-full py-3 text-lg font-medium text-slate-900 border-b border-slate-100 last:border-0"
  >
    {children}
  </Link>
);

const featuresData = {
  core: [
    { name: 'Startup Wizard', desc: 'Zero to profile in 5 minutes.', icon: <Zap size={20} />, path: '/onboarding' },
    { name: 'Pitch Deck Engine', desc: 'Generate investor decks instantly.', icon: <Presentation size={20} />, path: '/pitch-decks' },
    { name: 'Document Factory', desc: 'Create One-Pagers & GTM strategies.', icon: <FileText size={20} />, path: '/documents' },
    { name: 'Visual CRM', desc: 'Manage your fundraising pipeline.', icon: <Users size={20} />, path: '/crm' },
    { name: 'Tasks & Ops', desc: 'AI-generated founder roadmap.', icon: <CheckSquare size={20} />, path: '/tasks' },
  ],
  advanced: [
    { name: 'AI Market Research', desc: 'Validate TAM/SAM/SOM.', icon: <Search size={18} />, path: '/startup-profile' },
    { name: 'Investor Readiness', desc: 'Health scores & risk analysis.', icon: <Activity size={18} />, path: '/dashboard' },
  ]
};

const resourcesData = [
  { name: 'Blog', icon: <BookOpen size={16} />, path: '#' },
  { name: 'Community', icon: <MessageCircle size={16} />, path: '#' },
  { name: 'Help Center', icon: <HelpCircle size={16} />, path: '#' },
];

export const PublicNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  
  // Mobile accordion state
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Scroll Locking for Mobile Menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  const toggleMobileExpand = (section: string) => {
    setMobileExpanded(mobileExpanded === section ? null : section);
  };

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled ? 'bg-white/90 backdrop-blur-md border-slate-200 shadow-sm' : 'bg-transparent border-transparent'
        }`}
        onMouseLeave={() => setHoveredTab(null)}
      >
        <div className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between relative">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 z-20">
            <div className="text-brand-500">
              <Sparkles size={28} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">StartupAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink to="/" label="Platform" />
            
            {/* Features Mega Menu Trigger */}
            <div 
              className="relative px-4 py-2 group"
              onMouseEnter={() => setHoveredTab('features')}
            >
              <button className={`flex items-center gap-1 text-[15px] font-medium transition-colors ${hoveredTab === 'features' ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'}`}>
                Features <ChevronDown size={14} className={`transition-transform duration-200 ${hoveredTab === 'features' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <NavLink to="/pricing" label="Pricing" />

            {/* Resources Trigger */}
            <div 
              className="relative px-4 py-2 group"
              onMouseEnter={() => setHoveredTab('resources')}
            >
              <button className={`flex items-center gap-1 text-[15px] font-medium transition-colors ${hoveredTab === 'resources' ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'}`}>
                Resources <ChevronDown size={14} className={`transition-transform duration-200 ${hoveredTab === 'resources' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <NavLink to="/dashboard" label="Dashboard" />
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4 z-20">
            <Link to="/login" className="text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Log in
            </Link>
            <Link 
              to="/signup"
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-[15px] font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-slate-900 p-2 z-20"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* DESKTOP MEGA MENUS (Absolute Positioning) */}
          <AnimatePresence>
            {hoveredTab === 'features' && (
              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 pt-2 z-10"
                onMouseEnter={() => setHoveredTab('features')}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <div className="mx-auto max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-3">
                  {/* Left: Core Features */}
                  <div className="col-span-2 p-8 grid grid-cols-2 gap-x-8 gap-y-6">
                    <div className="col-span-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Core Platform</div>
                    {featuresData.core.map((item) => (
                      <Link key={item.name} to={item.path} className="flex gap-4 group">
                        <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{item.name}</div>
                          <div className="text-sm text-slate-500 leading-snug">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Right: Advanced */}
                  <div className="col-span-1 bg-slate-50 p-8 border-l border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Advanced Intelligence</div>
                    <div className="space-y-6">
                      {featuresData.advanced.map((item) => (
                        <Link key={item.name} to={item.path} className="flex gap-3 group">
                          <div className="mt-0.5 text-slate-400 group-hover:text-brand-600 transition-colors">
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">{item.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <Link to="/features" className="text-sm font-bold text-slate-900 hover:text-brand-600 flex items-center gap-1">
                            View all features <ChevronDown size={12} className="-rotate-90" />
                        </Link>
                    </div>
                  </div>
                </div>
              </MotionDiv>
            )}

            {hoveredTab === 'resources' && (
              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-10 w-64"
                onMouseEnter={() => setHoveredTab('resources')}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2">
                  {resourcesData.map((item) => (
                    <Link key={item.name} to={item.path} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors">
                      {item.icon}
                      <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MotionDiv
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col lg:hidden overflow-y-auto"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="text-brand-500"><Sparkles size={28} fill="currentColor" /></div>
                <span className="text-xl font-bold text-slate-900">StartupAI</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-full">
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex-1 p-6 space-y-2">
              {/* Fix: Passed children text explicitly within the tag */}
              <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Platform</MobileNavLink>
              
              {/* Features Accordion */}
              <div>
                <button 
                  onClick={() => toggleMobileExpand('features')}
                  className="w-full flex items-center justify-between py-3 text-lg font-medium text-slate-900 border-b border-slate-100"
                >
                  Features <ChevronDown size={18} className={`transition-transform ${mobileExpanded === 'features' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileExpanded === 'features' && (
                    <MotionDiv 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="py-4 pl-4 space-y-4 bg-slate-50 rounded-xl mt-2">
                            <div className="text-xs font-bold text-slate-400 uppercase">Core</div>
                            {featuresData.core.map(f => (
                                <Link key={f.name} to={f.path} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-700">
                                    <span className="text-brand-600">{f.icon}</span> {f.name}
                                </Link>
                            ))}
                            <div className="text-xs font-bold text-slate-400 uppercase mt-4">Advanced</div>
                            {featuresData.advanced.map(f => (
                                <Link key={f.name} to={f.path} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-700">
                                    <span className="text-brand-600">{f.icon}</span> {f.name}
                                </Link>
                            ))}
                        </div>
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </div>

              {/* Fix: Passed children text explicitly within the tag */}
              <MobileNavLink to="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</MobileNavLink>
              
              {/* Resources Accordion */}
              <div>
                <button 
                  onClick={() => toggleMobileExpand('resources')}
                  className="w-full flex items-center justify-between py-3 text-lg font-medium text-slate-900 border-b border-slate-100"
                >
                  Resources <ChevronDown size={18} className={`transition-transform ${mobileExpanded === 'resources' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileExpanded === 'resources' && (
                    <MotionDiv 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="py-4 pl-4 space-y-4 bg-slate-50 rounded-xl mt-2">
                            {resourcesData.map(r => (
                                <Link key={r.name} to={r.path} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-700">
                                    {r.icon} {r.name}
                                </Link>
                            ))}
                        </div>
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </div>

              {/* Fix: Passed children text explicitly within the tag */}
              <MobileNavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
            </div>

            {/* Mobile Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button onClick={() => handleNav('/login')} className="w-full py-3 text-center text-slate-600 font-medium mb-3">Log in</button>
              <button onClick={() => handleNav('/signup')} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg">
                Get Started
              </button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};
