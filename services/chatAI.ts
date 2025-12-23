import { StartupProfile, MetricsSnapshot, Deal, Task, EventData, Deck, InvestorDoc } from "../types";
import { supabase } from "../lib/supabaseClient";

interface ChatContext {
    profile: StartupProfile | null;
    metrics: MetricsSnapshot[];
    deals?: Deal[];
    tasks?: Task[];
    event?: EventData | null;
    deck?: Deck | null;
    doc?: InvestorDoc | null;
    memoryScope?: {
        type: 'startup' | 'project' | 'event' | 'deal';
        id: string;
        label: string;
    };
}

export const ChatAI = {
  /**
   * Sends message to the Copilot. 
   * Injects strictly scoped memory and entity awareness.
   */
  async sendMessage(
    history: { role: string; parts: { text: string }[] }[],
    message: string,
    context: ChatContext
  ) {
    if (!supabase) {
        throw new Error("Supabase required for Copilot features.");
    }

    try {
        // Log the intent for memory chips visualization in UI
        console.debug(`[Copilot] Routing request in scope: ${context.memoryScope?.label || 'Global'}`);

        const { data, error } = await supabase.functions.invoke('chat-copilot', {
            body: { 
                history, 
                message, 
                context: {
                    profile: context.profile,
                    metrics: context.metrics.slice(-12),
                    deals: context.deals?.slice(0, 10),
                    tasks: context.tasks?.slice(0, 10),
                    event: context.event,
                    deck: context.deck,
                    doc: context.doc,
                    // Pass the scope for Interactions API governance
                    scope: context.memoryScope 
                } 
            }
        });

        if (error) throw error;
        return data?.text || "I'm processing that for you...";
    } catch (err) {
        console.error("Chat AI Orchestration Error:", err);
        throw err;
    }
  }
};
