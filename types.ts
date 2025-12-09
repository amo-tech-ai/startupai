
/**
 * Database Schema Definitions
 * ---------------------------
 */

export type PageType = 
  | 'home' 
  | 'how-it-works' 
  | 'features' 
  | 'pricing' 
  | 'login' 
  | 'signup' 
  | 'onboarding'
  | 'dashboard'
  | 'pitch-decks'
  | 'crm'
  | 'documents'
  | 'tasks'
  | 'settings'
  | 'profile';

export type StartupStage = 'Idea' | 'MVP' | 'Seed' | 'Series A' | 'Growth' | 'Scale';

// Table: startups
export interface StartupProfile {
  id: string;
  userId: string; 
  name: string;
  tagline: string;
  description: string;
  mission: string;
  stage: StartupStage;
  yearFounded?: number;
  plan?: 'free' | 'founder' | 'growth';
  problemStatement: string;
  solutionStatement: string;
  businessModel: string;
  pricingModel?: string;
  targetMarket: string;
  industry?: string;
  customerSegments?: string[];
  keyFeatures?: string[];
  competitors?: string[];
  coreDifferentiator?: string;
  fundingGoal: number;
  currency: string;
  websiteUrl?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    pitchDeck?: string;
  };
  fundingHistory?: {
    id: string;
    round: string;
    date: string;
    amount: number;
    investors: string;
  }[];
  isRaising?: boolean;
  useOfFunds?: string[];
  createdAt: string;
  updatedAt: string;
}

// Table: startup_founders
export interface Founder {
  id: string;
  startupId: string;
  name: string;
  title: string;
  bio: string;
  linkedinProfile?: string;
  email?: string;
  personalWebsite?: string;
  avatarUrl?: string;
  isPrimaryContact: boolean;
}

// DTO for Full Profile Fetch (RPC Response Structure)
export interface StartupProfileDTO {
  startup_id: string;
  context: {
    name: string;
    tagline?: string;
    description?: string;
    mission?: string;
    stage?: string;
    industry?: string;
    website_url?: string;
    cover_image_url?: string;
    logo_url?: string;
    problem_statement?: string;
    solution_statement?: string;
    business_model?: string;
    pricing_model?: string;
    target_market?: string;
    funding_goal?: number;
    is_raising?: boolean;
    use_of_funds?: string[];
    year_founded?: number;
    competitors?: string[];
    key_features?: string[];
  };
  founders: {
    id: string;
    full_name: string; // RPC returns column names
    role: string;
    bio: string;
    linkedin_url?: string;
    email?: string;
    avatar_url?: string;
    is_primary?: boolean;
  }[];
  metrics: {
    id: string;
    monthly_revenue: number;
    monthly_active_users: number;
    snapshot_date: string;
  } | null;
  competitors?: string[]; // Added top level competitors from RPC aggregation
  ai_summary?: string;
  profile_strength?: number;
}

// Table: startup_competitors
export interface Competitor {
  id: string;
  startupId: string;
  name: string;
  strength?: string;
  weakness?: string;
  differentiation?: string;
  websiteUrl?: string;
}

// Table: startup_metrics_snapshots
export interface MetricsSnapshot {
  id: string;
  startupId: string;
  period: string;
  mrr: number;
  activeUsers: number;
  cac: number; 
  ltv: number; 
  burnRate: number;
  runwayMonths: number;
  cashBalance: number;
  recordedAt: string;
}

// Table: ai_coach_insights
export interface AICoachInsight {
  id: string;
  startupId: string;
  category: 'Growth' | 'Fundraising' | 'Product' | 'Team' | 'Finance';
  type: 'Risk' | 'Opportunity' | 'Action';
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'New' | 'Read' | 'Dismissed' | 'Completed';
  generatedAt: string;
}

// Table: tasks
export type TaskStatus = 'Backlog' | 'In Progress' | 'Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  startupId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignee?: string;
  aiGenerated: boolean;
}

// Table: crm_deals
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
}

// Table: crm_contacts
export interface Contact {
  id: string;
  startupId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  linkedinUrl?: string;
  createdAt: string;
}

// Table: investor_docs
export interface DocSection {
  id: string;
  title: string;
  content: string; // HTML string
}

export interface InvestorDoc {
  id: string;
  startupId: string;
  title: string;
  type: 'Pitch Deck' | 'One-Pager' | 'GTM Strategy' | 'Market Research' | 'Financial Model' | 'Product Roadmap' | 'Other';
  content: { sections: DocSection[] }; // JSONB structure
  status: 'Draft' | 'Review' | 'Final';
  updatedAt: string;
}

// Table: activity_log
export interface Activity {
  id: string;
  startupId: string;
  type: 'milestone' | 'update' | 'alert' | 'system';
  title: string;
  description: string;
  timestamp: string;
  actionUrl?: string;
}

// Table: decks
export interface Slide {
    id: string;
    title: string;
    bullets: string[];
    visualDescription?: string;
    imageUrl?: string;
    chartType?: string;
    chartData?: { label: string; value: number }[];
}

export interface Deck {
    id: string;
    startupId: string;
    title: string;
    template: 'Y Combinator' | 'Sequoia' | 'Guy Kawasaki' | 'Custom';
    slides: Slide[];
    updatedAt: string;
}

// User Profile
export interface UserProfileExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  logoUrl?: string;
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
  fullName: string;
  headline: string;
  location: string;
  bio: string;
  avatarUrl: string;
  coverImageUrl: string;
  email: string;
  phone?: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  experiences: UserProfileExperience[];
  education: UserProfileEducation[];
  skills: string[];
  completionScore: number;
}

export interface StartupDatabaseSchema {
  profile: StartupProfile | null;
  userProfile: UserProfile | null;
  founders: Founder[];
  competitors: Competitor[];
  metrics: MetricsSnapshot[];
  insights: AICoachInsight[];
  tasks: Task[];
  deals: Deal[];
  contacts: Contact[];
  docs: InvestorDoc[]; 
  activities: Activity[];
  decks: Deck[];
}
