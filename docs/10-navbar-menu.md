
# 🧭

**Version:** 2.0 | **Status:** Approved | **Design System:** Clean SaaS

---

## 1. Top Level Architecture

The navigation is designed to guide users from "Discovery" to "Action" with minimal friction. It employs a **Mega Menu** strategy for the "Features" dropdown to expose the platform's depth immediately.

### **Desktop Layout (>1024px)**
`[Logo]` `[Platform]` `[Features ▾]` `[Pricing]` `[Resources ▾]` `[Dashboard]` `[Get Started (Primary CTA)]`

### **Mobile Layout (<1024px)**
`[Logo]` `[Hamburger Menu]`
  -> **Drawer Overlay**
     -> Platform
     -> Features (Accordion)
        -> *List of Core Features*
     -> Pricing
     -> Resources (Accordion)
     -> Dashboard
     -> **Get Started (Sticky Bottom CTA)**

---

## 2. Feature Map & Routing

This table maps user-facing feature names to internal application routes and SEO descriptions.

| Feature Name | Short Description (Tooltip/SEO) | Internal Route | Icon (Lucide) |
| :--- | :--- | :--- | :--- |
| **Startup Wizard** | Go from zero to profile in 5 minutes with AI auto-fill. | `/onboarding` | `Zap` |
| **Pitch Deck Engine** | Generate Sequoia-style decks with one click. | `/pitch-decks` | `Presentation` |
| **Document Factory** | Create On StartupAI Navigation & Feature Architecturee-Pagers, GTM strategies & financial models. | `/documents` | `FileText` |
| **Visual CRM** | Track investors, manage pipelines, and close deals. | `/crm` | `Users` |
| **Tasks & Ops** | AI-generated roadmap and daily founder tasks. | `/tasks` | `CheckSquare` |
| **AI Market Research** | Validate TAM/SAM/SOM with Google Search Grounding. | `/startup-profile` | `Search` |
| **Investor Readiness** | Health scores and red-flag analysis before you pitch. | `/dashboard` | `Activity` |

---

## 3. UI/UX Specifications (Figma)

### **Container**
- **Height:** `64px` (Desktop), `56px` (Mobile)
- **Background:** `bg-white/80` (Backdrop Blur `12px`)
- **Border:** `border-b border-slate-200`
- **Z-Index:** `50` (Sticky)

### **Typography**
- **Links:** `Inter`, `14px`, `Medium`, `text-slate-600`, `hover:text-slate-900`.
- **Dropdown Headers:** `Inter`, `11px`, `Bold`, `Uppercase`, `tracking-wider`, `text-slate-400`.

### **Dropdown Interaction (Mega Menu)**
- **Trigger:** Hover (Desktop) with 150ms delay (prevents accidental closing).
- **Animation:** `Framer Motion` -> `opacity: 0 -> 1`, `y: -10 -> 0`.
- **Layout:** 2 Columns.
    - **Left (Core):** Larger icons, bold text.
    - **Right (Advanced):** List style, subtle background.

### **Buttons**
- **Secondary (Login):** Ghost variant, text-only.
- **Primary (Get Started):** `bg-slate-900`, `text-white`, `rounded-full`, `shadow-lg`, `hover:scale-105`.

---

## 4. Pricing Tier Mapping

Features are gated to drive upgrades.

| Feature | **Free** | **Founder ($29/mo)** | **Growth ($79/mo)** |
| :--- | :--- | :--- | :--- |
| **Startup Wizard** | Full Access | Full Access | Full Access |
| **Pitch Deck** | 1 Deck (PDF Export) | Unlimited (PPTX Export) | Custom Branding |
| **CRM** | 50 Contacts | Unlimited | Automations + Enrichment |
| **AI Research** | Basic Summary | Deep Search (Grounding) | Competitive Analysis Reports |
| **Documents** | 1 Draft | 10 Drafts/mo | Unlimited + Rewrite |
| **Data Room** | - | - | Secure Sharing + Analytics |

---

## 5. SEO Optimization Strategy

To maximize organic traffic, the Navbar links should use descriptive anchors in the DOM structure (even if visually simple).

1.  **Meta Titles:** Ensure routes like `/pitch-decks` have titles like *"AI Pitch Deck Generator for Startups | StartupAI"*.
2.  **Internal Linking:** The footer should mirror the "Features" dropdown to create a strong site graph.
3.  **Keywords:**
    *   *Target:* "AI Pitch Deck", "Startup CRM", "Market Research AI", "Investor Updates".
    *   *Placement:* Tooltips on Navbar items and H1s on destination pages.

---

## 6. Responsive Behavior Rules

1.  **Breakpoint:** Collapse to Hamburger at `1024px` (iPad Pro Portrait).
2.  **Touch Targets:** Mobile menu items must be at least `44px` tall.
3.  **No Hover:** Mobile menus rely strictly on click/tap events.
4.  **Scroll Lock:** When Mobile Menu opens, `body` must set `overflow: hidden` to prevent background scrolling.
