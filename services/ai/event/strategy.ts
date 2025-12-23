
import { GoogleGenAI, Type } from "@google/genai";
import { EventData, EventStrategyAnalysis } from "../../../types";
import { EventPrompts } from "../../../lib/prompts/eventPrompts";
import { cleanJson } from "../../../lib/utils";
import { supabase } from "../../../lib/supabaseClient";

export const analyzeStrategy = async (apiKey: string, eventData: EventData): Promise<EventStrategyAnalysis | null> => {
  
  // 1. Try Supabase Edge Function
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-helper', {
        body: { action: 'analyze_event_strategy', payload: { eventData } }
      });
      if (!error && data) return data;
      console.warn("Edge Function 'analyze_event_strategy' failed, falling back...", error);
    } catch (e) {
      console.warn("Edge connection error", e);
    }
  }

  // 2. Client Fallback
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
        // Gemini 3: High thinking level for complex operational strategy
        thinkingConfig: { thinkingLevel: 'high' }
      }
    });

    return JSON.parse(cleanJson(response.text));
  } catch (e) {
    console.error("Event Strategy Analysis Failed", e);
    return null;
  }
};
