import { GoogleGenAI, Type } from "@google/genai";
import { EventLogisticsAnalysis } from "../../../types";
import { EventPrompts } from "../../../lib/prompts/eventPrompts";
import { cleanJson } from "../../../lib/utils";

export const checkLogistics = async (apiKey: string, date: string, city: string): Promise<EventLogisticsAnalysis | null> => {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = EventPrompts.checkLogistics(date, city);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conflicts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  date: { type: Type.STRING },
                  impact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
                }
              }
            },
            weatherForecast: { type: Type.STRING },
            venueInsights: { type: Type.STRING },
            suggestedVenues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  capacity: { type: Type.STRING },
                  cost: { type: Type.STRING },
                  notes: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(cleanJson(response.text));
  } catch (e) {
    console.error("Event Logistics Check Failed", e);
    return {
      conflicts: [],
      weatherForecast: "Weather data unavailable.",
      venueInsights: "No venue specific alerts."
    };
  }
};