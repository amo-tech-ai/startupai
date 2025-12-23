
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

const MotionDiv = motion.div as any;

export const UndoToast: React.FC = () => {
  const { undoAction, triggerUndo } = useData();

  return (
    <AnimatePresence>
      {undoAction && (
        <MotionDiv
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-800 min-w-[320px]">
            <div className="flex-1 flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Safety System</span>
              <p className="text-sm font-medium">Deleted {undoAction.type}.</p>
            </div>
            <button 
              onClick={triggerUndo}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-all active:scale-95"
            >
              <RotateCcw size={16} /> Undo
            </button>
          </div>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};
