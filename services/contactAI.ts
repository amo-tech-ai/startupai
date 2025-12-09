
import { GoogleGenAI, Type } from "@google/genai";
import { cleanJson } from "../lib/utils";

export const ContactAI = {
  /**
   * Extracts contact details from a URL using Gemini 3 Pro with Search Grounding.
   */
  async extractFromUrl(apiKey: string, url: string) {
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

    try {
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

      const text = cleanJson(response.text);
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error("Contact AI Extraction Error:", error);
      throw error;
    }
  }
};
