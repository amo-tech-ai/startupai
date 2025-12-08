
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
    // If Supabase isn't enabled or configured, fallback to mock immediately
    if (!supabase) {
        const id = generateShortId();
        setProfile({ ...data, id, userId: 'mock' } as StartupProfile);
        return id;
    }
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Fallback to local state if no user (Unauthenticated Wizard Flow)
        if (!user) {
            console.log("No authenticated user found. Creating local profile.");
            const id = generateShortId();
            setProfile({ ...data, id, userId: 'guest' } as StartupProfile);
            return id;
        }

        // Authenticated creation
        const newProfile = await ProfileService.create(data, user.id);
        setProfile(newProfile);
        return newProfile.id;
    } catch (e) {
        console.error("Create Profile Error:", e);
        // Fallback even on error to allow UI to proceed
        const id = generateShortId();
        setProfile({ ...data, id, userId: 'guest' } as StartupProfile);
        return id;
    }
  };

  const updateProfile = async (data: Partial<StartupProfile>) => {
    setProfile(prev => prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : null);
    if (profile?.id && profile.userId !== 'guest') {
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
      
      // Fix: Use the startupId from the data payload if profile.id isn't available yet (e.g. during wizard flow)
      const targetStartupId = profile?.id || (foundersData.length > 0 ? foundersData[0].startupId : null);
      
      if (targetStartupId && targetStartupId !== 'temp' && targetStartupId !== 'guest') {
          await ProfileService.syncFounders(targetStartupId, foundersData);
      }
  };

  const addFounder = (founder: Founder) => {
      setFounders(prev => [...prev, founder]);
      if (profile?.id && profile.userId !== 'guest') {
          ProfileService.syncFounders(profile.id, [...founders, founder]);
      }
  };

  const removeFounder = (id: string) => {
      setFounders(prev => prev.filter(f => f.id !== id));
      if (profile?.id && profile.userId !== 'guest') {
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
        
        if (lastDate === today) {
            const updated = { ...last, ...data, recordedAt: new Date().toISOString() };
            return [...prev.slice(0, -1), updated];
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
            return [...prev, newSnapshot];
        }
    });
    
    if (targetStartupId !== 'temp' && targetStartupId !== 'guest') {
        DashboardService.updateMetrics(data, targetStartupId);
    }
  };

  const addInsight = (insight: AICoachInsight) => {
      setInsights(prev => [insight, ...prev]);
      if (profile?.id && profile.userId !== 'guest') {
          DashboardService.saveInsights([insight], profile.id);
      }
  };
  
  const setInsightsHandler = (newInsights: AICoachInsight[]) => {
      setInsights(newInsights);
      if (profile?.id && profile.userId !== 'guest') {
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
    setActivities(prev => [newActivity, ...prev]);
    
    if (profile?.id && profile.userId !== 'guest') {
        DashboardService.logActivity(data, profile.id);
    }
  };

  // --- DECKS ---
  const addDeck = async (data: Omit<Deck, 'id' | 'startupId'>) => {
      const tempId = generateShortId();
      const newDeck: Deck = { ...data, id: tempId, startupId: profile?.id || 'temp' };
      setDecks(prev => [newDeck, ...prev]); 

      if (profile?.id && profile.userId !== 'guest') {
          try {
              const realDeck = await DeckService.create(data, profile.id);
              // Replace optimistic deck with real one to get DB ID
              setDecks(prev => prev.map(d => d.id === tempId ? realDeck : d));
          } catch (e) {
              console.error(e);
              toastError("Failed to save deck");
          }
      }
  };

  const updateDeck = async (id: string, updates: Partial<Deck>) => {
      setDecks(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
      if (profile?.id && profile.userId !== 'guest') {
          await DeckService.update(id, updates);
      }
  };

  // --- CRM ---
  const addDeal = async (data: Omit<Deal, 'id' | 'startupId'>) => {
      const tempId = generateShortId();
      setDeals(prev => [...prev, { ...data, id: tempId, startupId: profile?.id || 'temp' }]);
      
      if (profile?.id && profile.userId !== 'guest') {
          try {
              const realId = await CrmService.createDeal(data, profile.id);
              setDeals(prev => prev.map(d => d.id === tempId ? { ...d, id: realId } : d));
          } catch(e) { console.error(e); }
      }
  };

  const updateDeal = async (id: string, updates: Partial<Deal>) => {
      setDeals(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
      if (profile?.id && profile.userId !== 'guest') {
          await CrmService.updateDeal(id, updates);
      }
  };

  // --- TASKS ---
  const addTask = (data: Omit<Task, 'id' | 'startupId'>) => {
      const tempId = generateShortId();
      setTasks(prev => [{...data, id: tempId, startupId: profile?.id||'temp'}, ...prev]);
      if(profile?.id && profile.userId !== 'guest') CrmService.createTask(data, profile.id);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
      if(profile?.id && profile.userId !== 'guest') CrmService.updateTask(id, updates);
  };

  const deleteTask = (id: string) => {
      setTasks(prev => prev.filter(t => t.id !== id));
      if(profile?.id && profile.userId !== 'guest') CrmService.deleteTask(id);
  };

  // --- DOCS ---
  const addDoc = async (data: Omit<InvestorDoc, 'id' | 'startupId' | 'updatedAt'>) => {
      const tempId = generateShortId();
      const newDoc = { ...data, id: tempId, startupId: profile?.id || 'temp', updatedAt: new Date().toISOString() };
      setDocs(prev => [newDoc, ...prev]);

      if (profile?.id && supabase && profile.userId !== 'guest') {
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
      setDocs(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
      if (profile?.id && profile.userId !== 'guest') {
          await DocumentService.update(id, updates);
      }
  };

  const deleteDoc = async (id: string) => {
      setDocs(prev => prev.filter(d => d.id !== id));
      if (profile?.id && profile.userId !== 'guest') {
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
