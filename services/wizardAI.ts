
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
    
    try {
        if (action === 'rewrite_field') {
            const { text, context } = payload;
            const rewriteSchema: Schema = {
                type: Type.OBJECT,
                properties: { result: { type: Type.STRING } },
                required: ["result"]
            };
            
            const prompt = `Rewrite this text for a startup investor profile. 
            Context: ${context}. 
            Original: "${text}".`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: { 
                    responseMimeType: 'application/json',
                    responseSchema: rewriteSchema
                }
            });
            return JSON.parse(response.text || '{}').result;
        }

        if (action === 'analyze_context') {
            // ... (Existing implementation kept in Edge Function, simplifying client fallback for brevity)
            // For complex logic like analyze_context, we rely heavily on Edge Function.
            // Client fallback here is simplified or skipped to save bundle size if needed.
            return null; 
        }

        if (action === 'generate_summary') {
            const { profile } = payload;
            const prompt = `Act as a VC. Research this company using Google Search and write a 3-paragraph executive summary.
            Startup: ${JSON.stringify(profile)}. 
            
            Return a JSON object wrapped in a markdown code block: 
            \`\`\`json
            { "summary": "HTML string..." }
            \`\`\``;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: { 
                    tools: [{ googleSearch: {} }],
                    thinkingConfig: { thinkingBudget: 1024 } 
                }
            });
            return JSON.parse(cleanJson(response.text)).summary;
        }

        if (action === 'analyze_business') {
            const prompt = `Context: ${payload.name} (${payload.industry}) - ${payload.tagline}. 
            Use Google Search to find real competitors and trends.
            
            Return a JSON object wrapped in a markdown code block:
            \`\`\`json
            {
                "competitors": ["string"],
                "coreDifferentiator": "string",
                "keyFeatures": ["string"]
            }
            \`\`\``;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: { 
                    tools: [{ googleSearch: {} }],
                    thinkingConfig: { thinkingBudget: 1024 } 
                }
            });
            return JSON.parse(cleanJson(response.text));
        }

        if (action === 'estimate_valuation') {
            // Legacy V2 call - keep for backward compatibility if needed, but V3 calculate_fundraising is better
            const valuationSchema: Schema = {
                type: Type.OBJECT,
                properties: {
                    min: { type: Type.NUMBER },
                    max: { type: Type.NUMBER },
                    reasoning: { type: Type.STRING }
                },
                required: ["min", "max", "reasoning"]
            };

            const prompt = `Estimate valuation for ${payload.stage} ${payload.industry} startup with $${payload.mrr} MRR.`;
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: { 
                    responseMimeType: 'application/json',
                    responseSchema: valuationSchema,
                    thinkingConfig: { thinkingBudget: 1024 } 
                }
            });
            return JSON.parse(response.text || '{}');
        }
    } catch (e) {
        console.error(`AI Error in ${action}:`, e);
        return null;
    }

    return null;
}

export const WizardService = {
  async analyzeContext(inputs: any, apiKey: string) {
    return runAI('analyze_context', { inputs }, apiKey);
  },

  async refineText(text: string, context: string, apiKey: string) {
    return runAI('rewrite_field', { text, context }, apiKey);
  },

  async rewriteBio(name: string, rawBio: string, role: string, apiKey: string) {
    return runAI('rewrite_field', { text: rawBio, context: `Bio for ${name}, ${role}` }, apiKey);
  },

  async analyzeBusiness(context: any, apiKey: string) {
    return runAI('analyze_business', context, apiKey);
  },

  async estimateValuation(industry: string, stage: string, mrr: number, apiKey: string) {
    return runAI('estimate_valuation', { industry, stage, mrr }, apiKey);
  },

  // --- V3 New Methods ---
  async analyzeTraction(metrics: any, industry: string, stage: string, apiKey: string) {
    return runAI('analyze_traction', { metrics, industry, stage }, apiKey);
  },

  async calculateFundraising(metrics: any, industry: string, stage: string, targetRaise: number, apiKey: string) {
    return runAI('calculate_fundraising', { metrics, industry, stage, targetRaise }, apiKey);
  },
  // ----------------------

  async suggestUseOfFunds(amount: number, stage: string, industry: string, apiKey: string) {
    // This is simple generation, OK to leave as client-only Schema call for speed
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
    return runAI('generate_summary', { profile: profileData }, apiKey);
  }
};
