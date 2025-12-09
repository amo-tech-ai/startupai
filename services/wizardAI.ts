
import { GoogleGenAI } from "@google/genai";
import { cleanJson } from "../lib/utils";
import { supabase } from "../lib/supabaseClient";

/**
 * Helper to execute AI logic either via Edge Function (Preferred) or Client SDK (Fallback)
 */
async function runAI(action: string, payload: any, apiKey: string) {
    // 1. Try Supabase Edge Function (Keeps API Key Secure)
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

    // 2. Client-Side Fallback (Development or Offline)
    const ai = new GoogleGenAI({ apiKey });
    
    if (action === 'rewrite_field') {
        const { text, context } = payload;
        const prompt = `Rewrite this text for a startup investor profile. 
        Context: ${context}. 
        Original: "${text}". 
        Return JSON: { "result": "..." }`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const json = JSON.parse(cleanJson(response.text));
        return json.result;
    }

    if (action === 'generate_summary') {
        const { profile } = payload;
        const prompt = `Act as a VC. Write a 3-paragraph executive summary for this startup: ${JSON.stringify(profile)}. Return JSON: { "summary": "HTML string..." }`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const json = JSON.parse(cleanJson(response.text));
        return json.summary;
    }

    if (action === 'analyze_business') {
        const prompt = `Context: ${payload.name} (${payload.industry}) - ${payload.tagline}. 
        Suggest competitors, core differentiator, and key features. Return JSON.`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(cleanJson(response.text));
    }

    if (action === 'estimate_valuation') {
        const prompt = `Estimate valuation for ${payload.stage} ${payload.industry} startup with $${payload.mrr} MRR. Return JSON {min, max, reasoning}`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(cleanJson(response.text));
    }

    return null;
}

export const WizardService = {
  async analyzeContext(name: string, website: string, apiKey: string) {
    // Context analysis usually needs Google Search grounding which works best on backend
    // but for now keeping client side if edge function doesn't support specific grounding config dynamically
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze startup "${name}" ${website ? `(${website})` : ''}. Return JSON: { tagline, industry, target_audience, core_problem, solution_statement, pricing_model_hint }`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { tools: [{ googleSearch: {} }] }
        });
        return JSON.parse(cleanJson(response.text));
    } catch (e) { return null; }
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

  async suggestUseOfFunds(amount: number, stage: string, industry: string, apiKey: string) {
    // Simple logic usually fine client side or via generic gen text
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Suggest use of funds for $${amount} raise for ${stage} ${industry} startup. JSON array strings.`;
    try {
        const res = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt, config: { responseMimeType: 'application/json' }});
        return JSON.parse(cleanJson(res.text)).useOfFunds || [];
    } catch { return []; }
  },

  async generateSummary(profileData: any, apiKey: string) {
    return runAI('generate_summary', { profile: profileData }, apiKey);
  }
};
