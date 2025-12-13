
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils.ts";
import { DeepResearchAgent, StandardAgent } from "./services.ts";

declare const Deno: any;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { action, payload, apiKey } = await req.json();
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY') || apiKey;
    
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
            result = await stdAgent.runTask(prompt);
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
        default:
            throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error("AI Helper Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
