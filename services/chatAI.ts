
import { GoogleGenAI } from "@google/genai";
import { StartupProfile, MetricsSnapshot } from "../types";
import { supabase } from "../lib/supabaseClient";

export const ChatAI = {
  async sendMessage(
    apiKey: string,
    history: { role: string; parts: { text: string }[] }[],
    message: string,
    context: {
        profile: StartupProfile | null;
        metrics: MetricsSnapshot[];
    }
  ) {
    // 1. Try Supabase Edge Function (Preferred for Security)
    if (supabase) {
        try {
            const { data, error } = await supabase.functions.invoke('chat-copilot', {
                body: { 
                    history, 
                    message, 
                    context: {
                        profile: context.profile,
                        // Minimize payload size if metrics history is huge
                        metrics: context.metrics.slice(-12) 
                    } 
                }
            });

            if (error) throw error;
            if (data && data.text) return data.text;
        } catch (err) {
            console.warn("Chat Edge Function failed, falling back to client-side SDK.", err);
        }
    }

    // 2. Client-Side Fallback (Development/Demo)
    const ai = new GoogleGenAI({ apiKey });
    
    const profileContext = context.profile ? `
      Startup Name: ${context.profile.name}
      Description: ${context.profile.tagline}
      Stage: ${context.profile.stage}
      Problem: ${context.profile.problemStatement}
      Solution: ${context.profile.solutionStatement}
      Target Market: ${context.profile.targetMarket}
    ` : "Startup Profile: Not fully set up.";

    const latestMetric = context.metrics[context.metrics.length - 1];
    const metricsContext = latestMetric ? `
      MRR: $${latestMetric.mrr}
      Active Users: ${latestMetric.activeUsers}
      Burn Rate: $${latestMetric.burnRate || 0}
      Cash: $${latestMetric.cashBalance || 0}
    ` : "Metrics: No data available.";

    const systemInstruction = `
      You are the "StartupAI Copilot", an expert venture capital advisor and operational co-founder.
      You are talking to the founder of the startup described below.
      
      CONTEXT:
      ${profileContext}
      ${metricsContext}

      ROLE:
      - Be concise, actionable, and encouraging but realistic.
      - If asked about metrics, refer to the data provided.
      - If asked for advice, use Paul Graham / Y Combinator principles.
    `;

    try {
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: { systemInstruction },
        history: history.map(h => ({ role: h.role, parts: h.parts }))
      });

      const result = await chat.sendMessage({ message });
      return result.text;
    } catch (error) {
      console.error("Chat AI Error:", error);
      throw error;
    }
  }
};
