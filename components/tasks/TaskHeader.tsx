
import React, { useState } from 'react';
import { Plus, LayoutGrid, List, Sparkles, Loader2 } from 'lucide-react';

interface TaskHeaderProps {
  viewMode: 'board' | 'list';
  setViewMode: (mode: 'board' | 'list') => void;
  onAddTask: (title: string) => void;
  onGenerateAI: () => void;
  isAiLoading: boolean;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({ 
  viewMode, 
  setViewMode, 
  onAddTask, 
  onGenerateAI, 
  isAiLoading 
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle);
      setNewTaskTitle('');
    }
  };

  return (
    <div className="px-8 py-6 bg-white border-b border-slate-200 shrink-0 shadow-sm z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Task Management</h1>
                <p className="text-slate-500 mt-1">Track your strategic roadmap and execution.</p>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={onGenerateAI}
                    disabled={isAiLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isAiLoading ? <Loader2 size={18} className="animate-spin"/> : <Sparkles size={18} />}
                    <span>AI Auto-Plan</span>
                </button>
            </div>
        </div>

        <div className="flex items-center gap-4 mt-8">
            <form onSubmit={handleSubmit} className="flex-1 max-w-lg relative group">
                <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                    type="text" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                />
            </form>
            
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

            <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                <button 
                    onClick={() => setViewMode('board')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    title="Board View"
                >
                    <LayoutGrid size={20} />
                </button>
                <button 
                     onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    title="List View"
                >
                    <List size={20} />
                </button>
            </div>
        </div>
    </div>
  );
};
