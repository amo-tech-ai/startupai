import React from 'react';
import { BookOpen, DollarSign, TrendingUp, AlertTriangle, ShieldCheck, Loader2, Swords, Globe, Lightbulb } from 'lucide-react';

interface DeepResearchViewProps {
  report: {
    executive_summary: string[];
    stage_inference: { stage: string; reasoning: string };
    traction_benchmarks: Array<{ metric: string; low: string; median: string; high: string; unit: string; citation: string }>;
    fundraising_benchmarks: Array<{ item: string; low: string; median: string; high: string; citation: string }>;
    valuation_references: Array<{ label: string; range: string; citation: string }>;
    competitor_analysis?: Array<{ name: string; differentiation: string; recent_moves: string }>;
    market_trends?: string[];
    red_flags_and_fixes: Array<{ flag: string; fix: string; timeline: string }>;
    confidence_score: { level: string; explanation: string };
  } | null;
  isLoading: boolean;
  loadingStatus?: string;
}

export const DeepResearchView: React.FC<DeepResearchViewProps> = ({ report, isLoading, loadingStatus }) => {
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <Loader2 size={32} className="animate-spin text-indigo-600 mb-4" />
            <span className="text-sm font-bold text-slate-700">{loadingStatus || "Initializing Agent..."}</span>
            <span className="text-xs text-slate-400 mt-2">This usually takes 15-20 seconds.</span>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Executive Summary */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <BookOpen size={20} className="text-purple-400" /> 
                    Investor Reality Check
                </h3>
                <span className={`text-xs px-2 py-1 rounded border ${report.confidence_score.level === 'High' ? 'bg-green-900 border-green-700 text-green-300' : 'bg-amber-900 border-amber-700 text-amber-300'}`}>
                    {report.confidence_score.level} Confidence
                </span>
            </div>
            <ul className="space-y-2">
                {report.executive_summary.map((item, i) => (
                    <li key={i} className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span> {item}
                    </li>
                ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
                Stage Inference: <strong className="text-slate-300">{report.stage_inference.stage}</strong> — {report.stage_inference.reasoning}
            </div>
        </div>

        {/* Competitor Analysis & Market Trends */}
        <div className="grid lg:grid-cols-2 gap-6">
            {report.competitor_analysis && report.competitor_analysis.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Swords size={18} className="text-blue-600" /> Competitive Landscape
                    </h4>
                    <div className="space-y-4">
                        {report.competitor_analysis.map((comp, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <h5 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                                    <Globe size={14} className="text-slate-400" /> {comp.name}
                                </h5>
                                <p className="text-xs text-slate-500 mb-2 leading-tight">{comp.recent_moves}</p>
                                <div className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded inline-block font-medium">
                                    Win: {comp.differentiation}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {report.market_trends && report.market_trends.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-indigo-600" /> Market Tailwinds
                    </h4>
                    <div className="grid gap-3">
                        {report.market_trends.map((trend, i) => (
                            <div key={i} className="flex gap-3 items-start bg-white/50 p-2 rounded-lg border border-white/50">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                                <p className="text-sm text-slate-700 leading-relaxed">{trend}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Benchmarks Grid */}
        <div className="grid md:grid-cols-2 gap-6">
            
            {/* Traction */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Lightbulb size={18} className="text-amber-500" /> Market Benchmarks (2024/25)
                </h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                            <tr>
                                <th className="px-2 py-2 text-left rounded-l-lg">Metric</th>
                                <th className="px-2 py-2 text-center">Median</th>
                                <th className="px-2 py-2 text-right rounded-r-lg">Source</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {report.traction_benchmarks.map((row, i) => (
                                <tr key={i}>
                                    <td className="px-2 py-3 font-medium text-slate-700">{row.metric}</td>
                                    <td className="px-2 py-3 text-center font-bold text-slate-900">{row.median} <span className="text-[10px] text-slate-400 font-normal">{row.unit}</span></td>
                                    <td className="px-2 py-3 text-right text-xs text-indigo-600 truncate max-w-[100px]" title={row.citation}>{row.citation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Fundraising */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <DollarSign size={18} className="text-green-600" /> Funding Norms
                </h4>
                <div className="space-y-4">
                    {report.fundraising_benchmarks.map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase">{item.item}</div>
                                <div className="text-lg font-bold text-slate-900">{item.median}</div>
                                <div className="text-[10px] text-slate-400">Range: {item.low} - {item.high}</div>
                            </div>
                            <div className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 max-w-[120px] truncate" title={item.citation}>
                                {item.citation}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100">
                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Valuation Comps</h5>
                    {report.valuation_references.map((v, i) => (
                        <div key={i} className="flex justify-between text-sm py-1">
                            <span className="text-slate-600">{v.label}</span>
                            <span className="font-bold text-slate-900">{v.range}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Red Flags */}
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
            <h4 className="font-bold text-rose-800 mb-4 flex items-center gap-2">
                <ShieldCheck size={18} /> Critical Fixes
            </h4>
            <div className="grid gap-3">
                {report.red_flags_and_fixes.map((flag, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm flex items-start gap-4">
                        <div className="mt-1">
                            <AlertTriangle size={16} className="text-rose-500" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 text-sm">{flag.flag}</div>
                            <div className="text-sm text-slate-600 mt-1">Fix: {flag.fix}</div>
                            <div className="text-[10px] text-slate-400 mt-2 font-mono uppercase">Timeline: {flag.timeline}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};