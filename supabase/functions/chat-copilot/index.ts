
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "npm:@google/genai";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { history, message, context, apiKey } = await req.json();
    
    // Prioritize server-side key, fallback to passed key (for dev/demo flex)
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY') || Deno.env.get('API_KEY') || apiKey;
    
    if (!googleApiKey) {
        throw new Error("Missing API Key configuration.");
    }

    const ai = new GoogleGenAI({ apiKey: googleApiKey });

    // Construct System Context
    const profileContext = context.profile ? `
      Startup Name: ${context.profile.name}
      Description: ${context.profile.tagline}
      Stage: ${context.profile.stage}
      Problem: ${context.profile.problemStatement}
      Solution: ${context.profile.solutionStatement}
      Target Market: ${context.profile.targetMarket}
    ` : "Startup Profile: Not fully set up.";

    const latestMetric = context.metrics && context.metrics.length > 0 
        ? context.metrics[context.metrics.length - 1] 
        : null;
        
    const metricsContext = latestMetric ? `
      MRR: $${latestMetric.mrr}
      Active Users: ${latestMetric.activeUsers}
      Burn Rate: $${latestMetric.burnRate || 0}
      Cash: $${latestMetric.cashBalance || 0}
    ` : "Metrics: No data available.";

    const systemInstruction = `
      You are the "StartupAI Copilot", an expert venture capital advisor and operational co-founder.
      You are talking to the founder of the startup described below.
      
      CONTEXT:
      ${profileContext}
      ${metricsContext}

      ROLE:
      - Be concise, actionable, and encouraging but realistic.
      - If asked about metrics, refer to the data provided.
      - If asked for advice, use Paul Graham / Y Combinator principles.
      - Do not invent data if it's missing from the context; ask the user to provide it.
    `;

    const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: { systemInstruction },
        history: history.map((h: any) => ({ role: h.role, parts: h.parts }))
    });

    const result = await chat.sendMessage({ message });
    
    return new Response(JSON.stringify({ text: result.text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
