
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { initialDatabaseState } from '../../data/mockDatabase';
import { 
  StartupProfile, 
  UserProfile, 
  Founder, 
  MetricsSnapshot, 
  AICoachInsight, 
  Activity, 
  Task, 
  Deck, 
  Deal, 
  InvestorDoc 
} from '../../types';
import { ProfileService } from '../../services/supabase/profile';
import { UserService } from '../../services/supabase/user';
import { DeckService } from '../../services/supabase/decks';
import { CrmService } from '../../services/supabase/crm';
import { DocumentService } from '../../services/supabase/documents';
import { DashboardService } from '../../services/supabase/dashboard';
import { mapDealFromDB, mapTaskFromDB, mapActivityFromDB } from '../../lib/mappers';

export const useSupabaseData = () => {
  // Local State (Optimistic UI) - Initialize with mocks for immediate feedback
  const [profile, setProfile] = useState<StartupProfile | null>(initialDatabaseState.profile);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialDatabaseState.userProfile);
  const [founders, setFounders] = useState<Founder[]>(initialDatabaseState.founders);
  const [metrics, setMetrics] = useState<MetricsSnapshot[]>(initialDatabaseState.metrics);
  const [insights, setInsights] = useState<AICoachInsight[]>(initialDatabaseState.insights);
  const [activities, setActivities] = useState<Activity[]>(initialDatabaseState.activities);
  const [tasks, setTasks] = useState<Task[]>(initialDatabaseState.tasks);
  const [decks, setDecks] = useState<Deck[]>(initialDatabaseState.decks);
  const [deals, setDeals] = useState<Deal[]>(initialDatabaseState.deals); 
  const [docs, setDocs] = useState<InvestorDoc[]>(initialDatabaseState.docs);
  const [isLoading, setIsLoading] = useState(false);
  
  // Realtime Channel Ref for safe cleanup
  const realtimeChannelRef = useRef<any>(null);

  // Helper to reset state on logout
  const clearData = () => {
      setProfile(null);
      setUserProfile(null);
      setFounders([]);
      setMetrics([]);
      setInsights([]);
      setActivities([]);
      setTasks([]);
      setDecks([]);
      setDeals([]);
      setDocs([]);
  };

  const loadData = useCallback(async () => {
      if (!supabase) return;
      
      setIsLoading(true);
      try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
             // If no user is logged in, we shouldn't show stale data or mocks in a production app context
             // but keeping mocks for demo/guest mode might be desired. 
             // Here we stick to clearing if specifically checking auth.
             // However, for the "guest wizard" to work, we handle that via the createStartup return.
             // If the app expects to be in "demo mode" when logged out, we should re-apply initialDatabaseState.
             // For now, we assume authenticated users need real data.
             setIsLoading(false);
             return; 
          }

          // 1. Fetch User Profile
          const loadedUserProfile = await UserService.getProfile(user.id);
          if (loadedUserProfile) {
            setUserProfile(loadedUserProfile);
          }

          // 2. Fetch Startup Profile & Founders
          const { profile: p, founders: f } = await ProfileService.getByUserId(user.id);
          
          if (p) {
              // USER HAS A PROFILE -> Load everything
              setProfile(p);
              setFounders(f);
              
              // 3. Fetch Dependent Data (Parallel with resilience)
              const results = await Promise.allSettled([
                  DeckService.getAll(p.id),
                  CrmService.getDeals(p.id),
                  DocumentService.getAll(p.id),
                  CrmService.getTasks(p.id),
                  DashboardService.getMetricsHistory(p.id),
                  DashboardService.getInsights(p.id),
                  DashboardService.getActivities(p.id)
              ]);

              // Helper to safely extract data from allSettled
              const unwrap = <T,>(result: PromiseSettledResult<T>, fallback: T): T => 
                  result.status === 'fulfilled' ? result.value : fallback;

              setDecks(unwrap(results[0], []));
              setDeals(unwrap(results[1], []));
              setDocs(unwrap(results[2], []));
              setTasks(unwrap(results[3], []));
              setMetrics(unwrap(results[4], []));
              setInsights(unwrap(results[5], []));
              setActivities(unwrap(results[6], []));

              // 4. Setup Realtime Subscriptions
              if (realtimeChannelRef.current) {
                  supabase.removeChannel(realtimeChannelRef.current);
              }

              const channel = supabase.channel('public-db-changes')
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
                    if (payload.eventType === 'INSERT') {
                        setTasks(prev => [mapTaskFromDB(payload.new), ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setTasks(prev => prev.map(t => t.id === payload.new.id ? mapTaskFromDB(payload.new) : t));
                    } else if (payload.eventType === 'DELETE') {
                        setTasks(prev => prev.filter(t => t.id !== payload.old.id));
                    }
                })
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'crm_activities', filter: `startup_id=eq.${p.id}` }, (payload: any) => {
                    setActivities(prev => [mapActivityFromDB(payload.new), ...prev]);
                })
                .subscribe();
              
              realtimeChannelRef.current = channel;
          } else {
              // AUTHENTICATED BUT NO STARTUP PROFILE -> Clear Mocks to trigger Onboarding Wizard
              clearData();
          }
      } catch (e) {
          console.error("Data Fetch Error:", e);
      } finally {
          setIsLoading(false);
      }
  }, []);

  useEffect(() => {
    if (!supabase) return;

    // Initial Load
    loadData();

    // Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            loadData();
        } else if (event === 'SIGNED_OUT') {
            clearData();
            if (realtimeChannelRef.current) {
                supabase.removeChannel(realtimeChannelRef.current);
                realtimeChannelRef.current = null;
            }
        }
    });

    return () => {
        subscription.unsubscribe();
        if (realtimeChannelRef.current) {
            supabase.removeChannel(realtimeChannelRef.current);
        }
    };
  }, [loadData]);

  return {
    profile, setProfile,
    userProfile, setUserProfile,
    founders, setFounders,
    metrics, setMetrics,
    insights, setInsights,
    activities, setActivities,
    tasks, setTasks,
    decks, setDecks,
    deals, setDeals,
    docs, setDocs,
    isLoading
  };
};
