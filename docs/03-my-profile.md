
# 👤 **My Profile Screen (LinkedIn-Style) — Master Plan**

**Version:** 1.3 | **Status:** 🏗️ In Progress  
**Owner:** Product Engineering Team  

---

## 📊 **Progress Tracker**

**Overall Completion:** 50% (Components Implemented)

| Phase | Status | Progress | Notes |
|-------|--------|----------|-------|
| **0. Infrastructure** | 🟢 Done | 100% | Route, Sidebar Link, Type defs added |
| **1. Structure & Wireframe** | 🟢 Done | 100% | Structural layout & skeleton components implemented |
| **2. Layout & Responsive** | 🟢 Done | 100% | Responsive Grid, Sticky Header/Sidebar implemented |
| **3. Component Architecture** | 🟢 Done | 100% | React Components created (Header, About, Exp, Skills, Sidebar) |
| **4. Content & Microcopy** | 🟡 In Progress | 80% | Labels and basic copy added to components |
| **5. Visual Design** | 🟡 In Progress | 80% | Tailwind styling applied, refinement needed |
| **6. Interactions & State** | 🟡 In Progress | 50% | Local states for editing added; animations pending |
| **7. Schema & SQL** | 🔴 Todo | 0% | Supabase migrations & RLS |
| **8. Backend Integration** | 🔴 Todo | 0% | Edge Functions (AI/LinkedIn) |
| **9. Frontend Integration** | 🔴 Todo | 0% | Data binding & mutations |

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
    ColLeft --> Projects[ProjectsSection]
    
    Header --> Avatar[AvatarUpload]
    Header --> Cover[CoverImage]
    Header --> HeaderInfo[EditableInfo]
    Header --> Actions[ActionButtons]
    
    Exp --> ExpList[ExperienceList]
    ExpItem --> EditModal[EditModal]
    
    ColRight --> Socials[SocialLinksCard]
    ColRight --> Contact[ContactInfoCard]
    ColRight --> AI[AIPreferencesCard]
    ColRight --> Security[SecuritySettings]
```

### **2. Entity Relationship Diagram (ERD)**

```mermaid
erDiagram
    profiles ||--o{ profile_experiences : has
    profiles ||--o{ profile_educations : has
    profiles ||--o{ profile_skills : has
    profiles ||--o{ profile_projects : has
    
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
        jsonb ai_preferences "New: {tone, auto_refine}"
    }
    profile_experiences {
        uuid id PK
        uuid profile_id FK
        text company
        text title
        text location
        date start_date
        date end_date
        bool is_current
        text description
    }
    profile_educations {
        uuid id PK
        uuid profile_id FK
        text school
        text degree
        text field_of_study
        date start_date
        date end_date
    }
    profile_skills {
        uuid id PK
        uuid profile_id FK
        text name
        int endorsements
    }
```
