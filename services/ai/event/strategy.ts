import { GoogleGenAI, Type } from "@google/genai";
import { EventData, EventStrategyAnalysis } from "../../../types";
import { EventPrompts } from "../../../lib/prompts/eventPrompts";
import { cleanJson } from "../../../lib/utils";

export const analyzeStrategy = async (apiKey: string, eventData: EventData): Promise<EventStrategyAnalysis | null> => {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = EventPrompts.analyzeStrategy(eventData);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feasibilityScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
                }
              }
            },
            suggestedThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
            audienceProfile: { type: Type.STRING },
            budgetEstimate: {
              type: Type.OBJECT,
              properties: {
                low: { type: Type.NUMBER },
                high: { type: Type.NUMBER },
                currency: { type: Type.STRING }
              }
            }
          },
          required: ['feasibilityScore', 'reasoning', 'risks', 'suggestedThemes', 'audienceProfile', 'budgetEstimate']
        },
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });

    return JSON.parse(cleanJson(response.text));
  } catch (e) {
    console.error("Event Strategy Analysis Failed", e);
    return null;
  }
};