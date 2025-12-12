
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
  // AI analysis fields
  headline?: string;
  experience_bullets?: string[];
  skills?: string[];
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
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  headline?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  socials: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  phone?: string;
  experiences: UserProfileExperience[];
  education: UserProfileEducation[];
  skills: string[];
  plan?: 'free' | 'founder' | 'growth';
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

export interface MetricsSnapshot {
  id: string;
  startupId: string;
  period: string; // ISO Date or "Oct 2023"
  mrr: number;
  activeUsers: number;
  cac?: number;
  ltv?: number;
  burnRate?: number;
  runwayMonths?: number;
  cashBalance?: number;
  recordedAt?: string;
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

export interface DocSection {
  id: string;
  title: string;
  content: string; // HTML
}

export interface InvestorDoc {
  id: string;
  startupId: string;
  userId?: string;
  title: string;
  type: string; // Pitch Deck, One-Pager, etc.
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

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface StartupProfileDTO {
  startup_id: string;
  context: any;
  founders: any[];
  metrics: any;
  competitors: string[];
}
