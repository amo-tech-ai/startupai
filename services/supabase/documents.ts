
import { supabase } from '../../lib/supabaseClient';
import { InvestorDoc } from '../../types';
import { mapDocFromDB } from '../../lib/mappers';

export const DocumentService = {
  async getAll(startupId: string): Promise<InvestorDoc[]> {
    if (!supabase) return [];
    
    const { data } = await supabase
        .from('investor_docs')
        .select('*')
        .eq('startup_id', startupId)
        .order('updated_at', { ascending: false });

    return data ? data.map(mapDocFromDB) : [];
  },

  async create(doc: Omit<InvestorDoc, 'id' | 'startupId' | 'updatedAt'>, startupId: string, userId: string): Promise<string> {
    if (!supabase) throw new Error("No Backend");

    const { data, error } = await supabase.from('investor_docs').insert({
        startup_id: startupId,
        user_id: userId,
        title: doc.title,
        type: doc.type,
        content: doc.content,
        status: doc.status
    }).select('id').single();

    if (error) throw error;
    return data.id;
  },

  async update(id: string, updates: Partial<InvestorDoc>): Promise<void> {
    if (!supabase) return;

    const payload: any = {};
    if (updates.title) payload.title = updates.title;
    if (updates.status) payload.status = updates.status;
    if (updates.content) payload.content = updates.content;
    payload.updated_at = new Date().toISOString();

    const { error } = await supabase.from('investor_docs').update(payload).eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    if (!supabase) return;
    await supabase.from('investor_docs').delete().eq('id', id);
  }
};
