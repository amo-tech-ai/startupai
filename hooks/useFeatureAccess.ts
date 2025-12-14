
import { useData } from '../context/DataContext';
import { useMemo } from 'react';

type PlanTier = 'free' | 'founder' | 'growth';

const LIMITS = {
  free: {
    decks: 1,
    events: 1,
    deals: 10,
    docs: 2,
    aiModel: 'gemini-2.5-flash', // Basic
  },
  founder: {
    decks: Infinity,
    events: 5,
    deals: Infinity,
    docs: 20,
    aiModel: 'gemini-3-pro-preview', // Advanced
  },
  growth: {
    decks: Infinity,
    events: Infinity,
    deals: Infinity,
    docs: Infinity,
    aiModel: 'gemini-3-pro-preview', // Advanced
  }
};

export const useFeatureAccess = () => {
  const { profile, decks, deals, docs, metrics } = useData();
  
  const plan: PlanTier = (profile?.plan as PlanTier) || 'free';
  const limits = LIMITS[plan];

  // Helper to check counts, treating guest mode as 'free'
  const checkLimit = (currentCount: number, limit: number) => currentCount < limit;

  // We fetch event count from local storage for guests or rely on a rough estimate if not loaded
  // For production, this should ideally come from a count query, but client-side length is fine for MVP
  const eventsCount = 0; // Events are fetched in dashboard, assuming 0 for checking unless passed explicitly

  const features = useMemo(() => ({
    canCreateDeck: checkLimit(decks.length, limits.decks),
    canCreateDeal: checkLimit(deals.filter(d => d.stage !== 'Closed').length, limits.deals),
    canCreateDoc: checkLimit(docs.length, limits.docs),
    canCreateEvent: (currentEventsCount: number) => checkLimit(currentEventsCount, limits.events),
    
    // Usage Data for UI
    usage: {
      decks: { current: decks.length, limit: limits.decks },
      deals: { current: deals.filter(d => d.stage !== 'Closed').length, limit: limits.deals },
      docs: { current: docs.length, limit: limits.docs },
    },
    
    plan,
    isPro: plan !== 'free'
  }), [profile, decks, deals, docs, plan]);

  return features;
};
