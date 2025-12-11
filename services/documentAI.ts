
import { GoogleGenAI, Type } from "@google/genai";
import { DocSection } from '../types';

export const DocumentAI = {
  /**
   * Generates a full document draft based on startup profile.
   */
  async generateDraft(
    apiKey: string, 
    docType: string, 
    profileContext: any
  ): Promise<DocSection[] | null> {
    const ai = new GoogleGenAI({ apiKey });
    
    const context = `
      Startup Name: ${profileContext.name}
      Tagline: ${profileContext.tagline}
      Mission: ${profileContext.mission}
      Problem: ${profileContext.problem}
      Solution: ${profileContext.solution}
      Target Market: ${profileContext.targetMarket}
      Business Model: ${profileContext.businessModel}
    `;

    const isFinancial = docType.toLowerCase().includes('financial') || docType.toLowerCase().includes('model');
    const tableInstruction = isFinancial 
        ? "For financials, content MUST contain HTML tables." 
        : "";

    const prompt = `
      You are a professional venture capital analyst.
      Task: Write a full ${docType} for the startup described below.
      
      Context:
      ${context}

      Requirements:
      1. Create 4-6 distinct sections.
      2. Use HTML tags (<h3>, <p>, <ul>, <li>, <table>) for content.
      ${tableInstruction}
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    sections: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                content: { type: Type.STRING, description: "HTML content string" }
                            },
                            required: ["title", "content"]
                        }
                    }
                },
                required: ["sections"]
            },
            thinkingConfig: { thinkingBudget: 2048 }
        }
      });

      const data = JSON.parse(response.text || '{}');
      if (data.sections && Array.isArray(data.sections)) {
          return data.sections.map((s: any, idx: number) => ({
              id: String(idx + 1),
              title: s.title,
              content: s.content
          }));
      }
      return null;
    } catch (error) {
      console.error("Doc Gen Error:", error);
      throw error;
    }
  },

  /**
   * Refines a specific section of text based on an instruction.
   * Text-to-text operation, no schema needed.
   */
  async refineSection(
    apiKey: string,
    content: string,
    instruction: 'clearer' | 'expand' | 'shorten' | 'grammar'
  ): Promise<string | null> {
    const ai = new GoogleGenAI({ apiKey });

    let promptInstruction = "";
    switch (instruction) {
        case 'clearer': promptInstruction = "Rewrite this text to be more professional, clear, and concise."; break;
        case 'expand': promptInstruction = "Expand on these points with more detail, examples, and context."; break;
        case 'shorten': promptInstruction = "Summarize this content into a punchy version."; break;
        case 'grammar': promptInstruction = "Fix all grammar, spelling, and punctuation errors."; break;
    }

    const prompt = `
      Task: ${promptInstruction}
      Input (HTML): ${content}
      Return ONLY the rewritten HTML content.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });
      
      return response.text?.trim() || null;
    } catch (error) {
      console.error("Doc Refine Error:", error);
      throw error;
    }
  }
};
