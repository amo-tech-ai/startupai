
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
         <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
         {activities.length > 0 ? (
           activities.map((item) => {
              let icon = <ActivityIcon size={16} />;
              let bg = "bg-slate-50";
              let text = "text-slate-600";

              if (item.type === 'milestone') { icon = <Sparkles size={16} />; bg = "bg-amber-50"; text="text-amber-600"; }
              else if (item.type === 'update') { icon = <FileText size={16} />; bg = "bg-indigo-50"; text="text-indigo-600"; }
              else if (item.type === 'alert') { icon = <Clock size={16} />; bg = "bg-rose-50"; text="text-rose-600"; }
              else if (item.type === 'system') { icon = <CheckSquare size={16} />; bg = "bg-green-50"; text="text-green-600"; }

              return (
                  <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-slate-50/80 transition-colors group cursor-pointer">
                     <div className={`p-2 rounded-lg ${bg} ${text}`}>
                        {icon}
                     </div>
                     <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900">{item.title}</div>
                        <div className="text-xs text-slate-500">{item.description}</div>
                     </div>
                     <div className="text-xs text-slate-400 whitespace-nowrap">{formatTime(item.timestamp)}</div>
                     <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
              );
           })
         ) : (
           <div className="p-8 text-center text-slate-400 text-sm">No recent activity</div>
         )}
      </div>
    </div>
  );
};
