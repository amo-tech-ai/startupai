
/**
 * Environment Variable Manager
 * ----------------------------
 * Safely retrieves environment variables in both browser (Vite) and 
 * server/shimmed (Node) environments to prevent "process is not defined" errors.
 */

const getSafeEnv = (key: string): string => {
  // 1. Try Vite's import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  // 2. Try global process.env (safely)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore ReferenceError if process is undefined
  }

  return '';
};

// Application Secrets
// Note: In Vite (Client-side), keys MUST start with VITE_ to be exposed.
// We have added 'GEMINI_' to envPrefix in vite.config.ts to support GEMINI_API_KEY.
export const API_KEY = 
  getSafeEnv('GEMINI_API_KEY') || 
  getSafeEnv('VITE_API_KEY') || 
  getSafeEnv('VITE_GEMINI_API_KEY') || 
  getSafeEnv('VITE_GOOGLE_API_KEY') || 
  getSafeEnv('API_KEY'); // Fallback for server-side/testing

export const SUPABASE_URL = getSafeEnv('VITE_SUPABASE_URL');
export const SUPABASE_ANON_KEY = getSafeEnv('VITE_SUPABASE_ANON_KEY');

// Helper to check if AI is available
export const isAiConfigured = () => !!API_KEY;
