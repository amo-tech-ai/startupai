import { supabase } from "../lib/supabaseClient";

/**
 * PRODUCTION-GRADE WIZARD SERVICE
 * -------------------------------
 * All AI logic is executed on the Edge to prevent prompt leakage 
 * and API key exposure in the client bundle.
 */

async function runAI(action: string, payload: any) {
    if (!supabase) {
        throw new Error("Supabase not initialized for AI operation.");
    }

    try {
        const { data, error } = await supabase.functions.invoke('ai-helper', {
            body: { action, payload }
        });
        
        if (error) throw error;
        return data;
    } catch (e) {
        console.error(`Edge Function '${action}' failed:`, e);
        throw new Error(`AI Analysis Failed: ${action}`);
    }
}

export const WizardService = {
  async analyzeContext(inputs: any) {
    return runAI('analyze_context', { inputs });
  },

  async refineText(text: string, context: string) {
    return runAI('rewrite_field', { text, context, field: 'text' }).then(res => res?.result);
  },

  async rewriteBio(name: string, rawBio: string, role: string) {
    return runAI('rewrite_field', { text: rawBio, context: `Bio for ${name}, ${role}`, field: 'bio' }).then(res => res?.result);
  },

  async analyzeBusiness(context: any) {
    return runAI('analyze_business', context);
  },

  async estimateValuation(industry: string, stage: string, mrr: number) {
    return runAI('calculate_fundraising', { metrics: { mrr }, industry, stage, targetRaise: 0 });
  },

  async analyzeTraction(metrics: any, industry: string, stage: string) {
    return runAI('analyze_traction', { metrics, industry, stage });
  },

  async calculateFundraising(metrics: any, industry: string, stage: string, targetRaise: number) {
    return runAI('calculate_fundraising', { metrics, industry, stage, targetRaise });
  },

  async analyzeRisks(profile: any) {
    return runAI('analyze_risks', { profile });
  },

  async performDeepResearch(profile: any, onProgress?: (status: string) => void) {
    try {
        if (onProgress) onProgress("🔍 Scanning market sources (2024/2025)...");
        const researchResult = await runAI('research_topic', { profile });
        
        if (!researchResult || !researchResult.report) {
            throw new Error("Research pass failed.");
        }

        if (onProgress) onProgress("📊 Synthesizing benchmarks...");
        const insights = await runAI('extract_insights', { report: researchResult.report });
        
        return insights;
    } catch (e) {
        console.error("Deep Research Failed", e);
        throw e;
    }
  },

  async suggestUseOfFunds(amount: number, stage: string, industry: string) {
    return runAI('suggest_funds', { amount, stage, industry }).then(res => res?.useOfFunds || []);
  },

  async generateSummary(profileData: any) {
    return runAI('generate_summary', { profile: profileData }).then(res => res?.summary);
  }
};