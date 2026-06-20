# LLM External Memory Generations

> Sources: Simone Rizzo, 2026-04-30; Andrej Karpathy, 2026-04-18; Pasquale Pillitteri, 2026-04-28
> Raw: [Generazioni di memoria degli LLM](../../raw/AI/Generazioni di memoria degli LLM.md); [LLM Wiki](../../raw/AI/LLM Wiki.md); [LLM Wiki Workshop Simone Rizzo](../../raw/AI/LLM Wiki Workshop Simone Rizzo.md)

## Overview

LLMs are stateless: every query begins from a blank slate. To make an agent operate over a private corpus (documents, conversations, decisions), the agent needs an external memory. Three generations of external memory have emerged: **RAG** (2022, passive retrieval), **Agentic File Search** (2024, dynamic exploration), and **LLM Wiki** (2026, cumulative synthesis). They are not strictly mutually exclusive — modern production systems often combine them.

## Where LLM Memory Lives

A model can carry knowledge in three places:

1. **In the weights** — embedded via training or fine-tuning. Static, low latency, no citations, expensive to update.
2. **In the context window** — pasted into the prompt at every call. Transparent, short-term, capped by context length, billed per token.
3. **In external memory** — files or databases retrieved on demand. The focus of this article.

## The Three Generations

| Aspect | RAG (2022) | Agentic File Search (2024) | LLM Wiki (2026) |
|--------|-----------|---------------------------|-----------------|
| Concept | Passive retrieval | Dynamic exploration | Cumulative synthesis |
| Mechanism | Precomputed embeddings; semantic similarity | Agent navigates files like a human; scans, reasons, follows references | Knowledge compiled into a persistent artifact that grows over time |
| Best fit | Large corpora, repetitive lookups | Mixed/unstructured docs, moderate scale | Bounded knowledge bases (~hundreds to low-thousands of pages) |

### Generation 1 — RAG

Documents are split into chunks, each chunk is converted to a vector via an embedding model, and stored in a vector database. At query time the user's question is embedded and the K nearest chunks are retrieved and fed back to the LLM as context. See [RAG Paradigms](../rag/rag-paradigms.md) for the full breakdown.

Known limitations:
- **Chunks lose context.** Splitting a document destroys relationships between sections.
- **Invisible cross-references.** Phrases like "as discussed in Chapter 4" carry no embedding signal.
- **Similarity ≠ relevance.** Semantic matching finds chunks that *look like* the question, not necessarily those that *answer* it.
- **No accumulation.** Each query is independent; the system never learns from prior questions.

### Generation 2 — Agentic File Search

No precomputed embeddings. The agent treats a directory tree of markdown/text files as part of its reasoning. See [Agentic File Search](agentic-file-search.md) for the operating model.

Three phases:
1. **Parallel preview.** Scan headers, summaries, first lines of every doc in a folder.
2. **Selective extraction.** Read full text only of docs judged relevant.
3. **Reference following.** If a relevant doc points to one skipped earlier, the agent backtracks.

Tools-based; markdown is the preferred format.

### Generation 3 — LLM Wiki

Knowledge is **compiled once** and then maintained — not re-derived per query. See [LLM Wiki Pattern](llm-wiki-pattern.md) for full architecture.

Three-layer structure:
- **Raw sources.** Immutable documents (PDF, CSV, TXT, MD, images).
- **The Wiki.** LLM-generated, interlinked markdown pages with concepts, entities, summaries, plus an index and an append-only log.
- **The Schema.** A `CLAUDE.md` / `AGENTS.md` / `SKILL.md` defining conventions and workflows.

A **lint** operation keeps the wiki healthy by fixing broken links, flagging contradictions, surfacing orphan pages, and reporting outdated claims.

## When Each Wins

- **RAG wins** for huge, relatively static corpora with predictable lookups (support knowledge bases, policy lookup, contract archives).
- **Agentic File Search wins** for medium-scale heterogeneous content where structure matters more than scale.
- **LLM Wiki wins** for bounded, concept-rich domains (personal research, study notes, second brains, product manuals — see this very repo).

For a deeper cost/latency comparison, see [RAG vs LLM Wiki vs Agentic Search](rag-vs-llm-wiki-vs-agentic-search.md).

## See Also

- [RAG Paradigms](../rag/rag-paradigms.md)
- [LLM Wiki Pattern](llm-wiki-pattern.md)
- [Agentic File Search](agentic-file-search.md)
- [RAG vs LLM Wiki vs Agentic Search](rag-vs-llm-wiki-vs-agentic-search.md)
