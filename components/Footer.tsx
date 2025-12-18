
import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 print:hidden">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
                <div className="text-brand-500">
                  <Sparkles size={24} fill="currentColor" />
                </div>
                <span className="text-xl font-bold text-slate-900">StartupAI</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              The all-in-one intelligence platform for modern founders. Build, track, and scale with confidence.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-600 font-medium">
              <li><Link to="/onboarding" className="hover:text-brand-500 transition-colors">Startup Wizard</Link></li>
              <li><Link to="/pitch-decks" className="hover:text-brand-500 transition-colors">Pitch Deck Engine</Link></li>
              <li><Link to="/documents" className="hover:text-brand-500 transition-colors">Document Factory</Link></li>
              <li><Link to="/crm" className="hover:text-brand-500 transition-colors">Visual CRM</Link></li>
              <li><Link to="/tasks" className="hover:text-brand-500 transition-colors">Tasks & Ops</Link></li>
              <li><Link to="/events" className="hover:text-brand-500 transition-colors">Event Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-widest">System Views</h4>
             <ul className="space-y-2 text-sm text-slate-600 font-medium">
              <li><Link to="/blueprint/architecture" className="hover:text-brand-500 transition-colors">View Architecture</Link></li>
              <li><Link to="/blueprint/workflow" className="hover:text-brand-500 transition-colors">View Workflow</Link></li>
              <li><Link to="/blueprint/ai-flowchart" className="hover:text-brand-500 transition-colors">View AI Flowchart</Link></li>
              <li><Link to="/blueprint/journey" className="hover:text-brand-500 transition-colors">View User Journey</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-widest">Intelligence</h4>
             <ul className="space-y-2 text-sm text-slate-600 font-medium">
              <li><Link to="/startup-profile" className="hover:text-brand-500 transition-colors">Market Research</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-500 transition-colors">Investor Readiness</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-500 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-widest">Legal</h4>
             <ul className="space-y-2 text-sm text-slate-600 font-medium">
              <li><a href="#" className="hover:text-brand-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2024 StartupAI OS v3.5. All rights reserved.</p>
          </div>
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

const Sparkles = ({ size, fill }: { size: number, fill?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={fill || "none"} 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="lucide lucide-sparkles"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M9 5h4"/>
      <path d="M19 17v4"/>
      <path d="M17 19h4"/>
    </svg>
);

export default Footer;
