import { supabase } from "../lib/supabaseClient";

/**
 * CONTACT INTELLIGENCE SERVICE
 * ----------------------------
 * Proxies extraction and search grounding to the Edge for safe execution.
 */

export const ContactAI = {
  /**
   * Extracts contact details from a URL using Gemini 3 Pro with Search Grounding.
   */
  async extractFromUrl(apiKey: string, url: string) {
    if (!supabase) {
        throw new Error("Supabase initialized required for contact extraction.");
    }

    try {
        const { data, error } = await supabase.functions.invoke('extract-contact-info', {
            body: { url }
        });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Contact AI Extraction Error:", error);
        throw error;
    }
  }
};