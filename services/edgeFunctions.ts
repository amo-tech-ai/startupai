
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Deck, Slide, StartupProfile } from '../types';
import { supabase } from '../lib/supabaseClient';
import { generateUUID, cleanJson } from "../lib/utils";

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
      templateInstructions = "Structure: approx 10 slides (Problem, Solution, Traction, etc).";
  } else if (template === 'Sequoia') {
      templateInstructions = "Structure: approx 12 slides (Purpose, Problem, Solution, Why Now, etc).";
  } else {
      templateInstructions = "Structure: Custom flow (10-15 slides) optimized for stage: " + profile.stage;
  }

  // Enrich context with all available profile data
  const competitorsList = profile.competitors && profile.competitors.length > 0 
    ? profile.competitors.join(', ') 
    : "Direct and indirect competitors in the space";
    
  const featuresList = profile.keyFeatures && profile.keyFeatures.length > 0
    ? profile.keyFeatures.join(', ')
    : "Key product capabilities";

  const fundingContext = profile.isRaising && profile.fundingGoal 
    ? `Target Raise: $${profile.fundingGoal.toLocaleString()} for ${profile.useOfFunds?.join(', ') || 'growth'}`
    : "Not currently explicitly raising, focus on growth story.";

  const prompt = `
    Act as a venture capital expert. Create a pitch deck outline for a startup.
    
    Startup Context:
    Name: ${profile.name}
    Tagline: ${profile.tagline}
    Problem: ${profile.problemStatement}
    Solution: ${profile.solutionStatement}
    Market: ${profile.targetMarket}
    Business Model: ${profile.businessModel} (${profile.pricingModel || 'Standard pricing'})
    Key Features: ${featuresList}
    Competitors: ${competitorsList}
    Traction / Stage: ${profile.stage}
    Fundraising Status: ${fundingContext}
    
    Template Request: ${template}
    Instructions: ${templateInstructions}

    STRICT RULES:
    1. Title Slide: Title must be ONLY the company name.
    2. Problem Slide: EXACTLY 3 high-impact bullet points.
    3. Competition: Explicitly mention differentiation.
    4. Charts: Assign 'chartType' (line, bar, pie, matrix) for data-heavy slides.
  `;

  // Schema Definition
  const chartDataSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      label: { type: Type.STRING },
      value: { type: Type.NUMBER },
    }
  };

  const slideSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
      visualDescription: { type: Type.STRING },
      chartType: { type: Type.STRING, enum: ['line', 'bar', 'pie', 'matrix', 'circles'], nullable: true },
      chartData: { type: Type.ARRAY, items: chartDataSchema, nullable: true }
    },
    required: ["title", "bullets", "visualDescription"]
  };

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: slideSchema
            },
            // Gemini 3: Using 'high' thinking level for architectural reasoning
            thinkingConfig: { thinkingLevel: 'high' } 
        }
    });

    // With responseSchema, response.text is guaranteed to be valid JSON string
    const rawSlides = JSON.parse(response.text || '[]');

    const slides: Slide[] = rawSlides.map((s: any) => ({
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
    
    let instructions = "Rewrite these bullet points to be more punchy, investor-focused, and quantifiable.";
    if (action === 'shorten') instructions = "Make these bullet points extremely concise (max 5 words each).";
    if (action === 'expand') instructions = "Expand these points with more detail and potential implications.";

    const prompt = `${instructions}
    Current bullets:
    ${bullets.join('\n')}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { 
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        
        return JSON.parse(response.text || '[]');
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
                    const base64EncodeString: string = part.inlineData.data;
                    return `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
                }
            }
        }
        return null;
    } catch (e) {
        console.error("Edge Function Error (image-ai):", e);
        throw e;
    }
}
