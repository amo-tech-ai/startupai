import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StartupProfile, MetricsSnapshot, AICoachInsight, Founder, StartupStage } from '../types';
import { initialDatabaseState } from '../data/mockDatabase';

interface DataContextType {
  profile: StartupProfile | null;
  metrics: MetricsSnapshot[];
  insights: AICoachInsight[];
  updateProfile: (data: Partial<StartupProfile>) => void;
  updateMetrics: (data: Partial<MetricsSnapshot>) => void;
  addInsight: (insight: AICoachInsight) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with the mock DB state, but typically this would be null until fetch
  const [profile, setProfile] = useState<StartupProfile | null>(initialDatabaseState.profile);
  const [metrics, setMetrics] = useState<MetricsSnapshot[]>(initialDatabaseState.metrics);
  const [insights, setInsights] = useState<AICoachInsight[]>(initialDatabaseState.insights);
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = (data: Partial<StartupProfile>) => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setProfile((prev) => {
        if (!prev) return data as StartupProfile;
        return { ...prev, ...data, updatedAt: new Date().toISOString() };
      });
      setIsLoading(false);
    }, 500);
  };

  const updateMetrics = (data: Partial<MetricsSnapshot>) => {
    setMetrics((prev) => {
      const current = prev[0] || {}; // Assuming single snapshot for MVP
      const updated = { ...current, ...data, recordedAt: new Date().toISOString() };
      return [updated as MetricsSnapshot];
    });
  };

  const addInsight = (insight: AICoachInsight) => {
    setInsights((prev) => [insight, ...prev]);
  };

  return (
    <DataContext.Provider value={{ profile, metrics, insights, updateProfile, updateMetrics, addInsight, isLoading }}>
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
