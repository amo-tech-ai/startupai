
import React from 'react';
import { 
  Activity as ActivityIcon, 
  Sparkles, 
  FileText, 
  Clock, 
  CheckSquare, 
  ChevronRight 
} from 'lucide-react';
import { Activity } from '../../types';

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  // Time formatter
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
         <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">Recent Activity</h3>
         <button className="text-xs font-bold text-[#6B7280] hover:text-[#1A1A1A] uppercase tracking-wide">View All</button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] divide-y divide-[#E5E5E5] max-h-[400px] overflow-y-auto">
         {activities.length > 0 ? (
           activities.map((item) => {
              let icon = <ActivityIcon size={16} />;
              let bg = "bg-[#F7F7F5]";
              let text = "text-[#6B7280]";

              if (item.type === 'milestone') { icon = <Sparkles size={16} />; bg = "bg-[#FEF3C7]"; text="text-[#92400E]"; }
              else if (item.type === 'update') { icon = <FileText size={16} />; bg = "bg-[#F7F7F5]"; text="text-[#1A1A1A]"; }
              else if (item.type === 'alert') { icon = <Clock size={16} />; bg = "bg-[#FEE2E2]"; text="text-[#991B1B]"; }
              else if (item.type === 'system') { icon = <CheckSquare size={16} />; bg = "bg-[#DCFCE7]"; text="text-[#166534]"; }

              return (
                  <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-[#F7F7F5] transition-colors group cursor-pointer">
                     <div className={`p-2 rounded-lg ${bg} ${text} shrink-0`}>
                        {icon}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-[#1A1A1A] truncate">{item.title}</div>
                        <div className="text-xs text-[#6B7280] truncate">{item.description}</div>
                     </div>
                     <div className="text-xs text-[#6B7280] whitespace-nowrap">{formatTime(item.timestamp)}</div>
                  </div>
              );
           })
         ) : (
           <div className="p-8 text-center text-[#6B7280] text-sm">No recent activity</div>
         )}
      </div>
    </div>
  );
};
