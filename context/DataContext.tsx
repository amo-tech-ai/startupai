import React, { createContext, useContext, useState, useRef } from 'react';
import { DataContextType } from './DataContextTypes';
import { useSupabaseData } from './hooks/useSupabaseData';
import { useAppActions } from './hooks/useAppActions';
import { useToast } from './ToastContext';

interface UndoState {
  itemId: string;
  type: 'deal' | 'contact' | 'task' | 'doc';
  data: any;
  // Fix: Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout to avoid NodeJS namespace issues in browser environments
  timer: ReturnType<typeof setTimeout>;
}

const DataContext = createContext<(DataContextType & { 
  undoAction: UndoState | null,
  performSoftDelete: (type: UndoState['type'], id: string, action: () => Promise<void>) => void,
  triggerUndo: () => void 
}) | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast, success } = useToast();
  const [undoAction, setUndoAction] = useState<UndoState | null>(null);

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
    events, setEvents,
    isLoading
  } = useSupabaseData();

  const actions = useAppActions({
    profile, userProfile, founders,
    setProfile, setUserProfile, setFounders,
    setMetrics, setInsights, setActivities,
    setTasks, setDecks, setDeals, setContacts, setDocs
  });

  // --- Production Safety Logic: Undo ---
  const performSoftDelete = (type: UndoState['type'], id: string, deleteFn: () => Promise<void>) => {
    // 1. Capture data for potential restore
    let originalData: any = null;
    if (type === 'deal') originalData = deals.find(d => d.id === id);
    if (type === 'contact') originalData = contacts.find(c => c.id === id);
    if (type === 'task') originalData = tasks.find(t => t.id === id);

    // 2. Optimistically remove from UI
    if (type === 'deal') setDeals(prev => prev.filter(d => d.id !== id));
    if (type === 'contact') setContacts(prev => prev.filter(c => c.id !== id));
    if (type === 'task') setTasks(prev => prev.filter(t => t.id !== id));

    // 3. Set Undo Timer (5 seconds)
    const timer = setTimeout(async () => {
      await deleteFn(); // Commit delete to backend after timeout
      setUndoAction(null);
    }, 5000);

    setUndoAction({ itemId: id, type, data: originalData, timer });
    toast(`Item moved to trash.`, 'info');
  };

  const triggerUndo = () => {
    if (!undoAction) return;
    clearTimeout(undoAction.timer);
    
    // Restore UI state
    const { type, data } = undoAction;
    if (type === 'deal') setDeals(prev => [...prev, data]);
    if (type === 'contact') setContacts(prev => [...prev, data]);
    if (type === 'task') setTasks(prev => [data, ...prev]);

    setUndoAction(null);
    success("Action undone.");
  };

  return (
    <DataContext.Provider value={{ 
      profile, userProfile, founders, metrics, insights, activities, tasks, decks, deals, contacts, docs, events,
      isLoading,
      ...actions,
      undoAction,
      performSoftDelete,
      triggerUndo
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