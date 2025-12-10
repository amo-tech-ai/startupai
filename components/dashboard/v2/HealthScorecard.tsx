
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
  const getColor = (s: number) => s >= 80 ? '#166534' : s >= 60 ? '#92400E' : '#991B1B';
  const color = getColor(score);

  const data = [
    { value: score },
    { value: 100 - score }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
          Startup Health
        </h3>
      </div>

      {/* Radial Progress Chart */}
      <div className="w-full min-w-0">
        <div className="relative h-40 w-full min-w-0 flex items-center justify-center mb-8">
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
                      <Cell fill="#F7F7F5" />
                  </Pie>
              </PieChart>
           </ResponsiveContainer>
           <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-3xl font-serif font-bold text-[#1A1A1A]">{score}%</span>
               <span className="text-xs text-[#6B7280] font-medium uppercase tracking-wide">Score</span>
           </div>
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
        <div className="mt-6 p-4 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl text-xs text-[#92400E]">
            <strong>Needs Attention:</strong> {missing.join(', ')}
        </div>
      )}
    </div>
  );
};

const HealthItem = ({ label, status, positive, negative, icon }: any) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-[#6B7280]">{label}</span>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status ? 'bg-[#DCFCE7] text-[#166534] border-[#bbf7d0]' : 'bg-[#FEE2E2] text-[#991B1B] border-[#fecaca]'}`}>
            {status ? icon : <XCircle size={14} />}
            {status ? positive : negative}
        </div>
    </div>
);
