# RAG vs LLM Wiki vs Agentic Search

> Sources: Pasquale Pillitteri, 2026-04-28; Simone Rizzo, 2026-04-30; Andrej Karpathy, 2026-04-18
> Raw: [RAG, LLM wiki, Agentic Search](../../raw/AI/RAG, LLM wiki, Agentic Search.md); [Generazioni di memoria degli LLM](../../raw/AI/Generazioni di memoria degli LLM.md); [LLM Wiki](../../raw/AI/LLM Wiki.md)

## Overview

The three generations of LLM external memory are not strict replacements — they sit on a spectrum of **how much work is done up front vs. at query time**, and they make different cost/latency/freshness trade-offs. This article compares them side by side to support architecture decisions.

## Comparison Matrix

| Dimension | RAG | Agentic File Search | LLM Wiki |
|-----------|-----|---------------------|----------|
| When (generation) | 2022 | 2024 | 2026 |
| Core idea | Pre-index → retrieve K chunks | Agent navigates files on demand | Compile knowledge into a persistent artifact |
| Up-front work | High (embedding pipeline, vector DB) | None | High (per ingest: compile + cascade) |
| Per-query cost | Low (one retrieval + one generation) | Medium-high (many tool calls) | Low (read a few compiled pages) |
| Latency | Low | High (tool-call round trips) | Low |
| Update cost | Re-embed affected chunks; reindex | Free (edit the file) | Medium (compile + cascade) |
| Cross-doc reasoning | Weak (chunks are isolated) | Strong (reference following) | Strong (interlinked pages, lint) |
| Best corpus size | Very large, static | Medium, heterogeneous, structured | Bounded (~hundreds to low thousands of pages) |
| Infra footprint | Vector DB + embedding model | None beyond file I/O | None beyond file I/O |
| Transparency | Opaque similarity scores | Every read is a visible tool call | Audit trail via `log.md` + git |

## Cost Profile

The three approaches push cost to different stages.

- **RAG** amortizes work across queries. The embedding pipeline is a sunk cost; each query then pays one retrieval + one generation. Cheapest per query at large scale.
- **Agentic File Search** pays per query. Token cost scales with the number of files previewed plus the full text of files opened. Acceptable on tens-to-hundreds of docs, painful on tens of thousands.
- **LLM Wiki** pays per ingest. Compilation and cascade updates are expensive, but reads are cheap because the agent retrieves a small number of pre-distilled pages.

For a 5,000-document support corpus that handles 10,000 queries/day, RAG wins by orders of magnitude. For a 200-page personal research base read by one user a few times a day, the wiki wins because the marginal read is essentially free and the compilation cost amortizes over the human user's attention.

## Latency Profile

- **RAG**: one vector lookup (single-digit ms) + one LLM call. Lowest end-to-end latency.
- **Agentic File Search**: N parallel previews + M sequential full reads + final generation. Often several seconds even when each step is fast.
- **LLM Wiki**: index lookup + 1–3 article reads + one LLM call. Comparable to RAG once the wiki exists.

## Freshness Profile

- **RAG**: stale until reindexed. Update lag is the embedding pipeline's cadence.
- **Agentic File Search**: real-time. The next query reads the current file.
- **LLM Wiki**: stale between ingests. Update lag is whatever cadence the agent runs ingest + cascade.

## Cross-Document Reasoning

This is where the wiki and agentic search beat RAG decisively. Both preserve relationships across documents:

- Agentic search follows explicit references at query time.
- The wiki bakes those relationships into interlinked pages during compilation, then exposes them as backlinks the next query can traverse for free.

RAG can approximate this with knowledge-graph indexes or [Advanced RAG](../rag/rag-paradigms.md) tricks, but it is still fighting the fundamental loss of context that chunking introduces.

## Decision Heuristic

A rough rule of thumb:

1. **Corpus > ~10,000 documents and mostly static?** → RAG.
2. **Corpus ≤ a few hundred documents, well-structured, updated often?** → Agentic File Search.
3. **Corpus is bounded, concept-rich, and you want it to compound over time?** → LLM Wiki.
4. **Hybrid** is normal: use a wiki for the curated knowledge graph and RAG to fall back on the unfiltered raw corpus when the wiki misses.

## See Also

- [LLM External Memory Generations](llm-external-memory-generations.md)
- [LLM Wiki Pattern](llm-wiki-pattern.md)
- [Agentic File Search](agentic-file-search.md)
- [RAG Paradigms](../rag/rag-paradigms.md)
