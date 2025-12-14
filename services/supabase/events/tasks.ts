import { supabase } from '../../../lib/supabaseClient';
import { EventTask } from '../../../types';
import { generateUUID } from '../../../lib/utils';

export const EventTaskService = {
  async getTasks(eventId: string): Promise<EventTask[]> {
      if (!supabase) {
          const local = JSON.parse(localStorage.getItem('guest_event_tasks') || '[]');
          return local.filter((t: any) => t.eventId === eventId);
      }

      const { data, error } = await supabase
          .from('event_tasks')
          .select('*')
          .eq('event_id', eventId)
          .order('due_date', { ascending: true });

      if (error || !data) return [];

      return data.map((t: any) => ({
          id: t.id,
          eventId: t.event_id,
          title: t.title,
          phase: t.phase,
          status: t.status,
          dueDate: t.due_date,
          assignee: t.assignee,
          is_ai_generated: t.is_ai_generated
      }));
  },

  async createTask(task: Omit<EventTask, 'id'>): Promise<EventTask | null> {
      if (!supabase) {
          const newTask = { ...task, id: generateUUID() };
          const local = JSON.parse(localStorage.getItem('guest_event_tasks') || '[]');
          localStorage.setItem('guest_event_tasks', JSON.stringify([...local, newTask]));
          return newTask as EventTask;
      }

      const { data, error } = await supabase
          .from('event_tasks')
          .insert({
              event_id: task.eventId,
              title: task.title,
              phase: task.phase,
              status: task.status,
              due_date: task.dueDate,
              assignee: task.assignee,
              is_ai_generated: task.is_ai_generated
          })
          .select()
          .single();

      if (error) return null;
      return {
          id: data.id,
          eventId: data.event_id,
          title: data.title,
          phase: data.phase,
          status: data.status,
          dueDate: data.due_date,
          assignee: data.assignee,
          is_ai_generated: data.is_ai_generated
      };
  },

  async updateTask(taskId: string, updates: Partial<EventTask>): Promise<void> {
      if (!supabase) {
          const local = JSON.parse(localStorage.getItem('guest_event_tasks') || '[]');
          const updated = local.map((t: any) => t.id === taskId ? { ...t, ...updates } : t);
          localStorage.setItem('guest_event_tasks', JSON.stringify(updated));
          return;
      }
      const dbPayload: any = {};
      if (updates.status) dbPayload.status = updates.status;
      if (updates.title) dbPayload.title = updates.title;
      if (updates.assignee) dbPayload.assignee = updates.assignee;
      
      await supabase.from('event_tasks').update(dbPayload).eq('id', taskId);
  },

  async deleteTask(taskId: string): Promise<void> {
      if (!supabase) {
          const local = JSON.parse(localStorage.getItem('guest_event_tasks') || '[]');
          const updated = local.filter((t: any) => t.id !== taskId);
          localStorage.setItem('guest_event_tasks', JSON.stringify(updated));
          return;
      }
      await supabase.from('event_tasks').delete().eq('id', taskId);
  }
};