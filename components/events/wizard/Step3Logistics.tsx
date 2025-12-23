
import React from 'react';
import { Calendar, MapPin, Sun, Map as MapIcon, Search, Building, ExternalLink, Star } from 'lucide-react';
import { EventLogisticsAnalysis } from '../../../types';

interface Step3LogisticsProps {
  date: string;
  city: string;
  logistics: EventLogisticsAnalysis | null;
  isLoading: boolean;
  onUpdate: (field: string, value: any) => void;
  onCheckConflicts: () => void;
}

export const Step3Logistics: React.FC<Step3LogisticsProps> = ({ 
  date, city, logistics, isLoading, onUpdate, onCheckConflicts 
}) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 pb-32">
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-slate-700 mb-2">Event Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="date" 
                value={date}
                onChange={(e) => onUpdate('date', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-slate-700 mb-2">Location / City</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={city}
                onChange={(e) => onUpdate('city', e.target.value)}
                placeholder="e.g. San Francisco"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <button 
            onClick={onCheckConflicts}
            disabled={isLoading || !date || !city}
            className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? 'Scanning...' : 'Analyze & Scout Venues'}
          </button>
        </div>
      </div>

      {logistics && (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Search size={20} className="text-purple-600" /> Conflict Radar
              </h3>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Search Grounded</span>
            </div>

            <div className="space-y-3">
              {logistics.conflicts.length > 0 ? logistics.conflicts.map((conflict, idx) => (
                <div key={idx} className={`p-3 rounded-xl border flex justify-between items-center ${
                  conflict.impact === 'High' ? 'bg-rose-50 border-rose-100 text-rose-900' : 'bg-amber-50 border-amber-100 text-amber-900'
                }`}>
                  <div>
                    <div className="font-bold text-sm">{conflict.name}</div>
                    <div className="text-xs opacity-80">{conflict.date}</div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 bg-white/50 rounded">
                    {conflict.impact} Impact
                  </span>
                </div>
              )) : (
                <div className="p-4 text-center text-slate-400 italic text-sm">No conflicts found.</div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Sun size={20} className="text-amber-500" /> Environment
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {logistics.weatherForecast}
              </p>
            </div>
          </div>

          {logistics.suggestedVenues && (
            <div className="md:col-span-2 bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
               <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-4">
                  <MapIcon size={20} className="text-indigo-600" /> AI Grounded Venue Scout
               </h3>
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {logistics.suggestedVenues.map((venue, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100 flex flex-col h-full group hover:shadow-md transition-all">
                          <div className="flex justify-between items-start mb-3">
                              <div>
                                  <h4 className="font-bold text-slate-900 leading-tight">{venue.name}</h4>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">{venue.cost} • {venue.capacity}</div>
                              </div>
                              {venue.mapsUri && (
                                  <a href={venue.mapsUri} target="_blank" rel="noreferrer" className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors">
                                      <ExternalLink size={14} />
                                  </a>
                              )}
                          </div>
                          
                          <div className="flex-1 space-y-3">
                              <p className="text-xs text-slate-600 leading-relaxed italic">"{venue.notes}"</p>
                              {venue.reviewSnippets && (
                                  <div className="bg-slate-50 p-2 rounded-lg space-y-1">
                                      {venue.reviewSnippets.slice(0, 2).map((s, i) => (
                                          <div key={i} className="flex gap-2 items-start text-[10px] text-slate-500">
                                              <Star size={10} className="text-amber-400 mt-0.5 shrink-0" fill="currentColor" />
                                              <span className="line-clamp-2">{s}</span>
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>
                          
                          <button 
                            className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onUpdate('venueUrls', [...(date as any).venueUrls || [], venue.mapsUri])}
                          >
                            Select Venue
                          </button>
                      </div>
                  ))}
               </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
