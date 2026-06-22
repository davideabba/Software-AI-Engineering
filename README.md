# Software AI Engineering — Second Brain

A personal knowledge base covering **Software Engineering** and **Software AI Engineering**, built with the [LLM Wiki pattern](wiki/ai-engineering/llm-wiki-pattern.md). The repo is designed to compound over time: new source material gets ingested, distilled, and woven into an interlinked wiki that grows with every study session.

## How It Works

The repo has two layers:

### `raw/` — Source Material

Immutable inputs. Notes, transcripts, slides, scripts, PDFs, and notebooks organized by topic:

| Directory | Content |
|-----------|---------|
| `raw/AI/` | LLM theory, RAG, containerization, deployment, LangChain, master's thesis |
| `raw/Big Data Analysis/` | Notebooks and exercises |
| `raw/Frontend/` | Library notes (HTMX, …) |
| `raw/Graph Analysis/` | Graph theory and algorithms |
| `raw/Python theory and exercise/` | Python fundamentals and exercises |

Sources are never modified. They are the ground truth for every wiki article.

### `wiki/` — Compiled Knowledge

LLM-generated English articles distilled from the raw sources. Organized in one level of topic subdirectories, cross-linked via relative markdown paths — navigable in any markdown reader or Obsidian.

| Topic | Articles |
|-------|---------|
| [`ai-engineering/`](wiki/ai-engineering/) | LLM memory generations, LLM Wiki pattern, RAG vs Agentic Search, prompting, quantization, LangChain |
| [`rag/`](wiki/rag/) | RAG paradigms, retrieval optimization, evaluation, IVFFlat indexes, thesis case study |
| [`containerization/`](wiki/containerization/) | Docker fundamentals, Dockerfile, Java image optimization, Compose orchestration |
| [`mlops/`](wiki/mlops/) | AI SaaS production architecture, simple deployment patterns |
| [`frontend/`](wiki/frontend/) | HTMX |
| [`software-engineering/`](wiki/software-engineering/) | *(growing)* |

Two special files keep the wiki navigable:

- [`wiki/index.md`](wiki/index.md) — global catalog: one row per article with a one-line summary.
- [`wiki/log.md`](wiki/log.md) — append-only operation log (ingest, lint, archived queries).

## Workflow

The wiki is maintained by a Claude Code agent running the **Karpathy LLM Wiki** skill (`.agents/skills/karpathy-llm-wiki/`). Three operations:

- **Ingest** — add a raw source, compile it into wiki articles, cascade-update related pages.
- **Query** — search and synthesize answers from wiki content; optionally archive the answer as a new page.
- **Lint** — fix broken links, patch missing index entries, report contradictions and orphan pages.

To add new material, drop it in the appropriate `raw/<topic>/` directory and run an ingest.

