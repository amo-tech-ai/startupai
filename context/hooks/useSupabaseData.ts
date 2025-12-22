import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { initialDatabaseState } from '../../data/mockDatabase';
import { 
  StartupProfile, UserProfile, Founder, MetricsSnapshot, 
  AICoachInsight, Activity, Task, Deck, Deal, InvestorDoc,
  Contact, EventData
} from '../../types';
import { ProfileService } from '../../services/supabase/profile';
import { UserService } from '../../services/supabase/user';
import { DeckService } from '../../services/supabase/decks';
import { CrmService } from '../../services/supabase/crm';
import { DocumentService } from '../../services/supabase/documents';
import { DashboardService } from '../../services/supabase/dashboard';
import { EventService } from '../../services/supabase/events';
import { mapDealFromDB, mapTaskFromDB } from '../../lib/mappers';
import { useToast } from '../ToastContext';

export const useSupabaseData = () => {
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
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'reconnecting' | 'offline'>('online');
  
  const realtimeChannelRef = useRef<any>(null);
  const { toast } = useToast();

  const loadGuestData = useCallback(() => {
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
              const ev = localStorage.getItem('guest_events'); if(ev) setEvents(JSON.parse(ev));
              const up = localStorage.getItem('guest_user_profile'); if(up) setUserProfile(JSON.parse(up));
          } catch(e) {
              console.error("Guest data corrupted", e);
          }
      }
  }, []);

  const loadData = useCallback(async () => {
      setIsLoading(true);
      try {
          if (supabase) {
              const { data: { user } } = await (supabase.auth as any).getUser();
              if (user) {
                  const upData = await UserService.getProfile(user.id);
                  if (upData) setUserProfile(upData);

                  const { profile: p, founders: f } = await ProfileService.getByUserId(user.id);
                  if (p) {
                      setProfile(p);
                      setFounders(f);
                      
                      const results = await Promise.all([
                          DeckService.getAll(p.id),
                          CrmService.getDeals(p.id),
                          DocumentService.getAll(p.id),
                          CrmService.getTasks(p.id),
                          DashboardService.getMetricsHistory(p.id),
                          DashboardService.getInsights(p.id),
                          DashboardService.getActivities(p.id),
                          CrmService.getContacts(p.id),
                          EventService.getAll(p.id)
                      ]);

                      setDecks(results[0]);
                      setDeals(results[1]);
                      setDocs(results[2]);
                      setTasks(results[3]);
                      setMetrics(results[4]);
                      setInsights(results[5]);
                      setActivities(results[6]);
                      setContacts(results[7]);
                      setEvents(results[8]);

                      // Multi-Table Realtime Orchestration
                      if (realtimeChannelRef.current) supabase.removeChannel(realtimeChannelRef.current);
                      
                      const channel = supabase.channel(`startup-ops-${p.id}`)
                        .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_deals', filter: `startup_id=eq.${p.id}` }, (payload: any) => {
                            if (payload.eventType === 'INSERT') setDeals(prev => [...prev, mapDealFromDB(payload.new)]);
                            else if (payload.eventType === 'UPDATE') {
                                if (payload.new.deleted_at) setDeals(prev => prev.filter(d => d.id !== payload.new.id));
                                else setDeals(prev => prev.map(d => d.id === payload.new.id ? mapDealFromDB(payload.new) : d));
                            }
                            else if (payload.eventType === 'DELETE') setDeals(prev => prev.filter(d => d.id !== payload.old.id));
                        })
                        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `startup_id=eq.${p.id}` }, (payload: any) => {
                            if (payload.eventType === 'INSERT') setTasks(prev => [...prev, mapTaskFromDB(payload.new)]);
                            else if (payload.eventType === 'UPDATE') setTasks(prev => prev.map(t => t.id === payload.new.id ? mapTaskFromDB(payload.new) : t));
                            else if (payload.eventType === 'DELETE') setTasks(prev => prev.filter(t => t.id !== payload.old.id));
                        })
                        .on('postgres_changes', { event: '*', schema: 'public', table: 'investor_docs', filter: `startup_id=eq.${p.id}` }, async () => {
                             const newDocs = await DocumentService.getAll(p.id);
                             setDocs(newDocs);
                        })
                        .subscribe((status: string) => {
                            if (status === 'SUBSCRIBED') setConnectionStatus('online');
                            if (status === 'TIMED_OUT') setConnectionStatus('reconnecting');
                            if (status === 'CHANNEL_ERROR') setConnectionStatus('offline');
                        });
                        
                      realtimeChannelRef.current = channel;
                      setIsLoading(false);
                      return;
                  }
              }
          }
          loadGuestData();
      } catch (e) {
          loadGuestData();
      } finally {
          setIsLoading(false);
      }
  }, [loadGuestData]);

  useEffect(() => {
    loadData();
    if (supabase) {
        const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((event: string) => {
            if (event === 'SIGNED_IN') loadData();
            else if (event === 'SIGNED_OUT') {
                setProfile(null);
                loadGuestData();
            }
        });
        return () => {
            subscription.unsubscribe();
            if (realtimeChannelRef.current) supabase.removeChannel(realtimeChannelRef.current);
        };
    }
  }, [loadData, loadGuestData]);

  return {
    profile, setProfile, userProfile, setUserProfile,
    founders, setFounders, metrics, setMetrics,
    insights, setInsights, activities, setActivities,
    tasks, setTasks, decks, setDecks, deals, setDeals,
    contacts, setContacts, docs, setDocs, events, setEvents,
    isLoading, connectionStatus
  };
};