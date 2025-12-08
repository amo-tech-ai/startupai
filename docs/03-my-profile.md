
# 👤 **My Profile Screen (LinkedIn-Style) — Master Plan**

**Version:** 2.0 | **Status:** 🟢 Frontend Complete | **Owner:** Product Engineering Team

---

## 📊 **Progress Tracker**

**Overall Completion:** 90% (Frontend Complete, Backend Integration Pending)

| Phase | Status | Progress | Notes |
|-------|--------|----------|-------|
| **0. Infrastructure** | 🟢 Done | 100% | Route, Sidebar Link, Type defs added |
| **1. Structure & Wireframe** | 🟢 Done | 100% | Structural layout & skeleton components implemented |
| **2. Layout & Responsive** | 🟢 Done | 100% | Responsive Grid, Sticky Header/Sidebar implemented |
| **3. Component Architecture** | 🟢 Done | 100% | React Components created (Header, About, Exp, Edu, Skills, Sidebar) |
| **4. Content & Microcopy** | 🟢 Done | 100% | Labels, placeholders, and tooltips added |
| **5. Visual Design** | 🟢 Done | 100% | Tailwind styling applied, clean SaaS aesthetic |
| **6. Interactions & State** | 🟢 Done | 100% | Local state buffering, Edit Modes, Add/Delete logic |
| **7. Data Integration** | 🟢 Done | 100% | Connected to global `DataContext` and `mockDatabase` |
| **8. Backend Integration** | 🟡 Pending | 0% | Connect to Supabase `profiles` table (Next Sprint) |

---

## 🧩 **Architecture Diagrams**

### **1. Component Hierarchy**

```mermaid
graph TD
    Page[Page: /profile] --> Layout[ProfileLayout]
    
    Layout --> ColLeft[Left Column (Main)]
    Layout --> ColRight[Right Column (Sidebar)]
    
    ColLeft --> Header[ProfileHeader]
    ColLeft --> About[AboutSection]
    ColLeft --> Exp[ExperienceSection]
    ColLeft --> Edu[EducationSection]
    ColLeft --> Skills[SkillsSection]
    
    Header --> Avatar[AvatarUpload]
    Header --> Cover[CoverImage]
    Header --> HeaderInfo[EditableInfo]
    Header --> Actions[ActionButtons]
    
    Exp --> ExpList[ExperienceList]
    ExpList --> ExpItem[ExperienceItem]
    
    ColRight --> Completion[ProfileStrength]
    ColRight --> Socials[SocialLinksCard]
    ColRight --> Contact[ContactInfoCard]
    ColRight --> Settings[SettingsTeaser]
```

### **2. Entity Relationship Diagram (ERD)**

```mermaid
erDiagram
    profiles ||--o{ profile_experiences : has
    profiles ||--o{ profile_educations : has
    profiles ||--o{ profile_skills : has
    
    profiles {
        uuid id PK "FK to auth.users"
        text full_name
        text headline "New"
        text location "New"
        text website "New"
        text bio
        text avatar_url
        text cover_image_url "New"
        jsonb social_links "New: {linkedin, twitter, github}"
        int completion_score
    }
    profile_experiences {
        uuid id PK
        uuid profile_id FK
        text company
        text title
        text start_date
        text end_date
        bool is_current
        text description
    }
    profile_educations {
        uuid id PK
        uuid profile_id FK
        text school
        text degree
        text year
    }
```

---

## 📝 **Prompt History**

### **PROMPT 1 — Structural Wireframe**
> Establish the visual layout hierarchy without detailed styling.
- **Output:** `components/Profile.tsx` (Wireframe Mode)
- **Focus:** Grid system, responsive stacking, section placement.

### **PROMPT 2 — Layout & Responsiveness**
> Refine wireframe into specific layout specification.
- **Output:** Updated `Profile.tsx`
- **Focus:** 2-column desktop (2/3 + 1/3), Sticky Sidebar, Mobile stacking.

### **PROMPT 3 — Component Design**
> detailed component breakdown and interaction design.
- **Output:** `components/profile/*`
- **Focus:**
    - `ProfileHeader`: Cover image, Avatar, Edit mode.
    - `AboutSection`: Textarea auto-resize, AI rewrite button.
    - `ExperienceSection`: List view, Edit modal/inline form.
    - `SkillsSection`: Tag management.
    - `SidebarWidgets`: Progress bar, social links.

### **PROMPT 4 — State & Data Wiring**
> Connect static components to global application state.
- **Output:** `DataContext.tsx`, `types.ts`, `mockDatabase.ts`
- **Focus:**
    - Define `UserProfile` interface.
    - Add mock data.
    - Implement `updateUserProfile` in Context.
    - Refactor components to consume `useData()`.

### **PROMPT 5 — Polish & Missing Features**
> Final polish and gap analysis.
- **Output:** `EducationSection.tsx`, `ProfileHeader.tsx` (State fix)
- **Focus:**
    - Added missing Education section.
    - Fixed performance issue in Header input (debouncing/local state).
    - Added "Edit" mode to Experience items.

---

## ✅ **Success Criteria Checklist**

- [x] **Visuals:** Matches "Professional Network" aesthetic (Clean, White, Indigo accents).
- [x] **Responsive:** Stacks correctly on mobile, Sidebar sticks on desktop.
- [x] **Data:** Persists changes to local memory/mock DB.
- [x] **Interactions:**
    - [x] Edit Profile Header
    - [x] Add/Edit/Delete Experience
    - [x] Add/Edit/Delete Education
    - [x] Add/Remove Skills
- [x] **Navigation:** Accessible from Sidebar.
