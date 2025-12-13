
import React, { useState, useEffect } from 'react';
import { WizardService } from '../../../services/wizardAI';
import { API_KEY } from '../../../lib/env';
import { TractionMetrics } from './traction/TractionMetrics';
import { FundraisingSection } from './traction/FundraisingSection';
import { DeepResearchSection } from './traction/DeepResearchSection';

interface StepTractionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const StepTraction: React.FC<StepTractionProps> = ({ formData, setFormData }) => {
  const [tractionData, setTractionData] = useState<any>(null);
  const [fundraisingData, setFundraisingData] = useState<any>(null);
  
  // Persisted or new report
  const [deepResearchReport, setDeepResearchReport] = useState<any>(formData.deepResearchReport || null);
  
  const [isSuggestingFunds, setIsSuggestingFunds] = useState(false);
  const [analyzingTraction, setAnalyzingTraction] = useState(false);
  const [analyzingFundraising, setAnalyzingFundraising] = useState(false);
  const [isDeepResearching, setIsDeepResearching] = useState(false);
  const [researchStatus, setResearchStatus] = useState("Initializing...");

  const update = (field: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: val }));
  };

  const addFundingRound = () => {
    const newRound = { id: Date.now().toString(), round: 'Seed', date: '', amount: 0, investors: '' };
    update('fundingHistory', [...formData.fundingHistory, newRound]);
  };

  // --- EFFECTS ---

  // 1. Analyze Traction (Lite)
  useEffect(() => {
      const delayDebounceFn = setTimeout(async () => {
          if (formData.mrr > 0 && API_KEY && !tractionData) {
              setAnalyzingTraction(true);
              try {
                  const result = await WizardService.analyzeTraction(
                      { mrr: formData.mrr, users: formData.totalUsers },
                      formData.industry || 'Tech',
                      formData.stage || 'Seed',
                      API_KEY
                  );
                  if (result) setTractionData(result);
              } catch(e) { console.error(e); } 
              finally { setAnalyzingTraction(false); }
          }
      }, 1500); 

      return () => clearTimeout(delayDebounceFn);
  }, [formData.mrr, formData.totalUsers, formData.industry, formData.stage]);

  // 2. Calculate Fundraising
  useEffect(() => {
      const delayDebounceFn = setTimeout(async () => {
          if ((formData.targetRaise > 0 || formData.mrr > 0) && API_KEY && !fundraisingData) {
              setAnalyzingFundraising(true);
              try {
                  const result = await WizardService.calculateFundraising(
                      { 
                          mrr: formData.mrr, 
                          burnRate: formData.mrr * 1.2, 
                          cash: formData.targetRaise * 0.1 
                      },
                      formData.industry || 'Tech',
                      formData.stage || 'Seed',
                      formData.targetRaise || 1000000,
                      API_KEY
                  );
                  if (result) setFundraisingData(result);
              } catch(e) { console.error(e); } 
              finally { setAnalyzingFundraising(false); }
          }
      }, 1500);

      return () => clearTimeout(delayDebounceFn);
  }, [formData.targetRaise, formData.mrr, formData.industry, formData.stage]);

  // --- ACTIONS ---

  const handleSuggestFunds = async () => {
    if (!API_KEY) return;
    setIsSuggestingFunds(true);
    try {
        const suggestions = await WizardService.suggestUseOfFunds(formData.targetRaise || 1000000, 'Seed', formData.industry || 'Tech', API_KEY);
        if (suggestions.length > 0) {
            update('useOfFunds', suggestions);
        }
    } finally {
        setIsSuggestingFunds(false);
    }
  };

  const handleDeepResearch = async () => {
      if (!API_KEY) return;
      setIsDeepResearching(true);
      setResearchStatus("Preparing mission...");
      setDeepResearchReport(null);
      
      try {
          const result = await WizardService.performDeepResearch(
              formData, 
              API_KEY, 
              (status) => setResearchStatus(status)
          );
          
          if (result) {
              setDeepResearchReport(result);
              update('deepResearchReport', result);
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsDeepResearching(false);
      }
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Left: Metrics */}
        <TractionMetrics 
            mrr={formData.mrr} 
            totalUsers={formData.totalUsers} 
            fundingHistory={formData.fundingHistory} 
            onUpdate={update} 
            onAddFunding={addFundingRound} 
            tractionData={tractionData}
            isAnalyzing={analyzingTraction}
        />

        {/* Right: Fundraising */}
        <FundraisingSection 
            isRaising={formData.isRaising}
            targetRaise={formData.targetRaise}
            useOfFunds={formData.useOfFunds}
            fundraisingData={fundraisingData}
            isAnalyzing={analyzingFundraising}
            isSuggesting={isSuggestingFunds}
            onUpdate={update}
            onSuggestFunds={handleSuggestFunds}
        />
      </div>

      {/* Bottom: Deep Research */}
      <DeepResearchSection 
          onRunResearch={handleDeepResearch}
          isResearching={isDeepResearching}
          status={researchStatus}
          report={deepResearchReport}
      />
    </div>
  );
};
