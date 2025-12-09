
import React, { useState } from 'react';
import { Lightbulb, RefreshCw, Loader2 } from 'lucide-react';

export const AIInsightsDigest: React.FC = () => {
  const [period, setPeriod] = useState<'Daily' | 'Weekly'>('Daily');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
            <Lightbulb size={20} className="text-amber-500" />
            <h3 className="font-bold text-slate-900">AI Digest</h3>
        </div>
        <div className="flex bg-slate-100 p-0.5 rounded-lg">
            {['Daily', 'Weekly'].map((p) => (
                <button
                    key={p}
                    onClick={() => setPeriod(p as any)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${period === p ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {p}
                </button>
            ))}
        </div>
      </div>

      <div className="space-y-3 min-h-[100px]">
        {isRefreshing ? (
            <div className="flex flex-col items-center justify-center h-24 text-slate-400 gap-2">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-xs">Analyzing trends...</span>
            </div>
        ) : (
            <>
                <div className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Customer interest <span className="text-green-600 font-bold">increased 12%</span> this week based on site traffic and CRM activity.
                    </p>
                </div>
                <div className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Burn rate is rising. Consider reviewing software subscriptions.
                    </p>
                </div>
            </>
        )}
      </div>

      <button 
        onClick={handleRefresh}
        className="w-full mt-4 py-2 text-xs font-bold text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} /> Regenerate Insights
      </button>
    </div>
  );
};
