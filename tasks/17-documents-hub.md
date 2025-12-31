# 17 - Documents Hub

## 📊 Progress Tracker
- [ ] Investment Memo Generator 0%
- [ ] RAG Search Engine 0%
- [ ] Contextual Rewriter 0%

## 📋 Implementation Order
| Step | Task | Technology |
| :--- | :--- | :--- |
| 1 | Drafting | Structured Output |
| 2 | Vault | pgvector Retrieval |
| 3 | Editing | Content Agent |

## 🛠️ Multi-Step Prompts

### Prompt A: Investment Memo Agent
> Build the "Investment Memo" wizard in `/documents`. The Architect Agent pulls from the "Deep Research Report" and Startup Graph to draft a 3-page, professional memo.

### Prompt B: RAG Search
> Implement "Chat with your Data Room." Use `pgvector` to store chunks of uploaded PDFs. The Retriever Agent (Pro) answers natural language questions based only on these files.

## 🏗️ Screens Involved
*   `/documents`
*   `/documents/:id`
