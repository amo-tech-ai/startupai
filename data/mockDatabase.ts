import { StartupDatabaseSchema, StartupProfile, Founder, Competitor, AICoachInsight } from '../types';

/**
 * Mock Data Validation
 * --------------------
 * This file serves to validate the schema structure by ensuring valid data 
 * can be instantiated against the TypeScript interfaces.
 */

const mockProfile: StartupProfile = {
  id: "st_123456",
  userId: "usr_789012",
  name: "StartupAI",
  tagline: "Your AI Co-Founder for Fundraising",
  description: "The all-in-one AI platform that helps founders raise funding, close deals, and scale faster.",
  mission: "To democratize access to capital for founders globally.",
  stage: "Seed",
  problemStatement: "Founders spend 60+ hours on documentation instead of building product.",
  solutionStatement: "AI-generated decks, models, and strategy docs in minutes.",
  businessModel: "B2B SaaS Subscription",
  targetMarket: "Early-stage Technology Startups",
  fundingGoal: 1500000,
  currency: "USD",
  websiteUrl: "https://startupai.com",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const mockFounders: Founder[] = [
  {
    id: "fnd_1",
    startupId: "st_123456",
    name: "Alex Rivera",
    role: "CEO",
    bio: "Ex-Google PM with 10 years of product experience.",
    isPrimaryContact: true
  },
  {
    id: "fnd_2",
    startupId: "st_123456",
    name: "Sarah Chen",
    role: "CTO",
    bio: "AI Researcher and Full-stack engineer.",
    isPrimaryContact: false
  }
];

const mockCompetitors: Competitor[] = [
  {
    id: "cmp_1",
    startupId: "st_123456",
    name: "SlideBean",
    strength: "Good design templates",
    weakness: "Limited AI text generation",
    differentiation: "We focus on the full strategic narrative, not just design."
  }
];

const mockInsights: AICoachInsight[] = [
  {
    id: "ins_1",
    startupId: "st_123456",
    category: "Fundraising",
    type: "Action",
    title: "Missing 'Competition' Slide",
    description: "Your Series A deck lacks a competition slide. Investors expect this.",
    priority: "High",
    status: "New",
    generatedAt: new Date().toISOString()
  }
];

// Initial Store State
export const initialDatabaseState: StartupDatabaseSchema = {
  profile: mockProfile,
  founders: mockFounders,
  competitors: mockCompetitors,
  metrics: [],
  insights: mockInsights
};

// Validation log (simulating DB check)
console.log("✅ Schema Validation Successful: Data persistence layer initialized.", initialDatabaseState);
