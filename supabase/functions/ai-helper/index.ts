
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

    // --- Action: Rewrite Field (Text Processing) ---
    if (action === 'rewrite_field') {
       const { field, text, context } = payload;
       // Explicitly ask for JSON result
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
    
    // --- Action: Analyze Context (Step 1 - Search Grounded) ---
    else if (action === 'analyze_context') {
        const { inputs } = payload;
        const urlList = [inputs.website, inputs.linkedin, ...(inputs.additionalUrls || [])].filter(Boolean).join(', ');
        
        const prompt = `
          You are an expert venture capital analyst.
          TASK: Analyze the following startup context to extract strategic signals.
          
          INPUTS:
          - Name: ${inputs.name}
          - URLs: ${urlList}
          - Industry Hint: ${inputs.industry || 'Unknown'}
          - Search Terms: ${inputs.searchTerms || 'None provided'}
          
          INSTRUCTIONS:
          1. Use Google Search to research the company.
          2. Return a valid JSON object wrapped in a markdown code block.
          
          JSON FORMAT:
          \`\`\`json
          {
            "tagline": "string",
            "industry": "string",
            "target_audience": "string",
            "core_problem": "string",
            "solution_statement": "string",
            "pricing_model_hint": "string",
            "social_links": { "linkedin": "string", "twitter": "string", "github": "string" },
            "competitors": ["string"],
            "trends": ["string"]
          }
          \`\`\`
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { 
                tools: [{ googleSearch: {} }] 
            }
        });
        const cleaned = cleanJson(response.text);
        result = JSON.parse(cleaned);
    }

    // --- Action: Generate Summary (Step 5 - Search Grounded) ---
    else if (action === 'generate_summary') {
       const { profile } = payload;
       const prompt = `Act as a VC analyst. Research the startup described below using Google Search to validate market claims, then write a 3-paragraph executive summary.
       
       Startup Profile: ${JSON.stringify(profile)}
       
       Return a JSON object wrapped in markdown: 
       \`\`\`json
       { "summary": "HTML string..." }
       \`\`\``;
       
       const response = await ai.models.generateContent({
         model: 'gemini-3-pro-preview',
         contents: prompt,
         config: { 
            tools: [{ googleSearch: {} }]
         }
       });
       const cleaned = cleanJson(response.text);
       result = JSON.parse(cleaned);
    }

    // --- Action: Analyze Business (Step 3 - Search Grounded) ---
    else if (action === 'analyze_business') {
        const prompt = `Context: ${payload.name} (${payload.industry}) - ${payload.tagline}.
        Use Google Search to find real, active competitors and market trends.
        
        Return a JSON object wrapped in markdown:
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
                tools: [{ googleSearch: {} }]
            }
        });
        const cleaned = cleanJson(response.text);
        result = JSON.parse(cleaned);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("AI Helper Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
