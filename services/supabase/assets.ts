
import { supabase } from '../../lib/supabaseClient';

export const AssetService = {
  async uploadFile(file: File, bucket: string): Promise<string | null> {
    if (!supabase) return URL.createObjectURL(file);
    
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await supabase.storage.from(bucket).upload(filePath, file);
        if (error) throw error;

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;
    } catch (e) {
        console.error("Asset Upload failed", e);
        return null;
    }
  }
};
