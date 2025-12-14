
import { supabase } from '../../lib/supabaseClient';

export const AssetService = {
  async uploadFile(file: File, bucket: string, pathPrefix?: string): Promise<string | null> {
    // Helper: Convert File to Base64 string (Fallback)
    const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // 1. Fallback immediately if no backend configured
    if (!supabase) {
        return toBase64(file);
    }
    
    try {
        const fileExt = file.name.split('.').pop();
        const randomId = Math.random().toString(36).substring(2);
        const timestamp = Date.now();
        const fileName = `${timestamp}-${randomId}.${fileExt}`;
        
        const filePath = pathPrefix ? `${pathPrefix}/${fileName}` : fileName;

        const { error } = await supabase.storage.from(bucket).upload(filePath, file);
        if (error) throw error;

        // If bucket is 'data-room', we do NOT return a public URL. 
        // We return the storage path to be used with getSignedUrl later.
        if (bucket === 'data-room') {
            return filePath; 
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;
    } catch (e) {
        console.warn("Asset Upload failed or offline, falling back to Base64 persistence.", e);
        return toBase64(file);
    }
  },

  /**
   * Generates a temporary signed URL for private assets (Data Room)
   */
  async getSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<string | null> {
      if (!supabase) return null; // Cannot sign urls offline
      
      // If path looks like a public URL or base64, return as is
      if (path.startsWith('http') || path.startsWith('data:')) return path;

      try {
          const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
          if (error) throw error;
          return data.signedUrl;
      } catch (e) {
          console.error("Failed to generate signed URL", e);
          return null;
      }
  }
};
