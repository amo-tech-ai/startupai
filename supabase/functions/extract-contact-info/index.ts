
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "npm:@google/genai";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper for JSON cleaning (simple version)
function cleanJson(text: string | undefined): string {
  if (!text) return "{}";
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
  }
  return cleaned;
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

      Return a JSON object with the following fields:
      - full_name (string): The person's full name.
      - role (string): Current job title or role.
      - company (string): Current company name.
      - email (string | null): Publicly available email address (or null).
      - tags (string[]): 3-5 tags describing their industry, expertise, or seniority (e.g. "Fintech", "Investor", "VP").
      - summary (string): A 1-sentence summary of who they are.
      - sector (string): The primary industry sector.
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
