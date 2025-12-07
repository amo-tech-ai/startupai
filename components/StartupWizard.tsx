
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

// Components
import { WizardProgress } from './wizard/WizardProgress';
import { WizardHeader } from './wizard/WizardHeader';
import { WizardFooter } from './wizard/WizardFooter';

// Steps
import { StepContext } from './wizard/steps/StepContext';
import { StepTeam } from './wizard/steps/StepTeam';
import { StepBusiness } from './wizard/steps/StepBusiness';
import { StepTraction } from './wizard/steps/StepTraction';
import { StepSummary } from './wizard/steps/StepSummary';

// Types & Data
import { INITIAL_WIZARD_STATE, WIZARD_STEPS, WizardFormData } from './wizard/types';

interface StartupWizardProps {
  setPage: (page: any) => void;
}

const StartupWizard: React.FC<StartupWizardProps> = ({ setPage }) => {
  const { updateProfile, updateMetrics, addActivity } = useData();
  const { success, error } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_WIZARD_STATE);

  // --- Actions ---

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          error("Startup Name is required.");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < WIZARD_STEPS.length) {
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

  const submitWizard = () => {
    // 1. Map to Profile Structure
    updateProfile({
      name: formData.name,
      websiteUrl: formData.website,
      tagline: formData.tagline,
      industry: formData.industry,
      coverImageUrl: formData.coverImage,
      yearFounded: formData.yearFounded,
      
      problemStatement: formData.problem,
      solutionStatement: formData.solution,
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
    
    success("Profile setup complete! Welcome to your dashboard.");

    setTimeout(() => {
      setPage('dashboard');
    }, 1000);
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
      <WizardHeader 
        currentStep={currentStep}
        totalSteps={WIZARD_STEPS.length}
        onExit={() => setPage('home')}
      />

      <WizardProgress 
        currentStep={currentStep} 
        totalSteps={WIZARD_STEPS.length} 
        stepTitle={WIZARD_STEPS[currentStep-1].title} 
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
        {renderStepContent()}
      </main>

      <WizardFooter 
        currentStep={currentStep}
        totalSteps={WIZARD_STEPS.length}
        onBack={handleBack}
        onNext={handleNext}
      />
    </div>
  );
};

export default StartupWizard;
