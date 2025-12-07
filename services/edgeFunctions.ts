import { GoogleGenAI } from "@google/genai";
import { Deck, Slide, StartupProfile } from '../types';
import { supabase } from '../lib/supabaseClient';
import { generateUUID } from "../lib/utils";

/**
 * EDGE FUNCTION SERVICE
 * ---------------------
 * Handles AI operations for the Pitch Deck engine.
 */

// 1. Generate Deck
export async function generateDeckEdge(
  apiKey: string,
  profile: StartupProfile,
  template: 'Y Combinator' | 'Sequoia' | 'Custom'
): Promise<Omit<Deck, 'id' | 'startupId'> | null> {
  
  // OPTION A: Real Supabase Edge Function
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-deck', {
        body: { profile, template }
      });
      
      if (!error && data) {
        return data as Omit<Deck, 'id' | 'startupId'>;
      }
      console.warn("Supabase Edge Function failed, falling back to local...", error);
    } catch (err) {
      console.warn("Supabase connection error, falling back...", err);
    }
  }

  // OPTION B: Client-side Fallback (Gemini Direct)
  const ai = new GoogleGenAI({ apiKey });

  let templateInstructions = "";
  if (template === 'Y Combinator') {
      templateInstructions = "Strictly follow the Y Combinator Seed Deck structure (approx 10 slides): Title, Problem, Solution, Traction, Unique Insight, Business Model, Market, Competition, Team, Ask.";
  } else if (template === 'Sequoia') {
      templateInstructions = "Strictly follow the Sequoia Capital structure (approx 12 slides): Company Purpose, Problem, Solution, Why Now, Market Potential, Competition, Product, Business Model, Team, Financials, Vision, Ask.";
  } else {
      templateInstructions = "Analyze the startup's specific context (Stage: " + profile.stage + ") to generate a custom, optimal slide flow (10-15 slides).";
  }

  const prompt = `
    Act as a venture capital expert. Create a pitch deck outline for a startup.
    
    Startup Context:
    Name: ${profile.name}
    Problem: ${profile.problemStatement}
    Solution: ${profile.solutionStatement}
    Market: ${profile.targetMarket}
    Stage: ${profile.stage}
    
    Template Request: ${template}
    Instructions: ${templateInstructions}

    STRICT BEST PRACTICES & GENERATION RULES:
    1. Title Slide: Title must be ONLY the company name "${profile.name}". No other text in title.
    2. Problem Slide: Must have EXACTLY 3 bullet points describing the core pain points.
    3. Chart Suggestions: Assign a 'chartType' field for data-heavy slides:
       - Traction/Growth -> 'line'
       - Financials -> 'bar'
       - Market Size -> 'pie' (TAM/SAM/SOM)
       - Otherwise -> null

    Task: Generate a JSON object representing the pitch deck.
    The JSON should be an array of "slides".
    Each slide object must have:
    - "title": string (e.g. "The Problem")
    - "bullets": string[] (3-4 concise, high-impact bullet points)
    - "visualDescription": string (detailed description of what image/chart should be on the slide)
    - "chartType": string | null (one of: 'line', 'bar', 'pie', 'matrix', 'circles' or null)
    - "chartData": { label: string, value: number }[] | null (If chartType is present, provide 4-6 realistic data points)

    Output format:
    [
        { "title": "...", "bullets": ["..."], "visualDescription": "...", "chartType": "line", "chartData": [{"label": "Q1", "value": 10}] }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });

    const text = response.text;
    if (!text) return null;

    const slides: Slide[] = JSON.parse(text).map((s: any) => ({
        id: generateUUID(),
        title: s.title,
        bullets: s.bullets,
        visualDescription: s.visualDescription,
        chartType: s.chartType,
        chartData: s.chartData
    }));

    return {
        title: `${profile.name} - ${template} Deck`,
        template: template,
        slides: slides,
        updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Edge Function Error (generate-deck):", error);
    throw error;
  }
}

// 2. Slide AI (Refine/Expand/Shorten)
export async function slideAIEdge(
  apiKey: string,
  bullets: string[],
  action: 'refine' | 'expand' | 'shorten'
): Promise<string[] | null> {
    
    if (supabase) {
        try {
            const { data } = await supabase.functions.invoke('slide-ai', {
                body: { bullets, action }
            });
            if (data) return data.bullets;
        } catch (e) {
            console.warn("Supabase slide-ai failed, fallback active.");
        }
    }

    const ai = new GoogleGenAI({ apiKey });
    
    let instructions = "Rewrite these bullet points to be more punchy, investor-focused, and quantifiable. Keep the same meaning.";
    if (action === 'shorten') instructions = "Make these bullet points extremely concise (max 5 words each).";
    if (action === 'expand') instructions = "Expand these points with more detail and potential implications.";

    const prompt = `${instructions}
    
    Current bullets:
    ${bullets.join('\n')}
    
    Return ONLY a JSON array of strings. ["bullet 1", "bullet 2"]`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        return text ? JSON.parse(text) : null;
    } catch (e) {
        console.error("Edge Function Error (slide-ai):", e);
        throw e;
    }
}

// 3. Image AI
export async function imageAIEdge(
    apiKey: string,
    slideTitle: string,
    visualDescription: string
): Promise<string | null> {

    if (supabase) {
        try {
            const { data } = await supabase.functions.invoke('image-ai', {
                body: { title: slideTitle, description: visualDescription }
            });
            if (data) return data.imageUrl;
        } catch (e) {
            console.warn("Supabase image-ai failed, fallback active.");
        }
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Create a professional, modern flat vector style illustration for a pitch deck slide. 
    Context: ${slideTitle}. 
    Description: ${visualDescription || 'A corporate abstract visualization of ' + slideTitle}. 
    Colors: Indigo, White, Slate. Minimalist, high quality.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] }
        });

        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        return null;
    } catch (e) {
        console.error("Edge Function Error (image-ai):", e);
        throw e;
    }
}