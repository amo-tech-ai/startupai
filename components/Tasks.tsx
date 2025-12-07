import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  MoreHorizontal, 
  Clock, 
  Sparkles,
  Loader2,
  List,
  LayoutGrid
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Task, TaskStatus } from '../types';
import { GoogleGenAI } from "@google/genai";
import { API_KEY } from '../lib/env';

const Tasks: React.FC = () => {
  const { tasks, addTask, updateTask, profile, addActivity } = useData();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Kanban Columns
  const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'Backlog', label: 'Backlog', color: 'bg-slate-100' },
    { id: 'In Progress', label: 'In Progress', color: 'bg-indigo-50' },
    { id: 'Review', label: 'Review', color: 'bg-amber-50' },
    { id: 'Done', label: 'Done', color: 'bg-green-50' },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
        title: newTaskTitle,
        status: 'Backlog',
        priority: 'Medium',
        aiGenerated: false
    });
    setNewTaskTitle('');
  };

  const generateAiRoadmap = async () => {
    if (!profile) return;
    if (!API_KEY) {
        alert("API Key missing");
        return;
    }

    setIsAiLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const prompt = `
            Context: Startup named "${profile.name}" in "${profile.stage}" stage.
            Sector: ${profile.targetMarket}
            Goal: ${profile.fundingGoal ? `Raise $${profile.fundingGoal}` : 'Scale Revenue'}

            Task: Generate 5 specific, high-priority tasks this startup should focus on RIGHT NOW to move to the next stage.
            
            Return a JSON array of objects with:
            - title (string)
            - description (string)
            - priority (High/Medium/Low)
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const text = response.text;
        if (text) {
            const newTasks = JSON.parse(text);
            newTasks.forEach((t: any) => {
                addTask({
                    title: t.title,
                    description: t.description,
                    status: 'Backlog',
                    priority: t.priority,
                    aiGenerated: true
                });
            });
            addActivity({
                type: 'system',
                title: 'AI Roadmap Generated',
                description: '5 new strategic tasks added to your backlog.'
            });
        }
    } catch (error) {
        console.error("AI Task Error", error);
    } finally {
        setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 bg-white border-b border-slate-200 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Task Management</h1>
                <p className="text-slate-500">Track your roadmap and execution.</p>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={generateAiRoadmap}
                    disabled={isAiLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70"
                >
                    {isAiLoading ? <Loader2 size={18} className="animate-spin"/> : <Sparkles size={18} />}
                    <span>AI Auto-Plan</span>
                </button>
            </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
            <form onSubmit={handleCreateTask} className="flex-1 max-w-lg relative">
                <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
            </form>
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setViewMode('board')}
                    className={`p-1.5 rounded ${viewMode === 'board' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <LayoutGrid size={18} />
                </button>
                <button 
                     onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <List size={18} />
                </button>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
        {viewMode === 'board' ? (
            <div className="flex h-full gap-6 min-w-[1000px]">
                {COLUMNS.map((col) => (
                    <div key={col.id} className="flex flex-col w-80 h-full shrink-0">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-700 text-sm">{col.label}</span>
                                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                    {tasks.filter(t => t.status === col.id).length}
                                </span>
                            </div>
                            <MoreHorizontal size={16} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                        </div>
                        
                        <div className={`flex-1 ${col.color} rounded-xl p-3 space-y-3 overflow-y-auto border border-slate-200/50`}>
                            {tasks.filter(t => t.status === col.id).map(task => (
                                <TaskCard 
                                    key={task.id} 
                                    task={task} 
                                    onMove={(id, dir) => {
                                        const currentIndex = COLUMNS.findIndex(c => c.id === task.status);
                                        const newIndex = currentIndex + dir;
                                        if (newIndex >= 0 && newIndex < COLUMNS.length) {
                                            updateTask(id, { status: COLUMNS[newIndex].id });
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-5xl mx-auto">
                {tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 group">
                        <button 
                            onClick={() => updateTask(task.id, { status: task.status === 'Done' ? 'Backlog' : 'Done' })}
                            className={`${task.status === 'Done' ? 'text-green-500' : 'text-slate-300 hover:text-indigo-500'}`}
                        >
                            {task.status === 'Done' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </button>
                        <div className="flex-1">
                            <div className={`font-medium ${task.status === 'Done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                {task.title}
                            </div>
                            {task.description && <div className="text-sm text-slate-500">{task.description}</div>}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            task.priority === 'High' ? 'bg-red-50 text-red-600' : 
                            task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 
                            'bg-blue-50 text-blue-600'
                        }`}>
                            {task.priority}
                        </span>
                        <div className="w-24 text-right">
                             <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-100 rounded-full">{task.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

const TaskCard: React.FC<{ task: Task, onMove: (id: string, dir: number) => void }> = ({ task, onMove }) => {
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative"
        >
            {task.aiGenerated && (
                <div className="absolute top-2 right-2 text-purple-500" title="AI Generated">
                    <Sparkles size={12} />
                </div>
            )}
            
            <div className="flex items-start justify-between mb-2">
                 <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                    task.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                    task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                    'bg-blue-50 text-blue-600 border border-blue-100'
                }`}>
                    {task.priority}
                </span>
            </div>

            <h4 className="font-bold text-slate-800 text-sm mb-1 leading-snug">{task.title}</h4>
            {task.description && (
                <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                    {task.description}
                </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-2">
                 <div className="flex items-center gap-1 text-xs text-slate-400">
                    {task.dueDate && (
                        <>
                            <Clock size={12} />
                            <span>{task.dueDate}</span>
                        </>
                    )}
                 </div>

                 {/* Quick Move Controls */}
                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => onMove(task.id, -1)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700">←</button>
                     <button onClick={() => onMove(task.id, 1)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700">→</button>
                 </div>
            </div>
        </motion.div>
    )
}

export default Tasks;
