<p align="center">
  <img src="https://img.shields.io/badge/PromptLens-v1.1-white?style=for-the-badge&logo=flask&logoColor=black" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Built%20With-FastAPI%20%2B%20React-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-Groq%20%2F%20LLaMA%203-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Open%20Source-Hackathon%202026-purple?style=for-the-badge" />
</p>

<h1 align="center">🔬 PromptLens</h1>
<h3 align="center">The Prompt Engineering Workbench for Developers</h3>

<p align="center">
  <i>Prompts are code. They deserve proper tooling.</i>
</p>

---

## 🚀 What Is PromptLens?

**PromptLens** is an open-source, self-hostable AI prompt engineering workbench that helps developers, AI engineers, and prompt engineers **write, test, debug, and optimize their prompts** — the same way they use unit tests and linters for code.

Right now, most developers iterate on prompts by guessing and copy-pasting outputs. There's no structured way to compare prompt variants, diagnose weaknesses, score quality, or track costs. **PromptLens fills that gap.**

---

## ✨ Features

| Module | What It Does |
|---|---|
| 🔬 **Prompt Diff & Compare** | Run two prompt variants side-by-side. Get a GitHub-style visual diff of outputs with an AI-powered winner analysis including token usage and latency. |
| 🩺 **Prompt Autopsy** | Paste any prompt and deconstruct it into its core components: system instruction, context block, constraints, output format, few-shot examples. Includes a **security & jailbreak linter**. |
| 🧬 **Mutation Engine** | Input one base prompt and generate 3 intelligent variants: More Specific, Chain-of-Thought, and Compressed. Ready to test immediately. |
| 📊 **Scoring Dashboard** | Score any prompt across 4 dimensions: **Clarity, Context, Safety, and Efficiency**. Visualized as a radar chart powered by Recharts + Groq. |
| 📦 **Export & Prompt Cards** | Export any tested prompt as a structured JSON **Prompt Card** or as a ready-to-paste **Python / JS code snippet**. |

---

## 🎬 Demo

> Run the app locally (instructions below) and test with this prompt:
>
> **Bad prompt (low scores):** `Write a python script that connects to a database and gets the users.`
>
> **Good prompt (high scores):** `Write a Python script that connects to a SQLite database named 'users.db'. Query all records from the 'users' table where 'is_active' = 1 and print their email addresses. Use ONLY the built-in sqlite3 library. Wrap execution in try/except to handle sqlite3.Error gracefully.`

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS v4
- **Backend:** FastAPI (Python 3.10+)
- **Database:** SQLite (via SQLAlchemy ORM)
- **AI Engine:** [Groq API](https://console.groq.com) (LLaMA 3.1 8B Instant)
- **Visualization:** Recharts (Radar Chart)
- **Diff Rendering:** react-diff-viewer

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.10+
- A free **Groq API key** from [console.groq.com](https://console.groq.com)

### 1. Clone the Repository

```bash
git clone https://github.com/Naitik-Baliyan/PromptLens.git
cd PromptLens
```

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up your environment variables
cp .env.example .env
# Open .env and add your GROQ_API_KEY

# Start the backend server
uvicorn main:app --reload
```

The API will be running at **`http://localhost:8000`**. Visit `http://localhost:8000/docs` for the interactive Swagger UI.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be running at **`http://localhost:5173`** 🚀

---

## 📁 Project Structure

```
PromptLens/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PromptDiff.jsx        # Side-by-side diff tool
│   │   │   ├── PromptAutopsy.jsx     # Prompt deconstructor + security linter
│   │   │   ├── MutationEngine.jsx    # Prompt variant generator
│   │   │   ├── ScoreDashboard.jsx    # AI-powered scoring + radar chart
│   │   │   └── ExportPanel.jsx       # Prompt Card & code snippet export
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── backend/
│   ├── main.py                        # FastAPI app entry point
│   ├── routes/
│   │   ├── diff.py                    # /diff/compare endpoint
│   │   ├── autopsy.py                 # /autopsy/analyze endpoint
│   │   ├── mutate.py                  # /mutate/generate endpoint
│   │   ├── score.py                   # /score/evaluate endpoint
│   │   └── dataset.py                 # /dataset endpoints (bulk testing)
│   ├── database/
│   │   ├── database.py                # SQLAlchemy engine + session
│   │   └── models.py                  # ORM models (PromptRun, PromptScore)
│   ├── .env.example                   # ← Copy this to .env
│   └── requirements.txt
├── prompt-cards/                      # Community-contributed Prompt Cards
│   └── example-sqlite-query.json
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── LICENSE                            # MIT
```

---

## 🌐 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/diff/compare` | Compare two prompts, get diff + winner |
| `POST` | `/autopsy/analyze` | Deconstruct & lint a prompt |
| `POST` | `/mutate/generate` | Generate 3 prompt mutations |
| `POST` | `/score/evaluate` | Score a prompt on 4 dimensions |

Full interactive docs available at `http://localhost:8000/docs` when the backend is running.

---

## 🤝 Contributing

We'd love your contributions! Whether it's:

- 🐛 Reporting a bug
- 💡 Proposing a new feature or scoring dimension
- 🃏 Submitting a **Prompt Card** to the community library
- 📝 Improving the docs

Please read **[CONTRIBUTING.md](./CONTRIBUTING.md)** to get started. All skill levels welcome — we have beginner-friendly issues tagged `good first issue`.

---

## 🗺️ Roadmap (Post-Hackathon)

- [ ] **VS Code Extension** — test prompts directly from the editor
- [ ] **CLI Tool** — `promptlens run prompt.txt` for terminal-based testing
- [ ] **Prompt History & Lineage** — git-like version control for prompts
- [ ] **Ollama Integration** — fully local, privacy-first model execution
- [ ] **Team Workspaces** — share prompt libraries across a team
- [ ] **Bulk Dataset Testing** — test one prompt against 10+ input cases at once

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Naitik-Baliyan">Naitik Baliyan</a> for the Open Source Hackathon 2026
  <br/>
  <i>PromptLens — Because your prompts deserve proper tooling.</i>
</p>
