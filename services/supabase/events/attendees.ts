import { supabase } from '../../../lib/supabaseClient';
import { EventAttendee } from '../../../types';
import { generateUUID } from '../../../lib/utils';

export const EventAttendeeService = {
  async getAttendees(eventId: string): Promise<EventAttendee[]> {
      if (!supabase) {
          const attendees = JSON.parse(localStorage.getItem('guest_event_attendees') || '[]');
          return attendees.filter((a: any) => a.eventId === eventId);
      }

      const { data } = await supabase
          .from('event_registrations')
          .select('*')
          .eq('event_id', eventId);

      return data ? data.map((a: any) => ({
          id: a.id,
          eventId: a.event_id,
          name: a.name || 'Guest',
          email: a.email || '',
          status: a.status,
          ticketType: a.ticket_type || 'General',
          registeredAt: a.registered_at
      })) : [];
  },

  async addAttendee(attendee: Omit<EventAttendee, 'id' | 'registeredAt'>): Promise<EventAttendee | null> {
      if (!supabase) {
          const newAttendee = { 
              ...attendee, 
              id: generateUUID(), 
              registeredAt: new Date().toISOString() 
          };
          const existing = JSON.parse(localStorage.getItem('guest_event_attendees') || '[]');
          localStorage.setItem('guest_event_attendees', JSON.stringify([...existing, newAttendee]));
          return newAttendee;
      }

      const { data, error } = await supabase.from('event_registrations').insert({
          event_id: attendee.eventId,
          user_id: null, // Anonymous / manual entry
          name: attendee.name,
          email: attendee.email,
          ticket_type: attendee.ticketType,
          status: attendee.status
      }).select().single();

      if (error) return null;

      return {
          id: data.id,
          eventId: data.event_id,
          name: data.name,
          email: data.email,
          status: data.status,
          ticketType: data.ticket_type,
          registeredAt: data.registered_at
      };
  },

  async updateAttendee(attendeeId: string, updates: Partial<EventAttendee>): Promise<void> {
      if (!supabase) {
          const local = JSON.parse(localStorage.getItem('guest_event_attendees') || '[]');
          const updated = local.map((a: any) => a.id === attendeeId ? { ...a, ...updates } : a);
          localStorage.setItem('guest_event_attendees', JSON.stringify(updated));
          return;
      }
      const dbPayload: any = {};
      if (updates.status) dbPayload.status = updates.status;
      if (updates.ticketType) dbPayload.ticket_type = updates.ticketType;
      
      await supabase.from('event_registrations').update(dbPayload).eq('id', attendeeId);
  },

  async deleteAttendee(attendeeId: string): Promise<void> {
      if (!supabase) {
          const local = JSON.parse(localStorage.getItem('guest_event_attendees') || '[]');
          const updated = local.filter((a: any) => a.id !== attendeeId);
          localStorage.setItem('guest_event_attendees', JSON.stringify(updated));
          return;
      }
      await supabase.from('event_registrations').delete().eq('id', attendeeId);
  }
};