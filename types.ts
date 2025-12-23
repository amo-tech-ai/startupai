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

export interface StartupProfileDTO {
  startup_id: string;
  context: any;
  founders: any[];
  metrics: any;
  competitors: string[];
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
}

export interface UserProfileExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface UserProfileEducation {
  id: string;
  school: string;
  degree: string;
  year: string;
  logoUrl?: string;
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
  experiences: UserProfileExperience[];
  education: UserProfileEducation[];
  skills: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface EventBudgetItem {
  id: string;
  category: 'Venue' | 'Food' | 'Marketing' | 'Speakers' | 'Ops' | 'Other';
  item: string;
  estimated: number;
  actual: number;
  status: 'Planned' | 'Pending' | 'Paid';
}

export interface EventAttendee {
  id: string;
  eventId: string;
  name: string;
  email: string;
  ticketType: string;
  status: 'Registered' | 'Attended';
  registeredAt: string;
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
  sponsorUrls: string[];
  inspirationUrls: string[];
  searchTerms: string[];
  strategy?: EventStrategyAnalysis;
  logistics?: EventLogisticsAnalysis;
  roi?: EventROIAnalysis;
  status?: 'Planning' | 'Scheduled' | 'Completed';
  isPublic?: boolean;
  budget_total?: number;
  budget_spent?: number;
  budget_items?: EventBudgetItem[];
  createdAt?: string;
}

export interface EventStrategyAnalysis {
  feasibilityScore: number;
  reasoning: string;
  risks: Array<{ title: string; severity: 'High' | 'Medium' | 'Low' }>;
  suggestedThemes: string[];
  audienceProfile: string;
  budgetEstimate: { low: number; high: number; currency: string };
}

export interface EventLogisticsAnalysis {
  conflicts: Array<{ name: string; date: string; impact: 'High' | 'Medium' | 'Low' }>;
  weatherForecast?: string;
  venueInsights?: string;
  suggestedVenues?: Array<{ 
    name: string; 
    capacity: string; 
    cost: string; 
    notes: string;
    mapsUri?: string;
    reviewSnippets?: string[];
  }>;
}

export interface EventROIAnalysis {
  score: number;
  costPerAttendee: number;
  summary: string;
  highlights: string[];
  improvements: string[];
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

export interface EventAsset {
  id: string;
  eventId: string;
  type: 'image' | 'copy' | 'email';
  title: string;
  content: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface DataRoomFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'scanning' | 'clean' | 'infected';
}

// NEW AGENTIC TYPES
export type AgentRunStatus = 'queued' | 'running' | 'needs_user' | 'complete' | 'error' | 'canceled';

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

export interface AgentAction {
  label: string;
  tool: string;
  args: any;
  requiresConfirmation: boolean;
  confidence: number;
  reasoning: string;
}
