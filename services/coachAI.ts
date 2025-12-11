
import { GoogleGenAI, Type } from "@google/genai";
import { AICoachInsight } from "../types";
import { generateShortId } from "../lib/utils";

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
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { 
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            category: { type: Type.STRING, enum: ["Growth", "Fundraising", "Product", "Finance", "Team"] },
                            type: { type: Type.STRING, enum: ["Risk", "Opportunity", "Action"] },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
                        },
                        required: ["category", "type", "title", "description", "priority"]
                    }
                },
                // Enable Thinking to analyze the strategic situation before outputting structured JSON
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });

        const rawInsights = JSON.parse(response.text || '[]');
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
    } catch (error) {
        console.error("AI Coach Error:", error);
        throw error;
    }
  }
};
