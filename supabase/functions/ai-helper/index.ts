
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils.ts";
import { DeepResearchAgent, StandardAgent } from "./services.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

declare const Deno: any;

async function logAiRun(supabase: any, userId: string, tool: string, status: string, duration: number) {
    try {
        if (!supabase || !userId) return;
        await supabase.from('ai_runs').insert({
            user_id: userId,
            tool_name: tool,
            status: status,
            duration_ms: duration,
            created_at: new Date().toISOString()
        });
    } catch (e) {
        console.error("Logging failed", e);
    }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const startTime = Date.now();
  let actionName = 'unknown';
  let userId = null;
  let supabase = null;

  try {
    const { action, payload, apiKey } = await req.json();
    actionName = action;
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY') || apiKey;
    
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
        supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
        const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
        userId = user?.id;
    }

    const deepAgent = new DeepResearchAgent(googleApiKey);
    const stdAgent = new StandardAgent(googleApiKey);

    let result;

    switch (action) {
        case 'research_topic': result = await deepAgent.researchTopic(payload.profile); break;
        case 'extract_insights': result = await deepAgent.extractInsights(payload.report); break;
        case 'analyze_context':
            result = await stdAgent.runTask(`Analyze: ${JSON.stringify(payload.inputs)}`, { tools: [{ googleSearch: {} }], thinkingConfig: { thinkingBudget: 2048 } });
            break;
        case 'generate_event_plan':
            result = await stdAgent.runTask(`Generate 15 critical event tasks for ${payload.eventData.name}`, { thinkingConfig: { thinkingBudget: 1024 } });
            break;
        case 'analyze_risks':
            result = await stdAgent.runTask(`Analyze DD risks for: ${JSON.stringify(payload.profile)}`, { thinkingConfig: { thinkingBudget: 2048 } });
            break;
        default:
            result = await stdAgent.runTask(`Perform action ${action} on ${JSON.stringify(payload)}`);
    }

    if (supabase && userId) await logAiRun(supabase, userId, actionName, 'success', Date.now() - startTime);

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: any) {
    if (supabase && userId) await logAiRun(supabase, userId, actionName, 'error', Date.now() - startTime);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
