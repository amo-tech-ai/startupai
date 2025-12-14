
import { EventData, EventBudgetItem } from '../../types';

export const EventPrompts = {
  analyzeStrategy: (eventData: EventData) => `
      Act as a World-Class Event Strategist.
      
      Analyze the following event plan for a startup:
      Event Name: ${eventData.name}
      Type: ${eventData.type}
      Description: ${eventData.description}
      Location: ${eventData.city}
      Context URLs: ${eventData.venueUrls.join(', ')}

      Task:
      1. Calculate a Feasibility Score (0-100) based on clarity and complexity.
      2. Identify top 3 Risks (Operational, Financial, or Audience).
      3. Suggest 3 creative Themes/Angles for the event.
      4. Define the ideal Audience Profile.
      5. Estimate a budget range (Low/High) for a ${eventData.duration}-hour event in ${eventData.city}.

      Return JSON.
  `,

  checkLogistics: (date: string, city: string) => `
      Act as an Event Operations Manager.
      
      Task: Perform a deep logistics scan for an event on ${date} in ${city}.
      
      Use Google Search to find:
      1. Major tech conferences, sports events, or holidays in ${city} on or near ${date} that might affect hotels/traffic.
      2. Typical weather for that time of year.
      3. **Venue Scouting:** Find 3 specific, real venues in ${city} suitable for a tech event. Include estimated capacity and pricing tier ($/$$/$$$).
      
      Return JSON:
      {
        "conflicts": [{ "name": "string", "date": "string", "impact": "High|Medium|Low" }],
        "weatherForecast": "string",
        "venueInsights": "string (general advice)",
        "suggestedVenues": [{ "name": "string", "capacity": "string", "cost": "$|$$|$$$", "notes": "string" }]
      }
  `,

  generateActionPlan: (eventData: EventData) => `
      Act as a Senior Event Producer.
      
      Create a detailed operational project plan for:
      - Event: ${eventData.name} (${eventData.type})
      - Date: ${eventData.date}
      - City: ${eventData.city}
      - Description: ${eventData.description}
      
      Generate a list of 10-15 critical tasks organized by phase (Strategy, Planning, Marketing, Operations, Post-Event).
      
      Output JSON format.
  `,

  generateImage: (eventData: EventData, assetType: string) => `
      Professional, modern event marketing visual for: ${eventData.name}.
      Type: ${assetType}
      Context: ${eventData.description}
      Vibe: ${eventData.type} event in ${eventData.city}. Tech-forward, premium, minimalist.
      Colors: Indigo, White, dark slate. 
      Style: 3D abstract geometry, corporate memphis, or high-end architectural photography.
      No text in image.
  `,

  generateCopy: (eventData: EventData, assetType: string) => `
      Act as a Senior Growth Marketer.
      Write short, punchy marketing copy for a ${assetType} post about ${eventData.name}.
      
      Event Context:
      - Description: ${eventData.description}
      - Type: ${eventData.type}
      - City: ${eventData.city}
      - Audience: ${eventData.strategy?.audienceProfile || 'Tech Founders & Investors'}
      
      Requirement:
      - Incorporate industry benchmarks for this event type (e.g. "Join the top 1% of founders", "Standard for Series A networking").
      - Use persuasive psychological hooks based on scarcity or social proof suitable for ${eventData.city}.
      - Value Prop: ${eventData.description}.
      - Call to Action: Register Now.
      
      Format: Plain text, max 3 sentences + 2 relevant hashtags.
  `,

  generateBudgetBreakdown: (total: number, type: string, city: string) => `
      Act as an Event Producer.
      
      Task: Create a realistic line-item budget breakdown for a ${type} in ${city} with a total budget of $${total}.
      
      Allocate funds across: Venue, Food/Bev, Marketing, Speakers, and Ops.
      Be realistic about costs in ${city}.
      
      Return JSON:
      {
        "items": [
          { "category": "Venue|Food|Marketing|Speakers|Ops|Other", "item": "string", "estimated": number }
        ]
      }
  `,

  optimizeBudget: (items: EventBudgetItem[], totalBudget: number) => `
      Act as a Financial Controller.
      
      Task: The current budget actuals exceed the total budget of $${totalBudget}.
      Analyze the current spend and re-allocate the *Remaining* budget items (Status: Planned) to fit within the limit.
      
      Rules:
      1. Do NOT touch items where 'Status' is 'Paid' (Money is gone).
      2. Suggest reductions for 'Planned' items (e.g. cheaper swag, less food).
      3. Return the FULL list of items with updated 'estimated' values for the planned items.
      
      Current Items: ${JSON.stringify(items)}
      
      Return JSON:
      {
        "items": [ ... ]
      }
  `,

  generateROI: (event: EventData, attendees: number) => `
      Act as a CMO.
      
      Task: Generate a Post-Event ROI Report for "${event.name}".
      
      Data:
      - Budget: $${event.budget_total}
      - Spend: $${event.budget_spent}
      - Attendees: ${attendees}
      - Goal: ${event.description}
      
      Calculate:
      1. Cost Per Attendee (CPA).
      2. Success Score (0-100) based on spend efficiency and hypothetical satisfaction.
      3. 3 Key Highlights (Qualitative).
      4. 3 Areas for Improvement for next time.
      
      Return JSON matching EventROIAnalysis interface.
  `
};