
import { generateShortId } from '../../../lib/utils';
import { MetricsSnapshot, AICoachInsight, Activity, StartupProfile } from '../../../types';
import { DashboardService } from '../../../services/supabase/dashboard';

interface DashboardActionsProps {
  profile: StartupProfile | null;
  setMetrics: React.Dispatch<React.SetStateAction<MetricsSnapshot[]>>;
  setInsights: React.Dispatch<React.SetStateAction<AICoachInsight[]>>;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  isGuestMode: () => boolean;
}

export const useDashboardActions = ({
  profile,
  setMetrics,
  setInsights,
  setActivities,
  isGuestMode
}: DashboardActionsProps) => {

  const persistGuestData = (key: string, data: any) => {
    if (isGuestMode()) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

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
                cashBalance: data.cashBalance || (last?.cashBalance || 0),
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

  return { updateMetrics, setInsights: setInsightsHandler, addInsight, addActivity };
};
