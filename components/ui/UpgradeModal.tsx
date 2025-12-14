
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, CheckCircle2, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

// Workaround for framer-motion strict types
const MotionDiv = motion.div as any;

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, featureName }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <MotionDiv
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Header Graphic */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 h-32 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg border border-white/20">
              <Crown size={32} className="text-white" />
            </div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 rounded-full text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Unlock {featureName}</h2>
            <p className="text-slate-500 mb-6 leading-relaxed">
              You've reached the limit for your current plan. Upgrade to <strong>Founder</strong> to remove limits and access advanced AI models.
            </p>

            <div className="space-y-3 mb-8 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                <span>Unlimited Pitch Decks & Events</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                <span>Gemini 3 Pro (Reasoning Model)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                <span>Full CRM & Data Export</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/settings/billing')}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Zap size={20} className="fill-yellow-400 text-yellow-400" /> Upgrade Now
            </button>
            
            <p className="mt-4 text-xs text-slate-400">
              Starting at $29/mo. Cancel anytime.
            </p>
          </div>
        </MotionDiv>
      </div>
    </AnimatePresence>
  );
};
