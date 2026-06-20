# LLM Wiki Pattern

> Sources: Andrej Karpathy, 2026-04-18; Simone Rizzo, 2026-04-30
> Raw: [LLM Wiki](../../raw/AI/LLM Wiki.md); [LLM Wiki Workshop Simone Rizzo](../../raw/AI/LLM Wiki Workshop Simone Rizzo.md)

## Overview

The LLM Wiki pattern treats a knowledge base as a **persistent, compounding artifact** that an LLM agent writes and maintains while the human reads and asks questions. Instead of retrieving fragments per query (RAG) or exploring files on the fly (agentic file search), the agent **compiles** raw sources into an interlinked corpus of markdown pages once, then keeps the corpus fresh through targeted updates and lints. Karpathy summarizes it as: *"The LLM writes and maintains the wiki; the human reads and asks questions."*

## Three-Layer Architecture

The pattern requires three distinct layers under a single project root.

### 1. Raw Sources (`raw/`)

Immutable inputs. PDFs, CSVs, TXT, MD, transcripts, screenshots, scraped articles. The agent reads them, never modifies them. Organized by topic subdirectory (`raw/<topic>/<file>`). Each file carries metadata: source URL, collected date, published date.

### 2. The Wiki (`wiki/`)

LLM-generated derived knowledge. The agent owns this layer end to end. Structure:

- `wiki/<topic>/<article>.md` — one level of nesting, no deeper.
- `wiki/index.md` — global catalog. One row per article grouped by topic, with link + one-line summary + Updated date.
- `wiki/log.md` — append-only operation log (ingest, query archives, lint runs).

Articles cross-link via relative markdown paths. Concepts, entities, and recurring terms get their own pages so they can be linked from many directions — the same hyperlinked structure Obsidian users already know.

### 3. The Schema (`SKILL.md` / `CLAUDE.md` / `AGENTS.md`)

The rules of the game: file naming, folder layout, ingest workflow, lint policy, conflict-handling conventions. Without the schema layer the agent drifts and the wiki decays into noise.

## Core Operations

### Ingest

The agent fetches a source, saves it under `raw/<topic>/YYYY-MM-DD-slug.md` with metadata, then **compiles** it into the wiki. Compilation is a routing decision:

- Same core thesis as an existing article → merge, add the source, refresh affected sections.
- New concept → create a new article in the most relevant topic directory.
- Spans multiple topics → place in the closest topic, add See Also links to neighbors.

After the primary write, the agent **cascades** updates: scans related articles in the same topic and the global index for ripple effects, and refreshes any article whose claims are now stale. Finally it updates `index.md` and appends to `log.md`.

### Query

Reads `index.md` to locate relevant articles, reads them, synthesizes an answer citing wiki pages by markdown link. Output goes to the conversation; nothing is written to disk unless the user asks to **archive** the answer — in which case it becomes a new wiki page tagged `[Archived]` in the index.

### Lint

Quality control. Two tiers:

- **Deterministic** checks (auto-fixed): orphan files missing from the index, broken internal links, broken Raw references, obvious See Also gaps within a topic.
- **Heuristic** checks (report only): factual contradictions across articles, outdated claims, missing conflict annotations, orphan pages with no inbound links, concepts that appear repeatedly but lack a dedicated page.

Lint is the maintenance pressure-valve that keeps a compounding artifact from rotting.

## Why the Wiki Compounds

Each ingest builds on the previous output, not the raw corpus alone. The agent reads its own past synthesis when compiling the next source, so:

- New facts get cross-referenced into the existing graph automatically.
- Contradictions surface as annotated disagreements rather than silently overwriting.
- The marginal cost of adding a source drops over time because the conceptual scaffolding is already there.

The result is a **second brain** the user can navigate the same way they navigate Obsidian — backlinks, atomic notes, dataview-style indexes — but built and maintained by the LLM rather than by hand.

## Tooling Around the Pattern

The workshop notes highlight a few adjacent tools that compose well with the wiki:

- **Obsidian** for human-side reading, backlinking, and graph view over `wiki/`.
- **Marp** to render wiki pages as slide decks for teaching or review.
- **Dataview** queries over frontmatter for live tables of contents.
- **Quarto (`.qmd`)** for executable documents when a wiki page needs runnable code.

The wiki itself stays plain markdown; these tools layer on top without touching the contract.

## Boundaries

The pattern works best for **bounded, concept-rich** domains — personal research notes, study material, product manuals, second brains — where the total surface fits in the low thousands of pages. For truly large, fast-moving corpora (customer support archives, enterprise document lakes), classical [RAG](../rag/rag-paradigms.md) still wins on cost and latency. See [RAG vs LLM Wiki vs Agentic Search](rag-vs-llm-wiki-vs-agentic-search.md) for the comparison.

## See Also

- [LLM External Memory Generations](llm-external-memory-generations.md)
- [Agentic File Search](agentic-file-search.md)
- [RAG vs LLM Wiki vs Agentic Search](rag-vs-llm-wiki-vs-agentic-search.md)
