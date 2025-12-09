
import { supabase } from '../../../lib/supabaseClient';
import { generateShortId } from '../../../lib/utils';
import { InvestorDoc, StartupProfile } from '../../../types';
import { DocumentService } from '../../../services/supabase/documents';

interface DocumentActionsProps {
  profile: StartupProfile | null;
  setDocs: React.Dispatch<React.SetStateAction<InvestorDoc[]>>;
  isGuestMode: () => boolean;
}

export const useDocumentActions = ({
  profile,
  setDocs,
  isGuestMode
}: DocumentActionsProps) => {

  const persistGuestData = (key: string, data: any) => {
    if (isGuestMode()) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const addDoc = async (data: Omit<InvestorDoc, 'id' | 'startupId' | 'updatedAt'>) => {
      const tempId = generateShortId();
      const newDoc = { ...data, id: tempId, startupId: profile?.id || 'temp', updatedAt: new Date().toISOString() };
      
      setDocs(prev => {
          const newState = [newDoc, ...prev];
          persistGuestData('guest_docs', newState);
          return newState;
      });

      if (profile?.id && supabase && !isGuestMode()) {
          try {
              const { data: { user } } = await (supabase.auth as any).getUser();
              if(user) {
                  const realId = await DocumentService.create(data, profile.id, user.id);
                  setDocs(prev => prev.map(d => d.id === tempId ? { ...d, id: realId } : d));
                  return realId;
              }
          } catch (e) { console.error(e); }
      }
      return tempId;
  };

  const updateDoc = async (id: string, updates: Partial<InvestorDoc>) => {
      setDocs(prev => {
          const newState = prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d);
          persistGuestData('guest_docs', newState);
          return newState;
      });
      if (profile?.id && !isGuestMode()) {
          await DocumentService.update(id, updates);
      }
  };

  const deleteDoc = async (id: string) => {
      setDocs(prev => {
          const newState = prev.filter(d => d.id !== id);
          persistGuestData('guest_docs', newState);
          return newState;
      });
      if (profile?.id && !isGuestMode()) {
          await DocumentService.delete(id);
      }
  };

  return { addDoc, updateDoc, deleteDoc };
};