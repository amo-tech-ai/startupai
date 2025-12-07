
import React from 'react';
import { 
  FileText, 
  Briefcase, 
  CheckSquare, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';
import { MetricsSnapshot, StartupProfile } from '../../types';

interface KPIGridProps {
  metrics: MetricsSnapshot[];
  profile: StartupProfile | null;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ metrics, profile }) => {
  const mrr = metrics[0]?.mrr || 0;
  const activeUsers = metrics[0]?.activeUsers || 0;
  const fundingGoal = profile?.fundingGoal || 1000000;
  
  // Calculate Progress towards funding
  const raisedAmount = 150000; 
  const fundingProgress = Math.min((raisedAmount / fundingGoal) * 100, 100);

  // Dynamic Chart Data Generation Helper
  const generateChartData = (currentValue: number, points: number = 7) => {
    if (currentValue === 0) return Array(points).fill({ v: 0 });
    
    return Array.from({ length: points }, (_, i) => {
      const reverseIndex = points - 1 - i;
      const volatility = Math.random() * 0.1 - 0.05; 
      const trendFactor = 1 - (reverseIndex * 0.1); 
      let val = currentValue * trendFactor * (1 + volatility);
      return { v: Math.max(0, val) };
    });
  };

  const mrrData = generateChartData(mrr);
  const usersData = generateChartData(activeUsers);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       {/* Card 1: MRR */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText size={20} />
             </div>
             <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} /> +3 this week
             </div>
          </div>
          <div className="mb-4">
             <div className="text-slate-500 text-sm font-medium mb-1">Monthly Revenue</div>
             <div className="text-3xl font-bold text-slate-900">${mrr.toLocaleString()}</div>
          </div>
          <div className="h-10 w-full opacity-50">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mrrData}>
                   <Area type="monotone" dataKey="v" stroke="#4f46e5" fill="#e0e7ff" strokeWidth={2} />
                </AreaChart>
             </ResponsiveContainer>
          </div>
       </div>

       {/* Card 2: Funding */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Briefcase size={20} />
             </div>
             <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} /> +12%
             </div>
          </div>
          <div className="mb-4">
             <div className="text-slate-500 text-sm font-medium mb-1">Funding Target</div>
             <div className="text-3xl font-bold text-slate-900">${fundingGoal.toLocaleString()}</div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
             <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${fundingProgress}%` }}></div>
          </div>
          <div className="text-xs text-slate-400">Raised: ${raisedAmount.toLocaleString()}</div>
       </div>

       {/* Card 3: Active Users */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                <CheckSquare size={20} />
             </div>
             <div className="flex items-center gap-1 text-slate-500 text-xs font-medium bg-slate-50 px-2 py-1 rounded-full">
                4 Urgent
             </div>
          </div>
           <div className="mb-4">
             <div className="text-slate-500 text-sm font-medium mb-1">Active Users</div>
             <div className="text-3xl font-bold text-slate-900">{activeUsers.toLocaleString()}</div>
          </div>
          <div className="h-10 w-full opacity-50">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usersData}>
                   <Bar dataKey="v" fill="#2dd4bf" radius={[2, 2, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </div>
       </div>

       {/* Card 4: Docs Generated */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <BarChart3 size={20} />
             </div>
              <div className="flex items-center gap-1 text-rose-500 text-xs font-bold bg-rose-50 px-2 py-1 rounded-full">
                <ArrowDownRight size={12} /> -2%
             </div>
          </div>
           <div className="mb-4">
             <div className="text-slate-500 text-sm font-medium mb-1">Docs Generated</div>
             <div className="text-3xl font-bold text-slate-900">12</div>
          </div>
          <div className="h-10 w-full opacity-50">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mrrData}>
                   <Bar dataKey="v" fill="#fb7185" radius={[2, 2, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </div>
       </div>
    </section>
  );
};
