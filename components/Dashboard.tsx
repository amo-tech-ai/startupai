
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { API_KEY } from '../lib/env';
import { CoachAI } from '../services/coachAI';
import { useToast } from '../context/ToastContext';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// New V2 Components
import { FounderCommandCenter } from './dashboard/v2/FounderCommandCenter';
import { HealthScorecard } from './dashboard/v2/HealthScorecard';
import { AICoachWidget } from './dashboard/v2/AICoachWidget';
import { MilestonesTimeline } from './dashboard/v2/MilestonesTimeline';
import { AIInsightsDigest } from './dashboard/v2/AIInsightsDigest';
import { CRMSnapshot } from './dashboard/v2/CRMSnapshot';
import { SmartAlerts } from './dashboard/v2/SmartAlerts';
import { SetupChecklist } from './dashboard/v2/SetupChecklist';
import { ActivityFeed } from './dashboard/ActivityFeed';
import { WelcomeHeader } from './dashboard/WelcomeHeader';
import { AddContactSidebar } from './dashboard/AddContactSidebar';

const Dashboard: React.FC = () => {
  const { profile, metrics, insights, activities, deals, decks, setInsights, addActivity } = useData();
  const { toast, error, success } = useToast();
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isContactSidebarOpen, setIsContactSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const isGuest = profile?.userId === 'guest' || profile?.userId === 'mock';

  // --- HEALTH SCORE LOGIC ---
  const calculateHealth = () => {
      let score = 0;
      const missing: string[] = [];
      const mrr = metrics[metrics.length - 1]?.mrr || 0;
      const runway = metrics[metrics.length - 1]?.runwayMonths || 0;

      // 1. Business (25%)
      if (mrr > 0) score += 25; else missing.push("Revenue");
      // 2. Fundraising (25%)
      if (decks.length > 0) score += 25; else missing.push("Pitch Deck");
      // 3. Operations (25%)
      if (runway > 6) score += 25; else if (runway > 3) score += 10; else missing.push("Runway");
      // 4. Profile (25%)
      if (profile?.websiteUrl) score += 10;
      if (profile?.coverImageUrl) score += 15;

      return {
          score: Math.min(score, 100),
          metrics: {
              mrrGrowth: mrr > 0, // Simplified
              deckReady: decks.length > 0,
              runwayHealthy: runway > 6,
              profileComplete: score >= 75
          },
          missing
      };
  };

  const healthData = calculateHealth();

  // --- AI COACH LOGIC ---
  const refreshInsights = async () => {
    if (!profile || !API_KEY) {
        if (!API_KEY) error("API Key missing");
        return;
    }

    setIsGeneratingInsights(true);
    toast("AI Coach is analyzing your metrics...", "info");

    try {
        const context = {
            id: profile.id,
            name: profile.name,
            stage: profile.stage,
            tagline: profile.tagline,
            problem: profile.problemStatement,
            solution: profile.solutionStatement,
            fundingGoal: profile.fundingGoal,
            mrr: metrics[0]?.mrr || 0,
            activeUsers: metrics[0]?.activeUsers || 0
        };

        const newInsights = await CoachAI.generateInsights(API_KEY, context);

        if (newInsights) {
            setInsights(newInsights);
            addActivity({
                type: 'system',
                title: 'AI Coach Analysis',
                description: 'Generated new strategic insights.'
            });
            success("Insights refreshed!");
        } else {
            error("No insights generated.");
        }
    } catch (e) {
        error("Failed to generate insights.");
    } finally {
        setIsGeneratingInsights(false);
    }
  };

  // Filter Milestones
  const milestones = activities.filter(a => a.type === 'milestone');

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700 bg-slate-50/50 min-h-screen">
      
      {/* Top Banner for Guests */}
      {isGuest && (
        <div className="bg-indigo-600 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-lg shadow-indigo-200">
            <div className="flex items-center gap-3">
                <AlertCircle className="shrink-0" />
                <div>
                    <div className="font-bold">Guest Mode Active</div>
                    <div className="text-sm text-indigo-100">Your data is only saved in this browser. Create an account to save it permanently.</div>
                </div>
            </div>
            <button 
                onClick={() => navigate('/signup')}
                className="whitespace-nowrap px-5 py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors"
            >
                Create Account
            </button>
        </div>
      )}

      {/* Header */}
      <WelcomeHeader 
        profile={profile} 
        onNewDeck={() => navigate('/pitch-decks')}
        onAddContact={() => setIsContactSidebarOpen(true)}
        onCreateDoc={() => navigate('/documents')}
      />

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* MAIN COLUMN (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
              {/* 1. Command Center */}
              <FounderCommandCenter metrics={metrics} />

              {/* 2. AI Coach */}
              <AICoachWidget 
                  insights={insights} 
                  isGenerating={isGeneratingInsights} 
                  onRefresh={refreshInsights} 
              />

              {/* 3. CRM & Milestones Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <CRMSnapshot deals={deals} />
                  <MilestonesTimeline milestones={milestones} />
              </div>
          </div>

          {/* SIDEBAR COLUMN (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
              {/* 1. Alerts */}
              <SmartAlerts />

              {/* 2. Health Score */}
              <HealthScorecard 
                  score={healthData.score} 
                  metrics={healthData.metrics} 
                  missing={healthData.missing} 
              />

              {/* 3. Setup Checklist */}
              <SetupChecklist profile={profile} />

              {/* 4. AI Digest */}
              <AIInsightsDigest />

              {/* 5. Recent Activity */}
              <ActivityFeed activities={activities} />
          </div>
      </div>

      <div className="h-12"></div>

      {/* Render the Sidebar */}
      <AddContactSidebar 
        isOpen={isContactSidebarOpen} 
        onClose={() => setIsContactSidebarOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
