
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Loader2, LayoutGrid, Palette, Info, DollarSign, PieChart, Users, CheckCircle } from 'lucide-react';
import { useEventDetails } from '../../hooks/useEventDetails';
import { EventOverview } from './tabs/EventOverview';
import { EventTasks } from './tabs/EventTasks';
import { EventMarketing } from './tabs/EventMarketing';
import { EventBudget } from './tabs/EventBudget';
import { EventAttendees } from './tabs/EventAttendees';
import { EventService } from '../../services/supabase/events';
import { useToast } from '../../context/ToastContext';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { event, tasks, loading, reload, toggleTaskStatus } = useEventDetails(id);
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'marketing' | 'budget' | 'attendees'>('overview');
  const [statusLoading, setStatusLoading] = useState(false);

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5]">
              <Loader2 size={32} className="animate-spin text-indigo-600" />
          </div>
      );
  }

  if (!event) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F5]">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Event Not Found</h2>
          <button onClick={() => navigate('/events')} className="text-indigo-600 hover:underline">Back to Events</button>
      </div>
  );

  const daysToGo = Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const toggleStatus = async () => {
      if (!id) return;
      setStatusLoading(true);
      const newStatus = event.status === 'Completed' ? 'Planning' : 'Completed';
      
      await EventService.updateEvent(id, { status: newStatus });
      success(`Event marked as ${newStatus}`);
      await reload();
      setStatusLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col font-sans text-slate-900">
        
        {/* HEADER */}
        <div className="bg-white border-b border-[#E5E5E5] px-6 py-6 shadow-sm sticky top-0 z-30">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => navigate('/events')} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#1A1A1A]">{event.name}</h1>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(event.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin size={14} /> {event.city}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${daysToGo > 0 ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                {daysToGo > 0 ? `${daysToGo} Days Away` : 'Completed'}
                            </span>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                        <button 
                            onClick={toggleStatus}
                            disabled={statusLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                event.status === 'Completed' 
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            }`}
                        >
                            {statusLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                            {event.status === 'Completed' ? 'Reopen Event' : 'Mark Complete'}
                        </button>
                    </div>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-1">
                    <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Info size={16}/>} label="Overview" />
                    <TabButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon={<LayoutGrid size={16}/>} label="Tasks" />
                    <TabButton active={activeTab === 'marketing'} onClick={() => setActiveTab('marketing')} icon={<Palette size={16}/>} label="Marketing" />
                    <TabButton active={activeTab === 'budget'} onClick={() => setActiveTab('budget')} icon={<DollarSign size={16}/>} label="Budget" />
                    <TabButton active={activeTab === 'attendees'} onClick={() => setActiveTab('attendees')} icon={<Users size={16}/>} label="Guest List" />
                </div>
            </div>
        </div>

        {/* CONTENT */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
            {activeTab === 'overview' && <EventOverview event={event} tasks={tasks} onReload={reload} />}
            {activeTab === 'tasks' && <EventTasks tasks={tasks} onToggleStatus={toggleTaskStatus} />}
            {activeTab === 'marketing' && <EventMarketing event={event} />}
            {activeTab === 'budget' && <EventBudget event={event} />}
            {activeTab === 'attendees' && <EventAttendees event={event} />}
        </main>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`pb-3 flex items-center gap-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
            active ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
        }`}
    >
        {icon} {label}
    </button>
);

export default EventDetailsPage;
