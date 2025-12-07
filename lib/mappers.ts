
import { StartupProfile, Founder, Deck, Slide, Deal, InvestorDoc, MetricsSnapshot, AICoachInsight, Activity } from '../types';

/**
 * STARTUP PROFILE MAPPERS
 */
export const mapProfileFromDB = (data: any): StartupProfile => ({
  id: data.id,
  userId: data.user_id,
  name: data.name,
  tagline: data.tagline,
  description: data.description,
  mission: data.mission,
  stage: data.stage,
  yearFounded: data.year_founded,
  plan: data.plan,
  problemStatement: data.problem_statement,
  solutionStatement: data.solution_statement,
  businessModel: data.business_model,
  pricingModel: data.pricing_model,
  targetMarket: data.target_market,
  industry: data.industry,
  customerSegments: data.customer_segments,
  keyFeatures: data.key_features,
  competitors: data.competitors,
  coreDifferentiator: data.core_differentiator,
  fundingGoal: data.funding_goal,
  currency: data.currency || 'USD',
  websiteUrl: data.website_url,
  logoUrl: data.logo_url,
  coverImageUrl: data.cover_image_url,
  socialLinks: data.social_links,
  fundingHistory: data.funding_history,
  isRaising: data.is_raising,
  useOfFunds: data.use_of_funds,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

export const mapProfileToDB = (data: Partial<StartupProfile>) => {
  const payload: any = {};
  // Only map defined fields
  if (data.name !== undefined) payload.name = data.name;
  if (data.tagline !== undefined) payload.tagline = data.tagline;
  if (data.description !== undefined) payload.description = data.description;
  if (data.mission !== undefined) payload.mission = data.mission;
  if (data.stage !== undefined) payload.stage = data.stage;
  if (data.yearFounded !== undefined) payload.year_founded = data.yearFounded;
  if (data.plan !== undefined) payload.plan = data.plan;
  if (data.problemStatement !== undefined) payload.problem_statement = data.problemStatement;
  if (data.solutionStatement !== undefined) payload.solution_statement = data.solutionStatement;
  if (data.businessModel !== undefined) payload.business_model = data.businessModel;
  if (data.pricingModel !== undefined) payload.pricing_model = data.pricingModel;
  if (data.targetMarket !== undefined) payload.target_market = data.targetMarket;
  if (data.industry !== undefined) payload.industry = data.industry;
  if (data.customerSegments !== undefined) payload.customer_segments = data.customerSegments;
  if (data.keyFeatures !== undefined) payload.key_features = data.keyFeatures;
  if (data.competitors !== undefined) payload.competitors = data.competitors;
  if (data.coreDifferentiator !== undefined) payload.core_differentiator = data.coreDifferentiator;
  if (data.fundingGoal !== undefined) payload.funding_goal = data.fundingGoal;
  if (data.websiteUrl !== undefined) payload.website_url = data.websiteUrl;
  if (data.logoUrl !== undefined) payload.logo_url = data.logoUrl;
  if (data.coverImageUrl !== undefined) payload.cover_image_url = data.coverImageUrl;
  if (data.socialLinks !== undefined) payload.social_links = data.socialLinks;
  if (data.fundingHistory !== undefined) payload.funding_history = data.fundingHistory;
  if (data.isRaising !== undefined) payload.is_raising = data.isRaising;
  if (data.useOfFunds !== undefined) payload.use_of_funds = data.useOfFunds;
  
  if (Object.keys(payload).length > 0) {
      payload.updated_at = new Date().toISOString();
  }
  return payload;
};

/**
 * FOUNDER MAPPERS
 */
export const mapFounderFromDB = (f: any): Founder => ({
    id: f.id,
    startupId: f.startup_id,
    name: f.full_name || f.name,
    title: f.role || f.title,
    bio: f.bio,
    linkedinProfile: f.linkedin_url,
    email: f.email,
    avatarUrl: f.avatar_url,
    isPrimaryContact: f.is_primary || false
});

export const mapFounderToDB = (f: Founder, startupId: string) => ({
    startup_id: startupId,
    full_name: f.name,
    role: f.title,
    bio: f.bio,
    linkedin_url: f.linkedinProfile,
    email: f.email,
    avatar_url: f.avatarUrl,
    is_primary: f.isPrimaryContact
});

/**
 * DECK MAPPERS
 */
export const mapDeckFromDB = (d: any): Deck => ({
    id: d.id,
    startupId: d.startup_id,
    title: d.title,
    template: d.template,
    updatedAt: d.updated_at,
    slides: d.slides ? d.slides.sort((a: any, b: any) => a.position - b.position).map((s: any) => ({
        id: s.id,
        title: s.title,
        bullets: s.bullets || [],
        chartType: s.chart_type,
        chartData: s.chart_data,
        visualDescription: s.visual_description || '',
        imageUrl: s.image_url
    })) : []
});

/**
 * DEAL MAPPERS
 */
export const mapDealFromDB = (d: any): Deal => ({
    id: d.id,
    startupId: d.startup_id,
    company: d.name,
    value: d.amount,
    stage: d.stage,
    probability: d.probability,
    sector: d.sector,
    nextAction: d.next_action,
    dueDate: d.expected_close ? new Date(d.expected_close).toLocaleDateString() : 'TBD',
    ownerInitial: 'ME', 
    ownerColor: 'bg-indigo-500'
});

export const mapDealToDB = (d: Partial<Deal>, startupId?: string) => {
    const payload: any = {};
    if (d.company) payload.name = d.company;
    if (d.value) payload.amount = d.value;
    if (d.stage) payload.stage = d.stage;
    if (d.probability) payload.probability = d.probability;
    if (d.sector) payload.sector = d.sector;
    if (d.nextAction) payload.next_action = d.nextAction;
    
    if (d.dueDate && d.dueDate !== 'TBD' && d.dueDate !== 'Urgent') {
        const parsedDate = new Date(d.dueDate);
        if (!isNaN(parsedDate.getTime())) {
            payload.expected_close = parsedDate.toISOString();
        }
    }
    
    if (startupId) payload.startup_id = startupId;
    return payload;
};

/**
 * DOC MAPPERS
 */
export const mapDocFromDB = (d: any): InvestorDoc => ({
    id: d.id,
    startupId: d.startup_id,
    title: d.title,
    type: d.type,
    content: d.content || { sections: [] },
    status: d.status,
    updatedAt: d.updated_at
});

/**
 * METRICS MAPPERS
 */
export const mapMetricsFromDB = (m: any): MetricsSnapshot => ({
    id: m.id,
    startupId: m.startup_id,
    period: m.snapshot_date,
    mrr: m.monthly_revenue || 0,
    activeUsers: m.monthly_active_users || 0,
    cac: m.cac || 0,
    ltv: m.ltv || 0,
    burnRate: m.burn_rate || 0,
    runwayMonths: m.runway_months || 0,
    recordedAt: m.created_at
});

export const mapMetricsToDB = (m: Partial<MetricsSnapshot>, startupId: string) => ({
    startup_id: startupId,
    snapshot_date: m.period || new Date().toISOString().split('T')[0],
    monthly_revenue: m.mrr,
    monthly_active_users: m.activeUsers,
    cac: m.cac,
    ltv: m.ltv,
    burn_rate: m.burnRate,
    runway_months: m.runwayMonths
});

/**
 * INSIGHTS MAPPERS
 */
export const mapInsightFromDB = (i: any): AICoachInsight => ({
    id: i.id,
    startupId: i.startup_id,
    category: i.category,
    type: i.type,
    title: i.title,
    description: i.description,
    priority: i.priority,
    status: i.status || 'New',
    generatedAt: i.created_at
});

export const mapInsightToDB = (i: Partial<AICoachInsight>, startupId: string) => ({
    startup_id: startupId,
    category: i.category,
    type: i.type,
    title: i.title,
    description: i.description,
    priority: i.priority,
    status: i.status
});

/**
 * ACTIVITY MAPPERS
 */
export const mapActivityFromDB = (a: any): Activity => ({
    id: a.id,
    startupId: a.startup_id,
    type: a.activity_type,
    title: a.title,
    description: a.description,
    timestamp: a.occurred_at || a.created_at,
    actionUrl: a.metadata?.actionUrl
});

export const mapActivityToDB = (a: Partial<Activity>, startupId: string) => ({
    startup_id: startupId,
    activity_type: a.type,
    title: a.title,
    description: a.description,
    occurred_at: new Date().toISOString(),
    metadata: a.actionUrl ? { actionUrl: a.actionUrl } : {}
});
