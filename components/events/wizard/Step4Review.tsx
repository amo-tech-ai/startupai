
import React from 'react';
import { Calendar, MapPin, Target, Wallet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { EventData } from '../../../types';

interface Step4ReviewProps {
  data: EventData;
}

export const Step4Review: React.FC<Step4ReviewProps> = ({ data }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 pb-32">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Review & Launch</h2>
        <p className="text-slate-500">Confirm details before generating your operation plan.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-slate-900 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
          <div className="flex gap-4 text-sm text-slate-300">
            <span className="flex items-center gap-1.5"><Calendar size={14}/> {data.date || 'Date TBD'}</span>
            <span className="flex items-center gap-1.5"><MapPin size={14}/> {data.city || 'Location TBD'}</span>
            <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs font-bold uppercase">{data.type}</span>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Event Strategy</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Target className="text-indigo-600 mt-0.5" size={18} />
                <div>
                  <div className="font-bold text-slate-900 text-sm">Objective</div>
                  <p className="text-sm text-slate-600 leading-relaxed mt-1">{data.description}</p>
                </div>
              </div>
              {data.strategy && (
                <div className="flex items-start gap-3">
                  <Wallet className="text-emerald-600 mt-0.5" size={18} />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Budget Est.</div>
                    <p className="text-sm text-slate-600 mt-1">
                      ${data.strategy.budgetEstimate.low.toLocaleString()} - ${data.strategy.budgetEstimate.high.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Risk Profile</h3>
            {data.strategy?.risks.length ? (
              <div className="space-y-3">
                {data.strategy.risks.slice(0, 3).map((risk, i) => (
                  <div key={i} className="flex items-start gap-2 bg-rose-50 p-3 rounded-lg text-sm text-rose-800 border border-rose-100">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{risk.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No risks analyzed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
