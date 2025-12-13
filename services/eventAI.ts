
import { GoogleGenAI, Type } from "@google/genai";
import { EventData, EventStrategyAnalysis, EventLogisticsAnalysis, EventTask } from "../types";
import { supabase } from "../lib/supabaseClient";

export const EventAI = {
  
  /**
   * Step 2: Analyze Event Strategy
   * Uses "Thinking" to assess feasibility and alignment.
   */
  async analyzeStrategy(apiKey: string, eventData: EventData): Promise<EventStrategyAnalysis | null> {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Act as a World-Class Event Strategist.
      
      Analyze the following event plan for a startup:
      Event Name: ${eventData.name}
      Type: ${eventData.type}
      Description: ${eventData.description}
      Location: ${eventData.city}
      Context URLs: ${eventData.venueUrls.join(', ')}

      Task:
      1. Calculate a Feasibility Score (0-100) based on clarity and complexity.
      2. Identify top 3 Risks (Operational, Financial, or Audience).
      3. Suggest 3 creative Themes/Angles for the event.
      4. Define the ideal Audience Profile.
      5. Estimate a budget range (Low/High) for a ${eventData.duration}-hour event in ${eventData.city}.

      Return JSON.
    `;

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
          thinkingConfig: { thinkingBudget: 2048 } // Deep reasoning for budget/risks
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Event Strategy Analysis Failed", e);
      return null;
    }
  },

  /**
   * Step 3: Check Logistics & Conflicts
   * Uses "Search Grounding" to find real-world conflicts.
   */
  async checkLogistics(apiKey: string, date: string, city: string): Promise<EventLogisticsAnalysis | null> {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Act as an Event Operations Manager.
      
      Task: Check for scheduling conflicts for an event on ${date} in ${city}.
      
      Use Google Search to find:
      1. Major tech conferences, sports events, or holidays in ${city} on or near ${date}.
      2. Typical weather for that time of year.
      
      Return JSON.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }], // Enable Search for real data
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
              venueInsights: { type: Type.STRING }
            }
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Event Logistics Check Failed", e);
      // Return a safe fallback if search fails
      return {
        conflicts: [],
        weatherForecast: "Weather data unavailable.",
        venueInsights: "No venue specific alerts."
      };
    }
  },

  /**
   * Final Step: Generate Operational Plan
   * Generates a list of tasks backtracked from the event date.
   */
  async generateActionPlan(apiKey: string, eventData: EventData): Promise<any[]> {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Act as a Senior Event Producer.
      
      Create a detailed operational project plan for:
      - Event: ${eventData.name} (${eventData.type})
      - Date: ${eventData.date}
      - City: ${eventData.city}
      - Description: ${eventData.description}
      
      Generate a list of 10-15 critical tasks organized by phase (Strategy, Planning, Marketing, Operations, Post-Event).
      
      Output JSON format.
    `;

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

      const result = JSON.parse(response.text || '{}');
      return result.tasks || [];
    } catch (e) {
      console.error("Event Plan Generation Failed", e);
      return [];
    }
  }
};
