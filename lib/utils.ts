
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes conditionally
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a robust UUID.
 * Uses crypto.randomUUID if available (secure), falls back to a timestamp/random combo.
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for environments without crypto (older browsers/some server contexts)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generates a short ID for UI-friendly keys (e.g. "k92lsd")
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Robustly cleans and extracts JSON from model responses.
 * Handles Markdown code blocks, conversational prefixes, and raw JSON.
 */
export function cleanJson(text: string | undefined): string {
  if (!text) return "{}";
  
  // 1. Try to extract from markdown code block (```json ... ```)
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = text.match(codeBlockRegex);
  if (match) {
    return match[1].trim();
  }

  // 2. If no code block, try to find the first '{' and last '}' (simple heuristic)
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return text.substring(firstBrace, lastBrace + 1);
  }

  // 3. Fallback: return raw text (likely to fail parse if dirty, but better than nothing)
  return text.trim();
}
