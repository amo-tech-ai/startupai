import { GoogleGenAI } from "@google/genai";

/**
 * PRODUCTION AI CONFIGURATION
 * ---------------------------
 * Uses strictly controlled environment variables and correctly typed Gemini SDK calls.
 */

// Initialize AI Client
const aiClient = new GoogleGenAI({ 
  apiKey: process.env.API_KEY || (import.meta.env.VITE_API_KEY as string) 
});

export const getAI = () => aiClient;

/**
 * Standard content generation wrapper
 */
export async function generateText(prompt: string, model: string = 'gemini-3-pro-preview', systemInstruction?: string) {
  try {
    const response = await aiClient.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: model.includes('pro') ? { thinkingBudget: 2048 } : undefined
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}

/**
 * Contextual search grounding wrapper (Pro models only)
 */
export async function generateWithSearch(prompt: string) {
  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 4096 }
      }
    });
    
    return {
      text: response.text,
      citations: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("AI Search Error:", error);
    throw error;
  }
}