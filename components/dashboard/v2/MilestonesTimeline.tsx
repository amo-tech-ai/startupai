
import React from 'react';
import { Flag, Calendar } from 'lucide-react';
import { Activity } from '../../../types';

interface MilestonesTimelineProps {
  milestones: Activity[];
}

export const MilestonesTimeline: React.FC<MilestonesTimelineProps> = ({ milestones }) => {
  // Sort by date ascending for timeline
  const sorted = [...milestones].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Use placeholders if empty
  const displayItems = sorted.length > 0 ? sorted : [
    { id: '1', title: 'Company Created', timestamp: new Date().toISOString(), description: 'Day 1' },
    { id: '2', title: 'Profile Setup', timestamp: new Date().toISOString(), description: 'Core details added' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
        <Flag size={20} className="text-indigo-600" />
        <h3>Milestones</h3>
      </div>

      <div className="relative">
        {/* Horizontal Line */}
        <div className="absolute top-2.5 left-0 w-full h-0.5 bg-slate-100 rounded-full"></div>

        <div className="flex gap-8 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar relative z-10">
            {displayItems.map((item: any, idx) => (
                <div key={idx} className="flex-shrink-0 w-32 flex flex-col items-center text-center group">
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-indigo-500 mb-3 group-hover:scale-125 transition-transform shadow-sm"></div>
                    <div className="text-xs font-bold text-slate-800 mb-1">{item.title}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 justify-center bg-slate-50 px-2 py-0.5 rounded-full">
                        <Calendar size={8} />
                        {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                </div>
            ))}
            
            {/* Future Node */}
            <div className="flex-shrink-0 w-32 flex flex-col items-center text-center opacity-50">
                <div className="w-4 h-4 rounded-full bg-slate-200 border-2 border-slate-300 mb-3 border-dashed"></div>
                <div className="text-xs font-bold text-slate-400">Next Round</div>
            </div>
        </div>
      </div>
    </div>
  );
};
