import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";
import { generateUUID, cleanJson } from "../lib/utils";

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
        
        Return a JSON array of objects with:
        - title (string, max 10 words)
        - description (string, max 20 words)
        - priority (High/Medium/Low)
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const text = cleanJson(response.text);
        if (text) {
            const rawTasks = JSON.parse(text);
            return rawTasks.map((t: any) => ({
                title: t.title,
                description: t.description,
                status: 'Backlog', // Default to backlog
                priority: t.priority,
                aiGenerated: true
            }));
        }
        return null;
    } catch (error) {
        console.error("AI Task Roadmap Error:", error);
        throw error;
    }
  }
};