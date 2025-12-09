
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../context/ToastContext';

// Define exact input shape expected by Edge Function
interface UpdateProfilePayload {
  startup_id: string;
  context?: Record<string, any>;
  founders?: any[];
  metrics?: Record<string, any>;
  competitors?: string[];
}

export const useSaveStartupProfile = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { success, error: toastError } = useToast();

  const saveProfile = async (payload: UpdateProfilePayload) => {
    setIsSaving(true);
    try {
      if (!supabase) {
        // Fallback for demo/offline mode
        console.warn("Falling back to local simulation for save (Supabase not initialized).");
        await new Promise(r => setTimeout(r, 1000));
        success("Profile saved (Local)");
        return { success: true };
      }

      const { data, error } = await supabase.functions.invoke('update-startup-profile', {
        body: payload
      });

      if (error) throw error;

      success("Profile saved successfully");
      return data;
    } catch (err: any) {
      console.error('Save Profile Error:', err);
      // Simulate success in dev if edge function isn't reachable to avoid blocking UI
      if (import.meta.env.DEV) {
          success("Profile saved (Dev Simulation)");
          return { success: true };
      }
      toastError("Failed to save changes. " + (err.message || ""));
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveProfile, isSaving };
};
