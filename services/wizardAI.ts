
import { GoogleGenAI } from "@google/genai";
import { cleanJson } from "../lib/utils";

export const WizardService = {
  /**
   * STEP 1: Context Analysis
   * Uses Search Grounding + Thinking to extract deep context.
   */
  async analyzeContext(name: string, website: string, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are an expert startup analyst. Analyze the startup named "${name}" ${website ? `with website ${website}` : ''}.
      
      User Goal: specific details to auto-fill a profile.
      
      Task:
      1. Research the company using Google Search.
      2. If website is provided, prioritize extraction from there.
      3. If not found, infer from name and industry patterns.
      4. Think deeply about the target audience and core value proposition.
      
      Return a VALID JSON object with the following keys:
      - tagline (max 10 words, catchy)
      - industry (e.g. Fintech, Edtech, SaaS)
      - target_audience (e.g. SMBs, Enterprise)
      - core_problem (short description of the pain point)
      - solution_statement (how they solve it)
      - pricing_model_hint (e.g. SaaS, Freemium, Marketplace)
      - social_links: { linkedin: string, twitter: string, github: string } (Find these if possible, otherwise empty strings)
      
      IMPORTANT: Return ONLY valid JSON.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          // responseMimeType is NOT allowed when using googleSearch
          thinkingConfig: { thinkingBudget: 2048 } 
        }
      });

      const text = cleanJson(response.text);
      return text ? JSON.parse(text) : null;
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
      const cleaned = cleanJson(response.text);
      return cleaned ? JSON.parse(cleaned).refined : text;
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
      const cleaned = cleanJson(response.text);
      return cleaned ? JSON.parse(cleaned).bio : rawBio;
    } catch (error) {
      return rawBio;
    }
  },

  /**
   * STEP 3: Business & Competitors
   * Uses Thinking + Search
   */
  async analyzeBusiness(context: any, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Context: ${context.name} (${context.industry}) - ${context.tagline}
      
      Task:
      1. Think about the market landscape.
      2. Suggest 3-5 real competitors using Google Search.
      3. Suggest a strong "Core Differentiator".
      4. Suggest 3 key features.
      
      Return valid JSON:
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
          // responseMimeType: 'application/json', // Not allowed with search
          thinkingConfig: { thinkingBudget: 1024 }
        }
      });
      const text = cleanJson(response.text);
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error("Wizard AI Business Error:", error);
      return null;
    }
  },

  /**
   * STEP 4: Traction & Valuation
   * Uses Search + Thinking. Code execution removed to prevent conflicts with Search.
   */
  async estimateValuation(industry: string, stage: string, mrr: number, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Task: Estimate valuation for a ${stage} ${industry} startup with $${mrr} Monthly Recurring Revenue (MRR).
      
      Steps:
      1. Search for current revenue valuation multiples for ${industry} startups at ${stage} stage (e.g., "SaaS seed valuation multiples 2024").
      2. Calculate the valuation range (Low/High) based on MRR * 12 (Annualized) * Multiple.
      3. Return reasoning and numbers in millions.
      
      Output JSON: { "min": number, "max": number, "reasoning": "string" }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          // responseMimeType: 'application/json', // Not allowed with search
        }
      });
      const text = cleanJson(response.text);
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error("Valuation Error", error);
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
      const text = cleanJson(response.text);
      return text ? JSON.parse(text).useOfFunds : [];
    } catch (error) {
        return [];
    }
  },

  /**
   * STEP 5: Executive Summary Generation with Grounding
   */
  async generateSummary(profileData: any, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    
    // Construct a rich context from all profile data
    const context = JSON.stringify({
        name: profileData.name,
        tagline: profileData.tagline,
        website: profileData.website,
        industry: profileData.industry,
        stage: profileData.stage,
        problem: profileData.problem,
        solution: profileData.solution,
        businessModel: profileData.businessModel,
        traction: {
            mrr: profileData.mrr,
            users: profileData.totalUsers,
            raising: profileData.isRaising
        },
        team: profileData.founders.map((f:any) => `${f.name} (${f.title}) - ${f.bio}`).join('; ')
    });

    const prompt = `
      Act as a venture capital analyst. Write a compelling, 3-paragraph executive summary for this startup.
      
      Startup Data:
      ${context}
      
      Requirements:
      1. Paragraph 1: The Hook (Problem & Solution).
      2. Paragraph 2: The Business (Market, Model, Traction).
      3. Paragraph 3: The Team & Ask (Why this team? Fundraising status).
      
      Use Google Search to validate the market opportunity if industry is provided to make the summary stronger.
      
      Return JSON: { "summary": "HTML string with <p> tags..." }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
            // responseMimeType: 'application/json', // Not allowed with search
            tools: [{ googleSearch: {} }] 
        }
      });
      const text = cleanJson(response.text);
      return text ? JSON.parse(text).summary : null;
    } catch (error) {
      console.error("Summary Gen Error", error);
      return null;
    }
  }
};
