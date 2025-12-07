
import React, { useState, useEffect } from 'react';
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
import { Founder } from '../types';

interface StartupWizardProps {
  setPage: (page: any) => void;
}

const STORAGE_KEY = 'startup_wizard_progress';

const StartupWizard: React.FC<StartupWizardProps> = ({ setPage }) => {
  const { updateProfile, updateMetrics, addActivity, setFounders } = useData();
  const { success, error } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_WIZARD_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Persistence ---
  useEffect(() => {
    // Load saved state
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
        // Optional: restore step if saved
        // setCurrentStep(parsed._currentStep || 1); 
      } catch (e) {
        console.error("Failed to load wizard progress", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Save state on change
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isLoaded]);

  // --- Validation ---

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Context
        if (!formData.name.trim()) {
          error("Startup Name is required.");
          return false;
        }
        return true;
      
      case 2: // Team
        const hasValidFounder = formData.founders.some(f => f.name.trim().length > 0);
        if (!hasValidFounder) {
          error("Please add at least one founder with a name.");
          return false;
        }
        return true;

      case 3: // Business
        if (!formData.problem.trim() && !formData.solution.trim()) {
          error("Please provide either a Problem or Solution statement.");
          return false;
        }
        return true;

      case 4: // Traction
        if (formData.isRaising) {
           if (!formData.targetRaise || formData.targetRaise <= 0) {
             error("Please specify a valid Target Raise amount.");
             return false;
           }
        }
        return true;

      default:
        return true;
    }
  };

  // --- Actions ---

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
      window.scrollTo(0,0);
    } else {
      if (confirm("Exit wizard? Your progress will be lost if you clear your cache.")) {
        setPage('home'); 
      }
    }
  };

  const submitWizard = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Map to Profile Structure
      updateProfile({
        name: formData.name,
        websiteUrl: formData.website,
        tagline: formData.tagline,
        industry: formData.industry,
        coverImageUrl: formData.coverImage,
        yearFounded: formData.yearFounded,
        
        description: formData.aiSummary || formData.tagline, // Prefer AI summary
        problemStatement: formData.problem,
        solutionStatement: formData.solution,
        
        businessModel: formData.businessModel,
        pricingModel: formData.pricingModel,
        customerSegments: formData.customerSegments,
        keyFeatures: formData.keyFeatures,
        competitors: formData.competitors,
        coreDifferentiator: formData.coreDifferentiator,
        socialLinks: formData.socialLinks,
        
        fundingHistory: formData.fundingHistory,
        isRaising: formData.isRaising,
        fundingGoal: formData.targetRaise,
        useOfFunds: formData.useOfFunds,
        
        // Default others
        stage: (formData.stage as any) || 'Seed', 
        createdAt: new Date().toISOString(),
      });

      // 2. Map Founders (Fix: Only first is primary contact)
      const foundersPayload: Founder[] = formData.founders
        .filter(f => f.name.trim().length > 0)
        .map((f, idx) => ({
          id: f.id,
          startupId: 'temp_startup_id',
          name: f.name,
          title: f.title,
          bio: f.bio,
          linkedinProfile: f.linkedin,
          email: f.email,
          isPrimaryContact: idx === 0 
        }));
      setFounders(foundersPayload);

      // 3. Map to Metrics Structure
      updateMetrics({
        mrr: formData.mrr,
        activeUsers: formData.totalUsers,
        period: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });

      // 4. Log Activity
      addActivity({
        type: 'milestone',
        title: 'Profile Setup Complete',
        description: `${formData.name} profile is ready.`,
      });
      
      // 5. Cleanup
      localStorage.removeItem(STORAGE_KEY);
      success("Profile setup complete! Welcome to your dashboard.");

      // Small delay for UX
      setTimeout(() => {
        setPage('dashboard');
      }, 1000);

    } catch (err) {
      console.error(err);
      error("Failed to save profile. Please try again.");
      setIsSubmitting(false);
    }
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
