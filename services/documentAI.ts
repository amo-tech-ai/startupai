import { supabase } from "../lib/supabaseClient";
import { DocSection } from '../types';

/**
 * DOCUMENT INTELLIGENCE SERVICE
 * ----------------------------
 * Proxies all drafting and refinement to Edge Functions to keep
 * proprietary document structures and API keys secure.
 */

export const DocumentAI = {
  /**
   * Generates a full document draft based on startup profile.
   */
  async generateDraft(
    docType: string, 
    profileContext: any
  ): Promise<DocSection[] | null> {
    
    if (!supabase) throw new Error("Backend unavailable");

    try {
        const { data, error } = await supabase.functions.invoke('ai-helper', {
            body: { action: 'generate_document_draft', payload: { docType, profileContext } }
        });
        
        if (error) throw error;
        
        if (data && data.sections) {
            return data.sections.map((s: any, idx: number) => ({
                id: String(idx + 1),
                title: s.title,
                content: s.content
            }));
        }
        return null;
    } catch (err) {
        console.error("Document AI Error:", err);
        throw err;
    }
  },

  /**
   * Refines a specific section of text based on an instruction.
   */
  async refineSection(
    content: string,
    instruction: 'clearer' | 'expand' | 'shorten' | 'grammar'
  ): Promise<string | null> {
    
    if (!supabase) throw new Error("Backend unavailable");

    try {
        const { data, error } = await supabase.functions.invoke('ai-helper', {
            body: { action: 'refine_document_section', payload: { content, instruction } }
        });
        
        if (error) throw error;
        return data?.content || null;
    } catch (err) {
        console.error("Document Refine Error:", err);
        throw err;
    }
  }
};