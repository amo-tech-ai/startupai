
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, User, Mail, Calendar, Sparkles, Save, Trash2, Clock, CheckCircle2, Copy, Loader2, ArrowRight } from 'lucide-react';
import { Deal, DealStage } from '../../types';
import { useToast } from '../../context/ToastContext';
import { WizardService } from '../../services/wizardAI';
import { API_KEY } from '../../lib/env';

// Workaround for strict type checking
const MotionDiv = motion.div as any;

interface DealDetailDrawerProps {
  isOpen: boolean;
  deal: Deal | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Deal>) => void;
  onDelete: (id: string) => void;
}

export const DealDetailDrawer: React.FC<DealDetailDrawerProps> = ({ isOpen, deal, onClose, onUpdate, onDelete }) => {
  const { success, error, toast } = useToast();
  const [formData, setFormData] = useState<Partial<Deal>>({});
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');

  useEffect(() => {
    if (deal) {
      setFormData(deal);
      setGeneratedEmail('');
    }
  }, [deal]);

  const handleSave = () => {
    if (deal && formData) {
      onUpdate(deal.id, formData);
      success("Deal updated successfully");
      onClose();
    }
  };

  const handleDelete = () => {
    if (deal && confirm("Are you sure you want to delete this deal? This cannot be undone.")) {
      onDelete(deal.id);
      onClose();
    }
  };

  const handleAiDraftEmail = async () => {
    if (!API_KEY || !formData.company) return;
    
    setIsAiDrafting(true);
    toast("AI is drafting a follow-up email...", "info");

    try {
      const context = `
        Draft a follow-up email to ${formData.contactPerson || 'the prospect'} at ${formData.company}.
        Current Deal Stage: ${formData.stage}.
        Next Action: ${formData.nextAction}.
        Deal Value: $${formData.value}.
        Notes: ${formData.notes || 'None'}.
      `;
      
      const draft = await WizardService.refineText("Draft an email", context, API_KEY);
      if (draft) {
        setGeneratedEmail(draft.replace(/"/g, '')); // Cleanup quotes
        success("Draft generated!");
      }
    } catch (e) {
      error("Failed to generate email.");
    } finally {
      setIsAiDrafting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    success("Copied to clipboard");
  };

  if (!isOpen || !deal) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          />
          <MotionDiv 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-sm text-slate-400">
                  <Building2 size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{formData.company}</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>{formData.sector}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-700 font-medium">${formData.value?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 size={20} />
                </button>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Status Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-medium text-slate-700">Pipeline Stage</label>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    formData.stage === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                  }`}>{formData.stage}</span>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {['Lead', 'Qualified', 'Meeting', 'Proposal', 'Closed'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFormData({...formData, stage: s as DealStage})}
                      className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${
                        formData.stage === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deal Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Probability</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" min="0" max="100" step="5"
                      value={formData.probability}
                      onChange={(e) => setFormData({...formData, probability: Number(e.target.value)})}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="font-bold text-slate-900 w-8">{formData.probability}%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Expected Close</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      className="w-full pl-9 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <User size={16} /> Key Contact
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    placeholder="Contact Name"
                    value={formData.contactPerson || ''}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    className="p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <input 
                    placeholder="Email Address"
                    value={formData.contactEmail || ''}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    className="p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Notes & AI */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-900 text-sm">Notes & Context</label>
                  <button 
                    onClick={handleAiDraftEmail}
                    disabled={isAiDrafting}
                    className="flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isAiDrafting ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12} />}
                    Draft Follow-up
                  </button>
                </div>
                
                {generatedEmail && (
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 relative group">
                    <div className="text-xs font-bold text-purple-800 uppercase mb-2 flex items-center gap-2">
                      <Sparkles size={12}/> AI Draft
                    </div>
                    <textarea 
                      className="w-full bg-transparent border-none text-sm text-purple-900 leading-relaxed focus:ring-0 resize-none h-32"
                      value={generatedEmail}
                      onChange={(e) => setGeneratedEmail(e.target.value)}
                    />
                    <button 
                      onClick={copyToClipboard}
                      className="absolute bottom-3 right-3 p-1.5 bg-white rounded-lg shadow-sm text-purple-600 hover:text-purple-800 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                )}

                <textarea 
                  placeholder="Add notes about the deal..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                />
              </div>

              {/* Next Action */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <Clock size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-800 uppercase">Next Step</div>
                    <input 
                      value={formData.nextAction}
                      onChange={(e) => setFormData({...formData, nextAction: e.target.value})}
                      className="bg-transparent border-none p-0 text-sm font-medium text-indigo-900 focus:ring-0 w-full placeholder-indigo-300"
                      placeholder="Define next action..."
                    />
                  </div>
                </div>
                <CheckCircle2 className="text-indigo-300" size={20} />
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};
