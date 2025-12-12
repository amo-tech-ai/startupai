
import { 
  StartupProfile, UserProfile, Founder, MetricsSnapshot, 
  AICoachInsight, Activity, Task, Deck, Deal, Contact, InvestorDoc 
} from '../types';

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
  websiteUrl: data.website_url,
  logoUrl: data.logo_url,
  coverImageUrl: data.cover_image_url,
  industry: data.industry,
  yearFounded: data.year_founded,
  stage: data.stage || 'Seed',
  problemStatement: data.problem,
  solutionStatement: data.solution,
  businessModel: Array.isArray(data.business_model) ? data.business_model[0] : data.business_model,
  pricingModel: data.pricing_model,
  fundingGoal: data.raise_amount,
  isRaising: data.is_raising,
  isPublic: data.is_public,
  targetMarket: Array.isArray(data.target_customers) ? data.target_customers[0] : data.target_customers,
  competitors: [], // Usually separate table or jsonb
  keyFeatures: data.unique_value ? [data.unique_value] : [], 
  useOfFunds: data.use_of_funds,
  fundingHistory: [], 
  mrr: 0,
  totalUsers: 0, 
  updatedAt: data.updated_at
});

export const mapProfileToDB = (data: Partial<StartupProfile>) => {
  const payload: any = {};
  if (data.name) payload.name = data.name;
  if (data.tagline) payload.tagline = data.tagline;
  if (data.websiteUrl) payload.website_url = data.websiteUrl;
  if (data.logoUrl) payload.logo_url = data.logoUrl;
  if (data.coverImageUrl) payload.cover_image_url = data.coverImageUrl;
  if (data.industry) payload.industry = data.industry;
  if (data.yearFounded) payload.year_founded = data.yearFounded;
  if (data.stage) payload.stage = data.stage;
  if (data.problemStatement) payload.problem = data.problemStatement;
  if (data.solutionStatement) payload.solution = data.solutionStatement;
  if (data.businessModel) payload.business_model = [data.businessModel];
  if (data.pricingModel) payload.pricing_model = data.pricingModel;
  if (data.fundingGoal) payload.raise_amount = data.fundingGoal;
  if (data.isRaising !== undefined) payload.is_raising = data.isRaising;
  if (data.isPublic !== undefined) payload.is_public = data.isPublic;
  if (data.targetMarket) payload.target_customers = [data.targetMarket];
  if (data.useOfFunds) payload.use_of_funds = data.useOfFunds;
  return payload;
};

/**
 * FOUNDER MAPPERS
 */
export const mapFounderFromDB = (data: any): Founder => ({
  id: data.id,
  startupId: data.startup_id,
  name: data.full_name,
  title: data.role,
  bio: data.bio,
  linkedinProfile: data.linkedin_url,
  email: data.email,
  avatarUrl: data.avatar_url,
  isPrimaryContact: data.is_primary || false
});

export const mapFounderToDB = (f: Founder, startupId?: string) => ({
  id: f.id.length > 10 ? f.id : undefined, // Valid UUID check
  startup_id: startupId || f.startupId,
  full_name: f.name,
  role: f.title,
  bio: f.bio,
  linkedin_url: f.linkedinProfile,
  email: f.email,
  avatar_url: f.avatarUrl,
  is_primary: f.isPrimaryContact
});

/**
 * USER PROFILE MAPPERS
 */
export const mapUserProfileFromDB = (data: any): UserProfile => ({
  id: data.id,
  email: data.email,
  fullName: data.full_name,
  headline: data.headline,
  location: data.location,
  bio: data.bio,
  avatarUrl: data.avatar_url,
  coverImageUrl: data.cover_image_url,
  socials: data.social_links || {},
  phone: data.phone,
  experiences: data.experiences || [],
  education: data.education || [],
  skills: data.skills || []
});

export const mapUserProfileToDB = (data: Partial<UserProfile>) => {
  const payload: any = {};
  if (data.fullName) payload.full_name = data.fullName;
  if (data.headline) payload.headline = data.headline;
  if (data.location) payload.location = data.location;
  if (data.bio) payload.bio = data.bio;
  if (data.avatarUrl) payload.avatar_url = data.avatarUrl;
  if (data.coverImageUrl) payload.cover_image_url = data.coverImageUrl;
  if (data.socials) payload.social_links = data.socials;
  if (data.phone) payload.phone = data.phone;
  if (data.experiences) payload.experiences = data.experiences;
  if (data.education) payload.education = data.education;
  if (data.skills) payload.skills = data.skills;
  return payload;
};

/**
 * METRICS MAPPERS
 */
export const mapMetricsFromDB = (data: any): MetricsSnapshot => ({
  id: data.id,
  startupId: data.startup_id,
  period: data.snapshot_date,
  mrr: data.monthly_revenue,
  activeUsers: data.monthly_active_users,
  burnRate: data.burn_rate,
  cashBalance: data.cash_balance,
  runwayMonths: data.runway_months,
  recordedAt: data.created_at
});

export const mapMetricsToDB = (data: Partial<MetricsSnapshot>, startupId: string) => ({
  startup_id: startupId,
  snapshot_date: data.period || new Date().toISOString().split('T')[0],
  monthly_revenue: data.mrr,
  monthly_active_users: data.activeUsers,
  burn_rate: data.burnRate,
  cash_balance: data.cashBalance,
  runway_months: data.runwayMonths
});

/**
 * INSIGHT MAPPERS
 */
export const mapInsightFromDB = (data: any): AICoachInsight => ({
  id: data.id,
  startupId: data.startup_id,
  category: data.category || 'General',
  type: data.type || 'Action',
  title: data.title || 'Insight',
  description: data.description || '',
  priority: data.priority || 'Medium',
  status: data.status || 'New',
  generatedAt: data.created_at
});

export const mapInsightToDB = (data: AICoachInsight, startupId: string) => ({
  startup_id: startupId,
  category: data.category,
  type: data.type,
  title: data.title,
  description: data.description,
  priority: data.priority,
  status: data.status,
});

/**
 * ACTIVITY MAPPERS
 */
export const mapActivityFromDB = (data: any): Activity => ({
  id: data.id,
  startupId: data.startup_id,
  type: data.activity_type,
  title: data.title,
  description: data.description,
  timestamp: data.occurred_at
});

export const mapActivityToDB = (data: Partial<Activity>, startupId: string) => ({
  startup_id: startupId,
  activity_type: data.type,
  title: data.title,
  description: data.description,
  occurred_at: data.timestamp || new Date().toISOString()
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
    ownerColor: 'bg-indigo-500',
    notes: d.notes || '',
    contactPerson: d.contact_person || '',
    contactEmail: d.contact_email || '',
    lastContactDate: d.last_activity_date
});

export const mapDealToDB = (d: Partial<Deal>, startupId?: string) => {
    const payload: any = {};
    if (d.company) payload.name = d.company;
    if (d.value) payload.amount = d.value;
    if (d.stage) payload.stage = d.stage;
    if (d.probability) payload.probability = d.probability;
    if (d.sector) payload.sector = d.sector;
    if (d.nextAction) payload.next_action = d.nextAction;
    if (d.notes !== undefined) payload.notes = d.notes;
    if (d.contactPerson !== undefined) payload.contact_person = d.contactPerson;
    if (d.contactEmail !== undefined) payload.contact_email = d.contactEmail;
    if (d.lastContactDate !== undefined) payload.last_activity_date = d.lastContactDate;
    
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
 * CONTACT MAPPERS
 */
export const mapContactFromDB = (c: any): Contact => ({
  id: c.id,
  startupId: c.startup_id,
  firstName: c.first_name,
  lastName: c.last_name,
  email: c.email,
  phone: c.phone,
  role: c.role,
  type: c.type || 'Lead',
  linkedinUrl: c.linkedin_url,
  tags: [], 
  notes: '',
  createdAt: c.created_at
});

export const mapContactToDB = (c: Partial<Contact>, startupId?: string) => ({
  startup_id: startupId,
  first_name: c.firstName,
  last_name: c.lastName,
  email: c.email,
  phone: c.phone,
  role: c.role,
  linkedin_url: c.linkedinUrl,
  type: c.type
});

/**
 * TASK MAPPERS
 */
export const mapTaskFromDB = (t: any): Task => ({
  id: t.id,
  startupId: t.startup_id,
  title: t.title,
  description: t.description,
  status: t.status,
  priority: t.priority,
  aiGenerated: t.source === 'ai',
  dueDate: t.due
});

export const mapTaskToDB = (t: Partial<Task>, startupId?: string) => ({
  startup_id: startupId,
  title: t.title,
  description: t.description,
  status: t.status,
  priority: t.priority,
  source: t.aiGenerated ? 'ai' : 'manual',
  due: t.dueDate
});

/**
 * DOC MAPPERS
 */
export const mapDocFromDB = (d: any): InvestorDoc => ({
  id: d.id,
  startupId: d.startup_id,
  title: d.title,
  type: d.type,
  content: d.content,
  status: d.status,
  updatedAt: d.updated_at
});

/**
 * DECK MAPPERS
 */
export const mapDeckFromDB = (d: any): Deck => ({
  id: d.id,
  startupId: d.startup_id,
  title: d.title,
  template: d.template,
  slides: d.slides ? d.slides.sort((a: any, b: any) => a.position - b.position).map((s: any) => ({
      id: s.id,
      title: s.title,
      bullets: s.bullets,
      imageUrl: s.image_url,
      chartType: s.chart_type,
      chartData: s.chart_data,
      visualDescription: s.visual_description,
      position: s.position
  })) : [],
  updatedAt: d.updated_at,
  status: d.status,
  format: d.format
});