# Two-Level RAG Customer Support Assistant

> Sources: Davide Abba, 2025
> Raw: [Davide Abba's thesis](../../raw/AI/Master's Thesis/Davide Abba's thesis.md)

## Overview

This article summarizes a master's thesis project that designed and evaluated a customer-support assistant built on a **two-level RAG** retrieval scheme. The system runs on local infrastructure (llama-cpp / Ollama for LLMs, PgVector for the index, Docker for packaging) and was validated against a 100-question evaluation dataset drawn from the support corpus.

## Problem

Customer-support documents are long, structured, and uneven in granularity. A single naive RAG pass — chunk the docs, embed, retrieve top-K — performs poorly because:

- Page-level chunks are too coarse: they retrieve the right document but bury the relevant paragraph.
- Section-level chunks are too fine: they retrieve the right paragraph but miss the surrounding context that disambiguates it.

The thesis project addresses this with a two-stage retrieval.

## Two-Level Retrieval

The corpus is indexed at two granularities simultaneously:

1. **Page-level index.** One embedding per page (or other coarse unit). Captures topical relevance.
2. **Section-level index.** One embedding per paragraph or sub-section. Captures fine-grained answer location.

At query time:

1. Retrieve the top-K **pages** for the query.
2. Within those pages, retrieve the top-M **sections**.
3. Pass the selected sections — plus optional page-level context — to the generator.

This is a Small2Big-style pattern (see [RAG Retrieval Optimization](rag-retrieval-optimization.md)) applied as an explicit two-stage filter rather than a single index trick. The coarse stage acts as a precision filter; the fine stage acts as a relevance ranker within the precision-filtered subset.

## Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Embeddings | sentence-transformers | Same model for both indexes to keep the vector space consistent |
| Vector index | PgVector with [IVFFlat](ivfflat-vector-indexes.md) | `lists = 21` for ~440 chunks |
| LLM runtime | llama-cpp / Ollama | Local inference; quantized models (see [LLM Quantization Schemes](../ai-engineering/llm-quantization-schemes.md)) |
| Orchestration | [LangChain](../ai-engineering/langchain-ecosystem.md) | Chains for the two-stage retriever and the generation step |
| Packaging | Docker | Single-compose deployment of LLM + Postgres + app |

The local-stack choice was deliberate: the customer-support data could not leave the organization's infrastructure, so a hosted LLM API was off the table.

## Evaluation

A held-out dataset of **100 questions** with reference answers was used to compare:

- Single-level page retrieval
- Single-level section retrieval
- Two-level retrieval (the proposed system)

Metrics covered both retrieval (Hit Rate, MRR) and generation quality (manual scoring against the qualitative aspects in [RAG Evaluation](rag-evaluation.md), plus ROUGE for lexical overlap with reference answers). Two-level retrieval outperformed both single-level baselines on faithfulness and answer relevance, with the largest improvement on questions whose answers spanned multiple paragraphs within a single page.

## Lessons

- **Granularity is bimodal, not a single knob.** Most chunk-size debates pretend granularity is a single hyperparameter; in practice two coupled granularities work better than one carefully chosen middle ground.
- **Local-first is feasible.** Quantized models (Q4_K_M class) running on llama-cpp produced answers good enough for a domain-specific assistant without external API calls.
- **PgVector is enough.** Adding a dedicated vector database would have multiplied the operational footprint without measurable retrieval-quality gain at this corpus size.

## See Also

- [RAG Paradigms](rag-paradigms.md)
- [RAG Retrieval Optimization](rag-retrieval-optimization.md)
- [RAG Evaluation](rag-evaluation.md)
- [IVFFlat Vector Indexes](ivfflat-vector-indexes.md)
- [LLM Quantization Schemes](../ai-engineering/llm-quantization-schemes.md)
- [LangChain Ecosystem](../ai-engineering/langchain-ecosystem.md)
- [AI SaaS Production Architecture](../mlops/ai-saas-production-architecture.md)
