
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
      urls_used: string[];
      search_queries: string[];
      detected_signals: Array<{ label: string; value: string }>;
    };
    workflows: {
      url_context_ran: boolean;
      search_grounding_ran: boolean;
      missing_inputs: string[];
      next_actions: string[];
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
