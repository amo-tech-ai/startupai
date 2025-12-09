
import { 
  StartupProfile, UserProfile, Founder, MetricsSnapshot, 
  AICoachInsight, Activity, Task, Deck, Deal, InvestorDoc 
} from '../../types';

// Domain Hooks
import { useProfileActions } from './actions/useProfileActions';
import { useDashboardActions } from './actions/useDashboardActions';
import { useDeckActions } from './actions/useDeckActions';
import { useCrmActions } from './actions/useCrmActions';
import { useDocumentActions } from './actions/useDocumentActions';
import { useAssetActions } from './actions/useAssetActions';

interface AppActionsProps {
  profile: StartupProfile | null;
  userProfile: UserProfile | null;
  founders: Founder[];
  setProfile: React.Dispatch<React.SetStateAction<StartupProfile | null>>;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setFounders: React.Dispatch<React.SetStateAction<Founder[]>>;
  setMetrics: React.Dispatch<React.SetStateAction<MetricsSnapshot[]>>;
  setInsights: React.Dispatch<React.SetStateAction<AICoachInsight[]>>;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  setDocs: React.Dispatch<React.SetStateAction<InvestorDoc[]>>;
}

export const useAppActions = ({
  profile, userProfile, founders,
  setProfile, setUserProfile, setFounders,
  setMetrics, setInsights, setActivities,
  setTasks, setDecks, setDeals, setDocs
}: AppActionsProps) => {

  // 1. Profile Actions (Core)
  const profileActions = useProfileActions({
    profile, userProfile, founders, 
    setProfile, setUserProfile, setFounders
  });

  // 2. Dashboard Actions
  const dashboardActions = useDashboardActions({
    profile, setMetrics, setInsights, setActivities,
    isGuestMode: profileActions.isGuestMode
  });

  // 3. Asset Actions
  const assetActions = useAssetActions(profile, userProfile);

  // 4. Deck Actions
  const deckActions = useDeckActions({
    profile, setDecks, 
    isGuestMode: profileActions.isGuestMode
  });

  // 5. CRM Actions
  const crmActions = useCrmActions({
    profile, setDeals, setTasks, 
    isGuestMode: profileActions.isGuestMode
  });

  // 6. Document Actions
  const documentActions = useDocumentActions({
    profile, setDocs, 
    isGuestMode: profileActions.isGuestMode
  });

  return {
    // Flattened API surface to match original hook contract
    ...profileActions,
    ...dashboardActions,
    ...assetActions,
    ...deckActions,
    ...crmActions,
    ...documentActions
  };
};
