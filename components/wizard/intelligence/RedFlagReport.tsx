
import React from 'react';
import { AlertOctagon, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RedFlagReportProps {
  analysis: {
    overall_risk_level: string;
    risk_summary: string;
    issues: Array<{
      severity: string;
      category: string;
      title: string;
      description: string;
      fix: string;
    }>;
    strengths: string[];
  } | null;
  isLoading: boolean;
}

export const RedFlagReport: React.FC<RedFlagReportProps> = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 animate-pulse text-white">
        <div className="h-6 bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-800 rounded w-full"></div>
          <div className="h-20 bg-slate-800 rounded w-full mt-4"></div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const isCritical = analysis.overall_risk_level === 'Critical' || analysis.overall_risk_level === 'High';
  const riskColor = isCritical ? 'text-rose-500' : analysis.overall_risk_level === 'Medium' ? 'text-amber-500' : 'text-emerald-500';

  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden text-slate-200">
        <div className="p-6 border-b border-slate-800 bg-slate-950">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ShieldCheck className={riskColor} size={20} />
                        Due Diligence Audit
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">{analysis.risk_summary}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${isCritical ? 'bg-rose-950 border-rose-900 text-rose-500' : 'bg-emerald-950 border-emerald-900 text-emerald-500'}`}>
                    Risk: {analysis.overall_risk_level}
                </div>
            </div>
        </div>

        <div className="p-6 space-y-6">
            {/* Issues List */}
            {analysis.issues.length > 0 ? (
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Red Flags Detected</h4>
                    {analysis.issues.map((issue, idx) => (
                        <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex gap-4">
                            <div className="mt-1 shrink-0">
                                {issue.severity === 'Critical' ? (
                                    <AlertOctagon className="text-rose-500" size={20} />
                                ) : (
                                    <AlertTriangle className="text-amber-500" size={20} />
                                )}
                            </div>
                            <div>
                                <h5 className="font-bold text-slate-200 text-sm mb-1">{issue.title}</h5>
                                <p className="text-sm text-slate-400 mb-2 leading-relaxed">{issue.description}</p>
                                <div className="text-xs bg-slate-900/50 inline-block px-3 py-1.5 rounded border border-slate-700 text-indigo-400 font-medium">
                                    💡 Fix: {issue.fix}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-slate-500 italic">
                    No critical issues found. You look solid.
                </div>
            )}

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Key Strengths</h4>
                    <div className="flex flex-wrap gap-2">
                        {analysis.strengths.map((str, idx) => (
                            <span key={idx} className="px-3 py-1.5 bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 text-xs font-medium rounded-lg flex items-center gap-1.5">
                                <CheckCircle2 size={12} /> {str}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
