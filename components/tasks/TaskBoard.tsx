
import React from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  columns: { id: TaskStatus; label: string; color: string }[];
  onUpdateStatus: (id: string, newStatus: TaskStatus) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, columns, onUpdateStatus }) => {
  
  const handleMove = (id: string, currentStatus: TaskStatus, dir: number) => {
    const currentIndex = columns.findIndex(c => c.id === currentStatus);
    const newIndex = currentIndex + dir;
    if (newIndex >= 0 && newIndex < columns.length) {
        onUpdateStatus(id, columns[newIndex].id);
    }
  };

  return (
    <div className="flex h-full gap-6 min-w-[1000px] overflow-x-auto pb-4">
        {columns.map((col) => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
                <div key={col.id} className="flex flex-col w-80 h-full shrink-0">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700 text-sm">{col.label}</span>
                            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                {colTasks.length}
                            </span>
                        </div>
                        <MoreHorizontal size={16} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                    
                    <div className={`flex-1 ${col.color} rounded-2xl p-3 space-y-3 overflow-y-auto border border-slate-200/50 custom-scrollbar`}>
                        {colTasks.length === 0 && (
                            <div className="h-24 border-2 border-dashed border-slate-200/50 rounded-xl flex items-center justify-center text-slate-400 text-xs font-medium">
                                No tasks
                            </div>
                        )}
                        {colTasks.map(task => (
                            <TaskCard 
                                key={task.id} 
                                task={task} 
                                viewMode="board"
                                onStatusChange={(id, status) => onUpdateStatus(id, status)}
                                onMove={(id, dir) => handleMove(id, task.status, dir)}
                            />
                        ))}
                        
                        <button className="w-full py-2.5 border-2 border-dashed border-slate-200/80 rounded-xl text-slate-400 text-xs font-bold hover:border-indigo-300 hover:text-indigo-500 hover:bg-white/50 transition-all flex items-center justify-center gap-2">
                            <Plus size={14} /> Add Task
                        </button>
                    </div>
                </div>
            );
        })}
    </div>
  );
};
