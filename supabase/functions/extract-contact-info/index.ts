
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Type } from "npm:@google/genai";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            full_name: { type: Type.STRING },
            role: { type: Type.STRING },
            company: { type: Type.STRING },
            email: { type: Type.STRING, nullable: true },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING },
            sector: { type: Type.STRING }
          },
          required: ['full_name', 'company', 'tags']
        }
      }
    });

    // Clean JSON if needed (though responseMimeType usually handles it)
    let text = response.text || "{}";
    if (text.startsWith('```')) {
      text = text.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
    }
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
