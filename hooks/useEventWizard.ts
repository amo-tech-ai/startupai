import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';
import { API_KEY } from '../lib/env';
import { EventAI } from '../services/eventAI';
import { EventService } from '../services/supabase/events';
import { EventData, EventStrategyAnalysis, EventLogisticsAnalysis } from '../types';

const INITIAL_DATA: EventData = {
  name: '',
  description: '',
  type: '',
  date: '',
  duration: 4,
  city: '',
  venueUrls: [],
  sponsorUrls: [],
  inspirationUrls: [],
  searchTerms: []
};

export const useEventWizard = () => {
  const navigate = useNavigate();
  const { toast, success, error } = useToast();
  const { profile } = useData();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventData>(INITIAL_DATA);
  const [isProcessing, setIsProcessing] = useState(false);
  const [strategyAnalysis, setStrategyAnalysis] = useState<EventStrategyAnalysis | null>(null);
  const [logisticsAnalysis, setLogisticsAnalysis] = useState<EventLogisticsAnalysis | null>(null);

  const updateData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const runStrategyAnalysis = async () => {
     if (!API_KEY) { error("API Key missing"); return; }
     if (!formData.name || !formData.description || !formData.type) {
        toast("Please complete required fields.", "error");
        return;
     }
     setIsProcessing(true);
     toast("Generating Intelligence Brief (Gemini 3)...", "info");
     try {
        const result = await EventAI.analyzeStrategy(API_KEY, formData);
        if (result) {
            setStrategyAnalysis(result);
            updateData('strategy', result);
            setCurrentStep(2);
            success("Strategy Analysis Complete!");
        } else {
            error("Analysis failed. Please try again.");
        }
     } catch (e) {
        console.error(e);
        error("AI Service Error");
     } finally {
        setIsProcessing(false);
     }
  };

  const checkLogistics = async () => {
     if (!API_KEY) { error("API Key missing"); return; }
     setIsProcessing(true);
     try {
        const result = await EventAI.checkLogistics(API_KEY, formData.date, formData.city);
        if (result) {
            setLogisticsAnalysis(result);
            updateData('logistics', result);
            success("Logistics Scan Complete!");
        }
     } finally {
        setIsProcessing(false);
     }
  };

  const launchEvent = async () => {
      if (!API_KEY) { error("API Key missing"); return; }
      
      setIsProcessing(true);
      toast("Generating Operational Plan...", "info");

      try {
          // 1. Generate Tasks
          const tasks = await EventAI.generateActionPlan(API_KEY, formData);
          
          // 2. Save Event + Tasks to DB
          const eventId = await EventService.create(formData, tasks, profile?.id || 'guest');
          
          success("Event Launched Successfully!");
          setTimeout(() => {
              // Navigate to the specific event dashboard
              if (eventId) navigate(`/events/${eventId}`);
              else navigate('/events'); 
          }, 1000);
      } catch (e) {
          console.error(e);
          error("Failed to save event.");
      } finally {
          setIsProcessing(false);
      }
  };

  const nextStep = async () => {
     // Step 1 -> 2: Run AI Strategy
     if (currentStep === 1) {
        await runStrategyAnalysis();
     } 
     // Step 2 -> 3: Just Move
     else if (currentStep === 2) {
        setCurrentStep(3);
        window.scrollTo(0,0);
     } 
     // Step 3 -> 4: Validate Logistics
     else if (currentStep === 3) {
        if (!formData.date || !formData.city) {
            toast("Please select a date and location.", "error");
            return;
        }
        if (!logisticsAnalysis) {
            await checkLogistics(); 
        }
        setCurrentStep(4);
        window.scrollTo(0,0);
     } 
     // Step 4 -> Finish
     else if (currentStep === 4) {
        await launchEvent();
     }
  };

  const prevStep = () => {
      if (currentStep === 1) navigate('/dashboard');
      else setCurrentStep(prev => prev - 1);
  };

  return {
      currentStep,
      formData,
      isProcessing,
      strategyAnalysis,
      logisticsAnalysis,
      updateData,
      nextStep,
      prevStep,
      checkLogistics
  };
};