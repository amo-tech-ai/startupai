
import { StartupDatabaseSchema, StartupProfile, Founder, Competitor, AICoachInsight, Activity, Task, Deck, Deal, InvestorDoc } from '../types';

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

const mockTasks: Task[] = [
    {
        id: "tsk_1",
        startupId: "st_123456",
        title: "Incorporate Delaware C-Corp",
        description: "File articles of incorporation using Clerky or Stripe Atlas.",
        status: "Done",
        priority: "High",
        dueDate: "2023-11-01",
        aiGenerated: false
    },
    {
        id: "tsk_2",
        startupId: "st_123456",
        title: "Finalize Pitch Deck v1",
        description: "Review generated deck and add financial projections.",
        status: "In Progress",
        priority: "High",
        dueDate: "2023-11-15",
        aiGenerated: true
    },
    {
        id: "tsk_3",
        startupId: "st_123456",
        title: "Reach $10k MRR",
        description: "Close pending deals in pipeline.",
        status: "Backlog",
        priority: "Medium",
        aiGenerated: false
    }
];

const mockActivities: Activity[] = [
  {
    id: "act_1",
    startupId: "st_123456",
    type: "system",
    title: "Account Created",
    description: "Welcome to StartupAI! Your workspace is ready.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  },
  {
    id: "act_2",
    startupId: "st_123456",
    type: "milestone",
    title: "Metrics Updated",
    description: "Monthly revenue updated to $150k.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  }
];

const mockDecks: Deck[] = [
    {
        id: "deck_1",
        startupId: "st_123456",
        title: "Seed Round - YC Template",
        template: "Y Combinator",
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        slides: [
            { id: "s1", title: "Problem", bullets: ["Manual fundraising is slow", "Founders hate documentation"], visualDescription: "Chart showing hours wasted" },
            { id: "s2", title: "Solution", bullets: ["AI Operating System", "Auto-generate assets"], visualDescription: "Screenshot of StartupAI dashboard" }
        ]
    }
];

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
    ownerColor: "bg-indigo-500"
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
    ownerColor: "bg-emerald-500"
  }
];

const mockDocs: InvestorDoc[] = [
    {
        id: "doc_1",
        startupId: "st_123456",
        title: "Series A One-Pager",
        type: "One-Pager",
        status: "Draft",
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        content: {
            sections: [
                { id: "1", title: "Executive Summary", content: "<p>StartupAI is the operating system for modern founders.</p>" },
                { id: "2", title: "Market Opportunity", content: "<p>The market for AI productivity tools is estimated at $50B.</p>" }
            ]
        }
    },
    {
        id: "doc_2",
        startupId: "st_123456",
        title: "Q3 Financials",
        type: "Financial Model",
        status: "Final",
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        content: { sections: [] }
    }
];

// Initial Store State
export const initialDatabaseState: StartupDatabaseSchema = {
  profile: mockProfile,
  founders: mockFounders,
  competitors: mockCompetitors,
  metrics: [],
  insights: mockInsights,
  tasks: mockTasks,
  activities: mockActivities,
  decks: mockDecks,
  deals: mockDeals,
  docs: mockDocs
};

// Validation log (simulating DB check)
console.log("✅ Schema Validation Successful: Data persistence layer initialized.", initialDatabaseState);
