
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Mail, Send, Edit3, Loader2, Info } from 'lucide-react';
import { ProposedAction } from '../../types';

const MotionDiv = motion.div as any;

interface ProposedActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: ProposedAction | null;
  onApprove: (id: string, payload: any) => Promise<void>;
}

export const ProposedActionModal: React.FC<ProposedActionModalProps> = ({ 
  isOpen, 
  onClose, 
  action, 
  onApprove 
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [editedPayload, setEditedPayload] = useState<any>(null);

  React.useEffect(() => {
    if (action) setEditedPayload(action.payload);
  }, [action]);

  const handleApprove = async () => {
    if (!action) return;
    setIsExecuting(true);
    await onApprove(action.id, editedPayload);
    setIsExecuting(false);
    onClose();
  };

  if (!isOpen || !action) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <MotionDiv 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <MotionDiv
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Governance Review</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">AI Proposed Action</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
             <X size={20} />
           </button>
        </div>

        <div className="p-8 space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-1">
                    <Info size={16} /> Reasoning
                </div>
                <p className="text-sm text-indigo-600 leading-relaxed">
                    {action.reasoning}
                </p>
            </div>

            <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {action.type === 'email' ? 'Email Draft' : 'Payload'}
                </label>
                
                {action.type === 'email' ? (
                   <textarea 
                      className="w-full h-48 p-4 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-medium leading-relaxed"
                      value={editedPayload?.body || ''}
                      onChange={(e) => setEditedPayload({ ...editedPayload, body: e.target.value })}
                   />
                ) : (
                   <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-600">
                      {JSON.stringify(action.payload, null, 2)}
                   </div>
                )}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 text-slate-600 font-bold text-sm hover:bg-slate-50 rounded-xl transition-all"
                >
                  Reject Action
                </button>
                <button 
                  onClick={handleApprove}
                  disabled={isExecuting}
                  className="flex-[2] py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isExecuting ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} />}
                  Approve & Execute
                </button>
            </div>
        </div>

        <div className="px-8 py-3 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
            Human Oversight Enabled • Audit Log Registered
        </div>
      </MotionDiv>
    </div>
  );
};
