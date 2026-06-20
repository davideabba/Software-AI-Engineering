# RAG Retrieval Optimization

> Sources: Davide Abba, 2025
> Raw: [RAG](../../raw/AI/Master's Thesis/Notes/RAG.md)

## Overview

Retrieval quality is the dominant lever for RAG output quality: a great LLM cannot rescue a bad retrieval, but a great retrieval often makes a mediocre LLM look excellent. This article gathers the techniques applied at the **indexing**, **query**, and **routing** stages to maximize the chance that the chunks reaching the LLM actually answer the question.

## Indexing Stage

### Chunking

How the corpus is split into retrievable units. Common strategies:

- **Fixed-size.** Cut every N tokens. Simple, fast, ignores semantic boundaries.
- **Recursive.** Try paragraph splits, fall back to sentence, then to fixed-size. Standard default for prose.
- **Sliding window.** Overlapping chunks so a fact straddling a boundary is captured in at least one window.
- **Small2Big.** Embed small chunks for retrieval, but pass the larger surrounding section to the LLM. Captures local precision and global context simultaneously.

Chunk size is a precision/recall knob. Smaller chunks raise retrieval precision but starve the LLM of context; larger chunks do the opposite.

### Metadata Attachments

Each chunk carries metadata — source, section, author, date, doc type — that can be used for:

- **Pre-filtering.** Drop chunks whose metadata disqualifies them before the vector search.
- **Post-filtering.** Reorder or remove retrieved chunks based on metadata after the search.
- **Hybrid scoring.** Combine vector similarity with structured filters (BM25, recency boost).

### Index Topology

- **Flat.** One vector per chunk in one index. Default.
- **Hierarchical.** Index summaries at the top, full chunks at the bottom. Retrieve top-down.
- **Knowledge graph.** Entities and relations sit alongside vectors; retrieval can walk edges.
- **[IVFFlat](ivfflat-vector-indexes.md).** Inverted-file partitioning over flat vectors. PgVector's workhorse.

## Query Stage

### Query Expansion

Generate multiple candidate queries from the user input and retrieve against all of them:

- **Multi-Query.** Ask the LLM to paraphrase the question N times; union the retrieval results.
- **Sub-Query.** Decompose a compound question into atomic sub-questions; retrieve per sub-question.
- **Chain-of-Verification (CoVe).** Ask the LLM to verify the question, generate verification sub-queries, retrieve for each, then answer.

### Query Transformation

Rewrite the query into a different surface form that retrieves better:

- **Rewriting.** Strip filler, expand acronyms, normalize.
- **HyDE (Hypothetical Document Embeddings).** Have the LLM draft a hypothetical answer; embed that answer and retrieve against it. Often closer in vector space to the true source than the question itself.
- **Step-Back.** Generalize the question one level up before retrieving. E.g., "What is the boiling point of water at 2,000 m?" → "How does altitude affect boiling point?"

### Query Routing

When multiple indexes or tools exist, the router decides where the query goes:

- **Index selection.** Choose between a docs index, a code index, a tickets index.
- **Strategy selection.** Choose between vector retrieval, keyword search, or direct SQL.
- **Tool selection.** Decide whether the question even needs retrieval, or can be answered from the LLM's parametric knowledge.

## Post-Retrieval Stage

### Re-ranking

Cross-encoders (e.g. `bge-reranker`) or LLMs reorder the K retrieved chunks by genuine relevance to the query. Vector similarity is a weak proxy; a re-ranker fixes most of the slop.

### Context Compression

Long retrieved passages are filtered or summarized to fit the LLM's window without dropping signal. Strategies include LLM-based summarization, sentence-level relevance filtering, and key-fact extraction.

### Order Effects

LLMs attend more strongly to the start and end of the prompt ("lost in the middle"). Place the highest-ranked chunk at the start or end, not in the middle of the retrieved block.

## Augmentation Loops

For complex questions, a single retrieve-then-generate pass is not enough.

- **Iterative.** Retrieve, generate a partial answer, use the partial answer as a new query, retrieve again. Repeat until convergence. ITER-RETGEN is the canonical name.
- **Recursive.** Each retrieved chunk spawns its own sub-query, building a tree of retrievals.
- **Adaptive.** The model decides per step whether more retrieval is needed. Self-RAG, Flare, and Graph-Toolformer implement this differently — Self-RAG via reflection tokens, Flare via probability gates on generated tokens, Graph-Toolformer via tool-call planning over a knowledge graph.

## Practical Checklist

When a RAG system underperforms, walk down this list:

1. Inspect actual retrieved chunks for failing queries. The bug is almost always here.
2. Tune chunk size and overlap before anything else.
3. Add a re-ranker. Cheap, usually 5–10 points of precision.
4. Add HyDE or Multi-Query if the query/document surface forms differ a lot.
5. Add metadata filters when the corpus has obvious facets (date, source, doc type).
6. Only then consider knowledge graphs, iterative loops, or adaptive retrieval.

## See Also

- [RAG Paradigms](rag-paradigms.md)
- [RAG Evaluation](rag-evaluation.md)
- [IVFFlat Vector Indexes](ivfflat-vector-indexes.md)
- [Two-Level RAG Customer Support Assistant](two-level-rag-assistant.md)
