
import React from 'react';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';

interface TaskListViewProps {
  tasks: Task[];
  onUpdateStatus: (id: string, newStatus: TaskStatus) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({ tasks, onUpdateStatus }) => {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-1">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-5xl mx-auto">
            {tasks.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-sm">No tasks found. Create one to get started.</div>
            ) : (
                tasks.map((task) => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        viewMode="list"
                        onStatusChange={(id, status) => onUpdateStatus(id, status)}
                    />
                ))
            )}
        </div>
    </div>
  );
};
