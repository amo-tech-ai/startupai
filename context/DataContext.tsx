
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StartupProfile, MetricsSnapshot, AICoachInsight, Founder, Activity, Task, Deck, Deal, InvestorDoc } from '../types';
import { initialDatabaseState } from '../data/mockDatabase';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './ToastContext';
import { generateShortId } from '../lib/utils';
import { mapDealFromDB, mapActivityFromDB } from '../lib/mappers';

// Import Modular Services
import { ProfileService } from '../services/supabase/profile';
import { DeckService } from '../services/supabase/decks';
import { CrmService } from '../services/supabase/crm';
import { DocumentService } from '../services/supabase/documents';
import { AssetService } from '../services/supabase/assets';
import { DashboardService } from '../services/supabase/dashboard';

interface DataContextType {
  profile: StartupProfile | null;
  founders: Founder[];
  metrics: MetricsSnapshot[];
  insights: AICoachInsight[];
  activities: Activity[];
  tasks: Task[];
  decks: Deck[];
  deals: Deal[];
  docs: InvestorDoc[];
  createStartup: (data: Partial<StartupProfile>) => Promise<void>;
  updateProfile: (data: Partial<StartupProfile>) => Promise<void>;
  setFounders: (founders: Founder[]) => void;
  addFounder: (founder: Founder) => void;
  removeFounder: (id: string) => void;
  updateMetrics: (data: Partial<MetricsSnapshot>) => void;
  setInsights: (insights: AICoachInsight[]) => void;
  addInsight: (insight: AICoachInsight) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'startupId' | 'timestamp'>) => void;
  addTask: (task: Omit<Task, 'id' | 'startupId'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addDeck: (deck: Omit<Deck, 'id' | 'startupId'>) => void;
  updateDeck: (id: string, updates: Partial<Deck>) => void;
  addDeal: (deal: Omit<Deal, 'id' | 'startupId'>) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  addDoc: (doc: Omit<InvestorDoc, 'id' | 'startupId' | 'updatedAt'>) => Promise<string | null>;
  updateDoc: (id: string, updates: Partial<InvestorDoc>) => void;
  deleteDoc: (id: string) => void;
  uploadFile: (file: File, bucket: string) => Promise<string | null>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local State (Optimistic UI)
  const [profile, setProfile] = useState<StartupProfile | null>(initialDatabaseState.profile);
  const [founders, setFoundersState] = useState<Founder[]>(initialDatabaseState.founders);
  const [metrics, setMetrics] = useState<MetricsSnapshot[]>(initialDatabaseState.metrics);
  const [insights, setInsights] = useState<AICoachInsight[]>(initialDatabaseState.insights);
  const [activities, setActivities] = useState<Activity[]>(initialDatabaseState.activities);
  const [tasks, setTasks] = useState<Task[]>(initialDatabaseState.tasks);
  const [decks, setDecks] = useState<Deck[]>(initialDatabaseState.decks);
  const [deals, setDeals] = useState<Deal[]>(initialDatabaseState.deals); 
  const [docs, setDocs] = useState<InvestorDoc[]>(initialDatabaseState.docs);
  const [isLoading, setIsLoading] = useState(false);
  const { toast, error: toastError } = useToast();

  // --- INITIAL DATA FETCH & REALTIME ---
  useEffect(() => {
    if (!supabase) return; // Skip if offline/mock mode

    let realtimeChannel: any;

    const loadData = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Profile & Founders
            const { profile: p, founders: f } = await ProfileService.getByUserId(user.id);
            if (p) {
                setProfile(p);
                setFoundersState(f);
                
                // 2. Fetch Dependent Data (Parallel)
                const [decksData, dealsData, docsData, tasksData, metricsData, insightsData, activityData] = await Promise.all([
                    DeckService.getAll(p.id),
                    CrmService.getDeals(p.id),
                    DocumentService.getAll(p.id),
                    CrmService.getTasks(p.id),
                    DashboardService.getMetricsHistory(p.id),
                    DashboardService.getInsights(p.id),
                    DashboardService.getActivities(p.id)
                ]);

                setDecks(decksData);
                setDeals(dealsData);
                setDocs(docsData);
                setTasks(tasksData);
                setMetrics(metricsData);
                setInsights(insightsData);
                setActivities(activityData);

                // 3. Setup Realtime Subscriptions
                realtimeChannel = supabase.channel('public-db-changes')
                  .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_deals', filter: `startup_id=eq.${p.id}` }, (payload: any) => {
                      if (payload.eventType === 'INSERT') {
                          setDeals(prev => [...prev, mapDealFromDB(payload.new)]);
                      } else if (payload.eventType === 'UPDATE') {
                          setDeals(prev => prev.map(d => d.id === payload.new.id ? mapDealFromDB(payload.new) : d));
                      } else if (payload.eventType === 'DELETE') {
                          setDeals(prev => prev.filter(d => d.id !== payload.old.id));
                      }
                  })
                  .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `startup_id=eq.${p.id}` }, (payload: any) => {
                      // Simple mapping for realtime task updates
                      const mapTask = (t: any) => ({
                          id: t.id,
                          title: t.title,
                          status: t.status,
                          priority: t.priority,
                          description: t.description,
                          dueDate: t.due_date,
                          startupId: t.startup_id,
                          aiGenerated: false
                      });

                      if (payload.eventType === 'INSERT') {
                          setTasks(prev => [mapTask(payload.new), ...prev]);
                      } else if (payload.eventType === 'UPDATE') {
                          setTasks(prev => prev.map(t => t.id === payload.new.id ? mapTask(payload.new) : t));
                      } else if (payload.eventType === 'DELETE') {
                          setTasks(prev => prev.filter(t => t.id !== payload.old.id));
                      }
                  })
                  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'crm_activities', filter: `startup_id=eq.${p.id}` }, (payload: any) => {
                      setActivities(prev => [mapActivityFromDB(payload.new), ...prev]);
                  })
                  .subscribe();
            }
        } catch (e) {
            console.error("Data Fetch Error:", e);
        } finally {
            setIsLoading(false);
        }
    };

    loadData();

    return () => {
        if (realtimeChannel) supabase.removeChannel(realtimeChannel);
    };
  }, []);

  // --- ACTIONS ---

  const uploadFile = async (file: File, bucket: string) => {
      try {
          const url = await AssetService.uploadFile(file, bucket);
          return url;
      } catch (e) {
          toastError("Upload failed");
          return null;
      }
  };

  const createStartup = async (data: Partial<StartupProfile>) => {
    if (!supabase) {
        setProfile({ ...data, id: generateShortId(), userId: 'mock' } as StartupProfile);
        return;
    }
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");
        const newProfile = await ProfileService.create(data, user.id);
        setProfile(newProfile);
    } catch (e) {
        console.error(e);
        toastError("Failed to create profile");
    }
  };

  const updateProfile = async (data: Partial<StartupProfile>) => {
    setProfile(prev => prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : null);
    if (profile?.id) {
        await ProfileService.update(profile.id, data);
    }
  };

  const setFounders = async (foundersData: Founder[]) => {
      setFoundersState(foundersData);
      if (profile?.id) {
          await ProfileService.syncFounders(profile.id, foundersData);
      }
  };

  const addFounder = (founder: Founder) => {
      setFoundersState(prev => [...prev, founder]);
      if (profile?.id) {
          ProfileService.syncFounders(profile.id, [...founders, founder]);
      }
  };

  const removeFounder = (id: string) => {
      setFoundersState(prev => prev.filter(f => f.id !== id));
      ProfileService.deleteFounder(id);
  };

  // --- DASHBOARD DATA ---
  
  const updateMetrics = (data: Partial<MetricsSnapshot>) => {
    // Optimistic Update: Append new snapshot locally
    const newSnapshot = { 
        id: generateShortId(),
        startupId: profile?.id || 'temp',
        period: new Date().toISOString(),
        mrr: data.mrr || 0,
        activeUsers: data.activeUsers || 0,
        cac: 0, ltv: 0, burnRate: 0, runwayMonths: 0,
        recordedAt: new Date().toISOString(),
        ...data 
    };
    
    setMetrics(prev => [...prev, newSnapshot]);
    
    if (profile?.id) {
        DashboardService.updateMetrics(data, profile.id);
    }
  };

  const addInsight = (insight: AICoachInsight) => {
      setInsights(prev => [insight, ...prev]);
      if (profile?.id) {
          DashboardService.saveInsights([insight], profile.id);
      }
  };
  
  const setInsightsHandler = (newInsights: AICoachInsight[]) => {
      setInsights(newInsights);
      if (profile?.id) {
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
    
    if (profile?.id) {
        DashboardService.logActivity(data, profile.id);
    }
  };

  // --- DECKS ---
  const addDeck = async (data: Omit<Deck, 'id' | 'startupId'>) => {
      const tempId = generateShortId();
      const newDeck: Deck = { ...data, id: tempId, startupId: profile?.id || 'temp' };
      setDecks(prev => [newDeck, ...prev]); // Optimistic

      if (profile?.id) {
          try {
              const realDeck = await DeckService.create(data, profile.id);
              // Replace optimistic deck with real one
              setDecks(prev => prev.map(d => d.id === tempId ? realDeck : d));
          } catch (e) {
              console.error(e);
              toastError("Failed to save deck");
          }
      }
  };

  const updateDeck = async (id: string, updates: Partial<Deck>) => {
      setDecks(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
      await DeckService.update(id, updates);
  };

  // --- CRM ---
  const addDeal = async (data: Omit<Deal, 'id' | 'startupId'>) => {
      const tempId = generateShortId();
      setDeals(prev => [...prev, { ...data, id: tempId, startupId: profile?.id || 'temp' }]);
      
      if (profile?.id) {
          try {
              const realId = await CrmService.createDeal(data, profile.id);
              setDeals(prev => prev.map(d => d.id === tempId ? { ...d, id: realId } : d));
          } catch(e) { console.error(e); }
      }
  };

  const updateDeal = async (id: string, updates: Partial<Deal>) => {
      setDeals(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
      await CrmService.updateDeal(id, updates);
  };

  // --- TASKS ---
  const addTask = (data: Omit<Task, 'id' | 'startupId'>) => {
      const tempId = generateShortId();
      setTasks(prev => [{...data, id: tempId, startupId: profile?.id||'temp'}, ...prev]);
      if(profile?.id) CrmService.createTask(data, profile.id);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
      CrmService.updateTask(id, updates);
  };

  const deleteTask = (id: string) => {
      setTasks(prev => prev.filter(t => t.id !== id));
      CrmService.deleteTask(id);
  };

  // --- DOCS ---
  const addDoc = async (data: Omit<InvestorDoc, 'id' | 'startupId' | 'updatedAt'>) => {
      const tempId = generateShortId();
      const newDoc = { ...data, id: tempId, startupId: profile?.id || 'temp', updatedAt: new Date().toISOString() };
      setDocs(prev => [newDoc, ...prev]);

      if (profile?.id && supabase) {
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
      await DocumentService.update(id, updates);
  };

  const deleteDoc = async (id: string) => {
      setDocs(prev => prev.filter(d => d.id !== id));
      await DocumentService.delete(id);
  };

  return (
    <DataContext.Provider value={{ 
      profile, founders, metrics, insights, activities, tasks, decks, deals, docs,
      createStartup, updateProfile, setFounders, addFounder, removeFounder,
      updateMetrics, setInsights: setInsightsHandler, addInsight, addActivity, 
      addTask, updateTask, deleteTask,
      addDeck, updateDeck,
      addDeal, updateDeal,
      addDoc, updateDoc, deleteDoc,
      uploadFile, isLoading 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};
