
import { supabase } from '../../lib/supabaseClient';
import { EventData, EventTask } from '../../types';
import { generateUUID } from '../../lib/utils';

export const EventService = {
  
  async create(event: EventData, tasks: any[], startupId: string): Promise<string | null> {
    if (!supabase) {
        // Mock persistence for demo mode
        const mockId = generateUUID();
        const mockEvent = { ...event, id: mockId, startupId, status: 'Planning', createdAt: new Date().toISOString() };
        
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

    // 1. Create Event Record
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert({
        startup_id: startupId,
        name: event.name,
        type: event.type,
        start_date: event.date,
        location_data: { city: event.city, venueUrls: event.venueUrls },
        description: event.description,
        ai_analysis: { strategy: event.strategy, logistics: event.logistics },
        status: 'Planning',
        budget_total: event.strategy?.budgetEstimate?.high || 0
      })
      .select()
      .single();

    if (eventError) {
        console.error("Error creating event:", eventError);
        throw eventError;
    }

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
        city: e.location_data?.city || '',
        description: e.description,
        venueUrls: e.location_data?.venueUrls || [],
        sponsorUrls: [],
        inspirationUrls: [],
        searchTerms: [],
        status: e.status,
        strategy: e.ai_analysis?.strategy,
        logistics: e.ai_analysis?.logistics,
        budget_total: e.budget_total
    }));
  }
};
