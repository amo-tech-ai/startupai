
import { GoogleGenAI } from "@google/genai";

export const WizardService = {
  /**
   * STEP 1: Context Analysis
   * Uses URL Context Tool (simulated via prompt/search) + Search Grounding
   */
  async analyzeContext(name: string, website: string, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are an expert startup analyst. Analyze the startup named "${name}" ${website ? `with website ${website}` : ''}.
      
      User Goal: Tell us the basic information about the company.
      
      Task:
      1. If the website is real, extract details.
      2. If not found, infer from the name and industry patterns.
      3. Clean the one-liner to be investor-ready (concise, active voice).
      
      Return a JSON object with:
      - tagline (max 10 words)
      - industry (e.g. Fintech, Edtech)
      - target_audience (e.g. SMBs, Enterprise)
      - core_problem (short description)
      - pricing_model_hint (e.g. SaaS, Freemium)
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

      return response.text ? JSON.parse(response.text) : null;
    } catch (error) {
      console.error("Wizard AI Context Error:", error);
      return null;
    }
  },

  /**
   * Generic Text Refinement
   */
  async refineText(text: string, context: string, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      Refine the following ${context} for a startup to be more investor-ready, concise, and professional.
      Original: "${text}"
      
      Return JSON: { "refined": "..." }
    `;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      return response.text ? JSON.parse(response.text).refined : text;
    } catch (error) {
      return text;
    }
  },

  /**
   * STEP 2: Team Bio Rewrite
   */
  async rewriteBio(name: string, rawBio: string, role: string, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Rewrite this founder bio to be investor-ready. Highlight credibility, relevant experience, and founder-market fit.
      Founder: ${name}, Role: ${role}
      Raw Bio: "${rawBio}"
      
      Output JSON: { "bio": "..." }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      return response.text ? JSON.parse(response.text).bio : rawBio;
    } catch (error) {
      return rawBio;
    }
  },

  /**
   * STEP 3: Business & Competitors
   */
  async analyzeBusiness(context: any, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Context: ${context.name} (${context.industry}) - ${context.tagline}
      
      Task:
      1. Suggest 3-5 real competitors using Google Search.
      2. Suggest a strong "Core Differentiator".
      3. Suggest 3 key features.
      
      Return JSON:
      {
        "competitors": ["Name 1", "Name 2"],
        "coreDifferentiator": "...",
        "keyFeatures": ["...", "...", "..."]
      }
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
      return response.text ? JSON.parse(response.text) : null;
    } catch (error) {
      console.error("Wizard AI Business Error:", error);
      return null;
    }
  },

  /**
   * STEP 4: Traction & Valuation
   */
  async estimateValuation(industry: string, stage: string, mrr: number, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Estimate a valuation range for a ${stage} stage ${industry} startup with $${mrr} MRR.
      Use current market benchmarks.
      
      Return JSON: { "min": number, "max": number, "reasoning": "string" }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      return response.text ? JSON.parse(response.text) : null;
    } catch (error) {
      return null;
    }
  },

  /**
   * STEP 4: Use of Funds Suggestion
   */
  async suggestUseOfFunds(amount: number, stage: string, industry: string, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      Suggest 4-5 standard "Use of Funds" categories for a ${stage} ${industry} startup raising $${amount}.
      Focus on growth, product, and team.
      
      Return JSON: { "useOfFunds": ["Category 1", "Category 2", ...] }
    `;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      return response.text ? JSON.parse(response.text).useOfFunds : [];
    } catch (error) {
        return [];
    }
  },

  /**
   * STEP 5: Executive Summary Generation
   */
  async generateSummary(profileData: any, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Generate an investor executive summary (200 words max) based on:
      ${JSON.stringify(profileData)}
      
      Structure:
      - Problem & Solution
      - Market & Business Model
      - Traction
      - Team
      
      Return JSON: { "summary": "..." }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      return response.text ? JSON.parse(response.text).summary : null;
    } catch (error) {
      return null;
    }
  }
};
