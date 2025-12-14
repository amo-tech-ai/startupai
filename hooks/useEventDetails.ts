
import { useState, useEffect, useCallback } from 'react';
import { EventService } from '../services/supabase/events';
import { EventData, EventTask } from '../types';

export const useEventDetails = (id?: string) => {
  const [event, setEvent] = useState<EventData | null>(null);
  const [tasks, setTasks] = useState<EventTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [eventData, taskData] = await Promise.all([
        EventService.getById(id),
        EventService.getTasks(id)
      ]);
      
      setEvent(eventData);
      setTasks(taskData);
    } catch (err: any) {
      console.error("Failed to load event details:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t));
    
    try {
        await EventService.updateTask(taskId, { status: newStatus as any });
    } catch (e) {
        console.error("Failed to update task", e);
        // Revert on error
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: currentStatus as any } : t));
    }
  };

  return { event, tasks, loading, error, reload: loadData, toggleTaskStatus };
};
