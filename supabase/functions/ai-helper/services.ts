
import { GoogleGenAI } from "npm:@google/genai";
import { cleanJson } from "./utils.ts";

export class DeepResearchAgent {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async researchTopic(profile: any) {
    const prompt = `
        Act as a Senior Venture Capital Analyst.
        
        MISSION:
        Perform a deep-dive "Reality Check" on this startup using real-time Google Search.
        
        STARTUP:
        - Name: ${profile.name}
        - Industry: ${profile.industry}
        - Stage: ${profile.stage}
        - Context: ${profile.description || profile.tagline}
        
        RESEARCH TASKS:
        1. Find 2024/2025 benchmarks for ${profile.industry} at ${profile.stage} stage (Typical MRR, Growth Rates, Churn).
        2. Find recent comparable valuations or funding rounds in this sector (Pre-money, Deal Size).
        3. Identify top 3 active competitors. For each, find their specific recent moves (funding, features, pivots) in late 2024/2025.
        4. Identify 3 emerging market trends or shifts in this sector for 2025 (e.g. regulatory changes, tech shifts).
        5. Assess the feasibility of their fundraising goals ($${profile.fundingGoal || 'N/A'}).
        
        OUTPUT:
        Write a detailed strategic memo (Markdown).
        - Cite specific sources/URLs for every number found.
        - Be critical and realistic.
        - Do NOT output JSON. Write for a human partner.
    `;

    const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
            tools: [{ googleSearch: {} }],
            thinkingConfig: { thinkingBudget: 4096 }
        }
    });
    
    return { 
        report: response.text, 
        groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks 
    };
  }

  async extractInsights(report: string) {
    const prompt = `
        Act as a Data Extraction Agent.
        
        INPUT REPORT:
        """
        ${report}
        """
        
        TASK:
        Extract key benchmarks and signals into a strict JSON format.
        
        OUTPUT JSON SCHEMA:
        {
            "executive_summary": ["string (max 5 bullets)"],
            "stage_inference": { "stage": "string", "reasoning": "string" },
            "traction_benchmarks": [
                { "metric": "string", "low": "string", "median": "string", "high": "string", "unit": "string", "citation": "string" }
            ],
            "fundraising_benchmarks": [
                { "item": "string", "low": "string", "median": "string", "high": "string", "citation": "string" }
            ],
            "valuation_references": [
                { "label": "string", "range": "string", "citation": "string" }
            ],
            "competitor_analysis": [
                { "name": "string", "differentiation": "string", "recent_moves": "string" }
            ],
            "market_trends": ["string"],
            "red_flags_and_fixes": [
                { "flag": "string", "fix": "string", "timeline": "30 days" }
            ],
            "confidence_score": { "level": "High|Medium|Low", "explanation": "string" }
        }
    `;

    const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    
    return JSON.parse(cleanJson(response.text));
  }
}

export class StandardAgent {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async runTask(prompt: string, config: any = {}) {
    const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json', ...config }
    });
    return JSON.parse(cleanJson(response.text));
  }
}
