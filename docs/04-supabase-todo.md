
# 🗄️ Supabase Roadmap: User Profile Enrichment

**Status:** 🟡 Planned
**Goal:** Upgrade the `profiles` table to support rich LinkedIn-style data (Experience, Education, Skills) and implement AI automation for profile scoring and enrichment.

---

## 1. Schema Additions

### Table: `profiles` (Enhancements)
*Currently exists but needs additional columns to match the frontend `UserProfile` interface.*

| Column | Type | Description |
|:---|:---|:---|
| `headline` | `text` | Professional headline (e.g. "Founder @ StartupAI") |
| `location` | `text` | City, Country string |
| `phone` | `text` | Contact number (optional) |
| `cover_image_url` | `text` | URL to storage bucket image |
| `social_links` | `jsonb` | Object storing URLs: `{ linkedin, twitter, github, website }` |
| `skills` | `text[]` | Array of skill strings for easy filtering/search |
| `completion_score` | `integer` | Calculated 0-100 score for gamification |
| `last_enriched_at` | `timestamptz` | Timestamp of last external sync (LinkedIn) |

### Table: `profile_experience` (New)
*Normalized table for work history to enable query capabilities (e.g., "Find founders who worked at Google").*

| Column | Type | Constraints |
|:---|:---|:---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `profile_id` | `uuid` | FK to `profiles.id`, ON DELETE CASCADE |
| `company` | `text` | Required |
| `role` | `text` | Required |
| `start_date` | `date` | |
| `end_date` | `date` | Nullable (if current) |
| `is_current` | `boolean` | Default `false` |
| `description` | `text` | |
| `logo_url` | `text` | Fetched via Clearbit/Brandfetch |

### Table: `profile_education` (New)
*Normalized table for academic history.*

| Column | Type | Constraints |
|:---|:---|:---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `profile_id` | `uuid` | FK to `profiles.id`, ON DELETE CASCADE |
| `school` | `text` | Required |
| `degree` | `text` | |
| `field_of_study` | `text` | |
| `start_year` | `integer` | |
| `end_year` | `integer` | |

---

## 2. Indexes & Performance

*   **Search Vector:** Add a `tsvector` column `search_vector` to `profiles` combining `full_name`, `headline`, `skills`, and `bio` for fast user discovery.
*   **GIN Index:** On `profiles.skills` for fast array containment queries.
*   **Foreign Keys:** Index `profile_experience(profile_id)` and `profile_education(profile_id)`.

---

## 3. RLS Policies (Row Level Security)

### `profiles`
*   **Select:** `public` (or authenticated users only, depending on privacy setting).
*   **Update:** `auth.uid() == id` (Users can only edit their own profile).
*   **Insert:** `auth.uid() == id` (Created on signup via Trigger).

### `profile_experience` & `profile_education`
*   **Select:** Public/Authenticated.
*   **All Actions:** `auth.uid() == profile_id` (via join check or duplicate owner_id column).

---

## 4. Database Triggers & Functions

### `calculate_profile_score`
*   **Trigger:** After UPDATE on `profiles`, `profile_experience`, or `profile_education`.
*   **Logic:**
    *   Basic Info (Name, Headline, Avatar) = 30 pts
    *   Bio > 50 chars = 10 pts
    *   Experience > 0 = 20 pts
    *   Education > 0 = 10 pts
    *   Skills > 3 = 10 pts
    *   Social Links > 0 = 10 pts
    *   Location = 10 pts
*   **Action:** Updates `profiles.completion_score`.

---

## 5. Edge Functions (Deno)

### `enrich-profile`
*   **Trigger:** Manual button click ("Sync from LinkedIn").
*   **Inputs:** `linkedin_url`.
*   **Logic:** Calls external scraper API (e.g., Proxycurl), parses result, and performs upsert on `profiles` and child tables.

### `generate-bio`
*   **Trigger:** Manual button click in Edit mode.
*   **Inputs:** `experience` array, `skills`.
*   **Logic:** Uses Gemini 3 Pro to write a compelling bio based on work history.

---

## 6. Storage Buckets

### `avatars`
*   **Public Access:** True.
*   **Size Limit:** 2MB.
*   **Allowed Types:** `image/jpeg`, `image/png`, `image/webp`.

### `profile-covers` (New)
*   **Public Access:** True.
*   **Size Limit:** 5MB.
*   **Dimensions:** Optimized for 1200x300 aspect ratio.
