# 07 - execute-action Edge Function

## 📊 Progress Tracker
- [ ] Create Deno Function 0%
- [ ] Implement JWT Ownership Validation 0%
- [ ] Implement Transactional Writes 0%

## 📋 Implementation Order
| Step | Task | Code Logic |
| :--- | :--- | :--- |
| 1 | Auth | Verify user belongs to org_id |
| 2 | Fetch | Get Approved Proposal |
| 3 | Commit | Write to core tables via service_role |

## 🛠️ Multi-Step Prompts

### Prompt A: The Execution Gate
> Create a Supabase Edge Function `execute-action`. It accepts an `action_id`. Logic: 1) Verify the caller's JWT has access to the `org_id`. 2) Load the `proposed_action` record. 3) If status is 'approved', perform an atomic update on the target table (e.g., `decks` or `crm_deals`) using the stored payload.

### Prompt B: Idempotency Logic
> Update `execute-action` to check for an `executed_at` timestamp. Prevent the same AI proposal from being applied twice to the master records. Return a 200 OK if already executed.

## 🏗️ Screens Involved
*   N/A (Backend Core)

## 🌟 Real-World Use Cases
1. **Security**: AI suggests moving a fundraising stage. The founder clicks "Approve." The backend verifies ownership before the SQL UPDATE is allowed.
2. **Accountability**: Every change to the startup profile is linked to an `action_id` and a founder signature.
