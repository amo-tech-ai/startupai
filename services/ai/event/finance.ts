import { GoogleGenAI, Type } from "@google/genai";
import { EventData, EventBudgetItem, EventROIAnalysis } from "../../../types";
import { EventPrompts } from "../../../lib/prompts/eventPrompts";
import { generateUUID, cleanJson } from "../../../lib/utils";

export const suggestBudgetBreakdown = async (apiKey: string, total: number, type: string, city: string): Promise<EventBudgetItem[] | null> => {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = EventPrompts.generateBudgetBreakdown(total, type, city);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, enum: ['Venue', 'Food', 'Marketing', 'Speakers', 'Ops', 'Other'] },
                  item: { type: Type.STRING },
                  estimated: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(cleanJson(response.text));
    if (data.items) {
      return data.items.map((i: any) => ({
        id: generateUUID(),
        category: i.category,
        item: i.item,
        estimated: i.estimated,
        actual: 0,
        status: 'Planned'
      }));
    }
    return null;
  } catch (e) {
    console.error("Budget Gen Failed", e);
    return null;
  }
};

export const optimizeBudget = async (apiKey: string, items: EventBudgetItem[], totalBudget: number): Promise<EventBudgetItem[] | null> => {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = EventPrompts.optimizeBudget(items, totalBudget);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingBudget: 2048 } // Use Thinking to make hard tradeoff decisions
      }
    });

    const data = JSON.parse(cleanJson(response.text));
    return data.items || null;
  } catch (e) {
    console.error("Budget Optimization Failed", e);
    return null;
  }
};

export const generateROI = async (apiKey: string, event: EventData, attendees: number): Promise<EventROIAnalysis | null> => {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = EventPrompts.generateROI(event, attendees);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            costPerAttendee: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return JSON.parse(cleanJson(response.text));
  } catch (e) {
    console.error("ROI Analysis Failed", e);
    return null;
  }
};