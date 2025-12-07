
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  MoreHorizontal 
} from 'lucide-react';
import { Task } from '../../types';

// Workaround for strict type checking
const MotionDiv = motion.div as any;

interface TaskCardProps {
  task: Task;
  viewMode?: 'board' | 'list';
  onStatusChange: (id: string, newStatus: any) => void;
  onMove?: (id: string, dir: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, viewMode = 'board', onStatusChange, onMove }) => {
  
  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'High': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Low': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 group transition-colors">
        <button 
            onClick={() => onStatusChange(task.id, task.status === 'Done' ? 'Backlog' : 'Done')}
            className={`${task.status === 'Done' ? 'text-green-500' : 'text-slate-300 hover:text-indigo-500'} transition-colors`}
        >
            {task.status === 'Done' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </button>
        <div className="flex-1 min-w-0">
            <div className={`font-medium truncate ${task.status === 'Done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                {task.title}
                {task.aiGenerated && (
                    <Sparkles size={12} className="inline ml-2 text-purple-500" />
                )}
            </div>
            {task.description && <div className="text-sm text-slate-500 truncate">{task.description}</div>}
        </div>
        <div className="flex items-center gap-4">
            <span className={`px-2 py-1 rounded text-xs font-bold border ${getPriorityColor(task.priority)}`}>
                {task.priority}
            </span>
            <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-100 rounded-full w-24 text-center">
                {task.status}
            </span>
            <button className="text-slate-300 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all">
                <MoreHorizontal size={16} />
            </button>
        </div>
      </div>
    );
  }

  // BOARD VIEW
  return (
    <MotionDiv 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative"
    >
        {task.aiGenerated && (
            <div className="absolute top-3 right-3 text-purple-500" title="AI Generated">
                <Sparkles size={14} />
            </div>
        )}
        
        <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wide border ${getPriorityColor(task.priority)}`}>
                {task.priority}
            </span>
        </div>

        <h4 className={`font-bold text-slate-800 text-sm mb-1 leading-snug ${task.status === 'Done' ? 'line-through text-slate-400' : ''}`}>
            {task.title}
        </h4>
        
        {task.description && (
            <p className={`text-xs line-clamp-2 mb-3 leading-relaxed ${task.status === 'Done' ? 'text-slate-300' : 'text-slate-500'}`}>
                {task.description}
            </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-2">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                {task.dueDate && (
                    <>
                        <Clock size={12} />
                        <span>{task.dueDate}</span>
                    </>
                )}
                </div>

                {/* Quick Move Controls */}
                {onMove && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50 rounded-lg p-0.5">
                        <button onClick={() => onMove(task.id, -1)} className="p-1 hover:bg-white hover:shadow-sm rounded text-slate-400 hover:text-slate-700 transition-all">←</button>
                        <button onClick={() => onMove(task.id, 1)} className="p-1 hover:bg-white hover:shadow-sm rounded text-slate-400 hover:text-slate-700 transition-all">→</button>
                    </div>
                )}
        </div>
    </MotionDiv>
  );
};
