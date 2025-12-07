
import { supabase } from '../../lib/supabaseClient';
import { MetricsSnapshot, AICoachInsight, Activity } from '../../types';
import { 
    mapMetricsFromDB, mapMetricsToDB, 
    mapInsightFromDB, mapInsightToDB,
    mapActivityFromDB, mapActivityToDB 
} from '../../lib/mappers';

export const DashboardService = {
  /**
   * METRICS
   */
  async getMetricsHistory(startupId: string): Promise<MetricsSnapshot[]> {
    if (!supabase) return [];
    
    const { data } = await supabase
        .from('startup_metrics_snapshots')
        .select('*')
        .eq('startup_id', startupId)
        .order('snapshot_date', { ascending: true }) // Ascending for charts
        .limit(12);

    return data ? data.map(mapMetricsFromDB) : [];
  },

  async updateMetrics(metrics: Partial<MetricsSnapshot>, startupId: string): Promise<void> {
    if (!supabase) return;
    
    const payload = mapMetricsToDB(metrics, startupId);
    
    // Upsert to handle same-day updates (assumes unique constraint on startup_id + snapshot_date)
    const { error } = await supabase
        .from('startup_metrics_snapshots')
        .upsert(payload, { onConflict: 'startup_id, snapshot_date' });
        
    if (error) console.error("Error saving metrics", error);
  },

  /**
   * AI INSIGHTS
   */
  async getInsights(startupId: string): Promise<AICoachInsight[]> {
    if (!supabase) return [];

    const { data } = await supabase
        .from('ai_coach_insights')
        .select('*')
        .eq('startup_id', startupId)
        .order('created_at', { ascending: false });

    return data ? data.map(mapInsightFromDB) : [];
  },

  async saveInsights(insights: AICoachInsight[], startupId: string): Promise<void> {
    if (!supabase || insights.length === 0) return;

    const payload = insights.map(i => mapInsightToDB(i, startupId));
    
    const { error } = await supabase.from('ai_coach_insights').insert(payload);
    if (error) console.error("Error saving insights", error);
  },

  /**
   * ACTIVITIES
   */
  async getActivities(startupId: string): Promise<Activity[]> {
    if (!supabase) return [];

    const { data } = await supabase
        .from('crm_activities')
        .select('*')
        .eq('startup_id', startupId)
        .order('occurred_at', { ascending: false })
        .limit(20);

    return data ? data.map(mapActivityFromDB) : [];
  },

  async logActivity(activity: Omit<Activity, 'id' | 'startupId' | 'timestamp'>, startupId: string): Promise<void> {
    if (!supabase) return;

    const payload = mapActivityToDB(activity, startupId);
    const { error } = await supabase.from('crm_activities').insert(payload);
    if (error) console.error("Error logging activity", error);
  }
};
