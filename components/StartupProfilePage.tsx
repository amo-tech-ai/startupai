
import React, { useState } from 'react';
import { Eye, Edit3, Presentation, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { OverviewCard } from './startup-profile/OverviewCard';
import { TeamCard } from './startup-profile/TeamCard';
import { BusinessCard } from './startup-profile/BusinessCard';
import { TractionCard } from './startup-profile/TractionCard';
import { SummaryCard } from './startup-profile/SummaryCard';
import { useNavigate } from 'react-router-dom';
import { useSaveStartupProfile } from '../hooks/useSaveStartupProfile';
import { useStartupProfile } from '../hooks/useStartupProfile';
import { StartupProfile, Founder } from '../types';

const StartupProfilePage: React.FC = () => {
  const { profile: globalProfile } = useData(); 
  const { data: profileDTO, loading, reload } = useStartupProfile(globalProfile?.id);
  const { saveProfile, isSaving } = useSaveStartupProfile();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'edit' | 'investor'>('edit');

  if (loading && !globalProfile) return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-12 w-12 bg-indigo-200 rounded-full"></div>
              <div className="text-slate-500 font-medium">Loading profile...</div>
          </div>
      </div>
  );

  // Merge RPC DTO with base type if available, else fallback to global context (Legacy/Demo support)
  let displayProfile: StartupProfile | null = globalProfile;
  let displayFounders: Founder[] = [];

  if (profileDTO) {
      displayProfile = {
          ...globalProfile!, // Maintain structure
          id: profileDTO.startup_id,
          name: profileDTO.context.name,
          tagline: profileDTO.context.tagline || '',
          description: profileDTO.context.description || '',
          mission: profileDTO.context.mission || '',
          websiteUrl: profileDTO.context.website_url,
          logoUrl: profileDTO.context.logo_url,
          coverImageUrl: profileDTO.context.cover_image_url,
          industry: profileDTO.context.industry,
          yearFounded: profileDTO.context.year_founded,
          stage: (profileDTO.context.stage as any) || 'Seed',
          problemStatement: profileDTO.context.problem_statement || '',
          solutionStatement: profileDTO.context.solution_statement || '',
          businessModel: profileDTO.context.business_model || '',
          pricingModel: profileDTO.context.pricing_model,
          fundingGoal: profileDTO.context.funding_goal || 0,
          isRaising: profileDTO.context.is_raising,
          targetMarket: profileDTO.context.target_market || '',
          // Use competitors from DTO root if available (mapped from RPC), fallback to context
          competitors: profileDTO.competitors || profileDTO.context.competitors || [],
          keyFeatures: profileDTO.context.key_features || [],
          useOfFunds: profileDTO.context.use_of_funds || []
      };

      displayFounders = profileDTO.founders.map(f => ({
          id: f.id,
          startupId: profileDTO.startup_id,
          name: f.full_name,
          title: f.role,
          bio: f.bio,
          linkedinProfile: f.linkedin_url,
          email: f.email,
          avatarUrl: f.avatar_url,
          isPrimaryContact: f.is_primary || false
      }));
  }

  if (!displayProfile) return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
          <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
              <button onClick={() => navigate('/onboarding')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Go to Wizard</button>
          </div>
      </div>
  );

  const handleSaveContext = async (data: Partial<StartupProfile> & { metrics?: any }) => {
      // 1. Separate special keys that belong to different tables
      const { metrics, competitors, ...profileContext } = data;

      // 2. Map Profile Context to DB Columns (Schema Mapping)
      const contextPayload: any = {};
      if (profileContext.name) contextPayload.name = profileContext.name;
      if (profileContext.tagline) contextPayload.tagline = profileContext.tagline;
      if (profileContext.websiteUrl) contextPayload.website_url = profileContext.websiteUrl;
      if (profileContext.logoUrl) contextPayload.logo_url = profileContext.logoUrl;
      if (profileContext.coverImageUrl) contextPayload.cover_image_url = profileContext.coverImageUrl;
      if (profileContext.industry) contextPayload.industry = profileContext.industry;
      if (profileContext.yearFounded) contextPayload.year_founded = profileContext.yearFounded;
      if (profileContext.problemStatement) contextPayload.problem = profileContext.problemStatement;
      if (profileContext.solutionStatement) contextPayload.solution = profileContext.solutionStatement;
      
      // Convert single strings to array for DB text[] columns where applicable
      if (profileContext.businessModel) contextPayload.business_model = [profileContext.businessModel];
      if (profileContext.targetMarket) contextPayload.target_customers = [profileContext.targetMarket];
      
      if (profileContext.pricingModel) contextPayload.pricing_model = profileContext.pricingModel;
      if (profileContext.fundingGoal) contextPayload.raise_amount = profileContext.fundingGoal;
      if (profileContext.isRaising !== undefined) contextPayload.is_raising = profileContext.isRaising;
      if (profileContext.useOfFunds) contextPayload.use_of_funds = profileContext.useOfFunds;
      if (profileContext.keyFeatures) contextPayload.unique_value = profileContext.keyFeatures.join(', '); // unique_value is text

      // 3. Send Payload to Edge Function
      // Only include keys if they have data
      const payload: any = { startup_id: displayProfile!.id };
      
      if (Object.keys(contextPayload).length > 0) payload.context = contextPayload;
      if (metrics) payload.metrics = metrics;
      if (competitors) payload.competitors = competitors;

      await saveProfile(payload);
      reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl pt-4 lg:pt-8 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold text-slate-900">{displayProfile.name}</h1>
                    <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase border border-slate-200">{displayProfile.industry || 'Tech'}</span>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded uppercase border border-indigo-100">{displayProfile.stage || 'Seed'}</span>
                    </div>
                </div>
                <p className="text-slate-500">Manage your company profile and investor data.</p>
            </div>

            <div className="flex items-center gap-3">
                <div className="bg-white rounded-lg p-1 border border-slate-200 flex shadow-sm">
                    <button 
                        onClick={() => setViewMode('edit')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'edit' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Edit3 size={16} /> Edit
                    </button>
                    <button 
                        onClick={() => setViewMode('investor')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'investor' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Eye size={16} /> Preview
                    </button>
                </div>
                <button 
                    onClick={() => navigate('/pitch-decks')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                >
                    <Presentation size={18} /> Generate Deck
                </button>
            </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* MAIN COLUMN (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
                <OverviewCard 
                    viewMode={viewMode} 
                    profile={displayProfile} 
                    onSave={handleSaveContext} 
                />
                <BusinessCard 
                    viewMode={viewMode} 
                    profile={displayProfile}
                    onSave={handleSaveContext}
                />
                <TractionCard 
                    viewMode={viewMode} 
                    profile={displayProfile}
                    metrics={profileDTO?.metrics}
                    onSave={handleSaveContext}
                />
                <TeamCard 
                    viewMode={viewMode} 
                    founders={displayFounders}
                    onSave={(founders) => saveProfile({ startup_id: displayProfile!.id, founders })}
                />
            </div>

            {/* SIDEBAR COLUMN (4 cols) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                <SummaryCard profile={displayProfile} />
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                    <h3 className="font-bold text-slate-900 mb-3">Profile Status</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Last Synced</span>
                            <span className="font-medium flex items-center gap-2">
                                {new Date().toLocaleDateString()}
                                {isSaving ? <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" /> : <div className="w-2 h-2 bg-green-500 rounded-full" />}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Visibility</span>
                            <span className="inline-flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold text-xs">
                                <CheckCircle2 size={12} /> Private
                            </span>
                        </div>
                        <button 
                            onClick={() => reload()}
                            className="w-full mt-2 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2"
                        >
                            Refresh Data
                        </button>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default StartupProfilePage;
