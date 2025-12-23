
import { GoogleGenAI } from "@google/genai";

const aiClient = new GoogleGenAI({ 
  apiKey: process.env.API_KEY || (import.meta.env.VITE_API_KEY as string) 
});

export const getAI = () => aiClient;

export async function generateStrategicText(prompt: string, level: 'high' | 'medium' | 'low' | 'minimal' = 'high') {
  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: level }
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}
