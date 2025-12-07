# Pitch Deck Engine — Complete PRD & Implementation Plan

**Product:** StartupAI  
**Module:** Pitch Deck Generator + Editor  
**Version:** 3.3  
**Last Updated:** 2025-12-08  
**Status:** 🟢 Production Ready  
**Owner:** StartupAI Team

> **📊 Quick Status:**
> | Area | Progress | Notes |
> |------|----------|-------|
> | Frontend UI | 100% | Wizard, Editor, AI Copilot complete |
> | Database Schema | 100% | 5 tables, RLS, indexes |
> | Edge Functions | 100% | generate-deck, slide-ai, image-ai deployed |
> | Frontend Services | 100% | Hybrid Service (Supabase + Gemini Fallback) |
> | Frontend ↔ Backend Wiring | 100% | Fully connected with Auto-save |
> | **Total MVP** | **100%** | Ready for Launch |

---

## 📋 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Feature Status Matrix](#2-feature-status-matrix)
3. [Progress Tracker](#3-progress-tracker)
4. [Gemini 3 Pro AI Integration](#4-gemini-3-pro-ai-integration)
5. [System Architecture](#5-system-architecture)
6. [Sitemap & Navigation](#6-sitemap--navigation)
7. [User Journeys](#7-user-journeys)
8. [Workflows](#8-workflows)
9. [Slide-Level AI Agents](#9-slide-level-ai-agents)
10. [Template System](#10-template-system)
11. [Database Schema](#11-database-schema)
12. [Edge Functions](#12-edge-functions)
13. [Frontend Components](#13-frontend-components)
14. [Figma Make + Supabase Integration](#14-figma-make--supabase-integration)
15. [Success Criteria](#15-success-criteria)
16. [Mermaid Diagrams](#16-mermaid-diagrams)
17. [Risks & Mitigations](#17-risks--mitigations)
18. [Implementation Checklist](#18-implementation-checklist)
19. [Reference Documentation](#19-reference-documentation)

---

## 1. Executive Summary

### Problem Statement

| Problem | Impact |
|---------|--------|
| Creating investor pitch decks takes 2-4 weeks | Founders lose momentum |
| Generic templates don't resonate | Lower conversion rates |
| Market research is time-consuming | Outdated or inaccurate data |
| Professional visuals require designers | Additional cost and delay |
| Inconsistent messaging across slides | Confuses investors |

### Solution

The Pitch Deck Engine enables founders to generate a complete, investor-ready deck in under 2 minutes using Gemini 3 Pro, enriched by:

- **5 Premium Templates** — Startup, Corporate, Creative, Minimal, Gradient.
- **Best Practices Integration** — YC/Sequoia formats, chart type auto-selection.
- **Google Search Grounding** — Real-time market sizing, competitors with citations.
- **Structured Outputs** — Clean, consistent JSON slides.
- **Thinking Mode** — Deep strategic reasoning for deck narrative.
- **Image Generation** — Custom slide visuals via Nano Banana.

---

## 2. Feature Status Matrix

### Core Features

| Feature | Status | Progress | Priority | Notes |
|---------|--------|----------|----------|-------|
| **Wizard UI (4 Steps)** | ✅ Done | 100% | P0 | Context → Template → Details → Financials |
| **Template Selector** | ✅ Done | 100% | P0 | YC, Sequoia, Custom supported |
| **Deck Generation** | ✅ Done | 100% | P0 | Gemini 3 Pro + Hybrid Service |
| **Best Practices** | ✅ Done | 100% | P1 | Prompt Engineering enforces rules |
| **Slide Editor** | ✅ Done | 100% | P0 | Full WYSIWYG editing |
| **AI Copilot** | ✅ Done | 100% | P0 | Per-slide AI assistance (Refine/Expand) |
| **Image Generation** | ✅ Done | 100% | P1 | Integrated via Gemini 2.5 Flash Image |
| **Auto-Save** | ✅ Done | 100% | P0 | Debounced persistence to Supabase |
| **Supabase Persistence** | ✅ Done | 100% | P0 | Full CRUD + RLS |

---

## 3. Progress Tracker

### Overall Progress: 100%

```
[██████████████████████████████████████████████████] 100%
```

### Component Status (Verified)

| Component | Status | Notes |
|-----------|--------|-------|
| **Database Tables** | ✅ 100% | `decks`, `slides`, `share_links` mapped in DataContext |
| **RLS Policies** | ✅ 100% | User-scoped access control |
| **Edge Functions** | ✅ 100% | `generateDeckEdge` service layer active |
| **Frontend Services** | ✅ 100% | `deckService.ts`, `edgeFunctionService.ts` |
| **Wizard UI** | ✅ 100% | 4-step wizard complete |
| **Editor UI** | ✅ 100% | Sidebar, Canvas, Presentation Mode |
| **Supabase Auth** | ✅ 100% | Login, signup, session management |
| **UI ↔ Backend Wiring** | ✅ 100% | Fully wired |

---

## 4. Gemini 3 Pro AI Integration

### AI Tools Reference

| Tool | Model | Purpose | Implementation |
|------|-------|---------|----------------|
| **Text Generation** | gemini-3-pro-preview | Slide content, narratives | All slide types |
| **Thinking** | gemini-3-pro-preview | Complex reasoning, strategy | Deck outline generation |
| **Function Calling** | gemini-3-pro-preview | Reliable JSON responses | generateDeckOutline function |
| **Google Search** | gemini-3-pro-preview | Real-time data | Market, competition slides |
| **Structured Outputs** | gemini-2.5-flash | Fast, typed responses | Slide rewrites, analysis |
| **Image Generation** | gemini-2.5-flash-image | Slide visuals | SlideCanvas integration |

---

## 5. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PITCH DECK ENGINE                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │
│  │   WIZARD    │ ──▶│ GENERATING  │ ──▶│   EDITOR    │              │
│  │ (NewDeck)   │    │   SCREEN    │    │ (DeckEditor)│              │
│  └─────────────┘    └─────────────┘    └─────────────┘              │
│                            │                   │                     │
│                            ▼                   ▼                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                  HYBRID SERVICE LAYER                         │   │
│  │               (services/edgeFunctions.ts)                     │   │
│  │                                                               │   │
│  │  1. Try Supabase Edge Function                                │   │
│  │  2. Fallback to Client-Side Gemini SDK                        │   │
│  │                                                               │   │
│  └───────────────────────────┬───────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                  GEMINI 3 PRO TOOLS                           │   │
│  │                                                               │   │
│  │  • Thinking       • Function Calling    • Google Search      │   │
│  │                                                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    SUPABASE                                   │   │
│  │                                                               │   │
│  │  • decks          • slides              • storage            │   │
│  │                                                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Sitemap & Navigation

### Core Sitemap

```
StartupAI
├── /dashboard
│   └── /pitch-decks (Gallery)
│       ├── /new (Modal Wizard)
│       ├── /:id/edit (Editor)
│       │   ├── Slide Outline (Left)
│       │   ├── Slide Canvas (Center)
│       │   └── Presentation Mode (Overlay)
```

---

## 10. Template System

### Template Overview (Implemented)

| Template | Focus | Slides | Structure |
|----------|-------|--------|-----------|
| **Y Combinator** | Seed Funding | 10 | Problem, Solution, Traction, Market, Team, Ask |
| **Sequoia** | Story/Strategy | 12 | Company Purpose, Problem, Solution, Why Now, Market, Product, Team, Financials |
| **Custom** | Context Aware | Auto | AI decides based on startup stage and industry |

---

## 11. Database Schema

### Table: decks

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| startup_id | UUID | Startup profile (FK) |
| title | TEXT | Deck title |
| template | TEXT | Template name |
| status | TEXT | draft, review, final |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update |

### Table: slides

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| deck_id | UUID | Parent deck (FK) |
| title | TEXT | Slide headline |
| content | JSONB | Bullet points (array) |
| visual_description | TEXT | AI prompt for image |
| image_url | TEXT | Generated/uploaded image |
| chart_type | TEXT | line, bar, pie, matrix |
| chart_data | JSONB | Chart configuration |
| position | INTEGER | Slide order |

---

## 18. Implementation Checklist

### ✅ Completed (Core Infrastructure)

- [x] Wizard UI (Modal based)
- [x] Template selector (YC, Sequoia, Custom)
- [x] DeckEditorContext (via global DataContext)
- [x] Slide editor (EditorPanel/SlideCanvas)
- [x] Chart component (Recharts integration)
- [x] Mock mode fallback (Hybrid Service)
- [x] RLS policies (18 policies)
- [x] Google Search Grounding (via Gemini SDK)
- [x] URL Context extraction (Wizard)

### ✅ Completed (Backend Wiring & Auth)

- [x] **Supabase Auth setup**: `AuthContext` managing sessions.
- [x] **Wire Wizard to Backend**: `NewDeckModal` calls `generateDeckEdge`.
- [x] **Wire Editor to Backend**: `DeckEditor` loads from `useData()` which syncs with Supabase `decks` table.
- [x] **Wire AI Copilot**: `SlideCanvas` calls `slideAIEdge` for text refinement.
- [x] **Wire Image Generation**: `SlideCanvas` calls `imageAIEdge` for visuals.
- [x] **Auto-Save**: Implemented in `DeckEditor` with 1000ms debounce to `updateDeck`.
- [x] **Loading States**: Spinners added to all async actions.
- [x] **Error Handling**: Alerts and console logging for failures.

### ✅ Completed (Slide Features)

- [x] **Slide Reordering**: Sidebar supports Move Up/Down.
- [x] **Slide Deletion**: Delete button on canvas.
- [x] **Add Slide**: Button in sidebar.
- [x] **Presentation Mode**: Full-screen overlay with keyboard navigation.
- [x] **Chart Rendering**: Dynamic rendering of Line, Bar, and Pie charts based on AI data.

### 🚀 Ready for Launch

The Pitch Deck module is now fully functional, persistent, and connected to the AI backend.

---

## 19. Reference Documentation

### Detailed Plan Files (`/plan/figma/pitch-deck/`)

| File | Purpose | Status |
|------|---------|--------|
| `02-pitch-deck-wizard.md` | **This File** | ✅ Master Plan |
| `12-templates.md` | Template system blueprint | ✅ Implemented |
| `14-pitch-deck-best-practices.md` | Best practices guide | ✅ Integrated |
| `17-schema.md` | Database schema documentation | ✅ Implemented |
