import { GoogleGenAI } from "@google/genai";
import { AICoachInsight } from "../types";
import { generateShortId, cleanJson } from "../lib/utils";

export const CoachAI = {
  /**
   * analyzes startup metrics and profile to generate strategic insights.
   */
  async generateInsights(
    apiKey: string,
    context: any
  ): Promise<AICoachInsight[] | null> {
    
    const ai = new GoogleGenAI({ apiKey });
    
    const promptContext = `
        Startup: ${context.name}
        Stage: ${context.stage}
        Tagline: ${context.tagline}
        Problem: ${context.problem}
        Solution: ${context.solution}
        Funding Goal: $${context.fundingGoal}
        MRR: $${context.mrr}
        Active Users: ${context.activeUsers}
    `;

    const prompt = `
        You are a Y Combinator-level startup coach. Analyze the following startup context and provide 3 high-impact strategic insights.
        
        Context:
        ${promptContext}

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

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const text = cleanJson(response.text);
        if (text) {
            const rawInsights = JSON.parse(text);
            return rawInsights.map((i: any) => ({
                id: generateShortId(),
                startupId: context.id || 'unknown',
                category: i.category,
                type: i.type,
                title: i.title,
                description: i.description,
                priority: i.priority,
                status: 'New',
                generatedAt: new Date().toISOString()
            }));
        }
        return null;
    } catch (error) {
        console.error("AI Coach Error:", error);
        throw error;
    }
  }
};