
import React from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { generateShortId } from '../../../lib/utils';
import { StartupProfile, UserProfile, Founder } from '../../../types';
import { ProfileService } from '../../../services/supabase/profile';
import { UserService } from '../../../services/supabase/user';

interface ProfileActionsProps {
  profile: StartupProfile | null;
  userProfile: UserProfile | null;
  founders: Founder[];
  setProfile: React.Dispatch<React.SetStateAction<StartupProfile | null>>;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setFounders: React.Dispatch<React.SetStateAction<Founder[]>>;
}

export const useProfileActions = ({
  profile,
  userProfile,
  founders,
  setProfile,
  setUserProfile,
  setFounders
}: ProfileActionsProps) => {
  
  const isGuestMode = () => !profile || profile.userId === 'guest' || profile.userId === 'mock';

  const persistGuestData = (key: string, data: any) => {
    if (isGuestMode()) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const createStartup = async (data: Partial<StartupProfile>): Promise<string | null> => {
    let isGuest = !supabase;
    let userId = 'mock';

    if (supabase) {
        const { data: { user } } = await (supabase.auth as any).getUser();
        if (!user) {
            isGuest = true;
            userId = 'guest';
        } else {
            userId = user.id;
        }
    }

    if (isGuest) {
        console.log("Creating local guest profile.");
        const id = generateShortId();
        const guestProfile = { ...data, id, userId: 'guest' } as StartupProfile;
        setProfile(guestProfile);
        persistGuestData('guest_profile', guestProfile);
        return id;
    }
    
    try {
        const newProfile = await ProfileService.create(data, userId);
        setProfile(newProfile);
        return newProfile.id;
    } catch (e) {
        console.error("Create Profile Error:", e);
        const id = generateShortId();
        const fallbackProfile = { ...data, id, userId: 'guest' } as StartupProfile;
        setProfile(fallbackProfile);
        persistGuestData('guest_profile', fallbackProfile);
        return id;
    }
  };

  const updateProfile = async (data: Partial<StartupProfile>) => {
    setProfile(prev => {
        const updated = prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : null;
        if (updated && (updated.userId === 'guest' || updated.userId === 'mock')) {
            localStorage.setItem('guest_profile', JSON.stringify(updated));
        }
        return updated;
    });

    if (profile?.id && !isGuestMode()) {
        await ProfileService.update(profile.id, data);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    setUserProfile(prev => {
        const updated = prev ? { ...prev, ...data } : null;
        
        // Persist to local storage in guest mode
        if (updated && isGuestMode()) {
             localStorage.setItem('guest_user_profile', JSON.stringify(updated));
        }
        
        return updated;
    });

    if (userProfile?.id && supabase && !isGuestMode()) {
        try {
            await UserService.updateProfile(userProfile.id, data);
        } catch(e) {
            console.error("Failed to sync profile update", e);
        }
    }
  };

  const setFoundersAction = async (foundersData: Founder[]) => {
      setFounders(foundersData);
      persistGuestData('guest_founders', foundersData);
      
      const targetStartupId = profile?.id;
      if (targetStartupId && !isGuestMode()) {
          await ProfileService.syncFounders(targetStartupId, foundersData);
      }
  };

  const addFounder = (founder: Founder) => {
      setFounders(prev => {
          const newState = [...prev, founder];
          persistGuestData('guest_founders', newState);
          return newState;
      });
      if (profile?.id && !isGuestMode()) {
          ProfileService.syncFounders(profile.id, [...founders, founder]);
      }
  };

  const removeFounder = (id: string) => {
      setFounders(prev => {
          const newState = prev.filter(f => f.id !== id);
          persistGuestData('guest_founders', newState);
          return newState;
      });
      if (profile?.id && !isGuestMode()) {
          ProfileService.deleteFounder(id);
      }
  };

  return {
    createStartup,
    updateProfile,
    updateUserProfile,
    setFounders: setFoundersAction,
    addFounder,
    removeFounder,
    isGuestMode
  };
};
