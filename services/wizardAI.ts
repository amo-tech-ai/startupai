
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
            const { inputs } = payload;
            const urlList = [inputs.website, inputs.linkedin, ...(inputs.additionalUrls || [])].filter(Boolean).join(', ');
            
            const prompt = `
              You are an expert venture capital scout and forensic data analyst.
              
              TASK: Perform a deep analysis of the following startup inputs to build a comprehensive intelligence profile.
              
              INPUTS:
              - Name: ${inputs.name}
              - URLs: ${urlList}
              - Description: ${inputs.description || 'None'}
              - Search Terms: ${inputs.searchTerms || 'None'}
              - Industry Hint: ${inputs.industry || 'Unknown'}
              
              WORKFLOW:
              1. **Founder Forensics**: Use Google Search to find public LinkedIn details, bios, and backgrounds of ALL founders associated with this startup/URL.
              2. **Website Extraction**: Analyze the company website content via Search Grounding (meta tags, value prop, features).
              3. **Market Intelligence**: Identify real competitors, market trends, and pricing models.
              4. **Synthesis**: Combine all signals into the structured JSON below.

              OUTPUT FORMAT (Strict JSON):
              \`\`\`json
              {
                "summary_screen": {
                  "title": "Startup Intelligence Profile",
                  "summary": "3-4 sentence comprehensive summary combining user input, website findings, and market context.",
                  "industry_detected": "string",
                  "product_category": "string",
                  "badges": ["Search Grounded", "string", "string"]
                },
                "founder_intelligence": {
                  "founders": [
                    {
                      "name": "string",
                      "title": "string",
                      "bio": "2-3 sentences inferred from LinkedIn/Web",
                      "headline": "string",
                      "experience_bullets": ["Previous Company - Role", "Domain Expertise"],
                      "skills": ["string"],
                      "education": ["University - Degree"],
                      "linkedin": "string"
                    }
                  ]
                },
                "website_analysis": {
                  "value_prop": "string",
                  "key_features": ["string"],
                  "pricing_hints": "string",
                  "target_audience": "string",
                  "proof_points": ["Customer logos", "Testimonials mentioned"]
                },
                "research_data": {
                  "queries_used": ["{name} competitors", "{industry} trends"],
                  "sources_count": 5
                },
                "detected_signals": {
                  "general": [
                    { "label": "Business Model", "value": "string" },
                    { "label": "Stage Inference", "value": "string" }
                  ],
                  "product": [
                    { "label": "Core Problem", "value": "string" },
                    { "label": "Solution Theme", "value": "string" }
                  ],
                  "market": [
                    { "label": "Market Segment", "value": "string" },
                    { "label": "Trend", "value": "string" }
                  ],
                  "founder": [
                    { "label": "Founder-Market Fit", "value": "High/Med/Low" },
                    { "label": "Team Completeness", "value": "string" }
                  ]
                },
                "workflows": {
                  "url_context_ran": true,
                  "search_grounding_ran": true,
                  "next_actions": ["Verify Founder Bio", "Review Competitors"]
                },
                "wizard_autofill": {
                  "product_summary": "string",
                  "key_features": ["string"],
                  "target_customers": ["string"],
                  "use_cases": ["string"],
                  "pricing_model": "string",
                  "problem": "string",
                  "solution": "string",
                  "uvp": "string",
                  "core_differentiator": "string",
                  "competitors": [
                    { "name": "string", "url": "string", "positioning": "string" }
                  ],
                  "market_trends": ["string"]
                }
              }
              \`\`\`
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: { 
                    tools: [{ googleSearch: {} }],
                    thinkingConfig: { thinkingBudget: 4096 }
                }
            });
            return JSON.parse(cleanJson(response.text));
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
