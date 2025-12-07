
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <AlertCircle size={20} className="text-red-500" />,
    info: <Info size={20} className="text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-white border-green-100',
    error: 'bg-white border-red-100',
    info: 'bg-white border-blue-100',
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      layout
      className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border ${bgColors[toast.type]} min-w-[300px] max-w-md pointer-events-auto`}
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="text-sm font-medium text-slate-700 flex-1">{toast.message}</p>
      <button 
        onClick={() => onClose(toast.id)}
        className="text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X size={16} />
      </button>
    </MotionDiv>
  );
};
