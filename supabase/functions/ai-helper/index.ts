
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
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = text.match(codeBlockRegex);
  if (match) return match[1].trim();
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
  const googleApiKey = Deno.env.get('GOOGLE_API_KEY') || apiKey;
  const ai = new GoogleGenAI({ apiKey: googleApiKey });

  try {
    let result;

    if (action === 'rewrite_field') {
       const { field, text, context } = payload;
       const prompt = `Rewrite this ${field} for a startup investor profile. Context: ${JSON.stringify(context)}. Original: "${text}". Return JSON: \`\`\`json\n{ "result": "..." }\n\`\`\``;
       const response = await ai.models.generateContent({
         model: 'gemini-3-pro-preview',
         contents: prompt,
         config: { responseMimeType: 'application/json' }
       });
       result = JSON.parse(response.text || '{}');
    } 
    else if (action === 'analyze_context') {
        const { inputs } = payload;
        const urlList = [inputs.website, inputs.linkedin, ...(inputs.additionalUrls || [])].filter(Boolean).join(', ');
        
        const prompt = `
          You are an expert venture capital scout and forensic data analyst.
          
          TASK: Perform a deep analysis of the following startup inputs to build a comprehensive intelligence profile.
          
          INPUTS:
          - Name: ${inputs.name}
          - URLs: ${urlList}
          - Description: ${inputs.description || 'None'}
          - Search Terms: ${inputs.searchTerms || 'None'}
          - Industry Hint: ${inputs.industry || 'Unknown'}
          
          WORKFLOW:
          1. **Founder Forensics**: Use Google Search to find public LinkedIn details, bios, and backgrounds of ALL founders associated with this startup/URL. Infer skills and domain expertise.
          2. **Website Extraction**: Analyze the company website content via Search Grounding (meta tags, value prop, features).
          3. **Market Intelligence**: Identify real competitors, market trends, and pricing models.
          4. **Synthesis**: Combine all signals into the structured JSON below.

          OUTPUT FORMAT (Strict JSON):
          \`\`\`json
          {
            "summary_screen": {
              "title": "Startup Intelligence Profile",
              "summary": "3-4 sentence comprehensive summary combining user input, website findings, and market context.",
              "industry_detected": "string",
              "product_category": "string",
              "badges": ["Search Grounded", "string", "string"]
            },
            "founder_intelligence": {
              "founders": [
                {
                  "name": "string",
                  "title": "string",
                  "bio": "2-3 sentences inferred from LinkedIn/Web",
                  "headline": "string",
                  "experience_bullets": ["Previous Company - Role", "Domain Expertise"],
                  "skills": ["string"],
                  "education": ["University - Degree"],
                  "linkedin": "string"
                }
              ]
            },
            "website_analysis": {
              "value_prop": "string",
              "key_features": ["string"],
              "pricing_hints": "string",
              "target_audience": "string",
              "proof_points": ["Customer logos", "Testimonials mentioned"]
            },
            "research_data": {
              "queries_used": ["{name} competitors", "{industry} trends"],
              "sources_count": 5
            },
            "detected_signals": {
              "general": [
                { "label": "Business Model", "value": "string" },
                { "label": "Stage Inference", "value": "string" }
              ],
              "product": [
                { "label": "Core Problem", "value": "string" },
                { "label": "Solution Theme", "value": "string" }
              ],
              "market": [
                { "label": "Market Segment", "value": "string" },
                { "label": "Trend", "value": "string" }
              ],
              "founder": [
                { "label": "Founder-Market Fit", "value": "High/Med/Low" },
                { "label": "Team Completeness", "value": "string" }
              ]
            },
            "workflows": {
              "url_context_ran": true,
              "search_grounding_ran": true,
              "next_actions": ["Verify Founder Bio", "Review Competitors"]
            },
            "wizard_autofill": {
              "product_summary": "string",
              "key_features": ["string"],
              "target_customers": ["string"],
              "use_cases": ["string"],
              "pricing_model": "string",
              "problem": "string",
              "solution": "string",
              "uvp": "string",
              "core_differentiator": "string",
              "competitors": [
                { "name": "string", "url": "string", "positioning": "string" }
              ],
              "market_trends": ["string"]
            }
          }
          \`\`\`
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { 
                tools: [{ googleSearch: {} }],
                thinkingConfig: { thinkingBudget: 4096 }
            }
        });
        const cleaned = cleanJson(response.text);
        result = JSON.parse(cleaned);
    }
    // --- V3: TRACTION ANALYSIS ---
    else if (action === 'analyze_traction') {
        const { metrics, industry, stage } = payload;
        const prompt = `
            Act as a Senior VC Analyst.
            Context: A ${stage} stage ${industry} startup.
            Metrics provided: ${JSON.stringify(metrics)}.

            Task:
            1. Use Google Search to find current 2024/2025 benchmarks for ${industry} startups at ${stage} stage (Typical MRR, Growth Rates, Burn).
            2. Compare the provided metrics against these benchmarks.
            3. Identify "Green Flags" (strengths/traction) and "Red Flags" (risks).
            4. Provide an investor interpretation.

            Output JSON:
            \`\`\`json
            {
                "investor_interpretation": "A brutally honest 1-sentence VC take on their traction.",
                "stage_alignment": "Early Validation | Growing | Scaling | Pre-Product",
                "benchmark_context": "Short summary of market avg (e.g. 'Median Seed SaaS MRR is $15k with 15% MoM growth').",
                "green_flags": ["string"],
                "red_flags": ["string"],
                "recommended_next_metrics": [
                    { "metric": "string", "target": "string", "timeframe": "string" }
                ]
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
        result = JSON.parse(cleanJson(response.text));
    }
    // --- V3: FUNDRAISING CALCULATOR ---
    else if (action === 'calculate_fundraising') {
        const { metrics, industry, stage, targetRaise } = payload;
        const prompt = `
            Act as a Senior VC Analyst.
            Context: ${stage} stage ${industry} startup.
            Financials: ${JSON.stringify(metrics)}.
            Target Raise: $${targetRaise}.

            Task:
            1. Calculate implied runway from cash/burn (if burn > 0).
            2. Use Google Search to find current 2024/2025 valuation multiples for ${industry} at ${stage}.
            3. Estimate a defensible pre-money valuation range.
            4. Determine the appropriate raise amount based on typical 18-24mo runway needs.

            Output JSON:
            \`\`\`json
            {
                "runway_months": number,
                "recommended_stage": "Pre-Seed | Seed | Series A",
                "valuation_range": { "min": number (in millions), "max": number (in millions), "reasoning": "string" },
                "raise_sanity_check": { "status": "Healthy | Aggressive | Conservative", "message": "string" },
                "benchmark_logic": "string (citations of multiples/market data)"
            }
            \`\`\`
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { 
                tools: [{ googleSearch: {} }],
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });
        result = JSON.parse(cleanJson(response.text));
    }
    // --- V3: RED FLAG ANALYST ---
    else if (action === 'analyze_risks') {
        const { profile } = payload;
        const prompt = `
            Act as a skeptical Venture Capitalist conducting Due Diligence.
            Review this startup profile for logical inconsistencies, red flags, or unrealistic claims.
            
            Profile Data:
            - Name: ${profile.name}
            - Stage: ${profile.stage}
            - MRR: $${profile.mrr || 0}
            - Fundraising: Asking $${profile.targetRaise || 0}
            - Team Size: ${profile.founders?.length || 1}
            - Industry: ${profile.industry}
            
            Task:
            1. Sanity check Stage vs Metrics (e.g. "Series A" with $0 revenue).
            2. Sanity check Ask vs Traction (e.g. Raising $5M on idea stage).
            3. Identify missing critical components (e.g. Solo founder, no technical lead).
            4. Identify "Vague" claims (e.g. "We have no competitors").

            Output JSON:
            \`\`\`json
            {
                "overall_risk_level": "Low | Medium | High | Critical",
                "risk_summary": "1 sentence overview.",
                "issues": [
                    {
                        "severity": "Critical | Warning",
                        "category": "Team | Financials | Market | Product",
                        "title": "string",
                        "description": "string",
                        "fix": "Specific advice to resolve this."
                    }
                ],
                "strengths": ["List 2-3 genuine strengths to balance the feedback"]
            }
            \`\`\`
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { 
                thinkingConfig: { thinkingBudget: 4096 }
            }
        });
        result = JSON.parse(cleanJson(response.text));
    }
    // ... (Other legacy handlers)
    else if (action === 'generate_summary') {
       const { profile } = payload;
       const prompt = `Act as a VC analyst. Write a 3-paragraph executive summary. Startup: ${JSON.stringify(profile)}. Return JSON: { "summary": "HTML string..." }`;
       const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt, config: { responseMimeType: 'application/json' } });
       result = JSON.parse(response.text || '{}');
    }
    else if (action === 'analyze_business') {
        const prompt = `Context: ${payload.name} (${payload.industry}) - ${payload.tagline}. Return JSON: { "competitors": ["string"], "coreDifferentiator": "string", "keyFeatures": ["string"] }`;
        const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt, config: { tools: [{ googleSearch: {} }] } });
        const cleaned = cleanJson(response.text);
        result = JSON.parse(cleaned);
    }
    else if (action === 'generate_roadmap') {
       const { profileContext } = payload;
       const prompt = `Context: ${JSON.stringify(profileContext)}. Return JSON: { "tasks": [{ "title": "", "description": "", "priority": "High" }] }`;
       const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt, config: { responseMimeType: 'application/json' } });
       result = JSON.parse(response.text || '{}');
    }
    else if (action === 'generate_document_draft') {
        const { docType, profileContext } = payload;
        const prompt = `Write ${docType} for ${profileContext.name}. Return JSON: { "sections": [{ "title": "", "content": "html" }] }`;
        const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt, config: { responseMimeType: 'application/json' } });
        result = JSON.parse(response.text || '{}');
    }
    else if (action === 'refine_document_section') {
        const { content, instruction } = payload;
        const prompt = `Task: ${instruction}\nInput: ${content}\nReturn JSON: { "content": "..." }`;
        const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt, config: { responseMimeType: 'application/json' } });
        result = JSON.parse(response.text || '{}');
    }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error("AI Helper Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
