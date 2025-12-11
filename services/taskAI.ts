
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";
import { generateUUID } from "../lib/utils";

export const TaskAI = {
  /**
   * Generates a strategic roadmap of tasks based on startup profile.
   */
  async generateRoadmap(
    apiKey: string,
    profileContext: { name: string; stage: string; targetMarket: string; goal: string }
  ): Promise<Omit<Task, 'id' | 'startupId'>[] | null> {
    
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
        Context: Startup named "${profileContext.name}" in "${profileContext.stage}" stage.
        Sector: ${profileContext.targetMarket}
        Goal: ${profileContext.goal}

        Task: Generate 5 specific, high-priority tasks this startup should focus on RIGHT NOW to move to the next stage.
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
                            title: { type: Type.STRING, description: "Max 10 words" },
                            description: { type: Type.STRING, description: "Max 20 words" },
                            priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
                        },
                        required: ["title", "description", "priority"]
                    }
                },
                thinkingConfig: { thinkingBudget: 1024 }
            }
        });

        const rawTasks = JSON.parse(response.text || '[]');
        return rawTasks.map((t: any) => ({
            title: t.title,
            description: t.description,
            status: 'Backlog', // Default to backlog
            priority: t.priority,
            aiGenerated: true
        }));
    } catch (error) {
        console.error("AI Task Roadmap Error:", error);
        throw error;
    }
  }
};
