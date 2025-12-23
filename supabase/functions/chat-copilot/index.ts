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
    
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY') || Deno.env.get('API_KEY') || apiKey;
    
    if (!googleApiKey) {
        throw new Error("Missing API Key configuration.");
    }

    const ai = new GoogleGenAI({ apiKey: googleApiKey });

    // 1. Startup Profile Context
    const profileContext = context.profile ? `
      Startup Name: ${context.profile.name}
      Description: ${context.profile.tagline}
      Stage: ${context.profile.stage}
      Problem: ${context.profile.problemStatement}
      Solution: ${context.profile.solutionStatement}
      Target Market: ${context.profile.targetMarket}
    ` : "Startup Profile: Not fully set up.";

    // 2. Metrics Context
    const latestMetric = context.metrics && context.metrics.length > 0 
        ? context.metrics[context.metrics.length - 1] 
        : null;
        
    const metricsContext = latestMetric ? `
      Financial Snapshot:
      - MRR: $${latestMetric.mrr}
      - Active Users: ${latestMetric.activeUsers}
      - Burn Rate: $${latestMetric.burnRate || 0}
      - Cash: $${latestMetric.cashBalance || 0}
    ` : "Metrics: No data available.";

    // 3. Current Focused Entity Context (Event, Deck, or Doc)
    let focusedEntityContext = "";
    if (context.event) {
        focusedEntityContext = `
          CURRENT FOCUS: EVENT PLANNING
          Event Name: ${context.event.name}
          Type: ${context.event.type}
          Date: ${context.event.date}
          City: ${context.event.city}
          Status: ${context.event.status}
          Description: ${context.event.description}
          Budget Total: $${context.event.budget_total}
        `;
    } else if (context.deck) {
        focusedEntityContext = `
          CURRENT FOCUS: PITCH DECK
          Title: ${context.deck.title}
          Template: ${context.deck.template}
          Slide Count: ${context.deck.slides?.length || 0}
        `;
    } else if (context.doc) {
        focusedEntityContext = `
          CURRENT FOCUS: INVESTOR DOCUMENT
          Title: ${context.doc.title}
          Type: ${context.doc.type}
          Status: ${context.doc.status}
        `;
    }

    const systemInstruction = `
      You are the "StartupAI Copilot", an expert venture capital advisor and operational co-founder.
      You are talking to the founder of the startup described below.
      
      STARTUP CONTEXT:
      ${profileContext}
      ${metricsContext}
      
      ${focusedEntityContext}

      GOAL:
      - Be concise, actionable, and encouraging but realistic.
      - If an event is being planned, offer logistical advice or marketing hooks.
      - If a deck is open, offer narrative or design feedback.
      - Use Paul Graham / Y Combinator principles for advice.
      - If asked about metrics, refer to the data provided.
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