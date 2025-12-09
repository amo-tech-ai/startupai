
import { supabase } from '../../lib/supabaseClient';

export const AssetService = {
  async uploadFile(file: File, bucket: string, pathPrefix?: string): Promise<string | null> {
    // Helper: Convert File to Base64 string
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
        // Use timestamp + random to ensure uniqueness
        const fileName = `${timestamp}-${randomId}.${fileExt}`;
        
        // Use prefix (userId/startupId) if provided to organize bucket and prevent global collisions
        const filePath = pathPrefix ? `${pathPrefix}/${fileName}` : fileName;

        const { error } = await supabase.storage.from(bucket).upload(filePath, file);
        if (error) throw error;

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;
    } catch (e) {
        console.warn("Asset Upload failed or offline, falling back to Base64 persistence.", e);
        // 2. Fallback on error (Offline Resilience)
        // This ensures the user can still see their image in the session even if upload fails
        return toBase64(file);
    }
  }
};
