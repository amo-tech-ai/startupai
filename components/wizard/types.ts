
export interface WizardFormData {
  // Context
  name: string;
  website: string;
  industry: string;
  yearFounded: number;
  tagline: string;
  coverImage: string;
  stage: string;
  
  // Team
  founders: Array<{
    id: string;
    name: string;
    title: string;
    bio: string;
    linkedin: string;
    email: string;
    website: string;
  }>;
  
  // Business
  problem: string;
  solution: string;
  businessModel: string;
  pricingModel: string;
  customerSegments: string[];
  keyFeatures: string[];
  competitors: string[];
  coreDifferentiator: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    github: string;
    pitchDeck: string;
  };
  
  // Traction
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
  
  // Summary
  aiSummary: string;
}

export const INITIAL_WIZARD_STATE: WizardFormData = {
  name: '',
  website: '',
  industry: '',
  yearFounded: new Date().getFullYear(),
  tagline: '',
  coverImage: '',
  stage: 'Idea',
  founders: [{ id: '1', name: '', title: '', bio: '', linkedin: '', email: '', website: '' }],
  problem: '',
  solution: '',
  businessModel: '',
  pricingModel: '',
  customerSegments: [],
  keyFeatures: [],
  competitors: [],
  coreDifferentiator: '',
  socialLinks: { linkedin: '', twitter: '', github: '', pitchDeck: '' },
  mrr: 0,
  totalUsers: 0,
  fundingHistory: [],
  isRaising: false,
  targetRaise: 0,
  useOfFunds: [],
  aiSummary: ''
};

export const WIZARD_STEPS = [
  { id: 1, title: 'Context', description: 'Company Basics' },
  { id: 2, title: 'Team', description: 'Founders' },
  { id: 3, title: 'Business', description: 'Model & Market' },
  { id: 4, title: 'Traction', description: 'Metrics & Funding' },
  { id: 5, title: 'Summary', description: 'Review & Launch' },
];