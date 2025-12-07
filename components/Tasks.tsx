import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const Tasks: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-6 pb-12">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Tasks</h1>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-3xl">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Upcoming</h2>
            <div className="space-y-3">
                 {[
                     { done: false, text: "Review Q3 Financials" },
                     { done: true, text: "Update Pitch Deck slides 4-6" },
                     { done: false, text: "Email follow-up to Sequoia" },
                 ].map((task, idx) => (
                     <div key={idx} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg group cursor-pointer">
                         {task.done ? 
                            <CheckCircle2 className="text-green-500" /> : 
                            <Circle className="text-slate-300 group-hover:text-primary-600" />
                         }
                         <span className={`${task.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.text}</span>
                     </div>
                 ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;