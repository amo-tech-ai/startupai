
import { StartupProfile, MetricsSnapshot, AICoachInsight, Founder, Activity, Task, Deck, Deal, InvestorDoc, UserProfile, Contact, EventData } from '../types';

export interface DataContextType {
  profile: StartupProfile | null;
  userProfile: UserProfile | null;
  founders: Founder[];
  metrics: MetricsSnapshot[];
  insights: AICoachInsight[];
  activities: Activity[];
  tasks: Task[];
  decks: Deck[];
  deals: Deal[];
  contacts: Contact[];
  docs: InvestorDoc[];
  events: EventData[]; // Added events
  
  createStartup: (data: Partial<StartupProfile>) => Promise<string | null>;
  updateProfile: (data: Partial<StartupProfile>) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  setFounders: (founders: Founder[]) => void;
  addFounder: (founder: Founder) => void;
  removeFounder: (id: string) => void;
  
  updateMetrics: (data: Partial<MetricsSnapshot>, overrideStartupId?: string) => void;
  setInsights: (insights: AICoachInsight[]) => void;
  addInsight: (insight: AICoachInsight) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'startupId' | 'timestamp'>) => void;
  
  addTask: (task: Omit<Task, 'id' | 'startupId'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addDeck: (deck: Omit<Deck, 'id' | 'startupId'>) => Promise<string>;
  updateDeck: (id: string, updates: Partial<Deck>) => void;
  
  addDeal: (deal: Omit<Deal, 'id' | 'startupId'>) => Promise<void>;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  
  addContact: (contact: Omit<Contact, 'id' | 'startupId' | 'createdAt'>) => Promise<void>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => void;

  addDoc: (doc: Omit<InvestorDoc, 'id' | 'startupId' | 'updatedAt'>) => Promise<string | null>;
  updateDoc: (id: string, updates: Partial<InvestorDoc>) => void;
  deleteDoc: (id: string) => void;
  
  uploadFile: (file: File, bucket: string) => Promise<string | null>;
  isLoading: boolean;
}
