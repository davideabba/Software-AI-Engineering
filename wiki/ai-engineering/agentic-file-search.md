# Agentic File Search

> Sources: Simone Rizzo, 2026-04-30; Pasquale Pillitteri, 2026-04-28
> Raw: [Generazioni di memoria degli LLM](../../raw/AI/Generazioni di memoria degli LLM.md); [RAG, LLM wiki, Agentic Search](../../raw/AI/RAG, LLM wiki, Agentic Search.md)

## Overview

Agentic File Search is the second generation of LLM external memory (2024). It abandons precomputed embeddings and instead lets the agent **navigate a directory tree of markdown/text files like a human would** — scanning previews, opening only what looks promising, and following references. The mechanism trades vector-DB infrastructure for tool calls and reasoning, which fits medium-scale heterogeneous content where document structure carries more meaning than raw scale.

## Operating Model

The agent works against a plain directory of markdown (or text) files. No chunking, no embeddings, no similarity scores. Three phases run per query:

### 1. Parallel Preview

The agent issues a batch of lightweight reads against every document in the candidate folder — typically the file header, top-level summary, and first lines. This is cheap because each preview is small, and it can be parallelized across files.

### 2. Selective Extraction

Based on the previews, the agent decides which documents look genuinely relevant and reads them in full. Documents that the preview ruled out are not paid for. This is the inverse of RAG's top-K retrieval: instead of pulling K chunks and trusting the similarity score, the agent reads the whole document for the ones it judges worth reading.

### 3. Reference Following

If an opened document references another that the preview phase skipped (e.g., "see notes from the March kickoff"), the agent backtracks and pulls that file too. This recovers the cross-document links that pure vector search loses when chunks are isolated.

## Why Markdown

The format is not incidental. Markdown gives the agent:

- **Headers** that double as structural previews.
- **Inline links** that act as a manual call graph between documents.
- **Front matter / metadata blocks** the agent can parse without an embedding model.

Plain text works too, but it loses the structural signals that make the preview phase efficient.

## Strengths

- **No infrastructure.** No vector database, no embedding pipeline, no re-indexing on update.
- **Updates are free.** Edit the file; the next query sees the new content.
- **Structure-aware.** The agent reasons over the same hierarchy the author wrote — sections, headings, link graph — instead of a flat embedding space.
- **Transparent.** Every read is a tool call you can audit. There is no opaque similarity score deciding what gets seen.

## Weaknesses

- **Cost grows with corpus size.** Preview every file in a 10,000-document folder and the token bill is large even though each preview is small.
- **Latency.** Each query pays for tool-call round trips that RAG amortizes into a single retrieval step.
- **Quality depends on document structure.** Sloppy headers and missing summaries cripple the preview phase.

## When To Reach For It

Best fit when the corpus is **medium-scale, heterogeneous, and well-structured** — engineering wikis, design docs, meeting notes — and updates are frequent enough that maintaining a vector index would be painful. For very large or very static corpora, [RAG](../rag/rag-paradigms.md) still dominates on cost; for compounding personal knowledge bases, the [LLM Wiki Pattern](llm-wiki-pattern.md) is a better fit because it adds a compilation step on top of the same file substrate.

## See Also

- [LLM External Memory Generations](llm-external-memory-generations.md)
- [LLM Wiki Pattern](llm-wiki-pattern.md)
- [RAG vs LLM Wiki vs Agentic Search](rag-vs-llm-wiki-vs-agentic-search.md)
