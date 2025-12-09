
import { GoogleGenAI } from "@google/genai";
import { StartupProfile, MetricsSnapshot } from "../types";

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
    const ai = new GoogleGenAI({ apiKey });
    
    // Construct System Prompt with Context
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
      - Do not invent data if it's missing from the context; ask the user to provide it.
    `;

    try {
      const model = ai.models.generateContent; // Use simple generateContent for now to keep it stateless or manage history manually
      // Note: For multi-turn, we usually use chats.create, but here we'll just send the history as a prompt or use the chat model if available.
      // Simpler for this implementation: Use chat model with history.
      
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
