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

/**
 * Fix: Added UserProfileExperience to resolve error in components/profile/ExperienceSection.tsx
 */
export interface UserProfileExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

/**
 * Fix: Added UserProfileEducation to resolve error in components/profile/EducationSection.tsx
 */
export interface UserProfileEducation {
  id: string;
  school: string;
  degree: string;
  year: string;
  logoUrl?: string;
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

/**
 * Fix: Added StartupProfileDTO to resolve error in hooks/useStartupProfile.ts
 */
export interface StartupProfileDTO {
  startup_id: string;
  context: {
    name: string;
    tagline?: string;
    description?: string;
    mission?: string;
    website_url?: string;
    logo_url?: string;
    cover_image_url?: string;
    industry?: string;
    year_founded?: number;
    stage?: string;
    problem_statement?: string;
    solution_statement?: string;
    business_model?: string;
    pricing_model?: string;
    funding_goal?: number;
    is_raising: boolean;
    is_public: boolean;
    target_market?: string;
    competitors?: string[];
    key_features?: string[];
    use_of_funds?: string[];
    deep_research_report?: any;
  };
  founders: Array<{
    id: string;
    full_name: string;
    role: string;
    bio: string;
    linkedin_url?: string;
    email?: string;
    avatar_url?: string;
    is_primary: boolean;
  }>;
  metrics?: any;
  competitors?: string[];
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

export interface DocSection {
  id: string;
  title: string;
  content: string;
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
  deleted_at?: string;
  // AI Intelligence Vectors
  fit_score?: number;
  sentiment_score?: number; 
  warm_hook?: string;
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

export interface EventAsset {
  id: string;
  eventId: string;
  type: 'image' | 'copy' | 'email';
  title: string;
  content: string;
  createdAt: string;
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
  /**
   * Fix: Added missing properties to EventData to resolve errors in core.ts and useEventWizard.ts
   */
  sponsorUrls: string[];
  inspirationUrls: string[];
  searchTerms: string[];
  status?: string;
  isPublic?: boolean;
  strategy?: any;
  logistics?: any;
  roi?: any;
  budget_total?: number;
  budget_spent?: number;
  budget_items?: any[];
}

export interface EventTask {
  id: string;
  eventId: string;
  title: string;
  phase: 'Strategy' | 'Planning' | 'Marketing' | 'Operations' | 'Post-Event';
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string;
  assignee?: string;
  is_ai_generated?: boolean;
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
  entityId: string; 
  type: ActionType;
  label: string;
  description: string;
  payload: any; 
  status: ActionStatus;
  reasoning: string;
  confidence: number;
  createdAt: string;
  idempotencyKey?: string;
}

/**
 * Fix: Added EventStrategyAnalysis to resolve errors in Step2Strategy.tsx and strategy.ts
 */
export interface EventStrategyAnalysis {
  feasibilityScore: number;
  reasoning: string;
  risks: Array<{ title: string; severity: 'High' | 'Medium' | 'Low' }>;
  suggestedThemes: string[];
  audienceProfile: string;
  budgetEstimate: { low: number; high: number; currency: string };
}

/**
 * Fix: Added EventLogisticsAnalysis to resolve errors in Step3Logistics.tsx and logistics.ts
 */
export interface EventLogisticsAnalysis {
  conflicts: Array<{ name: string; date: string; impact: 'High' | 'Medium' | 'Low' }>;
  weatherForecast: string;
  venueInsights: string;
  suggestedVenues: Array<{
    name: string;
    capacity: string;
    cost: string;
    notes: string;
    mapsUri?: string;
    reviewSnippets?: string[];
  }>;
}

/**
 * Fix: Added EventBudgetItem to resolve errors in eventPrompts.ts, EventBudget.tsx, and finance.ts
 */
export interface EventBudgetItem {
  id: string;
  category: 'Venue' | 'Food' | 'Marketing' | 'Speakers' | 'Ops' | 'Other' | string;
  item: string;
  estimated: number;
  actual: number;
  status: 'Planned' | 'Pending' | 'Paid';
}

/**
 * Fix: Added EventROIAnalysis to resolve errors in finance.ts
 */
export interface EventROIAnalysis {
  score: number;
  costPerAttendee: number;
  summary: string;
  highlights: string[];
  improvements: string[];
}

/**
 * Fix: Added EventAttendee to resolve errors in EventAttendees.tsx and attendees.ts
 */
export interface EventAttendee {
  id: string;
  eventId: string;
  name: string;
  email: string;
  ticketType: string;
  status: 'Registered' | 'Attended';
  registeredAt: string;
}

/**
 * Fix: Added AppNotification to resolve error in context/NotificationContext.tsx
 */
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
}

/**
 * Fix: Added DataRoomFile to resolve error in components/documents/DataRoom.tsx
 */
export interface DataRoomFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'clean' | 'scanning' | 'flagged';
}
