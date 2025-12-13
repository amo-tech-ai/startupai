
import { GoogleGenAI } from "@google/genai";
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
                        // Minimize payload size
                        metrics: context.metrics.slice(-12),
                        deals: context.deals?.slice(0, 10), // Send top 10 deals
                        tasks: context.tasks?.slice(0, 10)  // Send top 10 tasks
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

    // CRM Context
    const pipelineValue = context.deals?.reduce((acc, d) => acc + (d.stage !== 'Closed' ? d.value : 0), 0) || 0;
    const dealContext = context.deals && context.deals.length > 0 ? `
      Active Pipeline Value: $${pipelineValue}
      Top Deals:
      ${context.deals.slice(0, 5).map(d => `- ${d.company} (${d.stage}): $${d.value}`).join('\n')}
    ` : "CRM: No active deals.";

    // Task Context
    const taskContext = context.tasks && context.tasks.length > 0 ? `
      Active Tasks:
      ${context.tasks.filter(t => t.status !== 'Done').slice(0, 5).map(t => `- [${t.priority}] ${t.title}`).join('\n')}
    ` : "Tasks: No pending tasks.";

    const systemInstruction = `
      You are the "StartupAI Copilot", an expert venture capital advisor and operational co-founder.
      You are talking to the founder of the startup described below.
      
      CONTEXT:
      ${profileContext}
      ${metricsContext}
      ${dealContext}
      ${taskContext}

      ROLE:
      - Be concise, actionable, and encouraging but realistic.
      - If asked about metrics, refer to the data provided.
      - If asked for advice, use Paul Graham / Y Combinator principles.
      - You can see their Deals and Tasks. Refer to them if relevant.
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
