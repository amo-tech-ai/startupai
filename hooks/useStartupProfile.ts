
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { StartupProfileDTO } from '../types';
import { useToast } from '../context/ToastContext';

export const useStartupProfile = (startupId?: string) => {
  const [data, setData] = useState<StartupProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { error: toastError } = useToast();

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
      
      // Transform if necessary (RPC returns JSON)
      setData(rpcData as StartupProfileDTO);
    } catch (err: any) {
      console.error('Fetch Profile Error:', err);
      setError(err);
      // Don't toast error immediately on load to avoid spamming if offline
    } finally {
      setLoading(false);
    }
  }, [startupId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { data, loading, error, reload: fetchProfile };
};
