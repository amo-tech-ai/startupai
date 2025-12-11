
import { GoogleGenAI } from "@google/genai";
import { cleanJson } from "../lib/utils";
import { supabase } from "../lib/supabaseClient";

export const ContactAI = {
  /**
   * Extracts contact details from a URL using Gemini 3 Pro with Search Grounding.
   */
  async extractFromUrl(apiKey: string, url: string) {
    
    // 1. Try Supabase Edge Function
    if (supabase) {
        try {
            const { data, error } = await supabase.functions.invoke('extract-contact-info', {
                body: { url }
            });
            if (!error && data) return data;
            console.warn("Contact Extraction Edge Function failed, falling back to client...", error);
        } catch (err) {
            console.warn("Edge function connection error", err);
        }
    }

    // 2. Client-Side Fallback
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an expert CRM data enrichment agent.
      
      Task: Analyze the following URL (LinkedIn profile or Company Website) and extract key contact information.
      URL: ${url}
      
      If you cannot access the URL directly, use Google Search to find the latest public information about the person or company represented by this URL.

      Return a JSON object wrapped in a markdown code block:
      \`\`\`json
      {
        "full_name": "string",
        "role": "string",
        "company": "string",
        "email": "string | null",
        "tags": ["string"],
        "summary": "string",
        "sector": "string"
      }
      \`\`\`
    `;

    try {
      // Use Google Search tool for grounding
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const text = cleanJson(response.text);
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error("Contact AI Extraction Error:", error);
      throw error;
    }
  }
};
