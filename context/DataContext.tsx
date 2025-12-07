import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StartupProfile, MetricsSnapshot, AICoachInsight, Founder, StartupStage, Activity, Task, Deck } from '../types';
import { initialDatabaseState } from '../data/mockDatabase';

interface DataContextType {
  profile: StartupProfile | null;
  metrics: MetricsSnapshot[];
  insights: AICoachInsight[];
  activities: Activity[];
  tasks: Task[];
  decks: Deck[];
  updateProfile: (data: Partial<StartupProfile>) => void;
  updateMetrics: (data: Partial<MetricsSnapshot>) => void;
  setInsights: (insights: AICoachInsight[]) => void;
  addInsight: (insight: AICoachInsight) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'startupId' | 'timestamp'>) => void;
  addTask: (task: Omit<Task, 'id' | 'startupId'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addDeck: (deck: Omit<Deck, 'id' | 'startupId'>) => void;
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
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addDeck = (data: Omit<Deck, 'id' | 'startupId'>) => {
      const newDeck: Deck = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          startupId: profile?.id || 'unknown'
      };
      setDecks(prev => [newDeck, ...prev]);
  }

  return (
    <DataContext.Provider value={{ 
      profile, 
      metrics, 
      insights, 
      activities, 
      tasks,
      decks,
      updateProfile, 
      updateMetrics, 
      setInsights,
      addInsight, 
      addActivity, 
      addTask,
      updateTask,
      deleteTask,
      addDeck,
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