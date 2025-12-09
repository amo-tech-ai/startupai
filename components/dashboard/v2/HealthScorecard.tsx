
import React from 'react';
import { HeartPulse, CheckCircle2, XCircle, ArrowUpRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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

// Workaround for strict type checking
const MotionDiv = motion.div as any;

export const HealthScorecard: React.FC<HealthScorecardProps> = ({ score, metrics, missing }) => {
  const getColor = (s: number) => s >= 80 ? 'text-emerald-500' : s >= 60 ? 'text-amber-500' : 'text-rose-500';
  const getBg = (s: number) => s >= 80 ? 'bg-emerald-500' : s >= 60 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <HeartPulse className="text-rose-500" size={20} /> Startup Health
        </h3>
        <span className={`text-2xl font-bold ${getColor(score)}`}>{score}%</span>
      </div>

      {/* Radial Progress Concept - Simplified with CSS/Divs for reliability */}
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
         <MotionDiv 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            className={`h-full rounded-full ${getBg(score)}`}
            transition={{ duration: 1, ease: "easeOut" }}
         />
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
