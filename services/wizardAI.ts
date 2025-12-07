
import { GoogleGenAI } from "@google/genai";

export const WizardService = {
  /**
   * Analyzes a company name and website URL to generate a full startup profile.
   * Uses Google Search Grounding to find real data if available.
   */
  async analyzeStartupProfile(name: string, website: string, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are an expert startup analyst. Analyze the startup named "${name}" ${website ? `with website ${website}` : ''}.
      
      If the website/company is real and found via Google Search, use real data.
      If it seems hypothetical or new, generate a plausible, high-quality startup profile based on the name and typical industry patterns.

      Return a JSON object with the following fields:
      - tagline (concise, punchy, under 10 words)
      - mission (inspiring, under 20 words)
      - targetMarket (specific industry/niche)
      - problem (2-3 sentences describing the pain point)
      - solution (2-3 sentences describing the product value)
      - businessModel (choose one: SaaS, Marketplace, Ecommerce, Usage, Service)
      
      Ensure the tone is professional, investor-ready, and persuasive.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
        }
      });

      const text = response.text;
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error("Wizard AI Analysis Error:", error);
      throw error;
    }
  },

  /**
   * Refines a specific text field (Problem, Solution, Mission, etc.) using AI.
   */
  async refineText(
    field: string, 
    currentValue: string, 
    contextData: { name: string; industry: string; relatedContext?: string }, 
    apiKey: string
  ) {
    const context = `
      Startup Name: ${contextData.name}
      Industry: ${contextData.industry}
      ${contextData.relatedContext ? `Additional Context: ${contextData.relatedContext}` : ''}
    `;

    const prompt = `
      Context: ${context}
      User Input (${field}): "${currentValue}"
      
      Task: Rewrite the above ${field} to be more professional, concise, and investor-ready. 
      - If it's a tagline, make it punchy (max 10 words).
      - If it's a problem/solution, use active voice and quantify if possible (max 3 sentences).
      
      Return ONLY the rewritten text. No explanations.
    `;

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });
      
      return response.text?.trim() || null;
    } catch (error) {
      console.error(`Wizard AI Refine Error (${field}):`, error);
      throw error;
    }
  }
};
