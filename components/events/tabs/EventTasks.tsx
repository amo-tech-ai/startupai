
import React from 'react';
import { EventTask } from '../../../types';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';

interface EventTasksProps {
  tasks: EventTask[];
  onToggleStatus: (taskId: string, currentStatus: string) => void;
}

export const EventTasks: React.FC<EventTasksProps> = ({ tasks, onToggleStatus }) => {
  
  const phases = ['Strategy', 'Planning', 'Marketing', 'Operations', 'Post-Event'];

  return (
    <div className="space-y-8">
        {phases.map((phase) => {
            const phaseTasks = tasks.filter(t => t.phase === phase);
            if (phaseTasks.length === 0) return null;

            return (
                <div key={phase} className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-2 border-l-2 border-indigo-500">
                        {phase} Phase
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                        {phaseTasks.map((task) => (
                            <div 
                                key={task.id} 
                                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group cursor-pointer"
                                onClick={() => onToggleStatus(task.id, task.status)}
                            >
                                <button className="text-slate-300 hover:text-emerald-500 transition-colors">
                                    {task.status === 'done' ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} />}
                                </button>
                                <div className="flex-1">
                                    <div className={`font-medium text-slate-900 ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>{task.title}</div>
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded">
                                    <Calendar size={12} />
                                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-100">
                                    AI
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}
    </div>
  );
};
