# IVFFlat Vector Indexes

> Sources: Davide Abba, 2025
> Raw: [IVFFlat Indexes for query](../../raw/AI/Master's Thesis/Notes/IVFFlat Indexes for query.md)

## Overview

**IVFFlat** is the workhorse index type in PgVector. It combines an **Inverted File** partitioning scheme with **Flat** (uncompressed) vector storage inside each partition. The result is an approximate nearest-neighbor index that trades a small recall hit for a large speedup over exhaustive scan, while staying inside PostgreSQL — no separate vector database required.

## How It Works

Two phases:

1. **Build.** Cluster the dataset into `lists` partitions using k-means. Each vector is assigned to its nearest centroid.
2. **Query.** Find the `probes` partitions whose centroids are closest to the query vector. Scan only those partitions' vectors with exact distance computation; return the top-K.

`lists` is fixed at index build time. `probes` is a query-time knob: more probes = higher recall, slower query.

## Choosing `lists`

The PgVector guidance: for a dataset of N rows, set `lists` to roughly `sqrt(N)` for small datasets (≤ 1M rows) or `N / 1000` for larger ones. In the thesis project the corpus had ~440 chunks, so `lists = 21` (≈ `sqrt(440)`) was chosen.

Wrong `lists` is the single most common IVFFlat bug. Too low and each partition is huge, killing the speedup. Too high and centroids are noisy, killing recall.

## Distance Operators

PgVector exposes three operators that pair with three index variants:

| Operator | Distance | Index option |
|----------|----------|--------------|
| `<->` | L2 (Euclidean) | `vector_l2_ops` |
| `<#>` | Negative inner product | `vector_ip_ops` |
| `<=>` | Cosine | `vector_cosine_ops` |

The index must be built against the operator class you intend to query with — an L2 index does not accelerate cosine queries.

## Build and Query Example

```sql
-- Build
CREATE INDEX ON chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 21);

-- Query (set probes higher for recall, lower for speed)
SET ivfflat.probes = 4;

SELECT id, text
FROM chunks
ORDER BY embedding <=> $1
LIMIT 5;
```

## Trade-offs vs Alternatives

- **IVFFlat vs flat (no index).** Flat scan is exact but O(N) per query. IVFFlat is approximate but typically 10–100× faster on million-row corpora.
- **IVFFlat vs HNSW.** HNSW (also in PgVector) gives better recall/latency curves but higher build cost and memory footprint. For static corpora HNSW often wins; for write-heavy corpora IVFFlat rebuilds faster.
- **IVFFlat vs dedicated vector DBs.** Pinecone, Weaviate, Milvus, Qdrant offer richer features (filtering, hybrid search, distributed shards) but add an operational dependency. Staying in Postgres is a real win when the rest of the stack is already SQL.

## Operational Notes

- The index must be rebuilt after large bulk inserts; new vectors initially go to whichever partition their nearest centroid lives in, but the centroids themselves don't shift.
- `lists` and `probes` are independent tuning knobs. Benchmark on real query patterns, not on synthetic vectors.
- `EXPLAIN ANALYZE` confirms whether the planner is actually using the index; cosine queries on an L2 index silently fall back to a sequential scan.

## See Also

- [RAG Paradigms](rag-paradigms.md)
- [RAG Retrieval Optimization](rag-retrieval-optimization.md)
- [Two-Level RAG Customer Support Assistant](two-level-rag-assistant.md)
