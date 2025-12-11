
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "npm:@google/genai";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Robust JSON Cleaner
function cleanJson(text: string | undefined): string {
  if (!text) return "{}";
  
  // 1. Try to extract from markdown code block
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = text.match(codeBlockRegex);
  if (match) {
    return match[1].trim();
  }

  // 2. Fallback: bracket matching
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return text.substring(firstBrace, lastBrace + 1);
  }

  return text.trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const { action, payload, apiKey } = await req.json();
  
  // Use provided key or env var. Prioritize Deno env for security.
  const googleApiKey = Deno.env.get('GOOGLE_API_KEY') || apiKey;
  const ai = new GoogleGenAI({ apiKey: googleApiKey });

  try {
    let result;

    // --- Action: Rewrite Field ---
    if (action === 'rewrite_field') {
       const { field, text, context } = payload;
       const prompt = `Rewrite this ${field} for a startup investor profile. 
       Context: ${JSON.stringify(context)}. 
       Original: "${text}". 
       Return a JSON object wrapped in a markdown code block: 
       \`\`\`json
       { "result": "..." }
       \`\`\``;
       
       const response = await ai.models.generateContent({
         model: 'gemini-3-pro-preview',
         contents: prompt,
         config: { responseMimeType: 'application/json' }
       });
       result = JSON.parse(response.text || '{}');
    } 
    
    // --- Action: Analyze Context (Step 1 -> Step 2 Smart Intake) ---
    else if (action === 'analyze_context') {
        const { inputs } = payload;
        const urlList = [inputs.website, inputs.linkedin, ...(inputs.additionalUrls || [])].filter(Boolean).join(', ');
        
        const prompt = `
          You are an expert venture capital analyst and startup scout.
          
          TASK: Run a deep analysis on the following startup inputs to generate a "Smart Context" profile.
          
          USER INPUTS:
          - Startup Name: ${inputs.name}
          - Description: ${inputs.description || 'None'}
          - Target Market Hint: ${inputs.targetMarket || 'None'}
          - URLs: ${urlList}
          - Search Terms: ${inputs.searchTerms || 'None'}
          - Industry Hint: ${inputs.industry || 'Unknown'}
          
          WORKFLOWS TO RUN:
          1. **URL Context**: Extract value prop, features, audience from provided URLs.
          2. **Search Grounding**: Use Google Search to find real competitors, trends, and market validation based on the name/urls/terms.
          3. **Synthesis**: Combine signals into a cohesive summary.

          OUTPUT FORMAT:
          Return a valid JSON object wrapped in a markdown code block with the following EXACT structure:

          \`\`\`json
          {
            "summary_screen": {
              "title": "Startup Summary",
              "summary": "2-4 sentence combined summary using URL context + search grounding + user description.",
              "industry_detected": "string",
              "urls_used": ["string"],
              "search_queries": ["string"],
              "detected_signals": [
                { "label": "Target Audience", "value": "string" },
                { "label": "Core Problem", "value": "string" },
                { "label": "Solution Theme", "value": "string" },
                { "label": "Pricing Model", "value": "string" },
                { "label": "Competitor Insight", "value": "string" },
                { "label": "Trend Insight", "value": "string" }
              ]
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
            },
            "workflows": {
              "url_context_ran": true,
              "search_grounding_ran": true,
              "missing_inputs": ["string"],
              "next_actions": ["string"]
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
        const cleaned = cleanJson(response.text);
        result = JSON.parse(cleaned);
    }

    // --- Action: Generate Summary ---
    else if (action === 'generate_summary') {
       const { profile } = payload;
       const prompt = `Act as a VC analyst. Write a 3-paragraph executive summary for this startup.
       Startup Profile: ${JSON.stringify(profile)}
       Return JSON: { "summary": "HTML string..." }`;
       
       const response = await ai.models.generateContent({
         model: 'gemini-3-pro-preview',
         contents: prompt,
         config: { responseMimeType: 'application/json' }
       });
       result = JSON.parse(response.text || '{}');
    }

    // --- Action: Analyze Business ---
    else if (action === 'analyze_business') {
        const prompt = `Context: ${payload.name} (${payload.industry}) - ${payload.tagline}.
        Use Google Search to find real competitors.
        Return JSON: { "competitors": ["string"], "coreDifferentiator": "string", "keyFeatures": ["string"] }`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { tools: [{ googleSearch: {} }] }
        });
        const cleaned = cleanJson(response.text);
        result = JSON.parse(cleaned);
    }

    // --- Action: Generate Roadmap ---
    else if (action === 'generate_roadmap') {
       const { profileContext } = payload;
       const prompt = `Context: ${JSON.stringify(profileContext)}. Generate 5 tasks. Return JSON: { "tasks": [{ "title": "", "description": "", "priority": "High" }] }`;
       const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
       });
       result = JSON.parse(response.text || '{}');
    }

    // --- Action: Generate Doc Draft ---
    else if (action === 'generate_document_draft') {
        const { docType, profileContext } = payload;
        const prompt = `Write ${docType} for ${profileContext.name}. Return JSON: { "sections": [{ "title": "", "content": "html" }] }`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 2048 } }
       });
       result = JSON.parse(response.text || '{}');
    }

    // --- Action: Refine Doc ---
    else if (action === 'refine_document_section') {
        const { content, instruction } = payload;
        const prompt = `Task: ${instruction}\nInput: ${content}\nReturn JSON: { "content": "..." }`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        result = JSON.parse(response.text || '{}');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("AI Helper Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
