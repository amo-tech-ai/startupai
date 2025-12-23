
import { GoogleGenAI, Type } from "@google/genai";
import { EventData } from "../../../types";
import { EventPrompts } from "../../../lib/prompts/eventPrompts";
import { cleanJson } from "../../../lib/utils";
import { supabase } from "../../../lib/supabaseClient";

export const generateActionPlan = async (apiKey: string, eventData: EventData): Promise<any[]> => {
  
  // 1. Try Edge Function
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-helper', {
        body: { action: 'generate_event_plan', payload: { eventData } }
      });
      if (!error && data) return data.tasks || [];
      console.warn("Edge Function 'generate_event_plan' failed, falling back...", error);
    } catch (e) {
       console.warn("Edge connection error", e);
    }
  }

  // 2. Client Fallback
  const ai = new GoogleGenAI({ apiKey });
  const prompt = EventPrompts.generateActionPlan(eventData);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  phase: { type: Type.STRING, enum: ['Strategy', 'Planning', 'Marketing', 'Operations', 'Post-Event'] },
                  daysBeforeEvent: { type: Type.NUMBER, description: "Number of days before the event this task should be done" }
                }
              }
            }
          }
        },
        // Gemini 3: Using high depth for operational logic
        thinkingConfig: { thinkingLevel: 'high' }
      }
    });

    const result = JSON.parse(cleanJson(response.text));
    return result.tasks || [];
  } catch (e) {
    console.error("Event Plan Generation Failed", e);
    return [];
  }
};
