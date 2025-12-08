
import { supabase } from '../../lib/supabaseClient';
import { generateShortId } from '../../lib/utils';
import { useToast } from '../ToastContext';
import { 
  StartupProfile, UserProfile, Founder, MetricsSnapshot, 
  AICoachInsight, Activity, Task, Deck, Deal, InvestorDoc 
} from '../../types';

// Services
import { ProfileService } from '../../services/supabase/profile';
import { UserService } from '../../services/supabase/user';
import { DeckService } from '../../services/supabase/decks';
import { CrmService } from '../../services/supabase/crm';
import { DocumentService } from '../../services/supabase/documents';
import { AssetService } from '../../services/supabase/assets';
import { DashboardService } from '../../services/supabase/dashboard';

interface AppActionsProps {
  profile: StartupProfile | null;
  userProfile: UserProfile | null;
  founders: Founder[];
  setProfile: React.Dispatch<React.SetStateAction<StartupProfile | null>>;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setFounders: React.Dispatch<React.SetStateAction<Founder[]>>;
  setMetrics: React.Dispatch<React.SetStateAction<MetricsSnapshot[]>>;
  setInsights: React.Dispatch<React.SetStateAction<AICoachInsight[]>>;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  setDocs: React.Dispatch<React.SetStateAction<InvestorDoc[]>>;
}

export const useAppActions = ({
  profile, userProfile, founders,
  setProfile, setUserProfile, setFounders,
  setMetrics, setInsights, setActivities,
  setTasks, setDecks, setDeals, setDocs
}: AppActionsProps) => {
  const { error: toastError } = useToast();

  const isGuestMode = () => !profile || profile.userId === 'guest' || profile.userId === 'mock';

  // Helper to persist guest data
  const persistGuestData = (key: string, data: any) => {
    if (isGuestMode()) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const uploadFile = async (file: File, bucket: string) => {
      try {
          const url = await AssetService.uploadFile(file, bucket);
          return url;
      } catch (e) {
          toastError("Upload failed");
          return null;
      }
  };

  const createStartup = async (data: Partial<StartupProfile>): Promise<string | null> => {
    let isGuest = !supabase;
    let userId = 'mock';

    if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
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
    setUserProfile(prev => prev ? { ...prev, ...data } : null);
    if (userProfile?.id && supabase) {
        await UserService.updateProfile(userProfile.id, data);
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

  // --- DASHBOARD DATA ---
  
  const updateMetrics = (data: Partial<MetricsSnapshot>, overrideStartupId?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const targetStartupId = overrideStartupId || profile?.id || 'temp';
    
    setMetrics(prev => {
        const last = prev[prev.length - 1];
        const lastDate = last?.period?.split('T')[0];
        
        let newState;
        if (lastDate === today) {
            const updated = { ...last, ...data, recordedAt: new Date().toISOString() };
            newState = [...prev.slice(0, -1), updated];
        } else {
            const newSnapshot = { 
                id: generateShortId(),
                startupId: targetStartupId,
                period: new Date().toISOString(),
                mrr: data.mrr || (last?.mrr || 0),
                activeUsers: data.activeUsers || (last?.activeUsers || 0),
                cac: data.cac || (last?.cac || 0), 
                ltv: data.ltv || (last?.ltv || 0), 
                burnRate: data.burnRate || (last?.burnRate || 0), 
                runwayMonths: data.runwayMonths || (last?.runwayMonths || 0),
                recordedAt: new Date().toISOString()
            };
            newState = [...prev, newSnapshot];
        }
        persistGuestData('guest_metrics', newState);
        return newState;
    });
    
    if (targetStartupId !== 'temp' && !isGuestMode()) {
        DashboardService.updateMetrics(data, targetStartupId);
    }
  };

  const addInsight = (insight: AICoachInsight) => {
      setInsights(prev => {
          const newState = [insight, ...prev];
          persistGuestData('guest_insights', newState);
          return newState;
      });
      if (profile?.id && !isGuestMode()) {
          DashboardService.saveInsights([insight], profile.id);
      }
  };
  
  const setInsightsHandler = (newInsights: AICoachInsight[]) => {
      setInsights(newInsights);
      persistGuestData('guest_insights', newInsights);
      if (profile?.id && !isGuestMode()) {
          DashboardService.saveInsights(newInsights, profile.id);
      }
  };

  const addActivity = (data: Omit<Activity, 'id' | 'startupId' | 'timestamp'>) => {
    const newActivity = { 
        ...data, 
        id: generateShortId(), 
        startupId: profile?.id || '', 
        timestamp: new Date().toISOString() 
    };
    setActivities(prev => {
        const newState = [newActivity, ...prev];
        persistGuestData('guest_activities', newState);
        return newState;
    });
    
    if (profile?.id && !isGuestMode()) {
        DashboardService.logActivity(data, profile.id);
    }
  };

  // --- DECKS ---
  const addDeck = async (data: Omit<Deck, 'id' | 'startupId'>) => {
      const tempId = generateShortId();
      const newDeck: Deck = { ...data, id: tempId, startupId: profile?.id || 'temp' };
      
      setDecks(prev => {
          const newState = [newDeck, ...prev];
          persistGuestData('guest_decks', newState);
          return newState;
      });

      if (profile?.id && !isGuestMode()) {
          try {
              const realDeck = await DeckService.create(data, profile.id);
              setDecks(prev => prev.map(d => d.id === tempId ? realDeck : d));
          } catch (e) {
              console.error(e);
              toastError("Failed to save deck");
          }
      }
  };

  const updateDeck = async (id: string, updates: Partial<Deck>) => {
      setDecks(prev => {
          const newState = prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d);
          persistGuestData('guest_decks', newState);
          return newState;
      });
      if (profile?.id && !isGuestMode()) {
          await DeckService.update(id, updates);
      }
  };

  // --- CRM ---
  const addDeal = async (data: Omit<Deal, 'id' | 'startupId'>) => {
      const tempId = generateShortId();
      const newDeal = { ...data, id: tempId, startupId: profile?.id || 'temp' };
      
      setDeals(prev => {
          const newState = [...prev, newDeal];
          persistGuestData('guest_deals', newState);
          return newState;
      });
      
      if (profile?.id && !isGuestMode()) {
          try {
              const realId = await CrmService.createDeal(data, profile.id);
              setDeals(prev => prev.map(d => d.id === tempId ? { ...d, id: realId } : d));
          } catch(e) { console.error(e); }
      }
  };

  const updateDeal = async (id: string, updates: Partial<Deal>) => {
      setDeals(prev => {
          const newState = prev.map(d => d.id === id ? { ...d, ...updates } : d);
          persistGuestData('guest_deals', newState);
          return newState;
      });
      if (profile?.id && !isGuestMode()) {
          await CrmService.updateDeal(id, updates);
      }
  };

  // --- TASKS ---
  const addTask = (data: Omit<Task, 'id' | 'startupId'>) => {
      const tempId = generateShortId();
      const newTask = { ...data, id: tempId, startupId: profile?.id || 'temp' };
      
      setTasks(prev => {
          const newState = [newTask, ...prev];
          persistGuestData('guest_tasks', newState);
          return newState;
      });
      
      if(profile?.id && !isGuestMode()) CrmService.createTask(data, profile.id);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
      setTasks(prev => {
          const newState = prev.map(t => t.id === id ? { ...t, ...updates } : t);
          persistGuestData('guest_tasks', newState);
          return newState;
      });
      if(profile?.id && !isGuestMode()) CrmService.updateTask(id, updates);
  };

  const deleteTask = (id: string) => {
      setTasks(prev => {
          const newState = prev.filter(t => t.id !== id);
          persistGuestData('guest_tasks', newState);
          return newState;
      });
      if(profile?.id && !isGuestMode()) CrmService.deleteTask(id);
  };

  // --- DOCS ---
  const addDoc = async (data: Omit<InvestorDoc, 'id' | 'startupId' | 'updatedAt'>) => {
      const tempId = generateShortId();
      const newDoc = { ...data, id: tempId, startupId: profile?.id || 'temp', updatedAt: new Date().toISOString() };
      
      setDocs(prev => {
          const newState = [newDoc, ...prev];
          persistGuestData('guest_docs', newState);
          return newState;
      });

      if (profile?.id && supabase && !isGuestMode()) {
          try {
              const { data: { user } } = await supabase.auth.getUser();
              if(user) {
                  const realId = await DocumentService.create(data, profile.id, user.id);
                  setDocs(prev => prev.map(d => d.id === tempId ? { ...d, id: realId } : d));
                  return realId;
              }
          } catch (e) { console.error(e); }
      }
      return tempId;
  };

  const updateDoc = async (id: string, updates: Partial<InvestorDoc>) => {
      setDocs(prev => {
          const newState = prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d);
          persistGuestData('guest_docs', newState);
          return newState;
      });
      if (profile?.id && !isGuestMode()) {
          await DocumentService.update(id, updates);
      }
  };

  const deleteDoc = async (id: string) => {
      setDocs(prev => {
          const newState = prev.filter(d => d.id !== id);
          persistGuestData('guest_docs', newState);
          return newState;
      });
      if (profile?.id && !isGuestMode()) {
          await DocumentService.delete(id);
      }
  };

  return {
    createStartup, updateProfile, updateUserProfile, setFounders: setFoundersAction, addFounder, removeFounder,
    updateMetrics, setInsights: setInsightsHandler, addInsight, addActivity,
    addTask, updateTask, deleteTask,
    addDeck, updateDeck,
    addDeal, updateDeal,
    addDoc, updateDoc, deleteDoc,
    uploadFile
  };
};
