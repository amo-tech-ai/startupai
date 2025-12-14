import { supabase } from '../../../lib/supabaseClient';
import { EventAsset } from '../../../types';
import { generateUUID } from '../../../lib/utils';

export const EventAssetService = {
  async createAsset(asset: Omit<EventAsset, 'id' | 'createdAt'>): Promise<EventAsset | null> {
      if (!supabase) {
          const newAsset = { ...asset, id: generateUUID(), createdAt: new Date().toISOString() };
          const existing = JSON.parse(localStorage.getItem('guest_event_assets') || '[]');
          localStorage.setItem('guest_event_assets', JSON.stringify([...existing, newAsset]));
          return newAsset;
      }

      const { data, error } = await supabase
          .from('event_assets')
          .insert({
              event_id: asset.eventId,
              type: asset.type,
              content: asset.content, // Stores text or image URL
              title: asset.title
          })
          .select()
          .single();

      if (error) return null;
      return {
          id: data.id,
          eventId: data.event_id,
          type: data.type,
          content: data.content,
          title: data.title || '',
          createdAt: data.created_at
      };
  },

  async getAssets(eventId: string): Promise<EventAsset[]> {
      if (!supabase) {
          const local = JSON.parse(localStorage.getItem('guest_event_assets') || '[]');
          return local.filter((a: any) => a.eventId === eventId);
      }

      const { data, error } = await supabase
          .from('event_assets')
          .select('*')
          .eq('event_id', eventId)
          .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((a: any) => ({
          id: a.id,
          eventId: a.event_id,
          type: a.type,
          content: a.content,
          title: a.title || '',
          createdAt: a.created_at
      }));
  },

  async deleteAsset(assetId: string): Promise<void> {
      if (!supabase) {
          const local = JSON.parse(localStorage.getItem('guest_event_assets') || '[]');
          const updated = local.filter((a: any) => a.id !== assetId);
          localStorage.setItem('guest_event_assets', JSON.stringify(updated));
          return;
      }
      await supabase.from('event_assets').delete().eq('id', assetId);
  }
};