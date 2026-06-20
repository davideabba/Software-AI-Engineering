# AI SaaS Production Architecture

> Sources: Davide Abba, 2025
> Raw: [Architettura messa in produzione](../../raw/AI/Master's Thesis/Notes/Architettura messa in produzione.md)

## Overview

This article captures a two-phase AWS architecture for shipping an AI-backed SaaS — first as an MVP using hosted LLMs and the simplest possible infrastructure, then graduating to a scaled-out platform with self-hosted open-weight models. The phasing matters: phase 1 minimizes time-to-customer and unknowns; phase 2 minimizes per-call cost and dependency on a third-party model provider, but only once you have enough traffic to justify it.

## Phase 1 — MVP

Goal: prove product/market fit with the fewest moving parts. Hosted LLM, single application server, managed database.

### Components

| Layer | AWS service | Choice rationale |
|-------|-------------|------------------|
| Compute | EC2 | Single VM, simple ops, easy to debug |
| Database | RDS (Postgres) | Managed; PgVector extension covers embeddings |
| LLM | OpenAI API | Best quality per token in early MVP, no infra |
| App framework | Django | Auth, ORM, admin, REST all out of the box |
| LLM orchestration | LangChain | Chains, retrievers, agent loops |
| Domain / TLS | Route 53 + ACM | Standard AWS combo |

### Why this stack

- **EC2, not ECS/EKS.** Containers are an option but not a requirement at this size. One VM that you SSH into is faster to operate than a cluster you have to learn.
- **RDS + PgVector.** Avoid running two databases (relational + vector). PgVector inside Postgres handles both transactional data and embeddings. See [IVFFlat Vector Indexes](../rag/ivfflat-vector-indexes.md).
- **OpenAI API.** Per-token cost is high, but model quality is the highest and you avoid running GPUs.
- **Django + LangChain.** Django gives you everything around the LLM (auth, billing, admin); LangChain gives you the LLM glue (RAG, agents).

### Limits

This works until: hosted-LLM cost dominates revenue, latency from external API becomes a UX issue, or compliance forbids sending data to a third party.

## Phase 2 — Scale

Goal: drive per-call cost down and bring inference in-house. Containers, autoscaling, self-hosted open-weight models on GPUs.

### Components

| Layer | AWS service | Notes |
|-------|-------------|-------|
| Orchestration | ECS (Fargate) or EKS | ECS for simplicity, EKS when you need Kubernetes ecosystem |
| LLM inference | Self-hosted Mistral / Llama on g5.2xlarge | A10G GPU; supports quantized 7B–13B models comfortably |
| CDN | CloudFront | Edge cache for static assets and API responses where applicable |
| Database | RDS Postgres + PgVector | Carries over from phase 1; possibly add read replicas |
| App | Containerized Django | Same code, packaged into an OCI image |

### Why self-hosted models

The flip happens when monthly OpenAI bills exceed the cost of running a g5.2xlarge full-time. Quantized open-weight models (see [LLM Quantization Schemes](../ai-engineering/llm-quantization-schemes.md)) at Q4–Q5 are good enough for most production tasks, and once the GPU is up your marginal inference cost is approximately zero.

### Why ECS or EKS

- **ECS / Fargate.** No node management. Best when the team is small and Kubernetes expertise is thin.
- **EKS.** Full Kubernetes. Best when the rest of your platform tooling is Kubernetes-native or you need HPA, GitOps, service mesh.

For most teams, ECS is the right call until something specifically pushes them to EKS.

### CloudFront

Static assets, public API endpoints with cacheable responses, and even SSE/streaming for LLM responses can sit behind CloudFront. Latency drops, origin load drops, costs at scale drop.

## Migration Path

The phases share data and code:

1. Containerize the phase-1 app early, even before moving to ECS. Same image, two deployment targets.
2. Keep RDS as-is; phase 2 adds replicas, not replacements.
3. Stand up the self-hosted LLM behind a feature flag; route a percentage of traffic and compare quality + latency against the hosted API.
4. Cut over when self-hosted quality is acceptable and cost is winning.

Avoid the common trap of rewriting from monolith to microservices during the phase 1 → phase 2 jump. The transition that matters is **compute strategy and LLM provider**, not application architecture.

## See Also

- [Simple AI Deployment Patterns](simple-ai-deployment.md)
- [Two-Level RAG Customer Support Assistant](../rag/two-level-rag-assistant.md)
- [IVFFlat Vector Indexes](../rag/ivfflat-vector-indexes.md)
- [LLM Quantization Schemes](../ai-engineering/llm-quantization-schemes.md)
- [Docker Compose Orchestration](../containerization/docker-compose-orchestration.md)
