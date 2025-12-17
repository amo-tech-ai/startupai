
import { supabase } from '../../lib/supabaseClient';

export const AssetService = {
  async uploadFile(file: File, bucket: string, pathPrefix?: string): Promise<string | null> {
    const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    if (!supabase) {
        return toBase64(file);
    }
    
    try {
        const fileExt = file.name.split('.').pop();
        const randomId = Math.random().toString(36).substring(2);
        const fileName = `${Date.now()}-${randomId}.${fileExt}`;
        const filePath = pathPrefix ? `${pathPrefix}/${fileName}` : fileName;

        const { error } = await supabase.storage.from(bucket).upload(filePath, file);
        if (error) throw error;

        // Private buckets return the path for signed URL generation later
        if (bucket === 'data-room') {
            return filePath; 
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;
    } catch (e) {
        console.warn("Upload failed, fallback to base64.", e);
        return toBase64(file);
    }
  },

  async getSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<string | null> {
      if (!supabase) return null;
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
