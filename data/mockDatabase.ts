
import { Deal, StartupProfile, UserProfile, Founder, MetricsSnapshot, AICoachInsight, Activity, Task, Deck, Contact, InvestorDoc } from '../types';

const mockDeals: Deal[] = [
  {
    id: "deal_1",
    startupId: "st_123456",
    company: "Acme Corp",
    value: 50000,
    stage: 'Qualified',
    probability: 40,
    sector: "SaaS",
    nextAction: "Schedule Demo",
    dueDate: "Next Week",
    ownerInitial: "ME",
    ownerColor: "bg-indigo-500",
    contactPerson: "John Doe",
    contactEmail: "john@acme.com",
    notes: "Met at TechCrunch Disrupt. Interested in enterprise plan."
  },
  {
    id: "deal_2",
    startupId: "st_123456",
    company: "Stark Industries",
    value: 120000,
    stage: 'Proposal',
    probability: 70,
    sector: "Enterprise",
    nextAction: "Send Contract",
    dueDate: "Tomorrow",
    ownerInitial: "JD",
    ownerColor: "bg-emerald-500",
    contactPerson: "Pepper Potts",
    contactEmail: "ceo@stark.com",
    notes: "Reviewing security compliance docs."
  }
];

export const initialDatabaseState = {
  profile: null as StartupProfile | null,
  userProfile: null as UserProfile | null,
  founders: [] as Founder[],
  metrics: [] as MetricsSnapshot[],
  insights: [] as AICoachInsight[],
  activities: [] as Activity[],
  tasks: [] as Task[],
  decks: [] as Deck[],
  deals: mockDeals,
  contacts: [] as Contact[],
  docs: [] as InvestorDoc[]
};
