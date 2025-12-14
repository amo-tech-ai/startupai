# Event System Schema Documentation

**Version:** 2.0  
**Last Updated:** 2025-12-13  
**Status:** ✅ Production-Ready  
**Database:** Supabase PostgreSQL

---

## 📊 Schema Overview

The Event System consists of **5 core tables** that support both community events and startup-owned events:

| Table | Purpose | Records | RLS Policies | Indexes | Triggers |
|-------|---------|---------|--------------|---------|----------|
| `events` | Main event records | Community + Startup events | 4 | 10+ | 1 |
| `event_tasks` | AI-generated workback schedules | 50+ per event | 4 | 11+ | 2 |
| `event_assets` | Marketing assets (images, copy, landing pages) | Variable | 4 | 8+ | 1 |
| `event_budgets` | Budget line items & tracking | Variable | 4 | 7+ | 2 |
| `event_registrations` | User registrations & check-ins | Variable | 3 | 3+ | 1 |

**Total:** 5 tables, 19 RLS policies, 39+ indexes, 7 triggers

---

## 🗄️ Table Schemas

### 1. `events` - Main Event Records

**Purpose:** Stores both community events (`startup_id = null`) and startup-owned events (`startup_id != null`)

#### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | Primary key |
| `title` | `text` | ❌ | - | Event title |
| `description` | `text` | ✅ | - | Full event description |
| `tagline` | `text` | ✅ | - | Short tagline/slogan |
| `event_date` | `timestamptz` | ❌ | - | Start date/time |
| `end_date` | `timestamptz` | ✅ | - | End date/time |
| `location` | `text` | ✅ | - | Human-readable location |
| `location_data` | `jsonb` | ✅ | `{}` | Structured location data |
| `event_type` | `text` | ✅ | - | Event category (see constraints) |
| `format` | `text` | ✅ | - | Virtual/Physical/Hybrid |
| `timezone` | `text` | ✅ | `'America/Toronto'` | Event timezone |
| `status` | `text` | ✅ | `'planning'` | Event lifecycle status |
| `registration_url` | `text` | ✅ | - | External registration link |
| `image_url` | `text` | ✅ | - | Legacy image URL |
| `cover_image_url` | `text` | ✅ | - | Cover image URL |
| `landing_page_url` | `text` | ✅ | - | Generated landing page URL |
| `startup_id` | `uuid` | ✅ | - | FK → `startups.id` (null = community event) |
| `user_id` | `uuid` | ✅ | - | FK → `auth.users.id` (creator) |
| `org_id` | `uuid` | ✅ | - | FK → `orgs.id` |
| `budget_total` | `numeric` | ✅ | - | Total budget |
| `budget_spent` | `numeric` | ✅ | `0` | Amount spent |
| `budget_currency` | `text` | ✅ | `'USD'` | Currency code |
| `target_attendees` | `integer` | ✅ | - | Target attendance |
| `registered_count` | `integer` | ✅ | `0` | Current registrations (auto-updated) |
| `attended_count` | `integer` | ✅ | `0` | Checked-in attendees (auto-updated) |
| `ai_analysis` | `jsonb` | ✅ | `{}` | AI feasibility analysis |
| `wizard_context` | `jsonb` | ✅ | `{}` | Wizard inputs (URLs, goals, vibe) |
| `search_vector` | `tsvector` | ✅ | - | Full-text search index |
| `created_at` | `timestamptz` | ✅ | `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | ✅ | `now()` | Last update (auto-updated) |

#### Constraints

**Check Constraints:**
- `event_type` IN: `'webinar'`, `'meetup'`, `'conference'`, `'workshop'`, `'demo_day'`, `'networking'`, `'hackathon'`, `'pitch_event'`, `'other'`
- `format` IN: `'Virtual'`, `'Physical'`, `'Hybrid'`
- `status` IN: `'planning'`, `'marketing'`, `'registration_open'`, `'registration_closed'`, `'in_progress'`, `'completed'`, `'cancelled'`

**Foreign Keys:**
- `startup_id` → `startups.id` ON DELETE CASCADE
- `user_id` → `auth.users.id`
- `org_id` → `orgs.id` ON DELETE CASCADE

**Indexes:**
- Primary key: `events_pkey` on `id`
- `idx_events_event_date` on `event_date`
- `idx_events_startup_id` on `startup_id`
- `idx_events_status` on `status`
- `idx_events_search_vector` on `search_vector` (GIN)
- Composite indexes for common queries

**Triggers:**
- `on_event_update` → Updates `updated_at` before UPDATE

#### Frontend/Backend Usage

**TypeScript Type:**
```typescript
interface Event {
  id: string;
  title: string;
  description?: string;
  tagline?: string;
  event_date: string; // ISO 8601
  end_date?: string;
  location?: string;
  location_data?: {
    venue_name?: string;
    address?: string;
    city?: string;
    country?: string;
    capacity?: number;
    amenities?: string[];
    coordinates?: { lat: number; lng: number };
  };
  event_type?: EventType;
  format?: 'Virtual' | 'Physical' | 'Hybrid';
  timezone?: string;
  status?: EventStatus;
  registration_url?: string;
  cover_image_url?: string;
  landing_page_url?: string;
  startup_id?: string;
  user_id?: string;
  org_id?: string;
  budget_total?: number;
  budget_spent?: number;
  budget_currency?: string;
  target_attendees?: number;
  registered_count?: number;
  attended_count?: number;
  ai_analysis?: {
    feasibility_score?: number;
    risk_factors?: string[];
    conflict_warnings?: string[];
    recommendations?: string[];
  };
  wizard_context?: {
    urls?: string[];
    goals?: string[];
    target_audience?: string;
    vibe?: string;
    brand_context?: Record<string, any>;
  };
  created_at: string;
  updated_at: string;
}

type EventType = 'webinar' | 'meetup' | 'conference' | 'workshop' | 
                 'demo_day' | 'networking' | 'hackathon' | 'pitch_event' | 'other';

type EventStatus = 'planning' | 'marketing' | 'registration_open' | 
                   'registration_closed' | 'in_progress' | 'completed' | 'cancelled';
```

**Service Functions:**
```typescript
// services/supabase/events/core.ts
export async function getEventById(id: string): Promise<Event | null>
export async function getEventsByStartup(startupId: string): Promise<Event[]>
export async function createEvent(event: Partial<Event>): Promise<Event>
export async function updateEvent(id: string, updates: Partial<Event>): Promise<Event>
export async function deleteEvent(id: string): Promise<void>
export async function searchEvents(query: string): Promise<Event[]>
```

---

### 2. `event_tasks` - AI-Generated Workback Schedules

**Purpose:** Stores AI-generated tasks (50+ per event) organized by phase

#### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | Primary key |
| `event_id` | `uuid` | ❌ | - | FK → `events.id` |
| `startup_id` | `uuid` | ✅ | - | FK → `startups.id` |
| `title` | `text` | ❌ | - | Task title |
| `description` | `text` | ✅ | - | Task details |
| `phase` | `text` | ❌ | - | Task phase (see constraints) |
| `status` | `text` | ✅ | `'todo'` | Task status |
| `priority` | `text` | ✅ | `'medium'` | Task priority |
| `due_date` | `timestamptz` | ✅ | - | Calculated due date |
| `due_offset_days` | `integer` | ✅ | - | Days before event (for calculation) |
| `assignee_id` | `uuid` | ✅ | - | FK → `auth.users.id` |
| `is_ai_generated` | `boolean` | ✅ | `false` | AI-generated flag |
| `ai_reasoning` | `text` | ✅ | - | AI explanation for task |
| `created_at` | `timestamptz` | ✅ | `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | ✅ | `now()` | Last update (auto-updated) |
| `completed_at` | `timestamptz` | ✅ | - | Completion timestamp |

#### Constraints

**Check Constraints:**
- `phase` IN: `'Strategy'`, `'Planning'`, `'Marketing'`, `'Ops'`, `'Post'`
- `status` IN: `'todo'`, `'in_progress'`, `'blocked'`, `'done'`, `'cancelled'`
- `priority` IN: `'low'`, `'medium'`, `'high'`, `'urgent'`

**Foreign Keys:**
- `event_id` → `events.id` ON DELETE CASCADE
- `startup_id` → `startups.id` ON DELETE CASCADE
- `assignee_id` → `auth.users.id`

**Indexes:**
- Primary key: `event_tasks_pkey` on `id`
- `idx_event_tasks_event_id` on `event_id`
- `idx_event_tasks_phase` on `phase`
- `idx_event_tasks_status` on `status`
- `idx_event_tasks_due_date` on `due_date`
- Composite indexes for filtering

**Triggers:**
- `on_event_task_due_date_change` → Calculates `due_date` from `due_offset_days` + `event.event_date`
- `on_event_task_update` → Updates `updated_at` before UPDATE

#### Frontend/Backend Usage

**TypeScript Type:**
```typescript
interface EventTask {
  id: string;
  event_id: string;
  startup_id?: string;
  title: string;
  description?: string;
  phase: 'Strategy' | 'Planning' | 'Marketing' | 'Ops' | 'Post';
  status: 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  due_offset_days?: number;
  assignee_id?: string;
  is_ai_generated?: boolean;
  ai_reasoning?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}
```

**Service Functions:**
```typescript
// services/supabase/events/tasks.ts
export async function getTasksByEvent(eventId: string): Promise<EventTask[]>
export async function getTasksByPhase(eventId: string, phase: string): Promise<EventTask[]>
export async function createTask(task: Partial<EventTask>): Promise<EventTask>
export async function updateTask(id: string, updates: Partial<EventTask>): Promise<EventTask>
export async function deleteTask(id: string): Promise<void>
export async function completeTask(id: string): Promise<EventTask>
```

---

### 3. `event_assets` - Marketing Assets

**Purpose:** Stores AI-generated marketing assets (images, copy, landing pages)

#### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | Primary key |
| `event_id` | `uuid` | ❌ | - | FK → `events.id` |
| `startup_id` | `uuid` | ✅ | - | FK → `startups.id` |
| `asset_type` | `text` | ❌ | - | Asset type (see constraints) |
| `title` | `text` | ✅ | - | Asset title |
| `content` | `text` | ✅ | - | Asset content (copy, HTML) |
| `url` | `text` | ✅ | - | Asset URL (image, landing page) |
| `metadata` | `jsonb` | ✅ | `{}` | Additional metadata |
| `is_ai_generated` | `boolean` | ✅ | `false` | AI-generated flag |
| `ai_prompt` | `text` | ✅ | - | Prompt used for generation |
| `ai_model` | `text` | ✅ | - | Model used (e.g., 'gemini-2.5-flash') |
| `version` | `integer` | ✅ | `1` | Version number |
| `parent_asset_id` | `uuid` | ✅ | - | FK → `event_assets.id` (for versions) |
| `status` | `text` | ✅ | `'draft'` | Asset status |
| `created_at` | `timestamptz` | ✅ | `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | ✅ | `now()` | Last update (auto-updated) |

#### Constraints

**Check Constraints:**
- `asset_type` IN: `'hero_image'`, `'social_post'`, `'email_template'`, `'landing_page_copy'`, `'press_release'`, `'ad_creative'`, `'other'`
- `status` IN: `'draft'`, `'approved'`, `'published'`, `'archived'`

**Foreign Keys:**
- `event_id` → `events.id` ON DELETE CASCADE
- `startup_id` → `startups.id` ON DELETE CASCADE
- `parent_asset_id` → `event_assets.id` (self-reference for versions)

**Indexes:**
- Primary key: `event_assets_pkey` on `id`
- `idx_event_assets_event_id` on `event_id`
- `idx_event_assets_asset_type` on `asset_type`
- `idx_event_assets_status` on `status`
- Composite indexes for filtering

**Triggers:**
- `on_event_asset_update` → Updates `updated_at` before UPDATE

#### Frontend/Backend Usage

**TypeScript Type:**
```typescript
interface EventAsset {
  id: string;
  event_id: string;
  startup_id?: string;
  asset_type: 'hero_image' | 'social_post' | 'email_template' | 
              'landing_page_copy' | 'press_release' | 'ad_creative' | 'other';
  title?: string;
  content?: string;
  url?: string;
  metadata?: Record<string, any>;
  is_ai_generated?: boolean;
  ai_prompt?: string;
  ai_model?: string;
  version?: number;
  parent_asset_id?: string;
  status?: 'draft' | 'approved' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}
```

**Service Functions:**
```typescript
// services/supabase/events/assets.ts
export async function getAssetsByEvent(eventId: string): Promise<EventAsset[]>
export async function getAssetsByType(eventId: string, type: string): Promise<EventAsset[]>
export async function createAsset(asset: Partial<EventAsset>): Promise<EventAsset>
export async function updateAsset(id: string, updates: Partial<EventAsset>): Promise<EventAsset>
export async function deleteAsset(id: string): Promise<void>
export async function createAssetVersion(parentId: string, asset: Partial<EventAsset>): Promise<EventAsset>
```

---

### 4. `event_budgets` - Budget Line Items

**Purpose:** Tracks budget line items with estimated vs actual costs

#### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | Primary key |
| `event_id` | `uuid` | ❌ | - | FK → `events.id` |
| `startup_id` | `uuid` | ✅ | - | FK → `startups.id` |
| `category` | `text` | ❌ | - | Budget category (see constraints) |
| `description` | `text` | ✅ | - | Line item description |
| `estimated_cost` | `numeric` | ❌ | - | Estimated cost |
| `actual_cost` | `numeric` | ✅ | `0` | Actual cost |
| `currency` | `text` | ✅ | `'USD'` | Currency code |
| `is_paid` | `boolean` | ✅ | `false` | Payment status |
| `paid_at` | `timestamptz` | ✅ | - | Payment timestamp |
| `payment_method` | `text` | ✅ | - | Payment method |
| `vendor_name` | `text` | ✅ | - | Vendor name |
| `vendor_contact` | `text` | ✅ | - | Vendor contact info |
| `invoice_url` | `text` | ✅ | - | Invoice/document URL |
| `metadata` | `jsonb` | ✅ | `{}` | Additional metadata |
| `created_at` | `timestamptz` | ✅ | `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | ✅ | `now()` | Last update (auto-updated) |

#### Constraints

**Check Constraints:**
- `category` IN: `'Venue'`, `'Catering'`, `'Marketing'`, `'Speakers'`, `'AV_Equipment'`, `'Staffing'`, `'Travel'`, `'Swag'`, `'Other'`

**Foreign Keys:**
- `event_id` → `events.id` ON DELETE CASCADE
- `startup_id` → `startups.id` ON DELETE CASCADE

**Indexes:**
- Primary key: `event_budgets_pkey` on `id`
- `idx_event_budgets_event_id` on `event_id`
- `idx_event_budgets_category` on `category`
- Composite indexes for filtering

**Triggers:**
- `on_event_budget_change` → Updates `events.budget_spent` automatically (INSERT/UPDATE/DELETE)
- `on_event_budget_update` → Updates `updated_at` before UPDATE

#### Frontend/Backend Usage

**TypeScript Type:**
```typescript
interface EventBudget {
  id: string;
  event_id: string;
  startup_id?: string;
  category: 'Venue' | 'Catering' | 'Marketing' | 'Speakers' | 
           'AV_Equipment' | 'Staffing' | 'Travel' | 'Swag' | 'Other';
  description?: string;
  estimated_cost: number;
  actual_cost?: number;
  currency?: string;
  is_paid?: boolean;
  paid_at?: string;
  payment_method?: string;
  vendor_name?: string;
  vendor_contact?: string;
  invoice_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
```

**Service Functions:**
```typescript
// services/supabase/events/finance.ts
export async function getBudgetsByEvent(eventId: string): Promise<EventBudget[]>
export async function getBudgetsByCategory(eventId: string, category: string): Promise<EventBudget[]>
export async function createBudget(budget: Partial<EventBudget>): Promise<EventBudget>
export async function updateBudget(id: string, updates: Partial<EventBudget>): Promise<EventBudget>
export async function deleteBudget(id: string): Promise<void>
export async function getBudgetSummary(eventId: string): Promise<{
  total_estimated: number;
  total_actual: number;
  by_category: Record<string, { estimated: number; actual: number }>;
}>
```

---

### 5. `event_registrations` - User Registrations

**Purpose:** Tracks user registrations, check-ins, and feedback

#### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | ✅ | - | FK → `auth.users.id` |
| `event_id` | `uuid` | ✅ | - | FK → `events.id` |
| `status` | `text` | ✅ | `'registered'` | Registration status |
| `registered_at` | `timestamptz` | ✅ | `now()` | Registration timestamp |
| `checked_in_at` | `timestamptz` | ✅ | - | Check-in timestamp |
| `feedback_score` | `integer` | ✅ | - | Rating (1-5) |
| `feedback_comment` | `text` | ✅ | - | Feedback text |
| `custom_data` | `jsonb` | ✅ | `{}` | Custom registration data |

#### Constraints

**Check Constraints:**
- `status` IN: `'registered'`, `'attended'`, `'cancelled'`, `'no_show'`, `'waitlisted'`
- `feedback_score` BETWEEN 1 AND 5

**Foreign Keys:**
- `user_id` → `auth.users.id`
- `event_id` → `events.id`

**Unique Constraints:**
- `(user_id, event_id)` - One registration per user per event

**Indexes:**
- Primary key: `event_registrations_pkey` on `id`
- Unique: `event_registrations_user_id_event_id_key` on `(user_id, event_id)`
- `idx_event_registrations_event_id` on `event_id`
- `idx_event_registrations_user_id` on `user_id`

**Triggers:**
- `on_event_registration_change` → Updates `events.registered_count` and `events.attended_count` automatically

#### Frontend/Backend Usage

**TypeScript Type:**
```typescript
interface EventRegistration {
  id: string;
  user_id: string;
  event_id: string;
  status: 'registered' | 'attended' | 'cancelled' | 'no_show' | 'waitlisted';
  registered_at: string;
  checked_in_at?: string;
  feedback_score?: number; // 1-5
  feedback_comment?: string;
  custom_data?: Record<string, any>;
}
```

**Service Functions:**
```typescript
// services/supabase/events/attendees.ts
export async function getRegistrationsByEvent(eventId: string): Promise<EventRegistration[]>
export async function getRegistrationsByUser(userId: string): Promise<EventRegistration[]>
export async function registerForEvent(eventId: string, userId: string): Promise<EventRegistration>
export async function cancelRegistration(id: string): Promise<EventRegistration>
export async function checkIn(id: string): Promise<EventRegistration>
export async function submitFeedback(id: string, score: number, comment?: string): Promise<EventRegistration>
```

---

## 🔒 Row-Level Security (RLS) Policies

### `events` Table

1. **Public events are viewable by everyone**
   - **Command:** SELECT
   - **Qual:** `startup_id IS NULL OR user is org member`
   - **Purpose:** Community events public, startup events only for org members

2. **Users can insert events for their org**
   - **Command:** INSERT
   - **With Check:** `startup_id IS NULL OR user is org member`
   - **Purpose:** Only org members can create startup events

3. **Users can update their org events**
   - **Command:** UPDATE
   - **Qual/With Check:** `user is org member`
   - **Purpose:** Only org members can update startup events

4. **Users can delete their org events**
   - **Command:** DELETE
   - **Qual:** `user is org member`
   - **Purpose:** Only org members can delete startup events

### `event_tasks` Table

1. **Users can view their org event tasks**
   - **Command:** SELECT
   - **Qual:** `user is org member of event's startup`

2. **Users can insert tasks for their org events**
   - **Command:** INSERT
   - **With Check:** `user is org member of event's startup`

3. **Users can update tasks for their org events**
   - **Command:** UPDATE
   - **Qual/With Check:** `user is org member of event's startup`

4. **Users can delete tasks for their org events**
   - **Command:** DELETE
   - **Qual:** `user is org member of event's startup`

### `event_assets` Table

1. **Users can view their org event assets**
   - **Command:** SELECT
   - **Qual:** `user is org member of event's startup`

2. **Users can insert assets for their org events**
   - **Command:** INSERT
   - **With Check:** `user is org member of event's startup`

3. **Users can update assets for their org events**
   - **Command:** UPDATE
   - **Qual/With Check:** `user is org member of event's startup`

4. **Users can delete assets for their org events**
   - **Command:** DELETE
   - **Qual:** `user is org member of event's startup`

### `event_budgets` Table

1. **Users can view their org event budgets**
   - **Command:** SELECT
   - **Qual:** `user is org member of event's startup`

2. **Users can insert budgets for their org events**
   - **Command:** INSERT
   - **With Check:** `user is org member of event's startup`

3. **Users can update budgets for their org events**
   - **Command:** UPDATE
   - **Qual/With Check:** `user is org member of event's startup`

4. **Users can delete budgets for their org events**
   - **Command:** DELETE
   - **Qual:** `user is org member of event's startup`

### `event_registrations` Table

1. **Users can view own registrations**
   - **Command:** SELECT
   - **Qual:** `user_id = auth.uid()`
   - **Purpose:** Users can only see their own registrations

2. **Authenticated users can register for events**
   - **Command:** INSERT
   - **With Check:** `user_id = auth.uid()`
   - **Purpose:** Users can register themselves

3. **Users can cancel own registrations**
   - **Command:** DELETE
   - **Qual:** `user_id = auth.uid()`
   - **Purpose:** Users can cancel their own registrations

---

## 🔧 Database Functions & Triggers

### Triggers

#### 1. `on_event_update`
- **Table:** `events`
- **Timing:** BEFORE UPDATE
- **Function:** `handle_updated_at()`
- **Purpose:** Auto-update `updated_at` timestamp

#### 2. `on_event_task_due_date_change`
- **Table:** `event_tasks`
- **Timing:** BEFORE INSERT/UPDATE
- **Function:** `calculate_event_task_due_date()`
- **Purpose:** Calculates `due_date` from `due_offset_days` + `event.event_date`

#### 3. `on_event_task_update`
- **Table:** `event_tasks`
- **Timing:** BEFORE UPDATE
- **Function:** `handle_updated_at()`
- **Purpose:** Auto-update `updated_at` timestamp

#### 4. `on_event_asset_update`
- **Table:** `event_assets`
- **Timing:** BEFORE UPDATE
- **Function:** `handle_updated_at()`
- **Purpose:** Auto-update `updated_at` timestamp

#### 5. `on_event_budget_change`
- **Table:** `event_budgets`
- **Timing:** AFTER INSERT/UPDATE/DELETE
- **Function:** `update_event_budget_totals()`
- **Purpose:** Updates `events.budget_spent` automatically

#### 6. `on_event_budget_update`
- **Table:** `event_budgets`
- **Timing:** BEFORE UPDATE
- **Function:** `handle_updated_at()`
- **Purpose:** Auto-update `updated_at` timestamp

#### 7. `on_event_registration_change`
- **Table:** `event_registrations`
- **Timing:** AFTER INSERT/UPDATE/DELETE
- **Function:** `update_event_registration_counts()`
- **Purpose:** Updates `events.registered_count` and `events.attended_count` automatically

---

## 🔗 Relationships

```
events (1) ──→ (N) event_tasks
events (1) ──→ (N) event_assets
events (1) ──→ (N) event_budgets
events (1) ──→ (N) event_registrations

startups (1) ──→ (N) events
startups (1) ──→ (N) event_tasks
startups (1) ──→ (N) event_assets
startups (1) ──→ (N) event_budgets

orgs (1) ──→ (N) events

auth.users (1) ──→ (N) events (creator)
auth.users (1) ──→ (N) event_tasks (assignee)
auth.users (1) ──→ (N) event_registrations

event_assets (1) ──→ (N) event_assets (parent/version)
```

---

## 📡 Frontend/Backend Integration

### Service Layer Structure

```
services/
  supabase/
    events/
      core.ts          # Main event CRUD
      tasks.ts         # Task management
      assets.ts        # Asset management
      finance.ts       # Budget management
      attendees.ts     # Registration management
```

### Common Patterns

#### 1. Fetching Events

```typescript
// Get all events for a startup
const events = await getEventsByStartup(startupId);

// Get single event with related data
const event = await getEventById(eventId);
const tasks = await getTasksByEvent(eventId);
const assets = await getAssetsByEvent(eventId);
const budgets = await getBudgetsByEvent(eventId);
const registrations = await getRegistrationsByEvent(eventId);
```

#### 2. Creating Events

```typescript
// Create event from wizard
const event = await createEvent({
  title: 'Fashion Week Launch',
  event_date: '2025-06-15T18:00:00Z',
  startup_id: startupId,
  wizard_context: {
    urls: ['https://brand.com'],
    goals: ['brand awareness', 'networking'],
    target_audience: 'fashion industry professionals',
    vibe: 'sophisticated, modern'
  },
  status: 'planning'
});

// AI generates tasks automatically
// Budgets and assets created manually or via AI
```

#### 3. Real-time Subscriptions

```typescript
// Subscribe to event updates
const subscription = supabase
  .channel('event-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'events',
    filter: `startup_id=eq.${startupId}`
  }, (payload) => {
    console.log('Event changed:', payload);
  })
  .subscribe();
```

### React Hooks

```typescript
// hooks/useEventDetails.ts
export function useEventDetails(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [tasks, setTasks] = useState<EventTask[]>([]);
  const [assets, setAssets] = useState<EventAsset[]>([]);
  const [budgets, setBudgets] = useState<EventBudget[]>([]);
  
  useEffect(() => {
    // Fetch all related data
  }, [eventId]);
  
  return { event, tasks, assets, budgets };
}

// hooks/useEventWizard.ts
export function useEventWizard() {
  const [step, setStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({});
  
  const createEvent = async () => {
    // Create event with wizard context
  };
  
  return { step, setStep, wizardData, setWizardData, createEvent };
}
```

---

## 🎯 Key Design Decisions

### 1. Unified Events Table
- **Decision:** Extend `events` table rather than create `startup_events`
- **Rationale:** Reuse infrastructure, unified queries, backward compatible
- **Implementation:** `startup_id` nullable (null = community event)

### 2. Auto-Updating Counts
- **Decision:** Use triggers to update `registered_count` and `attended_count`
- **Rationale:** Consistency, performance, no manual updates needed
- **Implementation:** `update_event_registration_counts()` trigger function

### 3. Budget Tracking
- **Decision:** Separate `event_budgets` table with auto-summing
- **Rationale:** Detailed tracking, multiple line items, audit trail
- **Implementation:** `update_event_budget_totals()` trigger function

### 4. AI-Generated Tasks
- **Decision:** Store AI reasoning and generation metadata
- **Rationale:** Transparency, debugging, improvement
- **Implementation:** `is_ai_generated`, `ai_reasoning` fields

### 5. Asset Versioning
- **Decision:** Self-referencing `parent_asset_id` for versions
- **Rationale:** Track iterations, maintain history, rollback capability
- **Implementation:** Optional `parent_asset_id` FK

---

## 📝 Migration Notes

All migrations are in `supabase/migrations/`:

- `20251214010000_extend_events_for_startups.sql` - Extended events table
- `20251214010100_create_event_tasks.sql` - Created tasks table
- `20251214010200_create_event_assets.sql` - Created assets table
- `20251214010300_create_event_budgets.sql` - Created budgets table
- `20251214010400_add_events_rls_for_startups.sql` - RLS policies
- `20251214010500_add_event_tasks_rls.sql` - Tasks RLS
- `20251214010600_add_event_assets_rls.sql` - Assets RLS
- `20251214010700_add_event_budgets_rls.sql` - Budgets RLS
- `20251214010800_add_event_budget_triggers.sql` - Budget triggers
- `20251214010900_add_event_registration_triggers.sql` - Registration triggers
- `20251214011000_add_event_task_triggers.sql` - Task triggers
- `20251214020000_fix_events_rls_duplicate.sql` - Fixed duplicate RLS
- `20251214020100_add_security_to_trigger_functions.sql` - Function security
- `20251214020200_add_updated_at_triggers.sql` - Updated_at triggers
- `20251214020300_add_composite_indexes.sql` - Performance indexes

---

## ✅ Production Checklist

- [x] All tables created with proper constraints
- [x] RLS policies implemented and tested
- [x] Indexes created for performance
- [x] Triggers functioning correctly
- [x] Foreign keys with proper CASCADE rules
- [x] Check constraints for data validation
- [x] Auto-updating timestamps
- [x] Full-text search support
- [x] Multi-tenant security (org-based)
- [x] Backward compatibility (community events)

---

**Last Updated:** 2025-12-13  
**Schema Version:** 2.0  
**Status:** ✅ Production-Ready