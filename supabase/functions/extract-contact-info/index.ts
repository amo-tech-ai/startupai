
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    // Retrieve API Key from Server Environment Variables
    const apiKey = Deno.env.get('GOOGLE_API_KEY') || Deno.env.get('API_KEY');

    if (!apiKey) {
      throw new Error("Server-side API Key configuration missing.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an expert CRM data enrichment agent.
      
      Task: Analyze the following URL (LinkedIn profile or Company Website) and extract key contact information.
      URL: ${url}
      
      If you cannot access the URL directly, use Google Search to find the latest public information about the person or company represented by this URL.

      Return a JSON object wrapped in a markdown code block:
      \`\`\`json
      {
        "full_name": "string",
        "role": "string",
        "company": "string",
        "email": "string | null",
        "tags": ["string"],
        "summary": "string",
        "sector": "string"
      }
      \`\`\`
    `;

    // Using googleSearch tool implies we cannot enforce responseSchema via config.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = cleanJson(response.text);
    const data = JSON.parse(text);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
