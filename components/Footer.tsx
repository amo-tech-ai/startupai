
import React from 'react';
import { Zap, Twitter, Linkedin, Github } from 'lucide-react';
import { PageType } from '../types';

interface FooterProps {
  setPage?: (page: PageType) => void;
}

const Footer: React.FC<FooterProps> = ({ setPage }) => {
  const handleNav = (page: PageType) => {
    if (setPage) {
      setPage(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                  <Zap size={18} fill="currentColor" />
                </div>
                <span className="text-xl font-bold text-slate-900">startupAI</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              The all-in-one intelligence platform for modern founders. Build, track, and scale with confidence.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button onClick={() => handleNav('onboarding')} className="hover:text-primary-600 transition-colors">Startup Wizard</button>
              </li>
              <li>
                <button onClick={() => handleNav('features')} className="hover:text-primary-600 transition-colors">Features</button>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">Integrations</a>
              </li>
              <li>
                <button onClick={() => handleNav('pricing')} className="hover:text-primary-600 transition-colors">Pricing</button>
              </li>
              <li>
                <button onClick={() => handleNav('dashboard')} className="hover:text-primary-600 transition-colors font-medium text-indigo-600">Dashboard</button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
             <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-primary-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
             <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© 2024 startupAI Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Github size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
