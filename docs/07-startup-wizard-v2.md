
# 🧙‍♂️ Startup Wizard V2 — Smart Intake Engine

**Version:** 2.0 | **Status:** 🟡 In Progress | **Owner:** Product Engineering

---

## 📋 Executive Summary
Transform Step 1 of the Startup Wizard into a "Smart Intake Screen". Instead of simple data entry, this screen now acts as the primary context ingestion engine. By capturing multiple data sources (Website, LinkedIn, Blogs, Search Terms) upfront, we use Gemini 3 Pro with Google Search Grounding to pre-calculate the startup's entire strategic profile before they even reach Step 2.

---

## 📊 Progress Tracker

| Feature | Status | Description |
|:---|:---|:---|
| **Data Model Update** | 🟢 Done | Added `additionalUrls` and `searchTerms` to Wizard types. |
| **UI: Input Expansion** | 🟢 Done | Added LinkedIn, Multi-URL repeater, and Search Term inputs to Step 1. |
| **AI: Context Engine** | 🟢 Done | Updated `analyzeContext` to process multiple URLs and search intent. |
| **AI: Signal Detection** | 🟢 Done | Gemini now extracts Competitors and Trends during Step 1 analysis. |
| **UI: Signal Panel** | 🟢 Done | "Detected Signals" sidebar visualizes AI findings immediately. |
| **Integration** | 🟡 Testing | Verify Search Grounding accuracy. |

---

## 🧩 User Journey (Step 1)

```mermaid
flowchart LR
    Start[User Lands on Step 1] --> Inputs
    
    subgraph Inputs [Smart Intake Form]
        Name[Startup Name]
        Web[Website URL]
        Linked[LinkedIn URL]
        Extra[Additional URLs]
        Search[Search Terms]
    end
    
    Inputs --> Action[Click "Smart Autofill"]
    
    subgraph AI_Engine [Gemini 3 Pro]
        Context[URL Context Analysis]
        Grounding[Google Search Grounding]
        Reasoning[Strategic Synthesis]
        
        Context & Grounding --> Reasoning
    end
    
    Action --> AI_Engine
    
    AI_Engine --> Signals[Detected Signals Panel]
    
    subgraph Signals_UI [Right Panel]
        Audience[Target Audience]
        Problem[Core Problem]
        Trends[Market Trends]
        Comps[Competitors]
    end
    
    Signals --> Signals_UI
    Signals_UI --> Next[Next Step Enabled]
```

---

## 🧠 AI Workflow Specification

**Trigger:** `WizardService.analyzeContext`
**Model:** `gemini-3-pro-preview`
**Tools:** `googleSearch`

**Inputs:**
1.  **Primary URL:** The main website.
2.  **LinkedIn URL:** For founder/company context.
3.  **Additional URLs:** Engineering blogs, notion docs, press releases.
4.  **Search Terms:** User-guided hints (e.g., "AI for legal compliance").
5.  **Industry:** Hard constraint for the model.

**Outputs (JSON):**
*   `tagline`: Refined one-liner.
*   `industry`: Normalized industry tag.
*   `target_audience`: Specific ICP.
*   `core_problem`: The "Why" statement.
*   `solution_statement`: The "How" statement.
*   `pricing_model_hint`: Suggested business model.
*   `competitors`: Array of 3-5 real competitors found via search.
*   `trends`: Array of 2-3 active market trends relevant to the pitch.

---

## 🎨 Figma Make AI Prompt (Reference)

```text
Design an updated "Step 1 — Context" screen for the Startup Profile Wizard.
Style: clean modern SaaS, structured cards, white background, auto-layout, purple accent.
Frame width: 1440px.

Left Panel (Inputs):
- Startup Name (text input)
- Website URL (URL input + icon + "Smart Autofill" button inside field)
- LinkedIn URL (URL input with LinkedIn icon)
- Additional URLs (Repeater list with "+ Add URL" button)
- One-Liner Description (optional textarea)
- Industry Dropdown
- Year Founded
- Search Terms Input (Placeholder: "e.g. AI for finance, competitor names")
- Cover Image Upload (1200x600 card)

Right Panel (Smart Detected Signals):
- Vertical purple gradient card.
- Title: "Detected Signals".
- Subtitle: "AI analysis of your URLs and search terms."
- Expandable signal boxes for: Target Audience, Core Problem, Pricing Model, Competitor Mentions, Industry Trends.
```
