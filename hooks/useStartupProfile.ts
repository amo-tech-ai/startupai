
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { StartupProfileDTO } from '../types';

export const useStartupProfile = (startupId?: string) => {
  const [data, setData] = useState<StartupProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!startupId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      // Call RPC
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_startup_profile', { p_startup_id: startupId });

      if (rpcError) throw rpcError;
      
      setData(rpcData as StartupProfileDTO);
    } catch (err: any) {
      console.error('Fetch Profile Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [startupId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { data, loading, error, reload: fetchProfile };
};
