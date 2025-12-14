
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils.ts";
import { DeepResearchAgent, StandardAgent } from "./services.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

declare const Deno: any;

// Helper to log usage
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
        console.error("Failed to log AI run", e);
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
    
    // Auth Check for Logging
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
        supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
        userId = user?.id;
    }

    const deepAgent = new DeepResearchAgent(googleApiKey);
    const stdAgent = new StandardAgent(googleApiKey);

    let result;

    switch (action) {
        // --- V3 Deep Research Pipeline ---
        case 'research_topic':
            result = await deepAgent.researchTopic(payload.profile);
            break;
        case 'extract_insights':
            result = await deepAgent.extractInsights(payload.report);
            break;

        // --- Standard Logic ---
        case 'analyze_context': {
            const { inputs } = payload;
            const urlList = [inputs.website, inputs.linkedin, ...(inputs.additionalUrls || [])].filter(Boolean).join(', ');
            const prompt = `Analyze this startup. Inputs: ${JSON.stringify(inputs)}. URLs: ${urlList}. Return JSON matching WizardFormData structure.`;
            result = await stdAgent.runTask(prompt, { tools: [{ googleSearch: {} }], thinkingConfig: { thinkingBudget: 2048 } });
            break;
        }
        case 'analyze_traction': {
            const { metrics, industry, stage } = payload;
            const prompt = `Analyze traction for ${stage} ${industry} startup. Metrics: ${JSON.stringify(metrics)}. Return JSON with investor_interpretation, green_flags, red_flags.`;
            result = await stdAgent.runTask(prompt);
            break;
        }
        case 'calculate_fundraising': {
            const { metrics, industry, stage, targetRaise } = payload;
            const prompt = `Calculate fundraising needs. Context: ${JSON.stringify({metrics, industry, stage, targetRaise})}. Return JSON with valuation_range, runway_months.`;
            result = await stdAgent.runTask(prompt);
            break;
        }
        case 'analyze_risks': {
            const { profile } = payload;
            const prompt = `Analyze risks. Profile: ${JSON.stringify(profile)}. Return JSON with overall_risk_level, issues[].`;
            result = await stdAgent.runTask(prompt, { thinkingConfig: { thinkingBudget: 2048 } });
            break;
        }
        case 'generate_summary': {
            const { profile } = payload;
            const prompt = `Write summary. Profile: ${JSON.stringify(profile)}. Return JSON: { "summary": "..." }`;
            result = await stdAgent.runTask(prompt);
            break;
        }
        case 'analyze_business': {
            const prompt = `Analyze business. Context: ${JSON.stringify(payload)}. Return JSON: { competitors: [], keyFeatures: [], coreDifferentiator: "" }`;
            result = await stdAgent.runTask(prompt);
            break;
        }
        case 'generate_roadmap': {
            const { profileContext } = payload;
            const prompt = `Generate roadmap. Context: ${JSON.stringify(profileContext)}. Return JSON: { tasks: [] }`;
            result = await stdAgent.runTask(prompt);
            break;
        }
        case 'generate_document_draft': {
            const { docType, profileContext } = payload;
            const prompt = `Write ${docType}. Context: ${JSON.stringify(profileContext)}. Return JSON: { sections: [] }`;
            result = await stdAgent.runTask(prompt);
            break;
        }
        case 'refine_document_section': {
            const { content, instruction } = payload;
            const prompt = `Refine text. Instruction: ${instruction}. Content: ${content}. Return JSON: { "content": "..." }`;
            result = await stdAgent.runTask(prompt);
            break;
        }
        case 'rewrite_field': {
            const { field, text, context } = payload;
            const prompt = `Rewrite ${field}. Context: ${context}. Original: ${text}. Return JSON: { "result": "..." }`;
            result = await stdAgent.runTask(prompt);
            break;
        }

        // --- EVENT SYSTEM ACTIONS ---
        case 'analyze_event_strategy': {
            const { eventData } = payload;
            const prompt = `
              Act as a World-Class Event Strategist.
              Analyze: ${JSON.stringify(eventData)}.
              Task: Calculate feasibility, risks, themes, audience, and budget range.
              Return JSON matching EventStrategyAnalysis.
            `;
            result = await stdAgent.runTask(prompt, { thinkingConfig: { thinkingBudget: 2048 } });
            break;
        }
        case 'check_event_logistics': {
            const { date, city } = payload;
            const prompt = `
              Act as an Event Operations Manager.
              Scan logistics for ${date} in ${city}.
              Find conflicts, weather, and 3 specific real venues.
              Return JSON matching EventLogisticsAnalysis.
            `;
            result = await stdAgent.runTask(prompt, { tools: [{ googleSearch: {} }] });
            break;
        }
        case 'generate_event_plan': {
            const { eventData } = payload;
            const prompt = `
              Act as a Senior Event Producer.
              Create a project plan for ${eventData.name} (${eventData.type}) on ${eventData.date}.
              Generate 10-15 critical tasks by phase.
              Return JSON: { "tasks": [{ "title": "string", "phase": "string", "daysBeforeEvent": number }] }
            `;
            result = await stdAgent.runTask(prompt, { thinkingConfig: { thinkingBudget: 1024 } });
            break;
        }
        case 'generate_event_marketing_copy': {
            const { eventData, assetType } = payload;
            const prompt = `
              Act as a Growth Marketer.
              Write short marketing copy for a ${assetType} post about ${eventData.name}.
              Context: ${eventData.description}.
              Return JSON: { "copy": "string" }
            `;
            result = await stdAgent.runTask(prompt);
            break;
        }
        case 'suggest_event_budget': {
            const { total, type, city } = payload;
            const prompt = `
              Create a line-item budget for a ${type} in ${city} with total $${total}.
              Return JSON: { "items": [{ "category": "string", "item": "string", "estimated": number }] }
            `;
            result = await stdAgent.runTask(prompt);
            break;
        }
        case 'optimize_event_budget': {
            const { items, totalBudget } = payload;
            const prompt = `
              Optimize budget to fit $${totalBudget}.
              Current: ${JSON.stringify(items)}.
              Reduce 'Planned' items. Do not touch 'Paid'.
              Return JSON: { "items": [] }
            `;
            result = await stdAgent.runTask(prompt, { thinkingConfig: { thinkingBudget: 2048 } });
            break;
        }
        case 'generate_event_roi': {
            const { event, attendees } = payload;
            const prompt = `
              Generate Post-Event ROI Report for "${event.name}".
              Budget: $${event.budget_total}, Spent: $${event.budget_spent}, Attendees: ${attendees}.
              Return JSON matching EventROIAnalysis.
            `;
            result = await stdAgent.runTask(prompt);
            break;
        }

        default:
            throw new Error(`Unknown action: ${action}`);
    }

    // Success Log
    if (supabase && userId) {
        await logAiRun(supabase, userId, actionName, 'success', Date.now() - startTime);
    }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error("AI Helper Error:", error);
    // Error Log
    if (supabase && userId) {
        await logAiRun(supabase, userId, actionName, 'error', Date.now() - startTime);
    }
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
