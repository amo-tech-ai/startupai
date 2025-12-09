
import React, { createContext, useContext } from 'react';
import { DataContextType } from './DataContextTypes';
import { useSupabaseData } from './hooks/useSupabaseData';
import { useAppActions } from './hooks/useAppActions';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Data State & Loading Logic
  const {
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
  } = useSupabaseData();

  // 2. Action Logic
  const actions = useAppActions({
    profile, userProfile, founders,
    setProfile, setUserProfile, setFounders,
    setMetrics, setInsights, setActivities,
    setTasks, setDecks, setDeals, setContacts, setDocs
  });

  return (
    <DataContext.Provider value={{ 
      profile, userProfile, founders, metrics, insights, activities, tasks, decks, deals, contacts, docs,
      isLoading,
      ...actions
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
