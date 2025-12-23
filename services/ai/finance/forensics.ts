
import { GoogleGenAI, Type } from "@google/genai";
import { API_KEY } from "../../../lib/env";
import { cleanJson } from "../../../lib/utils";

export const FinancialForensics = {
  /**
   * Analyzes raw transaction data using Python code execution.
   * Enforces deterministic output and anomaly detection.
   */
  async analyzeTransactions(rawCsv: string) {
    if (!API_KEY) return null;

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = `
      Act as a Senior Forensic Startup Accountant. 
      Analyze the following raw CSV transaction data to calculate core SaaS metrics.

      DATA:
      """
      ${rawCsv}
      """
      
      EXECUTION PLAN (PYTHON/PANDAS):
      1. Schema Detection: Identify columns for Date, Amount, Description, and Category.
      2. Normalization: Standardize dates and handle null amounts as 0.
      3. Metric Calculation:
         - Calculate average monthly burn.
         - Project runway based on $1M current cash.
         - Calculate MRR if subscriptions are detectable.
      4. Anomaly Detection: Search for refunds, duplicate large charges, currency mismatches, or missing data gaps.

      STRICT OUTPUT SCHEMA:
      Return a JSON object with:
      - metrics: { mrr, monthly_burn, runway_months, cash_balance }
      - anomalies: Array of { title, description, severity: 'High'|'Med'|'Low' }
      - assumptions: Array of logic used (e.g. "Assuming 'Stripe' rows are revenue")
      - code: The actual Python code executed for audit purposes.
      
      Return ONLY the JSON object wrapped in markdown.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          tools: [{ codeExecution: {} }],
          responseMimeType: 'application/json',
          // High depth is required for multi-step forensic logic and reliable code generation
          thinkingConfig: { thinkingLevel: 'high' }
        }
      });

      return JSON.parse(cleanJson(response.text));
    } catch (e) {
      console.error("Financial Forensics Run Failed", e);
      return {
        error: "Analysis failed due to data complexity or service timeout.",
        status: 'error'
      };
    }
  }
};
