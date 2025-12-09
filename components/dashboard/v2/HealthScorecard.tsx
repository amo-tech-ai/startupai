
import React from 'react';
import { HeartPulse, CheckCircle2, XCircle, ArrowUpRight, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface HealthScorecardProps {
  score: number;
  metrics: {
    mrrGrowth: boolean;
    deckReady: boolean;
    runwayHealthy: boolean;
    profileComplete: boolean;
  };
  missing: string[];
}

export const HealthScorecard: React.FC<HealthScorecardProps> = ({ score, metrics, missing }) => {
  const getColor = (s: number) => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#f43f5e';
  const color = getColor(score);

  const data = [
    { value: score },
    { value: 100 - score }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <HeartPulse className="text-rose-500" size={20} /> Startup Health
        </h3>
      </div>

      {/* Radial Progress Chart */}
      <div className="relative h-40 flex items-center justify-center mb-4">
         <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={70}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                >
                    <Cell fill={color} />
                    <Cell fill="#f1f5f9" />
                </Pie>
            </PieChart>
         </ResponsiveContainer>
         <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-3xl font-bold text-slate-900">{score}%</span>
             <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Score</span>
         </div>
      </div>

      <div className="space-y-4">
        <HealthItem 
            label="Business Health" 
            status={metrics.mrrGrowth} 
            positive="Growing" 
            negative="Stagnant" 
            icon={<ArrowUpRight size={14} />}
        />
        <HealthItem 
            label="Fundraising" 
            status={metrics.deckReady} 
            positive="Deck Ready" 
            negative="Needs Deck" 
            icon={<CheckCircle2 size={14} />}
        />
        <HealthItem 
            label="Runway" 
            status={metrics.runwayHealthy} 
            positive="> 6 Months" 
            negative="Critical" 
            icon={<AlertCircle size={14} />}
        />
        <HealthItem 
            label="Profile" 
            status={metrics.profileComplete} 
            positive="Complete" 
            negative="Incomplete" 
            icon={<CheckCircle2 size={14} />}
        />
      </div>

      {missing.length > 0 && (
        <div className="mt-6 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800">
            <strong>Needs Attention:</strong> {missing.join(', ')}
        </div>
      )}
    </div>
  );
};

const HealthItem = ({ label, status, positive, negative, icon }: any) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-slate-600">{label}</span>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${status ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {status ? icon : <XCircle size={14} />}
            {status ? positive : negative}
        </div>
    </div>
);
