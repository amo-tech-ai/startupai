
import { supabase } from '../../lib/supabaseClient';
import { Deal, Task } from '../../types';
import { mapDealFromDB, mapDealToDB, mapTaskFromDB, mapTaskToDB } from '../../lib/mappers';

export const CrmService = {
  /**
   * DEALS
   */
  async getDeals(startupId: string): Promise<Deal[]> {
    if (!supabase) return [];
    
    const { data } = await supabase
        .from('crm_deals')
        .select('*')
        .eq('startup_id', startupId);
        
    return data ? data.map(mapDealFromDB) : [];
  },

  async createDeal(deal: Omit<Deal, 'id' | 'startupId'>, startupId: string): Promise<string> {
    if (!supabase) throw new Error("No backend");

    const payload = mapDealToDB(deal, startupId);
    
    const { data, error } = await supabase
        .from('crm_deals')
        .insert(payload)
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
  },

  async updateDeal(id: string, updates: Partial<Deal>): Promise<void> {
    if (!supabase) return;
    const payload = mapDealToDB(updates);
    await supabase.from('crm_deals').update(payload).eq('id', id);
  },

  /**
   * TASKS
   */
  async getTasks(startupId: string): Promise<Task[]> {
      if (!supabase) return [];
      const { data } = await supabase.from('tasks').select('*').eq('startup_id', startupId);
      return data ? data.map(mapTaskFromDB) : [];
  },

  async createTask(task: Omit<Task, 'id' | 'startupId'>, startupId: string): Promise<void> {
      if (!supabase) return;
      const payload = mapTaskToDB(task, startupId);
      await supabase.from('tasks').insert(payload);
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
      if (!supabase) return;
      const payload = mapTaskToDB(updates);
      await supabase.from('tasks').update(payload).eq('id', id);
  },

  async deleteTask(id: string): Promise<void> {
      if (!supabase) return;
      await supabase.from('tasks').delete().eq('id', id);
  }
};
