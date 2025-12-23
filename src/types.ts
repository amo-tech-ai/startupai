
export type DealStage = 'Lead' | 'Qualified' | 'Meeting' | 'Proposal' | 'Closed';

export interface Deal {
  id: string;
  startupId: string;
  company: string;
  value: number;
  stage: DealStage;
  probability: number;
  sector: string;
  nextAction: string;
  dueDate: string;
  ownerInitial: string;
  ownerColor: string;
  notes?: string;
  contactPerson?: string;
  contactEmail?: string;
  lastContactDate?: string;
  // AI Intelligence Vectors
  ai_score?: number;
  ai_reasoning?: string;
  strategic_hook?: string;
  last_enriched_at?: string;
  deleted_at?: string;
}

export interface Founder {
  id: string;
  startupId?: string;
  name: string;
  title: string;
  bio: string;
  linkedinProfile?: string;
  email?: string;
  avatarUrl?: string;
  website?: string;
  isPrimaryContact?: boolean;
  headline?: string;
  experience_bullets?: string[];
  skills?: string[];
}

export interface DocSection {
  id: string;
  title: string;
  content: string;
}

export interface StartupProfile {
  id: string;
  userId: string;
  name: string;
  tagline: string;
  description?: string;
  mission?: string;
  websiteUrl?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  industry?: string;
  yearFounded?: number;
  stage: string;
  problemStatement?: string;
  solutionStatement?: string;
  businessModel?: string;
  pricingModel?: string;
  fundingGoal: number;
  isRaising: boolean;
  isPublic?: boolean;
  targetMarket?: string;
  competitors?: string[];
  keyFeatures?: string[];
  useOfFunds?: string[];
  fundingHistory?: any[]; 
  mrr?: number;
  totalUsers?: number;
  plan?: 'free' | 'founder' | 'growth';
  updatedAt?: string;
  deepResearchReport?: any; 
}

export interface MetricsSnapshot {
  id: string;
  startupId: string;
  period: string; 
  mrr: number;
  activeUsers: number;
  cac?: number;
  ltv?: number;
  burnRate?: number;
  runwayMonths?: number;
  cashBalance?: number;
  recordedAt?: string;
}

export interface StartupStats {
  startupId: string;
  currentMrr: number;
  currentUsers: number;
  burnRate: number;
  cashBalance: number;
  runwayMonths: number;
  mrrGrowthPct: number;
  profileScore: number;
  missingCriticalFields: {
    website: boolean;
    pitchDeck: boolean;
    revenue: boolean;
  };
}

export interface AICoachInsight {
  id: string;
  startupId: string;
  category: string;
  type: 'Risk' | 'Opportunity' | 'Action';
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'New' | 'Dismissed' | 'Actioned';
  generatedAt: string;
}

export interface Activity {
  id: string;
  startupId: string;
  type: 'milestone' | 'update' | 'alert' | 'system';
  title: string;
  description: string;
  timestamp: string;
}

export type TaskStatus = 'Backlog' | 'In Progress' | 'Review' | 'Done';

export interface Task {
  id: string;
  startupId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'High' | 'Medium' | 'Low';
  aiGenerated?: boolean;
  dueDate?: string;
}

export interface Slide {
  id: string;
  title: string;
  bullets: string[];
  visualDescription?: string;
  imageUrl?: string;
  chartType?: string;
  chartData?: any[];
  position?: number;
}

export interface Deck {
  id: string;
  startupId: string;
  title: string;
  template: string;
  slides: Slide[];
  updatedAt: string;
  status?: 'draft' | 'final';
  format?: string;
}

export interface InvestorDoc {
  id: string;
  startupId: string;
  title: string;
  type: string;
  content: { sections: DocSection[] };
  status: 'Draft' | 'Review' | 'Final';
  updatedAt: string;
}

export type ContactType = 'Lead' | 'Investor' | 'Customer' | 'Partner' | 'Other';

export interface Contact {
  id: string;
  startupId: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  type: ContactType;
  linkedinUrl?: string;
  tags?: string[];
  notes?: string;
  createdAt?: string;
  // AI Intelligence Vectors
  fit_score?: number;
  sentiment_score?: number; 
  warm_hook?: string;
  deleted_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  headline?: string;
  location?: string;
  bio: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  phone?: string;
  experiences: any[];
  education: any[];
  skills: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface EventData {
  id?: string;
  startupId?: string;
  name: string;
  description: string;
  type: string;
  date: string;
  duration: number;
  city: string;
  venueUrls: string[];
  status?: string;
  isPublic?: boolean;
  strategy?: any;
  logistics?: any;
  roi?: any;
  budget_total?: number;
  budget_spent?: number;
  budget_items?: any[];
}

export type AgentRunStatus = 'queued' | 'running' | 'needs_user' | 'needs_approval' | 'complete' | 'error' | 'canceled';

export interface AgentRun {
  id: string;
  orgId: string;
  agentName: string;
  status: AgentRunStatus;
  startedAt: string;
  completedAt?: string;
  payload: any;
  result?: any;
  warnings?: string[];
  idempotencyKey: string;
}

export type ActionStatus = 'proposed' | 'approved' | 'rejected' | 'executed';
export type ActionType = 'email' | 'stage_move' | 'task_creation';

export interface ProposedAction {
  id: string;
  startupId: string;
  entityId: string; // Deal ID or Contact ID
  type: ActionType;
  label: string;
  description: string;
  payload: any; // e.g., email body or target stage
  status: ActionStatus;
  reasoning: string;
  confidence: number;
  createdAt: string;
  idempotencyKey?: string;
}
