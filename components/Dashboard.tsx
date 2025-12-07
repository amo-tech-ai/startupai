import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { API_KEY } from '../lib/env';
import { CoachAI } from '../services/coachAI';
import { useToast } from '../context/ToastContext';

// Components
import { WelcomeHeader } from './dashboard/WelcomeHeader';
import { KPIGrid } from './dashboard/KPIGrid';
import { ActivityFeed } from './dashboard/ActivityFeed';
import { ProfileStrength } from './dashboard/ProfileStrength';
import { AICoach } from './dashboard/AICoach';
import { AIJourney } from './dashboard/AIJourney';

const Dashboard: React.FC = () => {
  const { profile, metrics, insights, activities, setInsights, addActivity } = useData();
  const { toast, error, success } = useToast();
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

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

  // Auto-trigger on mount if no insights
  useEffect(() => {
      if (profile && insights.length === 0 && API_KEY && !isGeneratingInsights) {
          // Small delay to allow UI to render first
          const timer = setTimeout(() => {
              refreshInsights();
          }, 1500);
          return () => clearTimeout(timer);
      }
  }, [profile, insights.length]);

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      
      {/* 4️⃣ WELCOME SECTION */}
      <WelcomeHeader profile={profile} />

      {/* 5️⃣ KPI CARDS ROW */}
      <KPIGrid metrics={metrics} profile={profile} />

      {/* 6️⃣ GRID: ACTIVITY & AI INSIGHTS */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
         {/* Recent Activity (60% -> 3 cols) */}
         <div className="lg:col-span-3">
            <ActivityFeed activities={activities} />
         </div>

         {/* Right Column: Profile Score & AI Coach (40% -> 2 cols) */}
         <div className="lg:col-span-2 space-y-6">
            <ProfileStrength profile={profile} />
            <AICoach 
              insights={insights} 
              isGenerating={isGeneratingInsights} 
              onRefresh={refreshInsights} 
            />
         </div>
      </section>

      {/* 8️⃣ AI JOURNEY GRID */}
      <AIJourney />

      <div className="h-12"></div> {/* Bottom Spacer */}
    </div>
  );
};

export default Dashboard;