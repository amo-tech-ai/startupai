import { getAI } from "../lib/ai";
import { StartupProfile, MetricsSnapshot, Deal, Task } from "../types";
import { supabase } from "../lib/supabaseClient";

interface ChatContext {
    profile: StartupProfile | null;
    metrics: MetricsSnapshot[];
    deals?: Deal[];
    tasks?: Task[];
}

export const ChatAI = {
  async sendMessage(
    apiKey: string,
    history: { role: string; parts: { text: string }[] }[],
    message: string,
    context: ChatContext
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
                        metrics: context.metrics.slice(-12),
                        deals: context.deals?.slice(0, 10),
                        tasks: context.tasks?.slice(0, 10)
                    } 
                }
            });

            if (error) throw error;
            if (data && data.text) return data.text;
        } catch (err) {
            console.warn("Chat Edge Function failed, falling back to client-side SDK.", err);
        }
    }

    // 2. Client-Side Fallback using centralized Client
    const ai = getAI();
    
    const profileContext = context.profile ? `
      Startup Name: ${context.profile.name}
      Description: ${context.profile.tagline}
      Stage: ${context.profile.stage}
    ` : "Startup Profile: Not fully set up.";

    const systemInstruction = `
      You are the "StartupAI Copilot", an expert venture capital advisor and operational co-founder.
      You have access to their metrics, deals, and roadmap.
      
      CONTEXT:
      ${profileContext}

      RULES:
      - Be concise and actionable.
      - Use Paul Graham / Y Combinator principles.
      - Never hallucinate data. If you don't know, ask the user to provide context.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: message, // Chat expects contents or chat session
        config: { 
            systemInstruction,
            thinkingConfig: { thinkingBudget: 2048 }
        }
      });

      return response.text;
    } catch (error) {
      console.error("Chat AI Error:", error);
      throw error;
    }
  }
};