import { AICoachInsight } from "../types";
import { supabase } from "../lib/supabaseClient";

/**
 * STRATEGIC COACHING SERVICE
 * -------------------------
 * Leverages Gemini 3 Pro via Edge Functions to analyze startup health
 * and suggest high-impact tactical moves.
 */

export const CoachAI = {
  /**
   * Analyzes startup metrics and profile to generate strategic insights.
   */
  async generateInsights(
    apiKey: string, // Kept for interface compatibility but not used in Edge Flow
    context: any
  ): Promise<AICoachInsight[] | null> {
    
    if (!supabase) {
        throw new Error("Supabase required for production AI features.");
    }

    try {
        const { data, error } = await supabase.functions.invoke('ai-helper', {
            body: { 
                action: 'generate_coach_insights', 
                payload: { context } 
            }
        });

        if (error) throw error;
        
        return data || [];
    } catch (error) {
        console.error("AI Coach Error:", error);
        throw error;
    }
  }
};