
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { cleanJson } from "../lib/utils";
import { supabase } from "../lib/supabaseClient";

/**
 * Helper to execute AI logic either via Edge Function (Preferred) or Client SDK (Fallback)
 */
async function runAI(action: string, payload: any, apiKey: string) {
    // 1. Try Supabase Edge Function (Keeps API Key Secure & Uses centralized logic)
    if (supabase) {
        try {
            // NOTE: Deep Research/Thinking agents can take 30-60s. We MUST invoke with the client library's global config
            // but the per-request timeout isn't easily set in the JS client without global config changes.
            // However, Edge Functions default timeout is 60s (Pro plan) or 10s (Free). 
            // We rely on the platform limit here.
            const { data, error } = await supabase.functions.invoke('ai-helper', {
                body: { action, payload }
            });
            if (!error && data) return data;
            console.warn(`Edge Function '${action}' failed, falling back to client...`, error);
        } catch (e) {
            console.warn(`Edge Function connection error for '${action}'`, e);
        }
    }

    // 2. Client-Side Fallback 
    const ai = new GoogleGenAI({ apiKey });
    console.log(`[AI Fallback] Running '${action}' locally via Gemini SDK`);

    try {
        switch (action) {
            case 'analyze_context': {
                const { inputs } = payload;
                // IMPROVED: Explicitly ask to validate against live web data
                const prompt = `
                    Analyze this startup using Google Search for real-time market validation.
                    Inputs: ${JSON.stringify(inputs)}. 
                    
                    CRITICAL: Search for the specific company name and website to extract real details if they exist.
                    If the company is new, search for the 'Industry' and 'Target Market' to fill in benchmarks.
                    
                    Return JSON matching WizardFormData structure for pre-filling: summary_screen, founder_intelligence, wizard_autofill.
                `;
                const res = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: prompt,
                    config: { responseMimeType: 'application/json', tools: [{ googleSearch: {} }] }
                });
                return JSON.parse(cleanJson(res.text));
            }
            
            // --- V3 Deep Research Pipeline Fallback ---
            case 'research_topic': {
                const { profile } = payload;
                const prompt = `
                    Act as a Senior Venture Capital Analyst.
                    
                    MISSION:
                    Perform a deep-dive "Reality Check" on this startup using real-time Google Search.
                    
                    STARTUP:
                    - Name: ${profile.name}
                    - Industry: ${profile.industry}
                    - Stage: ${profile.stage}
                    - Context: ${profile.description || profile.tagline}
                    
                    RESEARCH TASKS (MUST USE GOOGLE SEARCH):
                    1. Find **2024/2025** benchmarks for ${profile.industry} at ${profile.stage} stage (Typical MRR, Growth Rates, Churn).
                    2. Find **recent (last 6 months)** comparable valuations or funding rounds in this sector (Pre-money, Deal Size).
                    3. Identify top 3 active competitors. For each, find their specific recent moves (funding, features, pivots) in late 2024/2025.
                    4. Identify 3 emerging market trends or shifts in this sector for 2025 (e.g. regulatory changes, tech shifts).
                    5. Assess the feasibility of their fundraising goals ($${profile.fundingGoal || 'N/A'}).
                    
                    OUTPUT:
                    Write a detailed strategic memo (Markdown).
                    - **CRITICAL:** Cite specific Source URLs for every number or claim found.
                    - Be critical and realistic.
                    - Do NOT output JSON. Write for a human partner.
                `;
                const res = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: prompt,
                    config: { 
                        tools: [{ googleSearch: {} }],
                        thinkingConfig: { thinkingBudget: 2048 } // Lower budget for client latency
                    }
                });
                return { report: res.text };
            }

            case 'extract_insights': {
                const { report } = payload;
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
                            { "metric": "string", "low": "string", "median": "string", "high": "string", "unit": "string", "citation": "string (URL or Source Name)" }
                        ],
                        "fundraising_benchmarks": [
                            { "item": "string", "low": "string", "median": "string", "high": "string", "citation": "string (URL or Source Name)" }
                        ],
                        "valuation_references": [
                            { "label": "string", "range": "string", "citation": "string (URL or Source Name)" }
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
                const res = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: prompt,
                    config: { responseMimeType: 'application/json' }
                });
                return JSON.parse(cleanJson(res.text));
            }

            // --- Standard Operations ---
            case 'rewrite_field': {
                const { text, context, field } = payload;
                const prompt = `Rewrite ${field}. Context: ${context}. Original: ${text}. Return JSON: { "result": "..." }`;
                const res = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: prompt,
                    config: { responseMimeType: 'application/json' }
                });
                return JSON.parse(cleanJson(res.text));
            }
            case 'analyze_business': {
                // IMPROVED: Ask for real-time competitor moves
                const prompt = `
                    Analyze business context using Google Search.
                    Context: ${JSON.stringify(payload)}. 
                    Find real competitors and their *current* value propositions.
                    Return JSON: { competitors: [], keyFeatures: [], coreDifferentiator: "" }
                `;
                const res = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: prompt,
                    config: { responseMimeType: 'application/json', tools: [{ googleSearch: {} }] }
                });
                return JSON.parse(cleanJson(res.text));
            }
            case 'generate_summary': {
                const { profile } = payload;
                const prompt = `Write summary. Profile: ${JSON.stringify(profile)}. Return JSON: { "summary": "..." }`;
                const res = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: prompt,
                    config: { responseMimeType: 'application/json' }
                });
                return JSON.parse(cleanJson(res.text));
            }
            case 'analyze_risks': {
                const { profile } = payload;
                const prompt = `Analyze risks. Profile: ${JSON.stringify(profile)}. Return JSON with overall_risk_level, issues[].`;
                const res = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: prompt,
                    config: { responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 2048 } }
                });
                return JSON.parse(cleanJson(res.text));
            }
            case 'calculate_fundraising': {
                const { metrics, industry, stage, targetRaise } = payload;
                // IMPROVED: Ask for live market multiples
                const prompt = `
                    Calculate fundraising needs. 
                    Context: ${JSON.stringify({metrics, industry, stage, targetRaise})}. 
                    Use Google Search to find current 2024/2025 valuation multiples for ${industry}.
                    Return JSON with valuation_range, runway_months, recommended_stage, raise_sanity_check, benchmark_logic.
                `;
                const res = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: prompt,
                    config: { responseMimeType: 'application/json', tools: [{ googleSearch: {} }] }
                });
                return JSON.parse(cleanJson(res.text));
            }
            case 'analyze_traction': {
                const { metrics, industry, stage } = payload;
                const prompt = `Analyze traction for ${stage} ${industry} startup. Metrics: ${JSON.stringify(metrics)}. Return JSON with investor_interpretation, green_flags, red_flags, recommended_next_metrics.`;
                const res = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: prompt,
                    config: { responseMimeType: 'application/json', tools: [{ googleSearch: {} }] }
                });
                return JSON.parse(cleanJson(res.text));
            }
            
            default:
                console.warn(`No client-side fallback implementation for ${action}`);
                return null;
        }
    } catch (e) {
        console.error("Client-side AI fallback failed", e);
        return null;
    }
}

export const WizardService = {
  async analyzeContext(inputs: any, apiKey: string) {
    return runAI('analyze_context', { inputs }, apiKey);
  },

  async refineText(text: string, context: string, apiKey: string) {
    return runAI('rewrite_field', { text, context, field: 'text' }, apiKey).then(res => res?.result);
  },

  async rewriteBio(name: string, rawBio: string, role: string, apiKey: string) {
    return runAI('rewrite_field', { text: rawBio, context: `Bio for ${name}, ${role}`, field: 'bio' }, apiKey).then(res => res?.result);
  },

  async analyzeBusiness(context: any, apiKey: string) {
    return runAI('analyze_business', context, apiKey);
  },

  async estimateValuation(industry: string, stage: string, mrr: number, apiKey: string) {
    return runAI('calculate_fundraising', { metrics: { mrr }, industry, stage, targetRaise: 0 }, apiKey);
  },

  async analyzeTraction(metrics: any, industry: string, stage: string, apiKey: string) {
    return runAI('analyze_traction', { metrics, industry, stage }, apiKey);
  },

  async calculateFundraising(metrics: any, industry: string, stage: string, targetRaise: number, apiKey: string) {
    return runAI('calculate_fundraising', { metrics, industry, stage, targetRaise }, apiKey);
  },

  async analyzeRisks(profile: any, apiKey: string) {
    return runAI('analyze_risks', { profile }, apiKey);
  },

  /**
   * Two-Pass Deep Research Pipeline (Client Orchestrated)
   * 1. Search Grounding -> Markdown Report
   * 2. Extraction -> Strict JSON
   */
  async performDeepResearch(profile: any, apiKey: string, onProgress?: (status: string) => void) {
    try {
        // Pass 1: Research
        if (onProgress) onProgress("🔍 Scanning market sources (2024/2025)...");
        const researchResult = await runAI('research_topic', { profile }, apiKey);
        
        if (!researchResult || !researchResult.report) {
            throw new Error("Research pass failed to generate data.");
        }

        // Pass 2: Extraction
        if (onProgress) onProgress("📊 Synthesizing benchmarks...");
        const insights = await runAI('extract_insights', { report: researchResult.report }, apiKey);
        
        return insights;
    } catch (e) {
        console.error("Deep Research Pipeline Failed", e);
        return null;
    }
  },

  async suggestUseOfFunds(amount: number, stage: string, industry: string, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Suggest use of funds for $${amount} raise for ${stage} ${industry} startup.`;
    try {
        const response = await ai.models.generateContent({ 
            model: 'gemini-3-pro-preview', 
            contents: prompt, 
            config: { 
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { useOfFunds: { type: Type.ARRAY, items: { type: Type.STRING } } }
                }
            }
        });
        return JSON.parse(response.text || '{}').useOfFunds || [];
    } catch { return []; }
  },

  async generateSummary(profileData: any, apiKey: string) {
    return runAI('generate_summary', { profile: profileData }, apiKey).then(res => res?.summary);
  }
};
