
import { GoogleGenAI } from "@google/genai";
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

    const prompt = `
      You are a professional venture capital analyst and startup writer.
      Task: Write a full ${docType} for the startup described below.
      
      Context:
      ${context}

      Requirements:
      1. Create 4-6 distinct sections appropriate for a ${docType}.
      2. For "Pitch Deck", use sections like: Problem, Solution, Market, Business Model, Team.
      3. For "One-Pager", use sections like: Executive Summary, Market Opportunity, Traction, Ask.
      4. Return the content as a valid JSON object containing an array of sections.
      5. Each section object must have: "title" (string) and "content" (string, HTML formatted paragraphs/lists).
      6. Use <h3> for subtitles, <p> for text, <ul>/<li> for lists.

      Output format:
      {
          "sections": [
              { "title": "Section Name", "content": "<p>Content...</p>" }
          ]
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const text = response.text;
      if (text) {
        const data = JSON.parse(text);
        if (data.sections && Array.isArray(data.sections)) {
            return data.sections.map((s: any, idx: number) => ({
                id: String(idx + 1),
                title: s.title,
                content: s.content
            }));
        }
      }
      return null;
    } catch (error) {
      console.error("Doc Gen Error:", error);
      throw error;
    }
  },

  /**
   * Refines a specific section of text based on an instruction.
   */
  async refineSection(
    apiKey: string,
    content: string,
    instruction: 'clearer' | 'expand' | 'shorten' | 'grammar'
  ): Promise<string | null> {
    const ai = new GoogleGenAI({ apiKey });

    let promptInstruction = "";
    switch (instruction) {
        case 'clearer': promptInstruction = "Rewrite this text to be more professional, clear, and concise. Use active voice."; break;
        case 'expand': promptInstruction = "Expand on these points with more detail, examples, and persuasive context. Keep the HTML structure."; break;
        case 'shorten': promptInstruction = "Summarize this content into a punchy, high-impact version. Remove fluff."; break;
        case 'grammar': promptInstruction = "Fix all grammar, spelling, and punctuation errors. Maintain the tone."; break;
    }

    const prompt = `
      Task: ${promptInstruction}
      
      Input Text (HTML):
      ${content}
      
      Return ONLY the rewritten HTML content. Do not add markdown code blocks.
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
