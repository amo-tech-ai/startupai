
import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { useSaveStartupProfile } from '../hooks/useSaveStartupProfile';
import { useStartupProfile } from '../hooks/useStartupProfile';
import { StartupProfile, Founder } from '../types';
import { useToast } from '../context/ToastContext';

// Modular Components
import { ProfilePageHeader } from './startup-profile/ProfilePageHeader';
import { ProfilePrintHeader } from './startup-profile/ProfilePrintHeader';
import { ProfilePageContent } from './startup-profile/ProfilePageContent';
import { ProfilePageSidebar } from './startup-profile/ProfilePageSidebar';
import { ShareModal } from './startup-profile/ShareModal';

const StartupProfilePage: React.FC = () => {
  const { profile: globalProfile } = useData(); 
  const { data: profileDTO, loading, reload } = useStartupProfile(globalProfile?.id);
  const { saveProfile, isSaving } = useSaveStartupProfile();
  const { success, info } = useToast();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState<'edit' | 'investor'>('edit');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // --- 1. Loading & Error States ---
  if (loading && !globalProfile) return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-12 w-12 bg-indigo-200 rounded-full"></div>
              <div className="text-slate-500 font-medium">Loading profile...</div>
          </div>
      </div>
  );

  // --- 2. Data Transformation (DTO -> UI Model) ---
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
          isPublic: profileDTO.context.is_public,
          targetMarket: profileDTO.context.target_market || '',
          competitors: profileDTO.competitors || profileDTO.context.competitors || [],
          keyFeatures: profileDTO.context.key_features || [],
          useOfFunds: profileDTO.context.use_of_funds || [],
          // Map Deep Research: Prefer dedicated column
          deepResearchReport: profileDTO.context.deep_research_report || globalProfile?.deepResearchReport || null
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

  // --- 3. Action Handlers ---

  const handleSaveContext = async (data: Partial<StartupProfile> & { metrics?: any }) => {
      // 1. Separate special keys
      const { metrics, competitors, deepResearchReport, ...profileContext } = data;

      // 2. Map Profile Context to DB Columns
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
      if (profileContext.businessModel) contextPayload.business_model = [profileContext.businessModel];
      if (profileContext.targetMarket) contextPayload.target_customers = [profileContext.targetMarket];
      if (profileContext.pricingModel) contextPayload.pricing_model = profileContext.pricingModel;
      if (profileContext.fundingGoal) contextPayload.raise_amount = profileContext.fundingGoal;
      if (profileContext.isRaising !== undefined) contextPayload.is_raising = profileContext.isRaising;
      if (profileContext.isPublic !== undefined) contextPayload.is_public = profileContext.isPublic;
      if (profileContext.useOfFunds) contextPayload.use_of_funds = profileContext.useOfFunds;
      if (profileContext.keyFeatures) contextPayload.unique_value = profileContext.keyFeatures.join(', ');

      // Persist Deep Research to dedicated column
      if (deepResearchReport) {
          contextPayload.deep_research_report = deepResearchReport;
      }

      // 3. Send Payload
      const payload: any = { startup_id: displayProfile!.id };
      
      if (Object.keys(contextPayload).length > 0) payload.context = contextPayload;
      if (metrics) payload.metrics = metrics;
      if (competitors) payload.competitors = competitors;

      await saveProfile(payload);
      reload();
  };

  const handleSaveTeam = (founders: Founder[]) => {
      saveProfile({ startup_id: displayProfile!.id, founders });
  };

  const toggleVisibility = async () => {
      const newValue = !displayProfile!.isPublic;
      await handleSaveContext({ isPublic: newValue });
      success(newValue ? "Profile is now public!" : "Profile is now private.");
  };

  const handlePrint = () => {
      setViewMode('investor');
      info("Preparing One-Pager PDF...");
      setTimeout(() => {
          window.print();
      }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900 print:bg-white print:p-0">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl pt-4 lg:pt-8 animate-in fade-in duration-500">
        
        <ProfilePageHeader 
            profile={displayProfile}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onShare={() => setIsShareModalOpen(true)}
            onGenerateDeck={() => navigate('/pitch-decks')}
        />

        {/* Investor View Banner */}
        {viewMode === 'investor' && (
            <div className="mb-6 bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center justify-between print:hidden">
                <div className="flex items-center gap-2 text-indigo-800 text-sm font-medium">
                    <Eye size={16} />
                    You are viewing your profile as an investor would see it.
                </div>
                <button onClick={() => setViewMode('edit')} className="text-xs font-bold text-indigo-600 hover:underline">
                    Back to Edit
                </button>
            </div>
        )}

        <ProfilePrintHeader profile={displayProfile} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block print:space-y-8">
            
            {/* MAIN COLUMN (8 cols) */}
            <div className="lg:col-span-8">
                <ProfilePageContent 
                    profile={displayProfile}
                    founders={displayFounders}
                    metrics={profileDTO?.metrics}
                    viewMode={viewMode}
                    onSaveContext={handleSaveContext}
                    onSaveTeam={handleSaveTeam}
                />
            </div>

            {/* SIDEBAR COLUMN (4 cols) */}
            <div className="lg:col-span-4">
                <ProfilePageSidebar 
                    profile={displayProfile}
                    viewMode={viewMode}
                    isSaving={isSaving}
                    onToggleVisibility={toggleVisibility}
                />
            </div>

        </div>
      </div>

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        isPublic={!!displayProfile.isPublic}
        onTogglePublic={toggleVisibility}
        publicUrl={`${window.location.origin}/#/s/${displayProfile.id}`}
        onDownloadPdf={handlePrint}
      />
    </div>
  );
};

export default StartupProfilePage;
