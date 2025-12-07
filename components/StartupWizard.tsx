import React, { useState } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { StartupStage } from '../types';
import { useData } from '../context/DataContext';
import { WizardService } from '../services/wizardAI';
import { API_KEY } from '../lib/env';

// Step Components
import { WizardProgress } from './wizard/WizardProgress';
import { StepBasics } from './wizard/steps/StepBasics';
import { StepIdentity } from './wizard/steps/StepIdentity';
import { StepStage } from './wizard/steps/StepStage';
import { StepProblem } from './wizard/steps/StepProblem';
import { StepSolution } from './wizard/steps/StepSolution';
import { StepBusiness } from './wizard/steps/StepBusiness';
import { StepTraction } from './wizard/steps/StepTraction';
import { StepTeam } from './wizard/steps/StepTeam';
import { StepReview } from './wizard/steps/StepReview';

interface StartupWizardProps {
  setPage: (page: any) => void;
}

// Wizard Steps Configuration
const STEPS = [
  { id: 1, title: 'Basics', description: 'Company Name & Website' },
  { id: 2, title: 'Identity', description: 'Tagline & Mission' },
  { id: 3, title: 'Stage', description: 'Development Phase' },
  { id: 4, title: 'Problem', description: 'What are you solving?' },
  { id: 5, title: 'Solution', description: 'How do you solve it?' },
  { id: 6, title: 'Business', description: 'Model & Pricing' },
  { id: 7, title: 'Traction', description: 'Key Metrics' },
  { id: 8, title: 'Team', description: 'Founding Members' },
  { id: 9, title: 'Review', description: 'Finalize & Launch' },
];

const StartupWizard: React.FC<StartupWizardProps> = ({ setPage }) => {
  const { updateProfile, updateMetrics, addActivity } = useData();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    tagline: '',
    mission: '',
    stage: 'Idea' as StartupStage,
    targetMarket: '',
    problem: '',
    solution: '',
    businessModel: '',
    pricingModel: '',
    mrr: '',
    users: '',
    fundingGoal: '',
    founders: [{ name: '', role: '' }]
  });

  // --- Actions ---

  const handleNext = () => {
    if (currentStep < 9) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0,0);
    } else {
      submitWizard();
    }
  };

  const submitWizard = () => {
    // 1. Map to Profile Structure
    updateProfile({
      name: formData.name,
      websiteUrl: formData.website,
      tagline: formData.tagline,
      mission: formData.mission,
      stage: formData.stage,
      targetMarket: formData.targetMarket,
      problemStatement: formData.problem,
      solutionStatement: formData.solution,
      businessModel: formData.businessModel,
      fundingGoal: Number(formData.fundingGoal) || 0,
      createdAt: new Date().toISOString(),
    });

    // 2. Map to Metrics Structure
    updateMetrics({
      mrr: Number(formData.mrr) || 0,
      activeUsers: Number(formData.users) || 0,
      period: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });

    // 3. Log Activity
    addActivity({
      type: 'milestone',
      title: 'Profile Setup Complete',
      description: `${formData.name} is now ready to build.`,
    });
    
    // Simulate API delay & Redirect
    setTimeout(() => {
      setPage('dashboard');
    }, 800);
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

  // --- AI Integration ---

  const analyzeWebsite = async () => {
    if (!formData.name && !formData.website) {
      alert("Please enter a Company Name or Website URL first.");
      return;
    }
    
    if (!API_KEY) {
      alert("API Key not found.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const data = await WizardService.analyzeStartupProfile(formData.name, formData.website, API_KEY);
      if (data) {
        setFormData(prev => ({
          ...prev,
          tagline: data.tagline || prev.tagline,
          mission: data.mission || prev.mission,
          targetMarket: data.targetMarket || prev.targetMarket,
          problem: data.problem || prev.problem,
          solution: data.solution || prev.solution,
          businessModel: data.businessModel || prev.businessModel,
        }));
        // Move to next step automatically if successful
        if (currentStep === 1) {
            setTimeout(() => setCurrentStep(2), 500);
        }
      }
    } catch (error) {
      alert("Could not auto-generate profile. Please fill manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const refineWithAI = async (field: 'problem' | 'solution' | 'tagline' | 'mission') => {
    if (!API_KEY) {
      alert("API Key not found.");
      return;
    }

    setIsAiLoading(true);
    try {
      const contextData = {
        name: formData.name,
        industry: formData.targetMarket,
        relatedContext: field === 'solution' ? formData.problem : (field === 'mission' ? formData.tagline : undefined)
      };

      const refinedText = await WizardService.refineText(field, formData[field as keyof typeof formData] as string, contextData, API_KEY);
      
      if (refinedText) {
        updateField(field, refinedText);
      }
    } catch (error) {
      // Error handling logged in service
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <StepBasics formData={formData} updateField={updateField} onAnalyze={analyzeWebsite} isAnalyzing={isAnalyzing} />;
      case 2: return <StepIdentity formData={formData} updateField={updateField} onRefine={refineWithAI} isAiLoading={isAiLoading} />;
      case 3: return <StepStage formData={formData} updateField={updateField} />;
      case 4: return <StepProblem formData={formData} updateField={updateField} onRefine={refineWithAI} isAiLoading={isAiLoading} />;
      case 5: return <StepSolution formData={formData} updateField={updateField} onRefine={refineWithAI} isAiLoading={isAiLoading} />;
      case 6: return <StepBusiness formData={formData} updateField={updateField} />;
      case 7: return <StepTraction formData={formData} updateField={updateField} />;
      case 8: return <StepTeam formData={formData} setFormData={setFormData} />;
      case 9: return <StepReview formData={formData} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 1. Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
             <div className="bg-slate-900 text-white p-1.5 rounded-lg">
                <Zap size={20} fill="currentColor" />
             </div>
             <span className="font-bold text-xl tracking-tight">startupAI</span>
          </div>
          <button onClick={() => setPage('home')} className="text-slate-400 hover:text-slate-900 font-medium">
             Save & Exit
          </button>
      </header>

      {/* 2. Wizard Progress */}
      <WizardProgress 
        currentStep={currentStep} 
        totalSteps={STEPS.length} 
        stepTitle={STEPS[currentStep-1].title} 
      />

      {/* 3. Main Content Form */}
      <main className="flex-1 flex flex-col items-center justify-start pt-8 pb-32 px-6">
        <div className="w-full max-w-2xl">
          {renderStepContent()}
        </div>
      </main>

      {/* 4. Footer Controls */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 z-20">
         <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button 
                onClick={handleBack}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
                {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>

            <button 
                onClick={handleNext}
                className="group flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1"
            >
                {currentStep === 9 ? 'Complete Setup' : 'Continue'}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </footer>
    </div>
  );
};

export default StartupWizard;
