
import { GoogleGenAI } from "@google/genai";
import { EventData } from "../../../types";
import { EventPrompts } from "../../../lib/prompts/eventPrompts";
import { supabase } from "../../../lib/supabaseClient";

export const generateMarketingAssets = async (apiKey: string, eventData: EventData, assetType: 'Social' | 'Email' | 'Poster'): Promise<{ imageUrl: string, copy: string } | null> => {
  const ai = new GoogleGenAI({ apiKey });
  
  // 1. Generate Image (Client-side usually preferred for Base64 handling, but we could move to Edge returning Signed URL)
  // For MVP, we'll keep Image Gen client-side to avoid timeout limits on standard edge functions with heavy media gen
  // or until we implement storage upload directly from Edge.
  const imagePrompt = EventPrompts.generateImage(eventData, assetType);
  let imageUrl = '';
  
  try {
    const imageRes = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: imagePrompt }] },
      config: {
        imageConfig: { aspectRatio: assetType === 'Social' ? '1:1' : '16:9' }
      }
    });

    for (const part of imageRes.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }
  } catch (e) {
    console.error("Image Gen Failed", e);
  }

  // 2. Generate Copy (Edge Function Candidate)
  let copy = "Join us at " + eventData.name;
  
  if (supabase) {
      try {
          const { data, error } = await supabase.functions.invoke('ai-helper', {
              body: { action: 'generate_event_marketing_copy', payload: { eventData, assetType } }
          });
          if (!error && data?.copy) copy = data.copy;
      } catch (e) { console.warn("Edge function copy failed", e); }
  }
  
  // Fallback if edge failed or returned empty
  if (copy === "Join us at " + eventData.name) {
      const copyPrompt = EventPrompts.generateCopy(eventData, assetType);
      try {
        const textRes = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: copyPrompt
        });
        if (textRes.text) copy = textRes.text;
      } catch (e) {
         // Keep default
      }
  }

  return { imageUrl, copy };
};
