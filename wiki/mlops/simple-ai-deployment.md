# Simple AI Deployment Patterns

> Sources: Davide Abba, 2025
> Raw: [Come distribuire l'IA in maniera semplice](../../raw/AI/Master's Thesis/Notes/Come distribuire l'IA in maniera semplice.md)

## Overview

This article catalogs the simplest end-to-end ways to deploy an AI application, from "double-click on a laptop" to "managed cluster on a cloud provider." The shared spine is **Docker**: package the app once, then pick a deployment surface based on where the users are and who operates the box. The choice tree has two axes — **on-prem vs cloud**, and **REST API vs web UI** — and the right answer depends on data sensitivity, expected traffic, and team size.

## The Spine: Docker

Whichever target you pick, the artifact is the same: an OCI image that runs the app and its dependencies. Build it once with a Dockerfile (see [Docker Images and Dockerfile](../containerization/docker-images-and-dockerfile.md)), push it to a registry, deploy from there. The image is the contract between development and operations.

## Distribution Targets

### Cloud — Managed Containers

| Service | Provider | Notes |
|---------|----------|-------|
| ECS / Fargate | AWS | Containers without managing servers; lowest ops effort |
| EKS | AWS | Full Kubernetes; best when you already speak K8s |
| Cloud Run | Google | Per-request scaling to zero; ideal for spiky traffic |
| Container Apps | Azure | Same shape as Cloud Run |

Pick managed containers when: you want autoscaling, blue/green deploys, observability hooks for free, and someone else patches the underlying OS.

### Cloud — Raw VMs

EC2 / GCE / Azure VMs running `docker compose up`. Lower abstraction, lower cost, more ops. Reasonable for an MVP with one VM and a couple of services. See [AI SaaS Production Architecture](ai-saas-production-architecture.md) for the phase-1 / phase-2 progression.

### On-Premises

Same Docker images, run on your own hardware. Reasons to go on-prem:

- **Data sensitivity.** Healthcare, defense, finance — data cannot leave the perimeter.
- **GPU economics.** Owning a workstation with a consumer GPU beats renting a cloud GPU when utilization is high enough.
- **Network constraints.** Edge or air-gapped sites.

Orchestrator options on-prem range from `docker compose` on a single host, to a small k3s/k8s cluster across a few nodes, to bare `systemd` units if you want zero orchestration overhead.

## Surface Style

### REST API

Ship the model behind HTTP endpoints. Consumers integrate via SDK or curl. Best when:

- You expect the AI to be one tool in a larger system.
- The clients are other services, not end users.
- You want maximum flexibility for downstream UIs.

### Web UI

Ship a self-contained website (typically Django/Flask + HTMX or a SPA + REST). Best when:

- You are selling the AI directly to humans.
- The fastest path to user feedback is a hosted URL.
- You don't yet know what API surface external integrators will want.

The two are not mutually exclusive — most production stacks ship both, with the UI talking to the same REST surface external clients use.

## Registries

Where the image lives between build and deploy:

- **Docker Hub.** Public; simplest; free tier sufficient for OSS or small private repos.
- **Amazon ECR.** Private; tightly integrated with ECS/EKS auth via IAM.
- **GitHub Container Registry.** Private; integrates with GitHub Actions; convenient when CI lives there already.
- **Self-hosted (Harbor, distribution).** When you need full control or air-gapped operations.

Pick the registry that matches the deployment target's auth story — ECR for AWS, GHCR if your CI is GitHub Actions, Docker Hub for everything else.

## Decision Heuristic

1. **Sensitive data?** → On-prem with `docker compose` or k3s.
2. **Spiky traffic, want to scale to zero?** → Cloud Run / Container Apps.
3. **Already on AWS, small team?** → ECS / Fargate.
4. **Already speak Kubernetes?** → EKS or self-hosted k8s.
5. **MVP, low traffic, fast iteration?** → Single EC2 with `docker compose`.
6. **Edge / offline?** → On-prem, single-host Docker.

## What Stays the Same

Regardless of target:

- The Dockerfile.
- The Compose file (for single-host deployments and dev).
- The environment-variable contract (12-factor config).
- The healthcheck endpoint.

This is the payoff of containerization: the deploy target becomes a runtime choice, not a code rewrite.

## See Also

- [AI SaaS Production Architecture](ai-saas-production-architecture.md)
- [Introduction to Containerization](../containerization/introduction-to-containerization.md)
- [Docker Compose Orchestration](../containerization/docker-compose-orchestration.md)
- [Two-Level RAG Customer Support Assistant](../rag/two-level-rag-assistant.md)
