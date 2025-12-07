
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { TaskStatus } from '../types';
import { TaskAI } from '../services/taskAI';
import { API_KEY } from '../lib/env';
import { useToast } from '../context/ToastContext';

// Modular Components
import { TaskHeader } from './tasks/TaskHeader';
import { TaskBoard } from './tasks/TaskBoard';
import { TaskListView } from './tasks/TaskListView';

const Tasks: React.FC = () => {
  const { tasks, addTask, updateTask, profile, addActivity } = useData();
  const { toast, error, success } = useToast();
  
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Kanban Columns Config
  const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'Backlog', label: 'Backlog', color: 'bg-slate-100' },
    { id: 'In Progress', label: 'In Progress', color: 'bg-blue-50' },
    { id: 'Review', label: 'Review', color: 'bg-amber-50' },
    { id: 'Done', label: 'Done', color: 'bg-green-50' },
  ];

  // Actions
  const handleCreateTask = (title: string) => {
    addTask({
        title,
        status: 'Backlog',
        priority: 'Medium',
        aiGenerated: false
    });
    success("Task added to backlog");
  };

  const handleUpdateStatus = (id: string, newStatus: TaskStatus) => {
      updateTask(id, { status: newStatus });
  };

  const generateAiRoadmap = async () => {
    if (!profile) {
        error("Complete your profile first to generate a roadmap.");
        return;
    }
    if (!API_KEY) {
        error("API Key missing");
        return;
    }

    setIsAiLoading(true);
    toast("AI is generating your strategic roadmap...", "info");

    try {
        const profileContext = {
            name: profile.name,
            stage: profile.stage,
            targetMarket: profile.targetMarket,
            goal: profile.fundingGoal ? `Raise $${profile.fundingGoal.toLocaleString()}` : 'Scale Revenue'
        };

        const newTasks = await TaskAI.generateRoadmap(API_KEY, profileContext);

        if (newTasks && newTasks.length > 0) {
            newTasks.forEach(task => addTask(task));
            
            addActivity({
                type: 'system',
                title: 'AI Roadmap Generated',
                description: `${newTasks.length} new strategic tasks added to your backlog.`
            });
            success("Roadmap generated successfully!");
        } else {
            error("AI could not generate tasks.");
        }
    } catch (err) {
        console.error(err);
        error("Failed to generate roadmap.");
    } finally {
        setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      
      <TaskHeader 
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddTask={handleCreateTask}
        onGenerateAI={generateAiRoadmap}
        isAiLoading={isAiLoading}
      />

      <div className="flex-1 overflow-hidden p-6 md:p-8">
        {viewMode === 'board' ? (
            <TaskBoard 
                tasks={tasks} 
                columns={COLUMNS} 
                onUpdateStatus={handleUpdateStatus} 
            />
        ) : (
            <TaskListView 
                tasks={tasks} 
                onUpdateStatus={handleUpdateStatus} 
            />
        )}
      </div>
    </div>
  );
};

export default Tasks;
