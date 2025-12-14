
import React, { useState, useEffect } from 'react';
import { Users, Plus, Download, Search, Mail, Tag, CheckCircle2, Circle } from 'lucide-react';
import { EventData, EventAttendee } from '../../../types';
import { EventService } from '../../../services/supabase/events';
import { useToast } from '../../../context/ToastContext';

interface EventAttendeesProps {
  event: EventData;
}

export const EventAttendees: React.FC<EventAttendeesProps> = ({ event }) => {
  const { success, error } = useToast();
  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const [newAttendee, setNewAttendee] = useState({ name: '', email: '', ticketType: 'General' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
      if (event.id) {
          EventService.getAttendees(event.id).then(setAttendees);
      }
  }, [event.id]);

  const handleAdd = async () => {
      if (!newAttendee.name || !newAttendee.email || !event.id) return;
      
      const added = await EventService.addAttendee({
          eventId: event.id,
          name: newAttendee.name,
          email: newAttendee.email,
          ticketType: newAttendee.ticketType,
          status: 'Registered'
      });

      if (added) {
          setAttendees(prev => [...prev, added]);
          setIsAdding(false);
          setNewAttendee({ name: '', email: '', ticketType: 'General' });
          success("Guest registered!");
      }
  };

  const toggleCheckIn = async (id: string) => {
      const current = attendees.find(a => a.id === id);
      if (!current) return;

      const newStatus = current.status === 'Attended' ? 'Registered' : 'Attended';
      
      // Optimistic update
      setAttendees(prev => prev.map(a => 
          a.id === id ? { ...a, status: newStatus } : a
      ));

      try {
          await EventService.updateAttendee(id, { status: newStatus });
      } catch (e) {
          console.error(e);
          error("Failed to update status");
          // Revert
          setAttendees(prev => prev.map(a => 
              a.id === id ? { ...a, status: current.status } : a
          ));
      }
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex gap-4">
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 shadow-sm">
                    {attendees.length} Registered
                </div>
                <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 text-sm font-bold text-emerald-700 shadow-sm">
                    {attendees.filter(a => a.status === 'Attended').length} Checked In
                </div>
            </div>
            
            <div className="flex gap-3">
                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50">
                    <Download size={18} />
                </button>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={16} /> Add Guest
                </button>
            </div>
        </div>

        {isAdding && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-lg animate-in fade-in slide-in-from-top-2">
                <h4 className="text-sm font-bold text-slate-900 mb-3">New Registration</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input 
                        placeholder="Full Name"
                        className="p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                        value={newAttendee.name}
                        onChange={e => setNewAttendee({...newAttendee, name: e.target.value})}
                    />
                    <input 
                        placeholder="Email"
                        type="email"
                        className="p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                        value={newAttendee.email}
                        onChange={e => setNewAttendee({...newAttendee, email: e.target.value})}
                    />
                    <select
                        className="p-2 border border-slate-200 rounded-lg text-sm outline-none bg-white"
                        value={newAttendee.ticketType}
                        onChange={e => setNewAttendee({...newAttendee, ticketType: e.target.value})}
                    >
                        <option value="General">General Admission</option>
                        <option value="VIP">VIP</option>
                        <option value="Speaker">Speaker</option>
                        <option value="Press">Press</option>
                    </select>
                    <button 
                        onClick={handleAdd}
                        className="bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800"
                    >
                        Register
                    </button>
                </div>
            </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 w-12"></th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Ticket</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4 text-right">Registered</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {attendees.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    <Users size={32} className="mx-auto mb-2 opacity-50" />
                                    No attendees registered yet.
                                </td>
                            </tr>
                        ) : (
                            attendees.map((attendee) => (
                                <tr key={attendee.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => toggleCheckIn(attendee.id)}>
                                    <td className="px-6 py-3">
                                        <button 
                                            className={`p-1 rounded-full transition-colors ${
                                                attendee.status === 'Attended' ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-300 hover:text-slate-400'
                                            }`}
                                        >
                                            {attendee.status === 'Attended' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-3 font-bold text-slate-900">
                                        {attendee.name}
                                        {attendee.status === 'Attended' && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Checked In</span>}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`text-xs px-2 py-1 rounded border font-medium ${
                                            attendee.ticketType === 'VIP' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                            attendee.ticketType === 'Speaker' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            'bg-slate-50 text-slate-600 border-slate-100'
                                        }`}>
                                            {attendee.ticketType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-slate-500 flex items-center gap-2">
                                        <Mail size={14} /> {attendee.email}
                                    </td>
                                    <td className="px-6 py-3 text-right text-slate-400 text-xs">
                                        {new Date(attendee.registeredAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};
