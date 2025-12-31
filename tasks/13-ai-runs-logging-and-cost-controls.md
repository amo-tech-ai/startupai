# 13 - AI Runs: Logging & Cost Controls

## 📊 Progress Tracker
- [ ] Token Usage Middleware 0%
- [ ] Daily Quota Enforcer 0%
- [ ] Latency Dashboard 0%

## 📋 Implementation Order
| Step | Task | Logic |
| :--- | :--- | :--- |
| 1 | Middleware | Request/Response logger |
| 2 | Enforcer | Postgres trigger |
| 3 | Dashboard | /agents view |

## 🛠️ Multi-Step Prompts

### Prompt A: Audit Logging
> Update the AI Edge Function to extract `metadata.token_count` from the Gemini response. INSERT a record into `ai_runs` with `duration_ms` and total tokens before returning the result to the UI.

### Prompt B: Rate Limiting
> Write a Postgres function `check_ai_quota`. It counts `ai_runs` for an `org_id` in the last 24 hours. If count > 50 (Free) or > 500 (Pro), throw a 429 error from the Edge Function.

## 🏗️ Screens Involved
*   `/agents` (Audit logs)
*   `/settings` (Usage bar)
