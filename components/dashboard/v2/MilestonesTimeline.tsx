
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
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-6">
      <div className="flex items-center gap-2 mb-6 text-[#1A1A1A] font-bold font-serif">
        <h3>Milestones</h3>
      </div>

      <div className="relative">
        {/* Horizontal Line */}
        <div className="absolute top-3 left-0 w-full h-px bg-[#E5E5E5]"></div>

        <div className="flex gap-8 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar relative z-10">
            {displayItems.map((item: any, idx) => (
                <div key={idx} className="flex-shrink-0 w-32 flex flex-col items-center text-center group">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-[#1A1A1A] mb-4 group-hover:scale-110 transition-transform shadow-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#1A1A1A] rounded-full"></div>
                    </div>
                    <div className="text-xs font-bold text-[#1A1A1A] mb-1">{item.title}</div>
                    <div className="text-[10px] text-[#6B7280] flex items-center gap-1 justify-center bg-[#F7F7F5] px-2 py-0.5 rounded-full">
                        <Calendar size={8} />
                        {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                </div>
            ))}
            
            {/* Future Node */}
            <div className="flex-shrink-0 w-32 flex flex-col items-center text-center opacity-40">
                <div className="w-6 h-6 rounded-full bg-[#F7F7F5] border border-[#E5E5E5] mb-4 border-dashed"></div>
                <div className="text-xs font-bold text-[#6B7280]">Next Round</div>
            </div>
        </div>
      </div>
    </div>
  );
};
