
import { AssetService } from '../../../services/supabase/assets';
import { useToast } from '../../ToastContext';
import { StartupProfile, UserProfile } from '../../../types';

export const useAssetActions = (
  profile: StartupProfile | null, 
  userProfile: UserProfile | null
) => {
  const { error: toastError } = useToast();

  const uploadFile = async (file: File, bucket: string) => {
      try {
          // Use startup ID or user ID as folder prefix to avoid collisions
          const prefix = profile?.id || userProfile?.id || 'guest';
          const url = await AssetService.uploadFile(file, bucket, prefix);
          return url;
      } catch (e) {
          toastError("Upload failed");
          return null;
      }
  };

  return { uploadFile };
};
