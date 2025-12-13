
import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Plus, ArrowRight, Loader2, 
  MoreHorizontal, Users, DollarSign, Clock 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { EventService } from '../../services/supabase/events';
import { EventData } from '../../types';

export const EventsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useData();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
        if (profile?.id) {
            const data = await EventService.getAll(profile.id);
            setEvents(data);
        } else {
            // Load local if guest
            const local = JSON.parse(localStorage.getItem('guest_events') || '[]');
            setEvents(local);
        }
        setLoading(false);
    };
    loadEvents();
  }, [profile]);

  return (
    <div className="min-h-screen bg-[#F7F7F5] pb-20 p-6 md:p-12">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold uppercase tracking-wide">Events OS</span>
           </div>
           <h1 className="text-4xl font-serif font-bold text-[#1A1A1A]">Event Command Center</h1>
           <p className="text-[#6B7280] mt-2 font-light text-lg">
             Manage your demo days, mixers, and product launches.
           </p>
        </div>
        
        <button 
           onClick={() => navigate('/events/new')}
           className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-xl font-medium shadow-lg hover:bg-black transition-all hover:-translate-y-0.5"
        >
           <Plus size={18} /> New Event
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={32} className="animate-spin text-indigo-600" />
            </div>
        ) : events.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#E5E5E5] p-16 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Calendar size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No Events Yet</h3>
                <p className="text-[#6B7280] mb-6 max-w-md mx-auto">
                    Start planning your next big moment. Gemini 3 Pro will handle the strategy and logistics.
                </p>
                <button 
                   onClick={() => navigate('/events/new')}
                   className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                   Launch Event Wizard
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col h-full">
                        <div className="h-32 bg-slate-100 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1A1A1A] shadow-sm">
                                {event.status}
                            </div>
                        </div>
                        
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-4">
                                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">{event.type}</div>
                                <h3 className="text-xl font-bold text-[#1A1A1A] line-clamp-1">{event.name}</h3>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                                    <Calendar size={16} className="text-[#9CA3AF]" />
                                    <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                                    <MapPin size={16} className="text-[#9CA3AF]" />
                                    <span>{event.city}</span>
                                </div>
                                {event.budget_total && (
                                    <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                                        <DollarSign size={16} className="text-[#9CA3AF]" />
                                        <span>Budget: ${event.budget_total.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-4 border-t border-[#F3F4F6] flex justify-between items-center">
                                <button className="text-sm font-bold text-[#1A1A1A] hover:text-indigo-600 transition-colors flex items-center gap-1 group-hover:gap-2">
                                    Manage <ArrowRight size={16} />
                                </button>
                                <button className="p-2 hover:bg-[#F3F4F6] rounded-full text-[#9CA3AF] hover:text-[#1A1A1A] transition-colors">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default EventsDashboard;
