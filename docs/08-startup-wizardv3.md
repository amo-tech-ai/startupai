
# 🧙‍♂️ Startup Wizard V3 — Investor-Grade Intelligence

**Version:** 3.3 | **Status:** 🟢 Completed | **Focus:** Traction, Fundraising, Benchmarking
**Powered By:** Gemini 3 Pro (Thinking Mode + Search Grounding)

---

## 📋 Executive Summary

The Wizard (V3) is now an **active analyst**. 
It uses **Google Search Grounding** to benchmark numbers against real-world 2024/2025 startup data, offering a "Reality Check" on valuation, runway, and raise targets.
It also performs a final **"Red Flag" Audit** using Thinking Mode to catch inconsistencies before submission.

**Critical Policy Change:** Fundraising is now **ACTIVE BY DEFAULT**. Every startup is treated as "fundraising-ready" unless explicitly toggled off.

---

## 📊 Progress Tracker

| Module | Feature | Status | Description |
|:---|:---|:---|:---|
| **Step 4: Traction** | **Benchmarking Engine** | 🟢 Done | Compares user MRR/Growth to industry averages via Search. |
| **Step 4: Traction** | **Metric Validation** | 🟢 Done | `BenchmarkCard` displays "Green Flags" and "Red Flags". |
| **Step 5: Funding** | **Smart Defaults** | 🟢 Done | Auto-calculates Raise amount logic. |
| **Step 5: Funding** | **Valuation Defense** | 🟢 Done | Generates a *range* with citations (e.g., "SaaS multiples 5-8x"). |
| **Step 5: Funding** | **Use of Funds** | 🟢 Done | Auto-allocator implemented. |
| **Global** | **Review Mode** | 🟢 Done | `RedFlagReport` audits the full profile in Step 6. |
| **Deep Research** | **Agent Persona** | 🟢 Done | Conservative VC Analyst persona implemented via Edge Functions. |
| **Deep Research** | **Citation Engine** | 🟢 Done | Parsing and linking distinct sources for every metric. |
| **Resilience** | **Client Fallback** | 🟢 Done | Full feature parity if Edge Functions are offline. |

---

## ✅ Success Criteria Met

1.  **Defensible Valuations**: `ValuationWidget` provides min/max ranges backed by search context.
2.  **Runway Safety**: `ValuationWidget` warns if runway < 9 months.
3.  **Benchmark Context**: `BenchmarkCard` shows investor interpretation of traction.
4.  **Red Flag Analysis**: `RedFlagReport` uses Thinking Mode to find logical inconsistencies.
5.  **Deep Research Persistence**: Reports are stored in a dedicated `deep_research_report` JSONB column.

---

## 🧜‍♀️ Architecture & Flows

### **Deep Research Workflow (Hybrid)**

```mermaid
flowchart TD
    Start[User Request] --> CheckEnv{Supabase Edge?}
    
    subgraph Edge Execution
    CheckEnv -- Yes --> EdgeAgent[DeepResearchAgent (Deno)]
    EdgeAgent --> Search[Google Search Tool]
    Search --> Report[Markdown Report]
    Report --> Extract[Extraction Agent]
    Extract --> JSON[Structured JSON]
    end
    
    subgraph Client Fallback
    CheckEnv -- No --> ClientAgent[Gemini SDK (Browser)]
    ClientAgent --> SearchClient[Google Search Tool]
    SearchClient --> ReportClient[Markdown Report]
    ReportClient --> ExtractClient[Extraction Agent]
    ExtractClient --> JSON
    end
    
    JSON --> UI[Render DeepResearchView]
    UI --> DB[Save to startups.deep_research_report]
```

---

## 🛠️ Production Readiness Checklist

- [x] **Edge Function Update**: `ai-helper` supports `analyze_traction`, `calculate_fundraising`, and `analyze_risks`.
- [x] **Prompt Engineering**: System instructions enforce "Conservative VC" persona.
- [x] **UI Components**: `BenchmarkCard`, `ValuationWidget`, and `RedFlagReport` implemented.
- [x] **Latency Management**: Loading skeletons added for all AI widgets.
- [x] **Schema**: Dedicated column added for research storage to prevent data loss.

---

## 🔮 Future Enhancements (V3.5 Roadmap)

### 1. Interactive Scenario Modeling
*   **Concept:** Instead of a static valuation range, allow founders to adjust inputs (Growth Rate, Churn, Margin) to see how specific performance shifts impact their valuation in real-time.
*   **Tech:** Client-side re-calculation using the benchmarking logic provided by the `calculate_fundraising` agent.

### 2. Pre-emptive "Risk Defense" Slides
*   **Concept:** If the Red Flag Report identifies a specific weakness (e.g., "High Customer Concentration"), automatically generate a specific Pitch Deck slide titled "Risk Mitigation" that addresses this point using best-practice arguments.
*   **Integration:** Link `RedFlagReport` output directly to `DeckService` to suggest slide insertions.

### 3. Conversational Intake (Gemini Live)
*   **Concept:** Replace the form-filling experience with a voice-based interview mode. "Tell me about your traction."
*   **Tech:** Use the Multimodal Live API to transcribe and parse intent into the JSON schema, making onboarding feel like a coffee chat with an investor.

### 4. Automated Data Room Structure
*   **Concept:** Based on the specific due diligence risks found, auto-create the necessary folder structure in the Document Workspace (e.g., if "Regulatory Risk" is found, automatically create a "Compliance" folder with a placeholder checklist).
