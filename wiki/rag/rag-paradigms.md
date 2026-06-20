# RAG Paradigms

> Sources: Davide Abba, 2025
> Raw: [RAG](../../raw/AI/Master's Thesis/Notes/RAG.md)

## Overview

Retrieval-Augmented Generation (RAG) augments an LLM with an external knowledge base so it can answer queries grounded in private or up-to-date information without retraining. RAG architectures have evolved through three paradigms: **Naive RAG** (the canonical pipeline), **Advanced RAG** (pre/post-retrieval optimizations), and **Modular RAG** (composable patterns built from reusable modules). The progression is one of growing decomposition: each generation pulls more concerns out of the monolithic retrieve-then-generate loop and into pluggable stages.

## Naive RAG

The reference pipeline. Three stages:

1. **Indexing.** Documents are loaded, split into chunks, embedded with a model (e.g. `sentence-transformers/all-MiniLM-L6-v2`), and stored in a vector database.
2. **Retrieval.** The user query is embedded with the same model and the top-K nearest chunks are pulled from the index.
3. **Generation.** The retrieved chunks are concatenated into the prompt and the LLM produces the answer.

Naive RAG is cheap and easy to ship, but its weaknesses are well known: chunks lose context when split, similarity is not the same as relevance, and the system has no way to reason about which retrieved chunks actually help.

## Advanced RAG

Adds **pre-retrieval** and **post-retrieval** stages around the same retrieve-then-generate skeleton.

### Pre-retrieval

Improvements before the vector lookup:

- **Better indexing.** Smarter chunking (recursive, sliding window, Small2Big), metadata attachments, hierarchical or knowledge-graph indexes.
- **Query optimization.** Rewriting, expansion (Multi-Query, Sub-Query, Chain-of-Verification), transformation (HyDE, Step-Back), and routing to the right index.

See [RAG Retrieval Optimization](rag-retrieval-optimization.md) for the full menu.

### Post-retrieval

Improvements after retrieval but before generation:

- **Re-ranking.** A cross-encoder or LLM re-orders the K retrieved chunks so the most relevant ones land at the top of the prompt.
- **Context compression.** Long retrieved passages are summarized or filtered to fit the context window without losing signal.
- **Sliding window over context.** When the retrieved set exceeds the window, slide over it and aggregate partial answers.

## Modular RAG

Treats the pipeline as a composition of **modules** plus reusable **patterns** that orchestrate them.

### Core Modules

| Module | Role |
|--------|------|
| Search | Performs retrieval against one or more indexes |
| Memory | Stores conversation history, user state, prior retrievals |
| Routing | Chooses which index / tool / strategy to use per query |
| Predict | The LLM generation step itself |
| Task Adapter | Adapts the pipeline shape to a specific downstream task |

### Canonical Patterns

- **Rewrite-Retrieve-Read.** Rewrite the query for better retrieval, then retrieve, then read.
- **Generate-Read.** Have the LLM draft a hypothetical answer (or document), retrieve against it, then read. HyDE is a variant.
- **Recite-Read.** Have the LLM recite relevant facts from its parametric memory, then retrieve to verify and augment, then read.

### Augmentation Modes

How retrieval is woven into generation:

- **Iterative (ITER-RETGEN).** Retrieve → generate → retrieve again using the partial generation → generate again. Useful for multi-hop questions.
- **Recursive.** Each retrieved chunk triggers a sub-query, recursively, until the agent has assembled the answer.
- **Adaptive.** The model decides per token or per step whether retrieval is needed. Examples: **Flare**, **Self-RAG**, **Graph-Toolformer**.

## Evolution Summary

Naive RAG asks: *"What chunks look like the query?"*
Advanced RAG asks: *"What chunks actually help the query, and how do I make them fit?"*
Modular RAG asks: *"What pipeline shape does this query deserve?"*

The further right on this spectrum, the more the system looks like a generic agent loop with retrieval as one tool among several.

## See Also

- [RAG Retrieval Optimization](rag-retrieval-optimization.md)
- [RAG Evaluation](rag-evaluation.md)
- [Two-Level RAG Customer Support Assistant](two-level-rag-assistant.md)
- [IVFFlat Vector Indexes](ivfflat-vector-indexes.md)
- [Zero-shot vs Few-shot Prompting](../ai-engineering/zero-shot-vs-few-shot.md)
