import React, { createContext, useContext, useState, useEffect } from 'react';
import { StartupProfile, MetricsSnapshot, AICoachInsight, Founder, StartupStage, Activity, Task, Deck, Deal, InvestorDoc } from '../types';
import { initialDatabaseState } from '../data/mockDatabase';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './ToastContext';

interface DataContextType {
  profile: StartupProfile | null;
  metrics: MetricsSnapshot[];
  insights: AICoachInsight[];
  activities: Activity[];
  tasks: Task[];
  decks: Deck[];
  deals: Deal[];
  docs: InvestorDoc[];
  updateProfile: (data: Partial<StartupProfile>) => void;
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
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with the mock DB state
  const [profile, setProfile] = useState<StartupProfile | null>(initialDatabaseState.profile);
  const [metrics, setMetrics] = useState<MetricsSnapshot[]>(initialDatabaseState.metrics);
  const [insights, setInsights] = useState<AICoachInsight[]>(initialDatabaseState.insights);
  const [activities, setActivities] = useState<Activity[]>(initialDatabaseState.activities);
  const [tasks, setTasks] = useState<Task[]>(initialDatabaseState.tasks);
  const [decks, setDecks] = useState<Deck[]>(initialDatabaseState.decks);
  const [deals, setDeals] = useState<Deal[]>(initialDatabaseState.deals); // Fixed initial state usage
  const [docs, setDocs] = useState<InvestorDoc[]>(initialDatabaseState.docs);
  const [isLoading, setIsLoading] = useState(false);
  const { toast, error: toastError } = useToast();

  // --- SUPABASE SYNC ---
  useEffect(() => {
    if (!supabase) return; // Skip if no backend

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const user = await supabase.auth.getUser();
            if (!user.data.user) return;

            // 1. Fetch Profile
            const { data: profileData } = await supabase.from('startups').select('*').single();
            if (profileData) setProfile(profileData);

            // 2. Fetch Decks (and slides joined)
            const { data: deckData } = await supabase.from('decks').select('*, slides(*)');
            if (deckData) {
                // Map DB structure to App structure if needed
                const formattedDecks = deckData.map((d: any) => ({
                    ...d,
                    slides: d.slides ? d.slides.sort((a: any, b: any) => a.position - b.position) : []
                }));
                setDecks(formattedDecks);
            }

            // 3. Fetch Tasks
            const { data: taskData } = await supabase.from('tasks').select('*');
            if (taskData) setTasks(taskData);

            // 4. Fetch Deals
            const { data: dealData } = await supabase.from('crm_deals').select('*');
            if (dealData) {
                const formattedDeals = dealData.map((d: any) => ({
                    id: d.id,
                    startupId: d.startup_id,
                    company: d.name,
                    value: d.amount,
                    stage: d.stage,
                    probability: d.probability,
                    sector: d.sector || '',
                    nextAction: d.next_action || '',
                    dueDate: d.expected_close || '',
                    ownerInitial: 'ME', // Placeholder until joined
                    ownerColor: 'bg-indigo-500' // Placeholder
                }));
                setDeals(formattedDeals);
            }

            // 5. Fetch Docs
            const { data: docData } = await supabase.from('investor_docs').select('*');
            if (docData) {
                // Map snake_case DB columns to camelCase types
                const formattedDocs = docData.map((d: any) => ({
                    id: d.id,
                    startupId: d.startup_id,
                    title: d.title,
                    type: d.type,
                    content: d.content,
                    status: d.status,
                    updatedAt: d.updated_at
                }));
                setDocs(formattedDocs);
            }

        } catch (e) {
            console.error("Supabase Sync Error:", e);
            toastError("Failed to sync data with server.");
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
  }, []);

  // --- ACTION HANDLERS ---

  const updateProfile = (data: Partial<StartupProfile>) => {
    setIsLoading(true);
    
    // Optimistic Update
    setProfile((prev) => {
      if (!prev) return data as StartupProfile;
      return { ...prev, ...data, updatedAt: new Date().toISOString() };
    });

    if (supabase && profile?.id) {
        supabase.from('startups').update(data).eq('id', profile.id).then();
    }

    // Simulate API delay if mock
    if (!supabase) setTimeout(() => setIsLoading(false), 500);
    else setIsLoading(false);
  };

  const updateMetrics = (data: Partial<MetricsSnapshot>) => {
    setMetrics((prev) => {
      const current = prev[0] || {}; 
      const updated = { ...current, ...data, recordedAt: new Date().toISOString() };
      return [updated as MetricsSnapshot];
    });
  };

  const addInsight = (insight: AICoachInsight) => {
    setInsights((prev) => [insight, ...prev]);
  };

  const addActivity = (data: Omit<Activity, 'id' | 'startupId' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      startupId: profile?.id || 'unknown',
      timestamp: new Date().toISOString()
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const addTask = (data: Omit<Task, 'id' | 'startupId'>) => {
    const newTask: Task = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        startupId: profile?.id || 'unknown'
    };
    setTasks(prev => [newTask, ...prev]);
    
    if (supabase && profile?.id) {
        supabase.from('tasks').insert({ ...data, startup_id: profile.id }).then();
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    
    if (supabase) {
        supabase.from('tasks').update(updates).eq('id', id).then();
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    
    if (supabase) {
        supabase.from('tasks').delete().eq('id', id).then();
    }
  };

  const addDeck = async (data: Omit<Deck, 'id' | 'startupId'>) => {
      const tempId = Math.random().toString(36).substr(2, 9);
      const newDeck: Deck = {
          ...data,
          id: tempId,
          startupId: profile?.id || 'unknown'
      };
      
      // Optimistic
      setDecks(prev => [newDeck, ...prev]);

      if (supabase && profile?.id) {
          try {
              // 1. Insert Deck
              const { data: deckRes, error: deckErr } = await supabase
                  .from('decks')
                  .insert({ 
                      title: data.title, 
                      template: data.template, 
                      startup_id: profile.id,
                      status: 'draft' 
                  })
                  .select()
                  .single();
              
              if (deckErr) throw deckErr;

              // 2. Insert Slides
              const slidesPayload = data.slides.map((s, idx) => ({
                  id: s.id, // Use generated UUIDs from Edge Function
                  deck_id: deckRes.id,
                  title: s.title,
                  bullets: s.bullets, // Store as JSONB
                  position: idx,
                  type: 'generic',
                  chart_type: s.chartType,
                  chart_data: s.chartData
              }));

              const { data: slidesRes, error: slidesErr } = await supabase.from('slides').insert(slidesPayload).select();
              
              if (slidesErr) throw slidesErr;

              // Update local IDs with real IDs (though should match if we provided UUIDs)
              setDecks(prev => prev.map(d => d.id === tempId ? { ...d, id: deckRes.id, slides: slidesRes as any } : d));

          } catch (e) {
              console.error("Failed to save deck to Supabase", e);
              toastError("Failed to save deck to server.");
          }
      }
  }

  const updateDeck = async (id: string, updates: Partial<Deck>) => {
      // Optimistic
      setDecks(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));

      if (supabase) {
          try {
              // Update Deck Metadata
              const { slides, ...deckMeta } = updates;
              if (Object.keys(deckMeta).length > 0) {
                  const dbPayload: any = {};
                  if (deckMeta.title) dbPayload.title = deckMeta.title;
                  dbPayload.updated_at = new Date().toISOString();
                  
                  const { error } = await supabase.from('decks').update(dbPayload).eq('id', id);
                  if (error) throw error;
              }

              // Update Slides (Upsert)
              if (slides) {
                  const slidesPayload = slides.map((s, idx) => ({
                      id: s.id,
                      deck_id: id,
                      title: s.title,
                      bullets: s.bullets,
                      image_url: s.imageUrl,
                      chart_type: s.chartType,
                      chart_data: s.chartData,
                      position: idx,
                      type: 'generic'
                  }));

                  const { error } = await supabase.from('slides').upsert(slidesPayload);
                  if (error) throw error;
              }
          } catch (e) {
              console.error("Failed to update deck in Supabase", e);
              toastError("Failed to sync changes.");
          }
      }
  }

  const addDeal = async (data: Omit<Deal, 'id' | 'startupId'>) => {
      const tempId = Math.random().toString(36).substr(2, 9);
      const newDeal: Deal = {
          ...data,
          id: tempId,
          startupId: profile?.id || 'unknown'
      };

      setDeals(prev => [...prev, newDeal]);

      if (supabase && profile?.id) {
          // Map to DB columns
          const dbPayload = {
              startup_id: profile.id,
              name: data.company,
              amount: data.value,
              stage: data.stage,
              probability: data.probability,
              sector: data.sector,
              next_action: data.nextAction,
              expected_close: data.dueDate, // mapping dueDate to expected_close
          };
          const { data: res } = await supabase.from('crm_deals').insert(dbPayload).select().single();
          if (res) {
              setDeals(prev => prev.map(d => d.id === tempId ? { ...d, id: res.id } : d));
          }
      }
  }

  const updateDeal = async (id: string, updates: Partial<Deal>) => {
      setDeals(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));

      if (supabase) {
          // Construct DB payload only with fields present in updates
          const dbPayload: any = {};
          if (updates.company) dbPayload.name = updates.company;
          if (updates.value) dbPayload.amount = updates.value;
          if (updates.stage) dbPayload.stage = updates.stage;
          if (updates.probability) dbPayload.probability = updates.probability;
          if (updates.sector) dbPayload.sector = updates.sector;
          if (updates.nextAction) dbPayload.next_action = updates.nextAction;
          if (updates.dueDate) dbPayload.expected_close = updates.dueDate;

          await supabase.from('crm_deals').update(dbPayload).eq('id', id);
      }
  }

  const addDoc = async (data: Omit<InvestorDoc, 'id' | 'startupId' | 'updatedAt'>) => {
      const tempId = Math.random().toString(36).substr(2, 9);
      const newDoc: InvestorDoc = {
          ...data,
          id: tempId,
          startupId: profile?.id || 'unknown',
          updatedAt: new Date().toISOString()
      };

      setDocs(prev => [newDoc, ...prev]);

      if (supabase && profile?.id) {
          // Only sync if user context is available
          try {
              const { data: res, error } = await supabase.from('investor_docs').insert({
                  startup_id: profile.id,
                  user_id: profile.userId, // We need to ensure we have this or rely on RLS default if auth is set
                  title: data.title,
                  type: data.type,
                  content: data.content,
                  status: data.status
              }).select().single();

              if (error) throw error;
              
              if (res) {
                  setDocs(prev => prev.map(d => d.id === tempId ? { ...d, id: res.id } : d));
                  return res.id;
              }
          } catch (e) {
              console.error("Failed to create doc in Supabase", e);
              toastError("Failed to save document to server.");
          }
      }
      return tempId; // Return temp ID if offline/mock
  }

  const updateDoc = async (id: string, updates: Partial<InvestorDoc>) => {
      setDocs(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));

      if (supabase) {
          try {
              const dbPayload: any = {};
              if (updates.title) dbPayload.title = updates.title;
              if (updates.status) dbPayload.status = updates.status;
              if (updates.content) dbPayload.content = updates.content;
              dbPayload.updated_at = new Date().toISOString();

              const { error } = await supabase.from('investor_docs').update(dbPayload).eq('id', id);
              if (error) throw error;
          } catch (e) {
              console.error("Failed to update doc in Supabase", e);
              toastError("Failed to sync document changes.");
          }
      }
  }

  const deleteDoc = async (id: string) => {
      setDocs(prev => prev.filter(d => d.id !== id));
      if (supabase) {
          await supabase.from('investor_docs').delete().eq('id', id);
      }
  }

  return (
    <DataContext.Provider value={{ 
      profile, 
      metrics, 
      insights, 
      activities, 
      tasks,
      decks,
      deals,
      docs,
      updateProfile, 
      updateMetrics, 
      setInsights,
      addInsight, 
      addActivity, 
      addTask,
      updateTask,
      deleteTask,
      addDeck,
      updateDeck,
      addDeal,
      updateDeal,
      addDoc,
      updateDoc,
      deleteDoc,
      isLoading 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};