
# Changelog

## [v2.1.0] - Startup Profile Dashboard
### Features
- **Profile Dashboard**: Launched `/startup-profile` as the central hub for managing company data.
- **Dual View Mode**: Implemented "Edit" vs "Investor View" toggle for previewing the profile.
- **AI Tools**: Added granular AI actions for every section:
  - "Refine Tagline" (Overview)
  - "Suggest Competitors" (Market)
  - "Estimate Valuation" (Traction)
  - "Rewrite Bio" (Team)
- **Deep Integration**: Fully wired to `Supabase` backend and `WizardService` for AI operations.
- **Visuals**: Implemented 5 specialized cards (Overview, Team, Business, Traction, Summary) with responsive layouts.

## [v2.0.0] - User Profile System
### Features
- **My Profile Screen**: Full LinkedIn-style profile management.
- **Rich Data**: Support for Work Experience, Education history, and Skill tagging.
- **LinkedIn Sync**: "One-click" import simulation to populate profile fields automatically.
- **Profile Strength**: Gamified completion score with actionable "next steps".
- **Backend Persistence**: Full read/write integration with Supabase `profiles` table using JSONB for complex nested data.
- **Media Uploads**: Integrated Avatar and Cover Image uploading via Supabase Storage.

## [v1.9.1] - Secure Development Workflow
### Security
- **Conditional Auth Bypass**: Restricted the "Bypass Authentication" button to the development environment only (`import.meta.env.DEV`). This ensures no backdoor access in production builds.
- **Mock Session Persistence**: Updated `AuthContext` to persist the debug session in `localStorage`, allowing page reloads without losing the "logged in" state during development.

## [v1.9.0] - UX Polish & Developer Experience
### Added
- **Developer Login Bypass**: Added a "Bypass Authentication" button on the Login screen to facilitate rapid testing without Supabase credentials.
- **Dashboard Quick Actions**: Wired up "New Deck", "Add Contact", and "Create Doc" buttons on the Dashboard welcome header to navigate to their respective modules.
- **Slide Editor Controls**: Added manual "Add Bullet" and "Delete Bullet" controls to the Slide Canvas for granular content editing alongside AI tools.
- **Robust Auth Handling**: Improved `AuthContext` to handle offline/mock states gracefully.

## [v1.8.0] - Pitch Deck Module
### Added
- **AI Pitch Deck Generator**: New module (`PitchDecks.tsx`) allowing users to generate full slide decks from their profile data.
- **Template System**: Support for Y Combinator, Sequoia, and Custom templates.
- **Slide Viewer**: Dedicated interface for presenting and exporting generated slides.
- **Data Integration**: Decks are now stored in global `DataContext`.

## [v1.7.0] - Task Intelligence
### Added
- **Intelligent Task Manager**: Full Kanban board with AI-powered roadmap generation.
- **AI Auto-Plan**: Uses Gemini 3 Pro to generate strategic tasks based on the startup's stage and funding goals.
- **Settings Module**: Connected profile settings to global state for full data lifecycle management (Read/Update).

## [v1.6.0] - AI Document Generator
### Added
- **AI Document Engine**: Enabled real-time generation of Pitch Decks, One-Pagers, and Strategy Docs in `Documents.tsx`.
- **Gemini 3 Integration**: Integrated `gemini-3-pro-preview` with JSON output mode to create structured, HTML-formatted document sections based on the user's startup profile.
- **Stateful Editor**: Upgraded the Document Editor to support dynamic section rendering and live AI updates.

## [v1.5.4] - Profile Gamification
### Added
- **Profile Strength Meter**: Dashboard widget calculating a 0-100% completion score.
- **Actionable Feedback**: Dynamic list of missing fields (e.g., "Add Problem Statement") to guide users to 100%.

## [v1.5.3] - AI Coach
### Added
- **AI Coach Integration**: Live Gemini 3 Pro integration in the Dashboard.
- **Dynamic Insights**: "Refresh Analysis" button now triggers a full strategic review of the startup's metrics and profile.
- **Visuals**: Updated Insights panel with loading states and category-specific styling (Risk/Opportunity/Action).

## [v1.5.1] - AI Enrichment
### Added
- **AI Auto-Fill**: Implemented "Magic Wand" feature in Startup Wizard to auto-generate profile data from a website URL or company name using Gemini 3 Search Grounding.
- **Context-Aware Refinement**: Updated `refineWithAI` to use cross-field context (e.g. Solution knows about Problem) for better results.

## [v1.5.0] - Startup Wizard
### Added
- **Profile Wizard**: Implemented the 9-step onboarding flow.
- **AI Integration**: Added Gemini 3 (Pro Preview) integration for refining Mission, Problem, and Solution statements.
- **Navigation**: Added 'Onboarding' route to App routing logic.

## [v1.4.1] - CRM Enhancements
### Added
- **New Deal Modal**: Added validation and refined UI for the deal creation form in CRM.

## [v1.4.0] - CRM & Deal Pipeline
### Added
- **CRM Module**:
  - Full Kanban board implementation with horizontal scrolling.
  - 5 customizable stages: Lead, Qualified, Meeting, Proposal, Closed.
  - **Deal Cards**: Rich UI showing company info, sector, probability bar, and owner.
  - **Pipeline Stats**: Header metrics for Total Pipeline Value, Active Deals, and Win Rate.
  - **Filters**: Search and filter functionality for deals.

## [v1.3.0] - Document Workspace & Workflow
### Added
- **Documents Module**:
  - Implemented dual-view architecture (Dashboard & Editor).
  - **Dashboard View**: Grid layout for creating Pitch Decks, One-Pagers, Financial Models, etc.
  - **User Journey**: Visual flow diagram showing the "Select -> AI Draft -> Edit -> Export" process.
  - **Editor View**: Full rich-text interface with "AI Companion" side panel.
  - **AI Features**: "Auto-Generate Draft", "Make Clearer", and "Investor-Ready Polish" controls.

## [v1.2.0] - Founder Command Center & Document Editor
### Added
- **Founder Command Center (Dashboard)**:
  - New "Good Morning" welcome section with quick actions.
  - Premium KPI cards with sparklines and trend indicators.
  - Activity Feed showing recent system events.
  - AI Insights panel with actionable recommendations.
  - Visual Workflow Diagram component.
  - AI Journey status grid.
- **Document Editor**:
  - Full-screen editor layout.
  - Left sidebar for section navigation (Problem, Solution, etc.).
  - Right sidebar for AI Co-Pilot (Rewrite tools, Suggestions, Context).
  - Rich text editor canvas styling.
- **App Navigation**:
  - Dedicated `Sidebar` component for authenticated app view.
  - Updated `Navbar` to support "App Mode" (Top bar utility style) vs "Public Mode" (Transparent/Sticky).
- **Layout Architecture**:
  - Refactored `App.tsx` to switch layouts based on route (Public vs App).

## [v1.1.0] - How It Works Page
### Added
- **How It Works Page**:
  - Full-page scroll storytelling ("From Idea to Investor-Ready").
  - Animated step-by-step visualizations.
  - Process flow diagrams.
  - Feature grid integration.

## [v1.0.0] - Initial Launch (Public Site)
### Added
- **Landing Page**:
  - Hero section with animated illustrations.
  - Feature grid.
  - Workflow visualization.
  - Testimonials.
  - Pricing placeholder.
- **Components Library**:
  - Reusable UI cards, buttons, and sections.
  - Tailwind CSS configuration.
- **Routing**:
  - Basic client-side routing setup.
  - Placeholder pages for Login, Signup, CRM, Tasks, Settings.
