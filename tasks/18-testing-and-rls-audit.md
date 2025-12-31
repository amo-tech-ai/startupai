# 18 - Testing & RLS Audit

## 📊 Progress Tracker
- [ ] RLS Security Audit 0%
- [ ] E2E Journey Validation 0%
- [ ] Latency & Cost Review 0%

## 📋 Implementation Order
| Step | Task | Focus |
| :--- | :--- | :--- |
| 1 | Security | SQL Policy Audit |
| 2 | E2E | Playwright Tests |
| 3 | Performance | p95 Latency Tuning |

## 🛠️ Multi-Step Prompts

### Prompt A: Security Forensic Audit
> Perform a full RLS audit on the `proposed_actions` table. GIVEN a user from Org B, WHEN they attempt to "Approve" an action ID from Org A, THEN the database must return a 403 Forbidden.

### Prompt B: E2E Seed Sprint
> Write a Playwright scenario for the "Seed Round Sprint" journey: 1) Paste URL, 2) Apply Intelligence Brief, 3) Generate Deck, 4) Approve first 5 slides. Confirm data integrity at every step.

## 🏗️ Screens Involved
*   All Routes.
