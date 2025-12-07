
import React, { useState } from 'react';
import { ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { StartupStage } from '../types';
import { useData } from '../context/DataContext';
import { WizardProgress } from './wizard/WizardProgress';

// Updated Steps
import { StepContext } from './wizard/steps/StepContext';
import { StepTeam } from './wizard/steps/StepTeam';
import { StepBusiness } from './wizard/steps/StepBusiness';
import { StepTraction } from './wizard/steps/StepTraction';
import { StepSummary } from './wizard/steps/StepSummary';

interface StartupWizardProps {
  setPage: (page: any) => void;
}

const STEPS = [
  { id: 1, title: 'Context', description: 'Company Basics' },
  { id: 2, title: 'Team', description: 'Founders' },
  { id: 3, title: 'Business', description: 'Model & Market' },
  { id: 4, title: 'Traction', description: 'Metrics & Funding' },
  { id: 5, title: 'Summary', description: 'Review & Launch' },
];

const StartupWizard: React.FC<StartupWizardProps> = ({ setPage }) => {
  const { updateProfile, updateMetrics, addActivity } = useData();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Consolidated Form Data
  const [formData, setFormData] = useState({
    // Context
    name: '',
    website: '',
    industry: '',
    yearFounded: new Date().getFullYear(),
    tagline: '',
    coverImage: '',
    
    // Team
    founders: [{ id: '1', name: '', title: '', bio: '', linkedin: '', email: '', website: '' }],
    
    // Business
    businessModel: '',
    pricingModel: '',
    customerSegments: [] as string[],
    keyFeatures: [] as string[],
    competitors: [] as string[],
    coreDifferentiator: '',
    socialLinks: { linkedin: '', twitter: '', github: '', pitchDeck: '' },
    
    // Traction
    mrr: 0,
    totalUsers: 0,
    fundingHistory: [] as any[],
    isRaising: false,
    targetRaise: 0,
    useOfFunds: [] as string[],
    
    // Summary
    aiSummary: ''
  });

  // --- Actions ---

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0,0);
    } else {
      submitWizard();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      setPage('home'); 
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitWizard = () => {
    // 1. Map to Profile Structure
    updateProfile({
      name: formData.name,
      websiteUrl: formData.website,
      tagline: formData.tagline,
      yearFounded: formData.yearFounded,
      businessModel: formData.businessModel,
      pricingModel: formData.pricingModel,
      customerSegments: formData.customerSegments,
      keyFeatures: formData.keyFeatures,
      coreDifferentiator: formData.coreDifferentiator,
      socialLinks: formData.socialLinks,
      fundingHistory: formData.fundingHistory,
      isRaising: formData.isRaising,
      fundingGoal: formData.targetRaise,
      useOfFunds: formData.useOfFunds,
      // Default others
      stage: 'Seed', 
      createdAt: new Date().toISOString(),
    });

    // 2. Map to Metrics Structure
    updateMetrics({
      mrr: formData.mrr,
      activeUsers: formData.totalUsers,
      period: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });

    // 3. Log Activity
    addActivity({
      type: 'milestone',
      title: 'Profile Setup Complete',
      description: `${formData.name} profile is ready.`,
    });
    
    setTimeout(() => {
      setPage('dashboard');
    }, 800);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <StepContext formData={formData} setFormData={setFormData} />;
      case 2: return <StepTeam formData={formData} setFormData={setFormData} />;
      case 3: return <StepBusiness formData={formData} setFormData={setFormData} />;
      case 4: return <StepTraction formData={formData} setFormData={setFormData} />;
      case 5: return <StepSummary formData={formData} setFormData={setFormData} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* 1. Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
             <div className="bg-purple-600 text-white p-1.5 rounded-lg shadow-sm">
                <Zap size={18} fill="currentColor" />
             </div>
             <span className="font-bold text-lg tracking-tight">startupAI</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex text-sm text-slate-500 font-medium">
                {Math.round((currentStep / 5) * 100)}% Complete
             </div>
             <button onClick={() => setPage('home')} className="text-sm font-bold text-slate-400 hover:text-slate-600">
                Exit
             </button>
          </div>
      </header>

      {/* 2. Wizard Progress */}
      <WizardProgress 
        currentStep={currentStep} 
        totalSteps={5} 
        stepTitle={STEPS[currentStep-1].title} 
      />

      {/* 3. Main Content Form */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
        {renderStepContent()}
      </main>

      {/* 4. Footer Controls */}
      <footer className="sticky bottom-0 bg-white border-t border-slate-200 p-4 md:px-8 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button 
                onClick={handleBack}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
                {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>

            <button 
                onClick={handleNext}
                className="group flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-600/20 transition-all hover:-translate-y-0.5 active:scale-95"
            >
                {currentStep === 5 ? 'Finish & Save' : 'Next Step'}
                {currentStep === 5 ? <CheckCircle size={20} /> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
         </div>
      </footer>
    </div>
  );
};

export default StartupWizard;
