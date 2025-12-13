
import React from 'react';
import { Zap, Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
                <div className="text-brand-500">
                  <Zap size={24} fill="currentColor" />
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
              <li><Link to="/onboarding" className="hover:text-brand-500 transition-colors">Startup Wizard</Link></li>
              <li><Link to="/features" className="hover:text-brand-500 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-500 transition-colors">Pricing</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-500 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
             <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-brand-500 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
             <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-brand-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Terms of Service</a></li>
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
