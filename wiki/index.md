# Knowledge Base Index

## ai-engineering

LLM external memory patterns, prompting techniques, model quantization, and the LangChain ecosystem.

| Article | Summary | Updated |
|---------|---------|---------|
| [LLM External Memory Generations](ai-engineering/llm-external-memory-generations.md) | Three generations of LLM external memory: RAG, Agentic File Search, LLM Wiki. | 2026-06-20 |
| [LLM Wiki Pattern](ai-engineering/llm-wiki-pattern.md) | Three-layer architecture (raw/wiki/schema) for a persistent, compounding LLM-maintained knowledge base. | 2026-06-20 |
| [Agentic File Search](ai-engineering/agentic-file-search.md) | Preview-extract-follow loop over a markdown directory tree, no embeddings required. | 2026-06-20 |
| [RAG vs LLM Wiki vs Agentic Search](ai-engineering/rag-vs-llm-wiki-vs-agentic-search.md) | Side-by-side cost, latency, freshness, and infra comparison of the three external-memory patterns. | 2026-06-20 |
| [Zero-shot vs Few-shot Prompting](ai-engineering/zero-shot-vs-few-shot.md) | When to add worked examples to a prompt, including the RAG variants. | 2026-06-20 |
| [LLM Quantization Schemes](ai-engineering/llm-quantization-schemes.md) | Decoding GGUF names like Q4_K_M: bits, k-means blocks, mixed precision. | 2026-06-20 |
| [LangChain Ecosystem](ai-engineering/langchain-ecosystem.md) | LangChain core, LangSmith, LangGraph, and the invoke/batch/stream interface. | 2026-06-20 |
| [LangChain Academy Course Overview](ai-engineering/langchain-academy-course.md) | Three-module course with gpt-5-nano, Tavily, MCP, and middleware patterns. | 2026-06-20 |

## rag

Retrieval-Augmented Generation paradigms, optimization techniques, evaluation, and a thesis case study.

| Article | Summary | Updated |
|---------|---------|---------|
| [RAG Paradigms](rag/rag-paradigms.md) | Naive, Advanced, and Modular RAG plus iterative/recursive/adaptive augmentation modes. | 2026-06-20 |
| [RAG Retrieval Optimization](rag/rag-retrieval-optimization.md) | Chunking, metadata, query expansion/transformation, routing, re-ranking, augmentation loops. | 2026-06-20 |
| [RAG Evaluation](rag/rag-evaluation.md) | Retrieval and generation metrics, qualitative aspects, benchmarks and judge frameworks. | 2026-06-20 |
| [IVFFlat Vector Indexes](rag/ivfflat-vector-indexes.md) | PgVector's IVFFlat: lists/probes tuning, distance operators, build and query patterns. | 2026-06-20 |
| [Two-Level RAG Customer Support Assistant](rag/two-level-rag-assistant.md) | Master's thesis project: page-level + section-level retrieval on a local stack. | 2026-06-20 |

## containerization

Docker, image optimization, and Compose-based multi-container orchestration.

| Article | Summary | Updated |
|---------|---------|---------|
| [Introduction to Containerization](containerization/introduction-to-containerization.md) | Containers vs VMs, history from chroot to Docker, Docker architecture and image formats. | 2026-06-20 |
| [Docker Images and Dockerfile](containerization/docker-images-and-dockerfile.md) | Layer model, instructions, CMD vs ENTRYPOINT, multi-stage builds, build cache. | 2026-06-20 |
| [Optimizing Docker Images for Java](containerization/optimizing-docker-images-java.md) | 478 MB → 170 MB via Spring Boot plugin, Jib, and jlink + multi-stage Alpine. | 2026-06-20 |
| [Docker Compose Orchestration](containerization/docker-compose-orchestration.md) | Services, ports, volumes, networks, depends_on with healthchecks, resources, replicas. | 2026-06-20 |

## mlops

AI deployment architectures and patterns from prototype to production.

| Article | Summary | Updated |
|---------|---------|---------|
| [AI SaaS Production Architecture](mlops/ai-saas-production-architecture.md) | Two-phase AWS stack: EC2 + RDS + OpenAI MVP, then ECS/EKS + self-hosted Mistral/Llama. | 2026-06-20 |
| [Simple AI Deployment Patterns](mlops/simple-ai-deployment.md) | Docker-based deployment targets (cloud managed, raw VMs, on-prem) and surface choices. | 2026-06-20 |

## frontend

Lightweight frontend libraries that pair well with server-rendered apps.

| Article | Summary | Updated |
|---------|---------|---------|
| [HTMX Overview](frontend/htmx-overview.md) | Hypertext-extending JS library: AJAX, CSS transitions, WebSockets, SSE via HTML attributes. | 2026-06-20 |

## software-engineering

General software engineering practices. *(Empty — pending ingest.)*
