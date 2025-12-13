
export interface WizardFormData {
  // --- Step 1: Context Inputs ---
  name: string;
  website: string;
  industry: string;
  yearFounded: number;
  tagline: string;          // Short description
  description: string;      // Long description (User input)
  targetMarket: string;     // User input
  coverImage: string;
  
  // Advanced Context
  additionalUrls: string[];
  searchTerms: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    github: string;
    pitchDeck: string;
  };

  // --- AI Analysis Data (Step 2 Storage) ---
  aiAnalysisResult?: {
    summary_screen: {
      title: string;
      summary: string;
      industry_detected: string;
      product_category: string;
      badges: string[];
    };
    founder_intelligence: {
      founders: Array<{
        name: string;
        title: string;
        bio: string;
        headline: string;
        experience_bullets: string[];
        skills: string[];
        education: string[];
        linkedin: string;
      }>;
    };
    website_analysis: {
      value_prop: string;
      key_features: string[];
      pricing_hints: string;
      target_audience: string;
      proof_points: string[];
    };
    research_data: {
      queries_used: string[];
      sources_count: number;
    };
    detected_signals: {
      general: Array<{ label: string; value: string }>;
      product: Array<{ label: string; value: string }>;
      market: Array<{ label: string; value: string }>;
      founder: Array<{ label: string; value: string }>;
    };
    workflows: {
      url_context_ran: boolean;
      search_grounding_ran: boolean;
      next_actions: string[];
    };
    // Legacy autofill for downstream steps
    wizard_autofill: {
      product_summary: string;
      key_features: string[];
      target_customers: string[];
      use_cases: string[];
      pricing_model: string;
      problem: string;
      solution: string;
      uvp: string;
      core_differentiator: string;
      competitors: Array<{ name: string; url: string; positioning: string }>;
      market_trends: string[];
    };
  };
  
  // --- Step 3-5: Detailed Fields ---
  stage: string;
  founders: Array<{
    id: string;
    name: string;
    title: string;
    bio: string;
    linkedin: string;
    email: string;
    website: string;
  }>;
  
  problem: string;
  solution: string;
  businessModel: string;
  pricingModel: string;
  customerSegments: string[];
  keyFeatures: string[];
  competitors: string[];
  coreDifferentiator: string;
  
  mrr: number;
  totalUsers: number;
  fundingHistory: Array<{
    id: string;
    round: string;
    date: string;
    amount: number;
    investors: string;
  }>;
  isRaising: boolean;
  targetRaise: number;
  useOfFunds: string[];
  
  aiSummary: string; // Final generated summary
  
  // --- V3: Deep Research Report ---
  deepResearchReport?: {
    executive_summary: string[];
    stage_inference: { stage: string; reasoning: string };
    traction_benchmarks: Array<{ metric: string; low: string; median: string; high: string; unit: string; citation: string }>;
    fundraising_benchmarks: Array<{ item: string; low: string; median: string; high: string; citation: string }>;
    valuation_references: Array<{ label: string; range: string; citation: string }>;
    competitor_analysis: Array<{ name: string; differentiation: string; recent_moves: string }>;
    market_trends: string[];
    red_flags_and_fixes: Array<{ flag: string; fix: string; timeline: string }>;
    confidence_score: { level: string; explanation: string };
  };
}

export const INITIAL_WIZARD_STATE: WizardFormData = {
  name: '',
  website: '',
  industry: '',
  yearFounded: new Date().getFullYear(),
  tagline: '',
  description: '',
  targetMarket: '',
  coverImage: '',
  stage: 'Seed',
  
  additionalUrls: [],
  searchTerms: '',
  socialLinks: { linkedin: '', twitter: '', github: '', pitchDeck: '' },

  founders: [{ id: '1', name: '', title: '', bio: '', linkedin: '', email: '', website: '' }],
  
  problem: '',
  solution: '',
  businessModel: '',
  pricingModel: '',
  customerSegments: [],
  keyFeatures: [],
  competitors: [],
  coreDifferentiator: '',
  
  mrr: 0,
  totalUsers: 0,
  fundingHistory: [],
  isRaising: false,
  targetRaise: 0,
  useOfFunds: [],
  aiSummary: ''
};

export const WIZARD_STEPS = [
  { id: 1, title: 'Context', description: 'Smart Intake' },
  { id: 2, title: 'Analysis', description: 'AI Insights' },
  { id: 3, title: 'Team', description: 'Founders' },
  { id: 4, title: 'Business', description: 'Model & Market' },
  { id: 5, title: 'Traction', description: 'Metrics' },
  { id: 6, title: 'Summary', description: 'Review' },
];