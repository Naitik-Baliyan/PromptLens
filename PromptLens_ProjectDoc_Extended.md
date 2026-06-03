# PromptLens — Project Document
**The Prompt Engineering Workbench for Developers**
Version: 1.1 | Author: Naitik Baliyan

## 1. Project Overview
PromptLens is an open-source prompt engineering workbench that helps developers, AI engineers, and prompt engineers write, test, debug, and optimize their prompts — the same way they use unit tests and linters for code.

The core belief behind PromptLens: **prompts are code, and they deserve proper tooling.**

Right now, developers write prompts by guessing, manually testing, and copy-pasting outputs. There is no structured way to compare prompt variants, diagnose weaknesses, score prompt quality, or track costs. PromptLens fills that gap.

## 2. The Problem
* Developers iterate on prompts blindly — no diff, no metrics, no structure.
* There is no standard way to compare two prompt variants and see which performs better or is more cost-effective.
* Prompt quality is subjective — no scoring framework exists for everyday use.
* Prompt engineers waste hours on trial-and-error with no tooling support.
* There is no open-source, self-hostable, privacy-first prompt testing tool for individual developers.

## 3. The Solution — What PromptLens Does
PromptLens is a web-based workbench with six core modules:

### 3.1 Prompt Diff & Compare
Run two prompt variants against a model simultaneously. Get side-by-side outputs with a GitHub-style visual diff highlighting the differences. A meta-LLM call then scores which prompt performed better on tone, accuracy, relevance, and output length.
* **New:** Tracks **Token Usage (Input/Output)** and **Response Latency (ms)** to ensure optimization for cost and speed.

### 3.2 Prompt Autopsy & Security Linter
Paste any prompt and PromptLens dissects it into its components:
* **System Instruction** — What role or persona is being set?
* **Context Block** — What background is being provided?
* **Constraints** — What rules or boundaries are defined?
* **Output Format** — Is the desired format specified?
* **Few-Shot Examples** — Are examples provided?
* **Security & Jailbreak Check:** Automatically tests constraints against common prompt injection techniques.
PromptLens highlights missing components and suggests improvements — like a linter for your prompts.

### 3.3 Mutation Engine
Input one base prompt and the Mutation Engine generates 5 intelligent variants:
* **More Specific** — adds detail and precision
* **Chain-of-Thought** — adds step-by-step reasoning instructions
* **Few-Shot** — prepends example input-output pairs
* **Compressed** — shortest version preserving core intent
* **Persona-Driven** — wraps in a role/expert persona
All 5 variants can be tested immediately within the app.

### 3.4 Prompt Scoring Dashboard
Every tested prompt receives a score across multiple dimensions.
* **Clarity:** Is the instruction unambiguous?
* **Specificity:** Are constraints and context detailed enough?
* **Constraint Quality:** Are the rules well-defined and enforceable?
* **Output Predictability:** Will this prompt produce consistent outputs?
* **Custom Rubrics:** Users can define their own scoring rules (e.g., "Must be in a pirate tone").
* **Deterministic Checks:** Validates structure (e.g., "Is it valid JSON?", "Under 500 chars?").
Scores are visualized as a radar chart for instant visual diagnosis.

### 3.5 Bulk Testing (Dataset Evals)
Testing against one input is risky. PromptLens allows users to upload a simple JSON/CSV of 5-10 test cases to run the prompt against multiple edge cases simultaneously, ensuring the prompt is robust.

### 3.6 Export: Prompt Cards & Code Snippets
Every tested prompt can be exported as:
* A **Prompt Card** (structured JSON or Markdown) containing the prompt text, scores, model used, and best output. 
* Ready-to-use **Code Snippets** (Python `openai`, JS, or LangChain templates) for immediate integration into the user's codebase.
Prompt Cards can be contributed back to the PromptLens open-source repository via pull request.

## 4. Tech Stack
* **Frontend:** React + Tailwind CSS (using `react-diff-viewer` for visual diffs)
* **Backend:** FastAPI (Python)
* **Database:** SQLite / Supabase (Added to track Prompt History and save datasets)
* **AI API:** Groq API (Cloud) & Ollama (Local-first privacy execution)
* **Visualization:** Recharts (radar chart)
* **Export:** JSON, Markdown, Python/JS Code Snippets
* **Hosting:** Vercel (frontend) + Render (backend)
* **Version Control:** GitHub (open source)

## 5. Project Structure
```text
promptlens/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PromptDiff.jsx
│   │   │   ├── PromptAutopsy.jsx
│   │   │   ├── MutationEngine.jsx
│   │   │   ├── ScoreDashboard.jsx
│   │   │   └── ExportPanel.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── main.py
│   ├── database/          ← (New) SQLite/Supabase models & schemas
│   ├── routes/
│   │   ├── diff.py
│   │   ├── autopsy.py
│   │   ├── mutate.py
│   │   ├── score.py
│   │   └── dataset.py     ← (New) Bulk testing routes
│   └── requirements.txt
├── prompt-cards/          ← community contributions go here
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

## 6. 5-Day Build Plan
* **Day 1:** Project setup, GitHub repo, FastAPI boilerplate, DB setup, React skeleton, API integration.
* **Day 2:** Prompt Diff feature (UI + backend) + Cost/Latency Tracking + Visual Diffing.
* **Day 3:** Prompt Autopsy (w/ Security Linter) + Mutation Engine.
* **Day 4:** Scoring Dashboard (w/ Custom Rubrics) + Bulk Testing UI.
* **Day 5:** Prompt Card & Code Export, README, CONTRIBUTING.md, polish, final testing, PR submission.

## 7. Open Source Contribution Model
PromptLens is designed to be community-driven from day one:
* Contributors can submit Prompt Cards via pull requests to the `/prompt-cards` folder.
* Issues will be pre-seeded with beginner-friendly tags for first-time contributors.
* `CONTRIBUTING.md` will include a clear guide for adding new mutation strategies or scoring dimensions.
* The project submission itself is via PR to the hackathon’s official submissions repository.

## 8. Why PromptLens Stands Out
* **Niche but real problem** — every developer using LLMs faces this, but no open-source tool solves it.
* **Local-First Privacy** — enterprise developers can run models locally via Ollama to keep their data secure.
* **Built by a prompt engineer** — the author brings domain expertise, not just technical skill.
* **Community-first design** — Prompt Cards make contribution natural and low-friction.
* **Extensible** — new scoring dimensions, mutation strategies, and model integrations can be added via PRs.

## 9. Future Roadmap (Post-Hackathon)
* **VS Code Extension** — test prompts directly from the editor.
* **CLI Tool** — `promptlens run prompt.txt` for terminal-based testing.
* **Prompt History & Lineage** — git-like version control for prompts across sessions.
* **Team Workspaces** — share prompt libraries across a team.
* **SaaS Version** — hosted version with advanced usage analytics.

---
*PromptLens — Because your prompts deserve proper tooling.*
