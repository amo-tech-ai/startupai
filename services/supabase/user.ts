
import { supabase } from '../../lib/supabaseClient';
import { UserProfile } from '../../types';
import { mapUserProfileFromDB, mapUserProfileToDB } from '../../lib/mappers';

export const UserService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (!supabase) return null;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return data ? mapUserProfileFromDB(data) : null;
  },

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    if (!supabase) return;

    const payload = mapUserProfileToDB(data);
    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', userId);

    if (error) throw error;
  }
};
