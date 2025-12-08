
import { UserProfile } from '../types';

/**
 * Service to handle external data enrichment (LinkedIn, Website scraping, etc.)
 * In a production environment, these methods would call Supabase Edge Functions.
 */
export const EnrichmentService = {
  /**
   * Simulates a backend call to scrape/fetch LinkedIn profile data.
   * Target endpoint: /functions/v1/linkedin-sync
   */
  async syncLinkedInProfile(linkedinUrl: string): Promise<Partial<UserProfile>> {
    console.log(`[Enrichment] Syncing LinkedIn: ${linkedinUrl}`);

    // 1. Validation
    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
      throw new Error("Please provide a valid LinkedIn URL (e.g. linkedin.com/in/username)");
    }

    // 2. Simulate Network Latency
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 3. Mock Returned Data
    // This simulates the JSON response from a scraper like Proxycurl
    return {
      fullName: "Alex Rivera", 
      headline: "Founder & CEO @ StartupAI | Techstars Alum",
      location: "San Francisco Bay Area",
      bio: "Building the operating system for modern founders. 3x Founder, YC W23. Previously Product at Stripe and Google. Passionate about AI and democratization of capital.",
      avatarUrl: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80",
      socials: {
        linkedin: linkedinUrl,
        twitter: "https://twitter.com/alexrivera_tech",
        website: "https://alexrivera.io",
        github: "https://github.com/alexrivera"
      },
      // In a real scenario, we might merge these with existing skills
      skills: ["Product Strategy", "Fundraising", "Go-to-Market", "React", "TypeScript", "Generative AI", "SaaS Metrics"]
    };
  }
};
