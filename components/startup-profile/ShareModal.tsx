
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Lock, Copy, Download, Check, FileText } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// Workaround for strict type checking
const MotionDiv = motion.div as any;

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPublic: boolean;
  onTogglePublic: () => Promise<void>;
  publicUrl: string;
  onDownloadPdf: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  isPublic,
  onTogglePublic,
  publicUrl,
  onDownloadPdf
}) => {
  const { success } = useToast();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    await onTogglePublic();
    setIsToggling(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    success("Link copied to clipboard!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
          />
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Share Data Room</h2>
                <p className="text-sm text-slate-500">Manage access to your startup profile.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Toggle Public Access */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isPublic ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                    {isPublic ? <Globe size={20} /> : <Lock size={20} />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Public Access</div>
                    <div className="text-xs text-slate-500">
                      {isPublic ? 'Anyone with the link can view.' : 'Only you can view this profile.'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleToggle}
                  disabled={isToggling}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isPublic ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                >
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${
                    isPublic ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>

              {/* Public Link */}
              <div className={`space-y-2 transition-opacity ${isPublic ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <label className="text-xs font-bold text-slate-500 uppercase">Public Link</label>
                <div className="flex gap-2">
                  <input 
                    readOnly 
                    value={publicUrl}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none"
                  />
                  <button 
                    onClick={handleCopy}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors text-sm"
                  >
                    <Copy size={16} /> Copy
                  </button>
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full my-2"></div>

              {/* PDF Export */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                       <FileText size={20} />
                    </div>
                    <div>
                        <div className="font-bold text-indigo-900 text-sm">One-Pager PDF</div>
                        <div className="text-xs text-indigo-700">Download a clean, printable summary.</div>
                    </div>
                 </div>
                 <button 
                    onClick={onDownloadPdf}
                    className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-colors text-sm"
                 >
                    <Download size={16} /> Download
                 </button>
              </div>
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};
