import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StartupProfile, MetricsSnapshot, AICoachInsight, Founder, StartupStage, Activity, Task, Deck, Deal } from '../types';
import { initialDatabaseState } from '../data/mockDatabase';
import { supabase } from '../lib/supabaseClient';

interface DataContextType {
  profile: StartupProfile | null;
  metrics: MetricsSnapshot[];
  insights: AICoachInsight[];
  activities: Activity[];
  tasks: Task[];
  decks: Deck[];
  deals: Deal[];
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
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with the mock DB state
  const [profile, setProfile] = useState<StartupProfile | null>(initialDatabaseState.profile);
  const [metrics, setMetrics] = useState<MetricsSnapshot[]>(initialDatabaseState.metrics);
  const [insights, setInsights] = useState<AICoachInsight[]>(initialDatabaseState.insights);
  const [activities, setActivities] = useState<Activity[]>(initialDatabaseState.activities);
  const [tasks, setTasks] = useState<Task[]>(initialDatabaseState.tasks);
  const [decks, setDecks] = useState<Deck[]>(initialDatabaseState.decks);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
                // Map DB columns (snake_case) to App types (camelCase) if needed, or rely on TS compatibility if columns match
                // Assuming DB table `crm_deals` matches needed fields or we map them.
                // For MVP, if names differ, we map manually. 
                // Let's assume schema matches or we use what we have.
                // The DB schema in docs shows `expected_close` instead of `dueDate`, etc.
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

        } catch (e) {
            console.error("Supabase Sync Error:", e);
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
                  deck_id: deckRes.id,
                  title: s.title,
                  content: JSON.stringify(s.bullets), // Store as string/json
                  position: idx,
                  type: 'generic'
              }));

              await supabase.from('slides').insert(slidesPayload);
              
              // Update local ID with real ID
              setDecks(prev => prev.map(d => d.id === tempId ? { ...d, id: deckRes.id } : d));

          } catch (e) {
              console.error("Failed to save deck to Supabase", e);
          }
      }
  }

  const updateDeck = async (id: string, updates: Partial<Deck>) => {
      // Optimistic
      setDecks(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));

      if (supabase) {
          if (updates.slides) {
              await supabase.from('decks').update({ 
                  title: updates.title, 
                  updated_at: new Date().toISOString() 
              }).eq('id', id);
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

  return (
    <DataContext.Provider value={{ 
      profile, 
      metrics, 
      insights, 
      activities, 
      tasks,
      decks,
      deals,
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