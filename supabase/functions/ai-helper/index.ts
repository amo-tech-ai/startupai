import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "npm:@google/genai";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const { action, payload, apiKey } = await req.json();
  
  // Use provided key or env var
  const googleApiKey = apiKey || Deno.env.get('GOOGLE_API_KEY');
  const ai = new GoogleGenAI({ apiKey: googleApiKey });

  try {
    let result;

    if (action === 'rewrite_field') {
       const { field, text, context } = payload;
       const prompt = `Rewrite this ${field} for a startup investor profile. Context: ${JSON.stringify(context)}. Original: "${text}". Return JSON: { "suggestion": "..." }`;
       
       const response = await ai.models.generateContent({
         model: 'gemini-3-pro-preview',
         contents: prompt,
         config: { responseMimeType: 'application/json' }
       });
       result = JSON.parse(response.text || '{}');
    } 
    
    else if (action === 'generate_summary') {
       const { profile } = payload;
       const prompt = `Act as a VC. Write a 3-paragraph executive summary for this startup: ${JSON.stringify(profile)}. Return JSON: { "summary": "HTML string..." }`;
       
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

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});