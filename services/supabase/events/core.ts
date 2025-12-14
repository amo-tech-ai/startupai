
import { supabase } from '../../../lib/supabaseClient';
import { EventData } from '../../../types';
import { generateUUID } from '../../../lib/utils';

export const EventCoreService = {
  
  async create(event: EventData, tasks: any[], startupId: string): Promise<string | null> {
    if (!supabase) {
        // Mock persistence for demo mode
        const mockId = generateUUID();
        const mockEvent = { ...event, id: mockId, startupId, status: 'Planning', isPublic: false, createdAt: new Date().toISOString() };
        
        // Save to local storage for persistence in demo
        const existing = JSON.parse(localStorage.getItem('guest_events') || '[]');
        localStorage.setItem('guest_events', JSON.stringify([...existing, mockEvent]));
        
        // Save tasks
        const mockTasks = tasks.map((t: any) => ({
            ...t,
            id: generateUUID(),
            eventId: mockId,
            status: 'todo',
            dueDate: new Date(new Date(event.date).getTime() - (t.daysBeforeEvent * 86400000)).toISOString()
        }));
        const existingTasks = JSON.parse(localStorage.getItem('guest_event_tasks') || '[]');
        localStorage.setItem('guest_event_tasks', JSON.stringify([...existingTasks, ...mockTasks]));

        return mockId;
    }

    try {
        // 1. Create Event Record
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .insert({
            startup_id: startupId,
            name: event.name,
            type: event.type,
            start_date: event.date,
            location_data: { city: event.city, venueUrls: event.venueUrls, duration: event.duration },
            description: event.description,
            ai_analysis: { strategy: event.strategy, logistics: event.logistics },
            status: 'Planning',
            is_public: false, // Default to private
            budget_total: event.strategy?.budgetEstimate?.high || 0
          })
          .select()
          .single();

        if (eventError) throw eventError;

        // 2. Create Tasks
        if (tasks.length > 0) {
            const taskPayloads = tasks.map((t: any) => ({
                event_id: eventData.id,
                title: t.title,
                phase: t.phase,
                status: 'todo',
                due_date: new Date(new Date(event.date).getTime() - (t.daysBeforeEvent * 86400000)).toISOString(),
                is_ai_generated: true
            }));

            const { error: taskError } = await supabase
                .from('event_tasks')
                .insert(taskPayloads);
                
            if (taskError) console.error("Error creating event tasks:", taskError);
        }

        return eventData.id;
    } catch (error) {
        console.error("Event creation failed:", error);
        return null;
    }
  },

  async updateEvent(id: string, updates: Partial<EventData>): Promise<void> {
      if (!supabase) {
          const events = JSON.parse(localStorage.getItem('guest_events') || '[]');
          const updated = events.map((e: any) => {
              if (e.id !== id) return e;
              // Deep merge AI analysis if present
              const newAnalysis = updates.roi ? { ...e.strategy, ...e.logistics, roi: updates.roi } : (e.strategy || e.logistics);
              
              return { 
                  ...e, 
                  ...updates, 
                  strategy: newAnalysis // Mock structure flattening
              };
          });
          localStorage.setItem('guest_events', JSON.stringify(updated));
          return;
      }

      // Map partial updates to DB columns
      const dbPayload: any = {};
      if (updates.status) dbPayload.status = updates.status;
      if (updates.name) dbPayload.name = updates.name;
      if (updates.description) dbPayload.description = updates.description;
      if (updates.isPublic !== undefined) dbPayload.is_public = updates.isPublic;
      
      if (updates.roi) {
          const { data: current } = await supabase.from('events').select('ai_analysis').eq('id', id).single();
          const currentAnalysis = current?.ai_analysis || {};
          dbPayload.ai_analysis = { ...currentAnalysis, roi: updates.roi };
      }
      
      if (Object.keys(dbPayload).length > 0) {
          await supabase.from('events').update(dbPayload).eq('id', id);
      }
  },

  async getAll(startupId: string): Promise<EventData[]> {
    if (!supabase) {
        const local = localStorage.getItem('guest_events');
        return local ? JSON.parse(local) : [];
    }

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('startup_id', startupId)
        .order('start_date', { ascending: true });

    if (error || !data) return [];

    return data.map((e: any) => ({
        id: e.id,
        startupId: e.startup_id,
        name: e.name,
        type: e.type,
        date: e.start_date,
        duration: e.location_data?.duration || 4,
        city: e.location_data?.city || '',
        description: e.description,
        venueUrls: e.location_data?.venueUrls || [],
        sponsorUrls: [],
        inspirationUrls: [],
        searchTerms: [],
        status: e.status,
        isPublic: e.is_public,
        strategy: e.ai_analysis?.strategy,
        logistics: e.ai_analysis?.logistics,
        roi: e.ai_analysis?.roi, // Map ROI
        budget_total: e.budget_total,
        budget_items: e.budget_data?.items || []
    }));
  },

  async getById(id: string): Promise<EventData | null> {
      if (!supabase) {
          const local = JSON.parse(localStorage.getItem('guest_events') || '[]');
          return local.find((e: any) => e.id === id) || null;
      }

      const { data: e, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

      if (error || !e) return null;

      return {
        id: e.id,
        startupId: e.startup_id,
        name: e.name,
        type: e.type,
        date: e.start_date,
        duration: e.location_data?.duration || 4,
        city: e.location_data?.city || '',
        description: e.description,
        venueUrls: e.location_data?.venueUrls || [],
        sponsorUrls: [],
        inspirationUrls: [],
        searchTerms: [],
        status: e.status,
        isPublic: e.is_public,
        strategy: e.ai_analysis?.strategy,
        logistics: e.ai_analysis?.logistics,
        roi: e.ai_analysis?.roi, // Map ROI
        budget_total: e.budget_total,
        budget_items: e.budget_data?.items || []
      };
  },

  async deleteEvent(id: string): Promise<void> {
      if (!supabase) {
          const events = JSON.parse(localStorage.getItem('guest_events') || '[]');
          localStorage.setItem('guest_events', JSON.stringify(events.filter((e: any) => e.id !== id)));
          return;
      }
      await supabase.from('events').delete().eq('id', id);
  }
};
