import { GoogleGenAI } from "@google/genai";

const aiClient = new GoogleGenAI({ 
  apiKey: process.env.API_KEY || (import.meta.env.VITE_API_KEY as string) 
});

export const getAI = () => aiClient;

export async function generateStrategicText(prompt: string, level: 'high' | 'medium' | 'low' | 'minimal' = 'high') {
  const budgetMap = {
    high: 4096,
    medium: 2048,
    low: 1024,
    minimal: 0
  };

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: budgetMap[level] }
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}