
# ✅ **StartupAI Profile Wizard Implementation Checklist**

**Version:** 2.1 | **Status:** 🟢 Live / In Progress

---

## 1️⃣ **Step 1 — CONTEXT**

### Goal:
Gather basic company info and use AI to extract signals from the provided website.

### **Tasks**:
* **Input Fields**:
  * [x] **Website URL** (auto-fill with URL context extraction from Gemini 3 Pro)
  * [x] **One-liner Description** (140-character max)
  * [x] **Industry** (dropdown: SaaS, Healthtech, Fintech, AI, etc.)
  * [x] **Year Founded** (year input)
  * [x] **Cover Image** (upload, 1200×600 recommended)

* **AI Integration**:
  * [x] Use **URL Context Tool** to extract company tagline, description, product, target audience, and pricing model.
  * [x] Use **Gemini 3 Pro** to rewrite the **one-liner** if necessary.
  * [x] Use **AI Detected Signals** to auto-detect:
    * Target Audience
    * Core Problem
    * Pricing Model

---

## 2️⃣ **Step 2 — TEAM**

### Goal:
Capture information about the founding team, ensuring founder-market fit is emphasized.

### **Tasks**:
* **Input Fields**:
  * [x] **Founder Full Name**
  * [x] **Founder Title** (e.g., Founder & CEO)
  * [x] **Founder Short Bio** (Textarea, editable with **AI Rewrite Bio** button)
  * [x] **LinkedIn URL**
  * [x] **Email Address**
  * [x] **Personal Website URL** (optional)

* **AI Integration**:
  * [x] Use **AI to rewrite** founder bios for clarity and investor appeal.
  * [x] **Generate suggestions** for improved bio content.

---

## 3️⃣ **Step 3 — BUSINESS**

### Goal:
Define the business model, pricing, competitors, and key differentiators.

### **Tasks**:
* **Input Fields**:
  * [x] **Business Model** (Dropdown: SaaS, Marketplace, Transaction-based, etc.)
  * [x] **Pricing Model** (Subscription, Freemium, etc.)
  * [x] **Customer Segments** (Multi-select tags)
  * [x] **Key Features** (Tags, with **Generate List** button for AI)
  * [x] **Competitors** (Add competitors with AI suggestion)
  * [x] **Core Differentiator** (Textarea, with **Suggest** button for AI)

* **AI Integration**:
  * [x] Use **Google Search Grounding** to suggest competitors.
  * [x] Use **AI** to auto-generate **core differentiators** and features.
  * [x] Use **AI** to suggest **missing competitors** based on industry data.

---

## 4️⃣ **Step 4 — TRACTION**

### Goal:
Show progress, revenue, user growth, and funding history.

### **Tasks**:
* **Input Fields**:
  * [x] **Monthly Revenue (MRR)** (Auto-update graph)
  * [x] **Total Users / Waitlist** (Numeric input)
  * [x] **Funding History** (Table: Round, Date, Amount, Investors)
  * [x] **Fundraising Status** (Toggle: Raising funds, Target Raise Amount, Use of Funds tags)

* **AI Integration**:
  * [x] Use **AI Valuation Tool** to estimate startup valuation based on MRR growth.
  * [x] Use **AI Insight** to suggest **use of funds** (e.g., Engineering, Sales, Marketing).

---

## 5️⃣ **Step 5 — SUMMARY**

### Goal:
Review the complete profile, assess completeness, and generate an AI-powered summary.

### **Tasks**:
* **Profile Strength**:
  * [x] Calculate **profile completeness score** (0–100% based on missing fields).
  * [x] List missing fields: Website, Cover image, Founder bio, Competitors.

* **AI Summary**:
  * [x] Generate an **AI Summary** of the startup, summarizing:
    * Problem & Solution
    * Market & Business Model
    * Traction & Team
    * Funding & Ask

---

## 🟢 **Implementation Status**

| Feature | Status | Implementation Details |
| :--- | :---: | :--- |
| **Context** | ✅ | Autofill, Signals, Cover Image Upload |
| **Team** | ✅ | Bio Rewrite, Founder Cards |
| **Business** | ✅ | Tag Inputs, AI Suggestions (Competitors/Diff) |
| **Traction** | ✅ | Metrics, Funding History, Valuation, Use of Funds |
| **Summary** | ✅ | Scoring Logic, Generative Executive Summary |
| **Data Layer** | ✅ | Connected to `DataContext` and Supabase Types |
