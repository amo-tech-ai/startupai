
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
  InvestorDoc,
  Contact
} from '../../types';
import { ProfileService } from '../../services/supabase/profile';
import { UserService } from '../../services/supabase/user';
import { DeckService } from '../../services/supabase/decks';
import { CrmService } from '../../services/supabase/crm';
import { DocumentService } from '../../services/supabase/documents';
import { DashboardService } from '../../services/supabase/dashboard';
import { mapDealFromDB } from '../../lib/mappers';
import { useToast } from '../ToastContext';

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
  const [contacts, setContacts] = useState<Contact[]>(initialDatabaseState.contacts);
  const [docs, setDocs] = useState<InvestorDoc[]>(initialDatabaseState.docs);
  const [isLoading, setIsLoading] = useState(true);
  
  // Realtime Channel Ref for safe cleanup
  const realtimeChannelRef = useRef<any>(null);
  const { toast, success, error } = useToast();

  // Helper to load guest data from LS
  const loadGuestData = useCallback(() => {
      console.log("Loading guest data...");
      const storedGuest = localStorage.getItem('guest_profile');
      if (storedGuest) {
          try {
              setProfile(JSON.parse(storedGuest));
              const f = localStorage.getItem('guest_founders'); if(f) setFounders(JSON.parse(f));
              const m = localStorage.getItem('guest_metrics'); if(m) setMetrics(JSON.parse(m));
              const i = localStorage.getItem('guest_insights'); if(i) setInsights(JSON.parse(i));
              const a = localStorage.getItem('guest_activities'); if(a) setActivities(JSON.parse(a));
              const t = localStorage.getItem('guest_tasks'); if(t) setTasks(JSON.parse(t));
              const d = localStorage.getItem('guest_decks'); if(d) setDecks(JSON.parse(d));
              const dl = localStorage.getItem('guest_deals'); if(dl) setDeals(JSON.parse(dl));
              const c = localStorage.getItem('guest_contacts'); if(c) setContacts(JSON.parse(c));
              const do_ = localStorage.getItem('guest_docs'); if(do_) setDocs(JSON.parse(do_));
              const up = localStorage.getItem('guest_user_profile'); if(up) setUserProfile(JSON.parse(up));
          } catch(e) {
              console.error("Failed to load guest data", e);
          }
      } else {
          // No guest profile, use initial mocks (Demo Mode)
          // Mocks are already set by default state
      }
  }, []);

  const migrateGuestData = async (userId: string, guestProfile: StartupProfile) => {
      console.log("Migrating guest data to user account...");
      toast("Syncing your guest data to the cloud...", "info");

      try {
          // 1. Create Profile
          const newProfile = await ProfileService.create(guestProfile, userId);
          setProfile(newProfile); // Update UI with real ID

          const startupId = newProfile.id;

          // 2. Migrate Children (One-way sync)
          // Founders
          const lFounders = localStorage.getItem('guest_founders');
          if (lFounders) await ProfileService.syncFounders(startupId, JSON.parse(lFounders));
          
          // Decks
          const lDecks = localStorage.getItem('guest_decks');
          if (lDecks) {
              const decks: Deck[] = JSON.parse(lDecks);
              for (const deck of decks) {
                  await DeckService.create(deck, startupId);
              }
          }

          // Deals
          const lDeals = localStorage.getItem('guest_deals');
          if (lDeals) {
              const deals: Deal[] = JSON.parse(lDeals);
              for (const deal of deals) await CrmService.createDeal(deal, startupId);
          }

          // Contacts
          const lContacts = localStorage.getItem('guest_contacts');
          if (lContacts) {
              const contacts: Contact[] = JSON.parse(lContacts);
              for (const contact of contacts) await CrmService.createContact(contact, startupId);
          }

          // Tasks
          const lTasks = localStorage.getItem('guest_tasks');
          if (lTasks) {
              const tasks: Task[] = JSON.parse(lTasks);
              for (const task of tasks) await CrmService.createTask(task, startupId);
          }

          // Docs
          const lDocs = localStorage.getItem('guest_docs');
          if (lDocs) {
              const docs: InvestorDoc[] = JSON.parse(lDocs);
              for (const doc of docs) await DocumentService.create(doc, startupId, userId);
          }

          // Migrate User Profile (My Profile)
          const guestUserStr = localStorage.getItem('guest_user_profile');
          if (guestUserStr) {
              const guestUser = JSON.parse(guestUserStr);
              // Only migrate if there's data
              await UserService.updateProfile(userId, guestUser);
          }

          // Clear Guest Data
          localStorage.removeItem('guest_profile');
          localStorage.removeItem('guest_founders');
          localStorage.removeItem('guest_decks');
          localStorage.removeItem('guest_deals');
          localStorage.removeItem('guest_contacts');
          localStorage.removeItem('guest_tasks');
          localStorage.removeItem('guest_docs');
          localStorage.removeItem('guest_metrics');
          localStorage.removeItem('guest_insights');
          localStorage.removeItem('guest_activities');
          localStorage.removeItem('guest_user_profile');

          console.log("Migration complete.");
          success("Data migration complete!");
          return true;
      } catch (e) {
          console.error("Migration failed", e);
          error("Failed to migrate some data. Please check your connection.");
          return false;
      }
  };

  const loadData = useCallback(async () => {
      setIsLoading(true);
      try {
          // 1. Offline Check
          if (!navigator.onLine) throw new Error("Offline");

          // 2. Try Supabase if available
          if (supabase) {
              // Add race condition to prevent hanging on poor connections
              const authPromise = supabase.auth.getUser();
              const timeoutPromise = new Promise((_, reject) => 
                  setTimeout(() => reject(new Error("Connection timeout")), 5000)
              );

              const { data: { user } } = await Promise.race([authPromise, timeoutPromise]) as any;
              
              if (user) {
                  // LOGGED IN USER
                  
                  // A. Fetch User Profile
                  const loadedUserProfile = await UserService.getProfile(user.id);
                  if (loadedUserProfile) setUserProfile(loadedUserProfile);

                  // B. Fetch Startup Profile
                  const { profile: p, founders: f } = await ProfileService.getByUserId(user.id);
                  
                  if (p) {
                      // HAS PROFILE -> Load normally
                      setProfile(p);
                      setFounders(f);
                      
                      // Load Relations in parallel
                      const results = await Promise.allSettled([
                          DeckService.getAll(p.id),
                          CrmService.getDeals(p.id),
                          DocumentService.getAll(p.id),
                          CrmService.getTasks(p.id),
                          DashboardService.getMetricsHistory(p.id),
                          DashboardService.getInsights(p.id),
                          DashboardService.getActivities(p.id),
                          CrmService.getContacts(p.id)
                      ]);

                      const unwrap = <T,>(result: PromiseSettledResult<T>, fallback: T): T => 
                          result.status === 'fulfilled' ? result.value : fallback;

                      setDecks(unwrap(results[0], []));
                      setDeals(unwrap(results[1], []));
                      setDocs(unwrap(results[2], []));
                      setTasks(unwrap(results[3], []));
                      setMetrics(unwrap(results[4], []));
                      setInsights(unwrap(results[5], []));
                      setActivities(unwrap(results[6], []));
                      setContacts(unwrap(results[7], []));

                      // Realtime Setup
                      if (realtimeChannelRef.current) supabase.removeChannel(realtimeChannelRef.current);
                      const channel = supabase.channel('public-db-changes')
                        .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_deals', filter: `startup_id=eq.${p.id}` }, (payload: any) => {
                            if (payload.eventType === 'INSERT') setDeals(prev => [...prev, mapDealFromDB(payload.new)]);
                            else if (payload.eventType === 'UPDATE') setDeals(prev => prev.map(d => d.id === payload.new.id ? mapDealFromDB(payload.new) : d));
                            else if (payload.eventType === 'DELETE') setDeals(prev => prev.filter(d => d.id !== payload.old.id));
                        })
                        .subscribe();
                      realtimeChannelRef.current = channel;

                      setIsLoading(false);
                      return; // Done loading real user data
                  } else {
                      // AUTHENTICATED BUT NO REMOTE PROFILE
                      // CHECK FOR GUEST DATA TO MIGRATE
                      const guestProfileStr = localStorage.getItem('guest_profile');
                      if (guestProfileStr) {
                          const guestProfile = JSON.parse(guestProfileStr);
                          await migrateGuestData(user.id, guestProfile);
                          // Recursive call to reload the migrated data
                          loadData();
                          return;
                      } else {
                          // Truly new user, clear everything for fresh onboarding
                          setProfile(null);
                          setUserProfile(null);
                          setFounders([]);
                          setMetrics([]);
                          setInsights([]);
                          setActivities([]);
                          setTasks([]);
                          setDecks([]);
                          setDeals([]);
                          setContacts([]);
                          setDocs([]);
                      }
                  }
              }
          }
          
          // 2. Fallback: No User or No Supabase -> Load Guest Data
          loadGuestData();

      } catch (e) {
          console.warn("Data Load Error (Falling back to local):", e);
          // Fallback to guest data on network error, timeout, or offline
          loadGuestData();
      } finally {
          setIsLoading(false);
      }
  }, [loadGuestData]);

  useEffect(() => {
    loadData();
    
    // Only set up auth listener if supabase is initialized
    if (supabase) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string) => {
            if (event === 'SIGNED_IN') loadData();
            else if (event === 'SIGNED_OUT') {
                setProfile(null);
                loadGuestData(); // Revert to guest data or mocks on logout
            }
        });
        return () => {
            subscription.unsubscribe();
            if (realtimeChannelRef.current) supabase.removeChannel(realtimeChannelRef.current);
        };
    }
  }, [loadData, loadGuestData]);

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
    contacts, setContacts,
    docs, setDocs,
    isLoading
  };
};
