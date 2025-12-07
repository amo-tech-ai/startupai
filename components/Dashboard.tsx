
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { GoogleGenAI } from "@google/genai";
import { AICoachInsight } from '../types';
import { API_KEY } from '../lib/env';

// Components
import { WelcomeHeader } from './dashboard/WelcomeHeader';
import { KPIGrid } from './dashboard/KPIGrid';
import { ActivityFeed } from './dashboard/ActivityFeed';
import { ProfileStrength } from './dashboard/ProfileStrength';
import { AICoach } from './dashboard/AICoach';
import { AIJourney } from './dashboard/AIJourney';

const Dashboard: React.FC = () => {
  const { profile, metrics, insights, activities, setInsights, addActivity } = useData();
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // --- AI COACH LOGIC ---
  const refreshInsights = async () => {
    if (!profile || !API_KEY) {
        if (!API_KEY) alert("API Key missing");
        return;
    }

    setIsGeneratingInsights(true);

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        
        const context = `
            Startup: ${profile.name}
            Stage: ${profile.stage}
            Tagline: ${profile.tagline}
            Problem: ${profile.problemStatement}
            Solution: ${profile.solutionStatement}
            Funding Goal: $${profile.fundingGoal}
            MRR: $${metrics[0]?.mrr || 0}
            Active Users: ${metrics[0]?.activeUsers || 0}
        `;

        const prompt = `
            You are a Y Combinator-level startup coach. Analyze the following startup context and provide 3 high-impact strategic insights.
            
            Context:
            ${context}

            Requirements:
            1. One 'Risk' (What could go wrong?)
            2. One 'Opportunity' (What is a low-hanging fruit?)
            3. One 'Action' (What should they do today?)
            
            Return ONLY a valid JSON array of objects with this schema:
            [
                {
                    "category": "Growth" | "Fundraising" | "Product" | "Finance",
                    "type": "Risk" | "Opportunity" | "Action",
                    "title": "Short punchy title (max 5 words)",
                    "description": "Clear explanation (max 15 words)",
                    "priority": "High" | "Medium" | "Low"
                }
            ]
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const text = response.text;
        if (text) {
            const rawInsights = JSON.parse(text);
            const newInsights: AICoachInsight[] = rawInsights.map((i: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                startupId: profile.id,
                category: i.category,
                type: i.type,
                title: i.title,
                description: i.description,
                priority: i.priority,
                status: 'New',
                generatedAt: new Date().toISOString()
            }));

            setInsights(newInsights);
            addActivity({
                type: 'system',
                title: 'AI Coach Analysis',
                description: 'Generated new strategic insights.'
            });
        }
    } catch (error) {
        console.error("AI Coach Error:", error);
        alert("Failed to generate insights. Please try again.");
    } finally {
        setIsGeneratingInsights(false);
    }
  };

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
