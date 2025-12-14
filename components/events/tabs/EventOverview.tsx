
import React, { useState } from 'react';
import { Target, AlertTriangle, CheckCircle2, Clock, Wallet, Users, Award, BarChart3, Loader2 } from 'lucide-react';
import { EventData, EventTask } from '../../../types';
import { EventAI } from '../../../services/eventAI';
import { EventService } from '../../../services/supabase/events';
import { API_KEY } from '../../../lib/env';
import { useToast } from '../../../context/ToastContext';

interface EventOverviewProps {
  event: EventData;
  tasks: EventTask[];
  onReload: () => void;
}

export const EventOverview: React.FC<EventOverviewProps> = ({ event, tasks, onReload }) => {
  const { toast, success, error } = useToast();
  const [isGeneratingROI, setIsGeneratingROI] = useState(false);
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const progress = Math.round((completedTasks / Math.max(tasks.length, 1)) * 100);

  const handleGenerateROI = async () => {
      if (!API_KEY) {
          error("API Key missing. Please configure your environment.");
          return;
      }
      if (!event.id) return;
      
      setIsGeneratingROI(true);
      toast("Analyzing event performance...", "info");

      try {
          // Assume 100 attendees for demo if not tracked
          // In real app, we'd count from the attendees table
          const attendees = await EventService.getAttendees(event.id);
          const attendeeCount = attendees.length || 50; 

          const roi = await EventAI.generateROI(API_KEY, event, attendeeCount);
          if (roi) {
              await EventService.updateEvent(event.id, { roi });
              success("ROI Report generated!");
              onReload(); // Trigger parent refresh instead of window reload
          } else {
              error("Could not generate report. Try again.");
          }
      } catch (e) {
          error("Failed to generate report.");
      } finally {
          setIsGeneratingROI(false);
      }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
        
        {/* Main Info */}
        <div className="md:col-span-2 space-y-8">
            
            {/* ROI Report (If Completed) */}
            {event.status === 'Completed' && (
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-24 bg-white/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-2">
                                <Award size={24} className="text-yellow-400" />
                                <h3 className="text-xl font-bold">Post-Event Intelligence</h3>
                            </div>
                            {!event.roi && (
                                <button 
                                    onClick={handleGenerateROI}
                                    disabled={isGeneratingROI}
                                    className="px-4 py-2 bg-white text-indigo-900 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2"
                                >
                                    {isGeneratingROI ? <Loader2 size={16} className="animate-spin" /> : <BarChart3 size={16} />}
                                    Generate Report
                                </button>
                            )}
                        </div>

                        {event.roi ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                        <div className="text-xs text-indigo-200 uppercase font-bold">Success Score</div>
                                        <div className="text-3xl font-bold">{event.roi.score}/100</div>
                                    </div>
                                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                        <div className="text-xs text-indigo-200 uppercase font-bold">Cost / Attendee</div>
                                        <div className="text-3xl font-bold">${event.roi.costPerAttendee}</div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-indigo-200 uppercase mb-2">Analysis</h4>
                                    <p className="text-sm text-indigo-50 leading-relaxed">{event.roi.summary}</p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-bold text-xs text-green-400 uppercase mb-2">Highlights</h4>
                                        <ul className="space-y-1 text-xs text-slate-300">
                                            {event.roi.highlights.map((h, i) => <li key={i}>• {h}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs text-amber-400 uppercase mb-2">Improvements</h4>
                                        <ul className="space-y-1 text-xs text-slate-300">
                                            {event.roi.improvements.map((h, i) => <li key={i}>• {h}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-indigo-200 text-sm">
                                Event marked as completed. Generate a comprehensive ROI analysis to close the loop.
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Target size={20} className="text-indigo-600" /> Objective
                </h3>
                <p className="text-slate-600 leading-relaxed">
                    {event.description}
                </p>
                
                {event.strategy && (
                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Target Audience</div>
                            <p className="text-sm font-medium text-slate-800">{event.strategy.audienceProfile}</p>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Themes</div>
                            <div className="flex flex-wrap gap-1">
                                {event.strategy.suggestedThemes.map((theme, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded border border-indigo-100">{theme}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Risk Radar */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-amber-500" /> Risk Watch
                </h3>
                <div className="space-y-3">
                    {event.strategy?.risks.map((risk, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-900">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${risk.severity === 'High' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                            <span className="font-bold">{risk.title}</span>
                            <span className="ml-auto text-xs uppercase font-bold opacity-60">{risk.severity}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
            
            {/* Progress */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" /> Progress
                </h3>
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold text-slate-900">{progress}%</span>
                    <span className="text-sm text-slate-500 mb-1">Ready</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                    <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                    <span>{completedTasks} Done</span>
                    <span>{tasks.length - completedTasks} Remaining</span>
                </div>
            </div>

            {/* Logistics Snapshot */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Clock size={18} /></div>
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Duration</div>
                        <div className="font-bold text-slate-900">{event.duration} Hours</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Wallet size={18} /></div>
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Budget Est.</div>
                        <div className="font-bold text-slate-900">${event.budget_total?.toLocaleString()}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Users size={18} /></div>
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Type</div>
                        <div className="font-bold text-slate-900">{event.type}</div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};
