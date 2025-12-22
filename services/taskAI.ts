import { Task } from "../types";
import { supabase } from "../lib/supabaseClient";

export const TaskAI = {
  /**
   * Generates a strategic roadmap of tasks based on startup profile.
   */
  async generateRoadmap(
    profileContext: { name: string; stage: string; targetMarket: string; goal: string }
  ): Promise<Omit<Task, 'id' | 'startupId'>[] | null> {
    
    if (!supabase) throw new Error("Backend unavailable");

    try {
        const { data, error } = await supabase.functions.invoke('ai-helper', {
            body: { action: 'generate_roadmap', payload: { profileContext } }
        });
        
        if (error) throw error;
        
        if (data && data.tasks) {
            return data.tasks.map((t: any) => ({
                title: t.title,
                description: t.description,
                status: 'Backlog',
                priority: t.priority,
                aiGenerated: true
            }));
        }
        return null;
    } catch (error) {
        console.error("AI Task Roadmap Error:", error);
        throw error;
    }
  }
};