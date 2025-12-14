import { GoogleGenAI } from "@google/genai";
import { EventData } from "../../../types";
import { EventPrompts } from "../../../lib/prompts/eventPrompts";

export const generateMarketingAssets = async (apiKey: string, eventData: EventData, assetType: 'Social' | 'Email' | 'Poster'): Promise<{ imageUrl: string, copy: string } | null> => {
  const ai = new GoogleGenAI({ apiKey });
  const imagePrompt = EventPrompts.generateImage(eventData, assetType);

  let imageUrl = '';
  try {
    // Use Gemini Nano Banana (gemini-2.5-flash-image) as requested
    const imageRes = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: imagePrompt }] },
      config: {
        // gemini-2.5-flash-image supports aspectRatio but NOT imageSize
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

  const copyPrompt = EventPrompts.generateCopy(eventData, assetType);

  try {
    const textRes = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: copyPrompt
    });

    return { imageUrl, copy: textRes.text || "Join us!" };
  } catch (e) {
    return { imageUrl, copy: "Join us at " + eventData.name };
  }
};