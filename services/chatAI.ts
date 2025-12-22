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
    history: { role: string; parts: { text: string }[] }[],
    message: string,
    context: ChatContext
  ) {
    if (!supabase) {
        throw new Error("Supabase required for Copilot features.");
    }

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
        return data?.text || "I encountered an error processing your request.";
    } catch (err) {
        console.error("Chat AI Error:", err);
        throw err;
    }
  }
};