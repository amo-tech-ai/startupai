
import { supabase } from '../../lib/supabaseClient';
import { StartupProfile, Founder } from '../../types';
import { mapProfileFromDB, mapProfileToDB, mapFounderFromDB, mapFounderToDB } from '../../lib/mappers';

export const ProfileService = {
  async getByUserId(userId: string): Promise<{ profile: StartupProfile | null, founders: Founder[] }> {
    if (!supabase) return { profile: null, founders: [] };

    const { data: profileData } = await supabase
      .from('startups')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!profileData) return { profile: null, founders: [] };

    const profile = mapProfileFromDB(profileData);

    const { data: founderData } = await supabase
      .from('startup_founders')
      .select('*')
      .eq('startup_id', profile.id);

    const founders = founderData ? founderData.map(mapFounderFromDB) : [];

    return { profile, founders };
  },

  async getById(id: string): Promise<{ profile: StartupProfile | null, founders: Founder[] }> {
    if (!supabase) return { profile: null, founders: [] };

    const { data: profileData } = await supabase
      .from('startups')
      .select('*')
      .eq('id', id)
      .single();

    if (!profileData) return { profile: null, founders: [] };

    const profile = mapProfileFromDB(profileData);

    const { data: founderData } = await supabase
      .from('startup_founders')
      .select('*')
      .eq('startup_id', profile.id);

    const founders = founderData ? founderData.map(mapFounderFromDB) : [];

    return { profile, founders };
  },

  async create(data: Partial<StartupProfile>, userId: string): Promise<StartupProfile> {
    if (!supabase) throw new Error("Supabase client not initialized");

    const payload = mapProfileToDB(data);
    payload.user_id = userId;

    const { data: newProfile, error } = await supabase
        .from('startups')
        .insert(payload)
        .select()
        .single();

    if (error) throw error;
    return mapProfileFromDB(newProfile);
  },

  async update(id: string, data: Partial<StartupProfile>): Promise<void> {
    if (!supabase) return;
    const payload = mapProfileToDB(data);
    const { error } = await supabase.from('startups').update(payload).eq('id', id);
    if (error) throw error;
  },

  async syncFounders(startupId: string, founders: Founder[]): Promise<void> {
    if (!supabase) return;

    // Strategy: Delete all for startup and re-insert. 
    // In production, upserting by ID is safer to preserve relationships.
    const { error: delError } = await supabase
        .from('startup_founders')
        .delete()
        .eq('startup_id', startupId);
    
    if (delError) throw delError;

    const payload = founders.map(f => mapFounderToDB(f, startupId));
    
    if (payload.length > 0) {
        const { error: insError } = await supabase.from('startup_founders').insert(payload);
        if (insError) throw insError;
    }
  },

  async deleteFounder(id: string): Promise<void> {
      if(!supabase) return;
      await supabase.from('startup_founders').delete().eq('id', id);
  }
};
