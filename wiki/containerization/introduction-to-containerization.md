# Introduction to Containerization

> Sources: AI apps orchestration notes
> Raw: [1 - Introduction to containerization](../../raw/AI/AI apps orchestration/1 - Introduction to containerization.md)

## Overview

Containerization is a lightweight virtualization technique that packages an application together with its dependencies into a self-contained unit — a **container** — that can run identically on any host with a compatible kernel. It sits between bare-metal deployment (one app per machine) and full virtual machines (one OS per app), trading the hardware-level isolation of VMs for a much smaller footprint and faster startup.

## The Deployment Spectrum

| Model | Isolation | Footprint | Startup | Typical density |
|-------|-----------|-----------|---------|-----------------|
| Bare metal | Process-level only | One OS for the whole machine | Minutes (boot) | Few apps per host |
| Virtual machines | Full OS isolation, hardware-emulated | Each VM = full OS image | Tens of seconds | ~10 per host |
| Containers | Kernel namespaces + cgroups | Shares host kernel; image is just userspace | Sub-second | Hundreds per host |

VMs run a complete guest operating system over a hypervisor. Containers reuse the host kernel and only package the application binaries, libraries, and configuration. That single design choice is what makes containers an order of magnitude denser and faster than VMs.

## Historical Roots

The mechanism predates Docker by decades:

- **chroot (1979).** First Unix syscall to give a process a restricted view of the filesystem. The original isolation primitive.
- **FreeBSD jails / Solaris zones.** Extended chroot with process and network isolation.
- **Linux namespaces + cgroups.** The two kernel features modern containers are built on. Namespaces isolate what a process can see (PID, network, mount, UTS, user, IPC). cgroups limit what a process can use (CPU, memory, I/O).
- **LXC (2008).** First mainstream Linux container manager built on namespaces + cgroups.
- **Docker (2013).** Wrapped LXC (later its own libcontainer / runc) in a developer-friendly toolchain: images, registries, declarative builds. This is the moment containers went mainstream.

## The Runtime Landscape

Several engines speak the OCI container standard today:

- **Docker.** The reference experience. Daemon (`dockerd`) + CLI + image format + registry.
- **Podman.** Daemonless Docker-compatible CLI. Rootless by default. The drop-in replacement many teams prefer.
- **containerd / CRI-O.** Lower-level runtimes used inside Kubernetes; not normally run directly.
- **Kubernetes.** Not a runtime itself; an orchestrator that schedules containers across a cluster.

## Image Formats

The packaging side has more variety than the runtime side:

- **OCI Image Format.** The vendor-neutral standard, derived from Docker's original format.
- **Docker Image Format.** Historical baseline; near-identical to OCI today.
- **SIF (Singularity Image Format).** Single-file images popular in HPC where root-less, immutable runs matter.
- **LXD.** Image format for the LXC successor; more "lightweight VM" than "single-app container."

## Docker Architecture

When you run `docker run`, several pieces interact:

1. **Docker CLI** sends the command to the **Docker Engine** (the daemon, `dockerd`).
2. The engine resolves the image name, pulling from a **Registry** if needed.
3. The engine asks `containerd` / `runc` to materialize a **container** from the image — a writable layer on top of the read-only image layers.
4. The container runs as a process tree on the host, isolated by namespaces and constrained by cgroups.

Key files on disk:

- `/var/lib/docker/` — image layers, container state, volumes.
- `~/.docker/config.json` — CLI configuration, including registry credentials.
- A project's `Dockerfile` — the build recipe.
- A project's `compose.yaml` — multi-container declarative deployment.

## Why It Won

Three properties together made containers dominant:

1. **Reproducibility.** The same image runs identically on a laptop, CI, and production.
2. **Density.** An order of magnitude more apps per host than VMs.
3. **Tooling.** Declarative builds, a registry ecosystem, and orchestrators (Kubernetes) on top.

## See Also

- [Docker Images and Dockerfile](docker-images-and-dockerfile.md)
- [Optimizing Docker Images for Java](optimizing-docker-images-java.md)
- [Docker Compose Orchestration](docker-compose-orchestration.md)
