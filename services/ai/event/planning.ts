import { GoogleGenAI, Type } from "@google/genai";
import { EventData } from "../../../types";
import { EventPrompts } from "../../../lib/prompts/eventPrompts";
import { cleanJson } from "../../../lib/utils";

export const generateActionPlan = async (apiKey: string, eventData: EventData): Promise<any[]> => {
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
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });

    const result = JSON.parse(cleanJson(response.text));
    return result.tasks || [];
  } catch (e) {
    console.error("Event Plan Generation Failed", e);
    return [];
  }
};