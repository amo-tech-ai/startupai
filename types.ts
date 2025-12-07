/**
 * Database Schema Definitions
 * ---------------------------
 * These interfaces mirror the SQL schema requirements for the Startup Wizard.
 * They provide type safety for the frontend application and simulate the 
 * structure of the backend tables.
 */

export type StartupStage = 'Idea' | 'MVP' | 'Seed' | 'Series A' | 'Growth' | 'Scale';

// Table: startups
export interface StartupProfile {
  id: string;
  userId: string; // For Row-Level Security (RLS) simulation
  name: string;
  tagline: string;
  description: string;
  mission: string;
  stage: StartupStage;
  problemStatement: string;
  solutionStatement: string;
  businessModel: string; // e.g., "B2B SaaS", "Marketplace"
  targetMarket: string;
  fundingGoal: number;
  currency: string;
  websiteUrl?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Table: startup_founders
export interface Founder {
  id: string;
  startupId: string;
  name: string;
  role: string; // e.g., "CEO", "CTO"
  bio: string;
  linkedinProfile?: string;
  avatarUrl?: string;
  isPrimaryContact: boolean;
}

// Table: startup_competitors
export interface Competitor {
  id: string;
  startupId: string;
  name: string;
  strength: string;
  weakness: string;
  differentiation: string; // How we win
  websiteUrl?: string;
}

// Table: startup_metrics_snapshots
export interface MetricsSnapshot {
  id: string;
  startupId: string;
  period: string; // e.g., "2023-10"
  mrr: number;
  activeUsers: number;
  cac: number; // Customer Acquisition Cost
  ltv: number; // Lifetime Value
  burnRate: number;
  runwayMonths: number;
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

// Complete Schema Context for Application State
export interface StartupDatabaseSchema {
  profile: StartupProfile | null;
  founders: Founder[];
  competitors: Competitor[];
  metrics: MetricsSnapshot[];
  insights: AICoachInsight[];
}
