# Docker Compose Orchestration

> Sources: AI apps orchestration notes
> Raw: [4 - Container orchestration](../../raw/AI/AI apps orchestration/4 - Container orchestration.md)

## Overview

Docker Compose declares a multi-container application as a single YAML file (`compose.yaml`) and brings it up with one command (`docker compose up`). It is the right tool for **single-host, multi-container** deployments — development environments, small production stacks, integration test rigs — sitting between raw `docker run` (one container at a time, imperative) and Kubernetes (cluster-scale, complex). This article catalogs the building blocks: services, ports, volumes, networks, dependencies, healthchecks, resources, and replicas.

## Services

A `service` is a container definition: image, command, env, ports, volumes. Compose stands up one service per container; services can be scaled to multiple replicas.

```yaml
services:
  api:
    image: myapp/api:1.2.0
    environment:
      DATABASE_URL: postgres://db/app
    ports:
      - "8080:8080"
```

Service names double as DNS hostnames inside the default network — `api` and `db` can reach each other by name without explicit networking config.

## Ports

`ports` maps a host port to a container port (`host:container`).

- `"8080:8080"` — bind on every host interface.
- `"127.0.0.1:8080:8080"` — bind only on localhost.
- `"8080"` — random host port; useful in CI to avoid collisions.

Internal-only services skip `ports` entirely and stay reachable via the Compose network.

## Volumes

Three volume types, each with a different lifecycle:

| Type | Syntax | Lifecycle |
|------|--------|-----------|
| Named | `db-data:/var/lib/postgresql/data` | Managed by Docker; survives container removal |
| Anonymous | `/var/lib/postgresql/data` (no source) | Removed when the container is removed |
| Bind mount | `./src:/app/src` | Direct path on the host; survives anything |

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

**Named volumes for state.** **Bind mounts for source.** Anonymous volumes are a footgun; avoid them.

## Networks

Compose auto-creates a default bridge network per project, so any service can reach any other by name. For more control, declare networks explicitly:

| Driver | Use case |
|--------|----------|
| `bridge` | Default. Single-host isolated network |
| `host` | Container shares the host's network stack; no isolation, no port mapping |
| `overlay` | Multi-host; used with Swarm / cluster mode |
| `macvlan` | Container appears as a separate physical device on the LAN |

```yaml
networks:
  frontend:
  backend:
    internal: true

services:
  api:
    networks: [frontend, backend]
  db:
    networks: [backend]
```

`internal: true` disconnects a network from the outside world entirely — useful for database subnets.

## depends_on and Healthchecks

`depends_on` controls **start order**, not **readiness**. To wait until a dependency is actually serving traffic, combine it with a healthcheck:

```yaml
services:
  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 10

  api:
    image: myapp/api
    depends_on:
      db:
        condition: service_healthy
```

Common healthcheck shapes:

- HTTP service: `curl -f http://localhost:8080/health || exit 1`
- HTTP service without curl: `wget -qO- http://localhost:8080/health || exit 1`
- PostgreSQL: `pg_isready -U postgres`
- Redis: `redis-cli ping | grep PONG`

The leading `CMD-SHELL` runs the test inside a shell so you get pipes, redirects, and `||`. Use `CMD` (exec form) when you don't need shell features.

## Resource Limits

Caps for CPU and memory under the `deploy.resources` key:

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: "1.5"
          memory: 512M
        reservations:
          cpus: "0.5"
          memory: 256M
```

`limits` are hard caps; `reservations` are soft guarantees the scheduler tries to honour. Resource keys under `deploy` apply universally only with Compose v2; older Swarm-only behaviour has been folded into the standard CLI.

## Replicas

Stateless services scale horizontally with `deploy.replicas`:

```yaml
services:
  api:
    image: myapp/api
    deploy:
      replicas: 3
```

The Compose CLI will run three instances of `api`, all behind the same DNS name with round-robin resolution. Stateful services (databases) should not be naively replicated — they need clustering protocols that Compose does not provide.

## When to Outgrow Compose

Compose is excellent up to: one host, a handful of services, a single-team operational model. Outgrow it when:

- You need true multi-host scheduling → Kubernetes.
- You need rolling updates with health-gated promotion → Kubernetes or Nomad.
- You need autoscaling on metrics → Kubernetes HPA.
- You need cross-cluster networking → service mesh on top of Kubernetes.

Until then, Compose is the highest-leverage orchestration tool on a single host.

## See Also

- [Introduction to Containerization](introduction-to-containerization.md)
- [Docker Images and Dockerfile](docker-images-and-dockerfile.md)
- [Optimizing Docker Images for Java](optimizing-docker-images-java.md)
- [Simple AI Deployment Patterns](../mlops/simple-ai-deployment.md)
