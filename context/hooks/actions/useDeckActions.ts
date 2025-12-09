
import { generateShortId } from '../../../lib/utils';
import { Deck, StartupProfile } from '../../../types';
import { DeckService } from '../../../services/supabase/decks';
import { useToast } from '../../ToastContext';

interface DeckActionsProps {
  profile: StartupProfile | null;
  setDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
  isGuestMode: () => boolean;
}

export const useDeckActions = ({
  profile,
  setDecks,
  isGuestMode
}: DeckActionsProps) => {
  const { error: toastError } = useToast();

  const persistGuestData = (key: string, data: any) => {
    if (isGuestMode()) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const addDeck = async (data: Omit<Deck, 'id' | 'startupId'>): Promise<string> => {
      const tempId = generateShortId();
      const newDeck: Deck = { ...data, id: tempId, startupId: profile?.id || 'temp' };
      
      setDecks(prev => {
          const newState = [newDeck, ...prev];
          persistGuestData('guest_decks', newState);
          return newState;
      });

      if (profile?.id && !isGuestMode()) {
          try {
              const realDeck = await DeckService.create(data, profile.id);
              // Optimistic update correction
              setDecks(prev => prev.map(d => d.id === tempId ? realDeck : d));
              return realDeck.id;
          } catch (e) {
              console.error(e);
              toastError("Failed to save deck");
              // Fallback to tempId in case of error so user isn't stuck
              return tempId;
          }
      }
      return tempId;
  };

  const updateDeck = async (id: string, updates: Partial<Deck>) => {
      setDecks(prev => {
          const newState = prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d);
          persistGuestData('guest_decks', newState);
          return newState;
      });
      if (profile?.id && !isGuestMode()) {
          await DeckService.update(id, updates);
      }
  };

  return { addDeck, updateDeck };
};
