
import { generateShortId } from '../../../lib/utils';
import { Deal, Task, StartupProfile } from '../../../types';
import { CrmService } from '../../../services/supabase/crm';

interface CrmActionsProps {
  profile: StartupProfile | null;
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  isGuestMode: () => boolean;
}

export const useCrmActions = ({
  profile,
  setDeals,
  setTasks,
  isGuestMode
}: CrmActionsProps) => {

  const persistGuestData = (key: string, data: any) => {
    if (isGuestMode()) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // --- DEALS ---
  const addDeal = async (data: Omit<Deal, 'id' | 'startupId'>) => {
      const tempId = generateShortId();
      const newDeal = { ...data, id: tempId, startupId: profile?.id || 'temp' };
      
      setDeals(prev => {
          const newState = [...prev, newDeal];
          persistGuestData('guest_deals', newState);
          return newState;
      });
      
      if (profile?.id && !isGuestMode()) {
          try {
              const realId = await CrmService.createDeal(data, profile.id);
              setDeals(prev => prev.map(d => d.id === tempId ? { ...d, id: realId } : d));
          } catch(e) { console.error(e); }
      }
  };

  const updateDeal = async (id: string, updates: Partial<Deal>) => {
      setDeals(prev => {
          const newState = prev.map(d => d.id === id ? { ...d, ...updates } : d);
          persistGuestData('guest_deals', newState);
          return newState;
      });
      if (profile?.id && !isGuestMode()) {
          await CrmService.updateDeal(id, updates);
      }
  };

  // --- TASKS ---
  const addTask = (data: Omit<Task, 'id' | 'startupId'>) => {
      const tempId = generateShortId();
      const newTask = { ...data, id: tempId, startupId: profile?.id || 'temp' };
      
      setTasks(prev => {
          const newState = [newTask, ...prev];
          persistGuestData('guest_tasks', newState);
          return newState;
      });
      
      if(profile?.id && !isGuestMode()) CrmService.createTask(data, profile.id);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
      setTasks(prev => {
          const newState = prev.map(t => t.id === id ? { ...t, ...updates } : t);
          persistGuestData('guest_tasks', newState);
          return newState;
      });
      if(profile?.id && !isGuestMode()) CrmService.updateTask(id, updates);
  };

  const deleteTask = (id: string) => {
      setTasks(prev => {
          const newState = prev.filter(t => t.id !== id);
          persistGuestData('guest_tasks', newState);
          return newState;
      });
      if(profile?.id && !isGuestMode()) CrmService.deleteTask(id);
  };

  return { addDeal, updateDeal, addTask, updateTask, deleteTask };
};
