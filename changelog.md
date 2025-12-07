# Changelog

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