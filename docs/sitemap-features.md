
# 🗺️ StartupAI - Sitemap & Feature Directory

**Version:** 2.0
**Status:** 🟢 Production Verified
**Owner:** Product Architecture Team

This document provides a complete map of the StartupAI application surfaces, including routing, purpose, and key interactions.

---

## 🌐 Public Marketing Surface
*Pages accessible without authentication.*

| Page Name | Route / Path | Purpose | Primary CTA | Secondary Actions | Auth? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Home** | `/` | Brand vision and hero interactivity. | "Get Started" | "Watch Demo" | No |
| **Features** | `/features` | Deep dive into individual platform modules. | "Start Free Trial" | "Book Demo" | No |
| **Pricing** | `/pricing` | Plan selection and tier comparison. | "Upgrade Now" | "View FAQ" | No |
| **How It Works** | `/how-it-works` | 3-step visualization of the AI engine. | "Generate Deck" | - | No |
| **Login** | `/login` | Authentication entry point. | "Sign In" | "Forgot Password" | No |
| **Signup** | `/signup` | User registration and account creation. | "Create Account" | "Login" | No |

---

## 🧙‍♂️ Intelligent Onboarding
*Agentic intake flows for data collection.*

| Page Name | Route / Path | Purpose | Primary CTA | Secondary Actions | Auth? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Startup Wizard** | `/onboarding` | 6-step smart intake w/ URL Analysis. | "Run Smart Autofill" | "Manual Entry" | Yes* |
| **Event Wizard** | `/events/new` | Multi-step event strategy generator. | "Generate Strategy" | "Check Conflicts" | Yes |

*\*Guest mode available for initial steps.*

---

## 📊 Core Application (Protected)
*Main operational dashboard and management tools.*

| Page Name | Route / Path | Purpose | Primary CTA | Secondary Actions | Auth? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | `/dashboard` | Main KPI overview & AI Coach insights. | "New Deck" | "Add Contact" | Yes |
| **Startup Profile** | `/startup-profile` | Master company record and research. | "Share Data Room" | "Run Deep Research" | Yes |
| **Pitch Decks** | `/pitch-decks` | Gallery of generated presentations. | "New Deck" | "Rename / Delete" | Yes |
| **Deck Editor** | `/pitch-decks/:id` | Slide-level canvas with AI Copilot. | "Export PDF" | "Present Mode" | Yes |
| **Visual CRM** | `/crm` | Kanban pipeline and Address Book. | "New Deal" | "Sync LinkedIn" | Yes |
| **Documents Hub** | `/documents` | Doc factory and Secure Data Room. | "Create Doc" | "Upload Asset" | Yes |
| **Doc Editor** | `/documents/:id` | Text editor with AI refinement. | "Export HTML" | "AI Rewrite" | Yes |
| **Events Hub** | `/events` | Event management dashboard. | "New Event" | "View ROI Report" | Yes |
| **Event Detail** | `/events/:id` | Full lifecycle ops per event. | "Mark Complete" | "Generate Socials" | Yes |
| **Tasks & Ops** | `/tasks` | Daily roadmap and tactical execution. | "AI Auto-Plan" | "Add Task" | Yes |
| **My Profile** | `/profile` | User's professional history (LinkedIn-style). | "Edit Profile" | "Sync LinkedIn" | Yes |
| **Settings** | `/settings` | Account, Team, and Billing config. | "Save Changes" | "Manage Billing" | Yes |

---

## 🔗 Shared & Public Subsets
*Time-limited or public versions of application data.*

| Page Name | Route / Path | Purpose | Primary CTA | Secondary Actions | Auth? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Investor Profile** | `/s/:id` | Public read-only view of a startup. | "Request Intro" | "Visit Website" | No |
| **Event Page** | `/e/:id` | Public registration for specific events. | "Register" | "Add to Calendar" | No |

---

## 🛠️ Global Navigation & Layouts

### **The Sidebar (App Layout)**
*   **Top:** Global Search (Cmd+K).
*   **Middle:** Main module links (Dashboard -> Settings).
*   **Bottom:** Plan Status (Free/Founder/Growth) + Logout.

### **The Navbar (Public Layout)**
*   **Platform Dropdown:** Overview of modular structure.
*   **Resources Dropdown:** Blog, Docs, Community.
*   **Primary Action:** "Get Started" (Redirect to Onboarding).

### **AI Assistant (Drawer)**
*   **Access:** Persistent "Ask AI" bubble in App Layout.
*   **Scope:** Context-aware chat with access to metrics, deals, and tasks.
