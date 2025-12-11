
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

// Components
import { WizardProgress } from './wizard/WizardProgress';
import { WizardHeader } from './wizard/WizardHeader';
import { WizardFooter } from './wizard/WizardFooter';

// Steps
import { StepContext } from './wizard/steps/StepContext';
import { StepAISummary } from './wizard/steps/StepAISummary'; // New Step 2
import { StepTeam } from './wizard/steps/StepTeam';
import { StepBusiness } from './wizard/steps/StepBusiness';
import { StepTraction } from './wizard/steps/StepTraction';
import { StepSummary } from './wizard/steps/StepSummary'; // Final Review

// Types & Data
import { INITIAL_WIZARD_STATE, WIZARD_STEPS, WizardFormData } from './wizard/types';
import { Founder } from '../types';

const STORAGE_KEY = 'startup_wizard_progress';

const StartupWizard: React.FC = () => {
  const { profile, createStartup, updateProfile, updateMetrics, addActivity, setFounders, uploadFile } = useData();
  const { success, error, toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_WIZARD_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  // --- Persistence ---
  useEffect(() => {
    // Load saved state
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
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
      case 1: // Context (Intake)
        if (!formData.name.trim()) {
          error("Startup Name is required.");
          return false;
        }
        return true;
      
      case 2: // Analysis (Read Only Review)
        return true; 

      case 3: // Team
        const hasValidFounder = formData.founders.some(f => f.name.trim().length > 0);
        if (!hasValidFounder) {
          error("Please add at least one founder with a name.");
          return false;
        }
        return true;

      case 4: // Business
        if (!formData.problem.trim() && !formData.solution.trim()) {
          error("Please provide either a Problem or Solution statement.");
          return false;
        }
        return true;

      case 5: // Traction
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
        navigate('/'); 
      }
    }
  };

  const handleGoToStep = (stepId: number) => {
      setCurrentStep(stepId);
      window.scrollTo(0,0);
  };

  // Image Upload Wrapper passed to StepContext
  const handleCoverUpload = async (file: File) => {
      toast("Uploading cover image...", "info");
      const url = await uploadFile(file, 'startup-assets');
      if (url) {
          setFormData(prev => ({ ...prev, coverImage: url }));
          success("Cover image uploaded!");
      }
  };

  const submitWizard = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Map to Profile Structure
      const profileData = {
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
        
        stage: (formData.stage as any) || 'Seed', 
      };

      // 2. Create or Update Profile
      // CRITICAL FIX: Capture the ID because local 'profile' state won't update in this closure
      let startupId = profile?.id;

      if (startupId) {
          await updateProfile(profileData);
      } else {
          const newId = await createStartup(profileData);
          if (newId) {
              startupId = newId;
          } else {
              throw new Error("Failed to create startup profile");
          }
      }

      // 3. Map Founders (Fix: Only first is primary contact)
      // Use the resolved startupId
      if (startupId) {
          const foundersPayload: Founder[] = formData.founders
            .filter(f => f.name.trim().length > 0)
            .map((f, idx) => ({
              id: f.id,
              startupId: startupId!, // Use validated ID
              name: f.name,
              title: f.title,
              bio: f.bio,
              linkedinProfile: f.linkedin,
              email: f.email,
              avatarUrl: (f as any).avatarUrl, // Ensure image URL is passed
              isPrimaryContact: idx === 0 
            }));
          setFounders(foundersPayload);

          // 4. Map to Metrics Structure
          updateMetrics({
            mrr: formData.mrr,
            activeUsers: formData.totalUsers,
            period: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          }, startupId); // Pass ID explicitly to override context logic
      }

      // 5. Log Activity
      addActivity({
        type: 'milestone',
        title: 'Profile Setup Complete',
        description: `${formData.name} profile is ready.`,
      });
      
      // 6. Cleanup
      localStorage.removeItem(STORAGE_KEY);
      success("Profile setup complete! Welcome to your dashboard.");

      // Small delay for UX and state refresh
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      console.error(err);
      error("Failed to save profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <StepContext formData={formData} setFormData={setFormData} onCoverUpload={handleCoverUpload} onNext={handleNext} />;
      case 2: return <StepAISummary formData={formData} onNext={handleNext} onBack={handleBack} />;
      case 3: return <StepTeam formData={formData} setFormData={setFormData} />;
      case 4: return <StepBusiness formData={formData} setFormData={setFormData} />;
      case 5: return <StepTraction formData={formData} setFormData={setFormData} />;
      case 6: return <StepSummary formData={formData} setFormData={setFormData} goToStep={handleGoToStep} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <WizardHeader 
        currentStep={currentStep}
        totalSteps={WIZARD_STEPS.length}
        onExit={() => navigate('/')}
      />

      <WizardProgress 
        currentStep={currentStep} 
        steps={WIZARD_STEPS}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        {renderStepContent()}
      </main>

      {/* Render footer only for steps that are NOT Context (Step 1 handles its own submit) or Analysis (Step 2 has its own CTA) */}
      {currentStep > 2 && (
        <WizardFooter 
            currentStep={currentStep}
            totalSteps={WIZARD_STEPS.length}
            onBack={handleBack}
            onNext={handleNext}
        />
      )}
    </div>
  );
};

export default StartupWizard;
