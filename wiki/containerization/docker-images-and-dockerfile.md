# Docker Images and Dockerfile

> Sources: AI apps orchestration notes
> Raw: [2 - Image creation (generic)](../../raw/AI/AI apps orchestration/2 - Image creation (generic).md)

## Overview

A Docker image is a stack of read-only filesystem **layers** merged at runtime by a union filesystem. The `Dockerfile` is a declarative recipe whose instructions each produce one layer. Understanding the layer model and the instruction semantics is the difference between a 50 MB image that rebuilds in seconds and a 2 GB image that invalidates its cache on every change.

## The Layer Model

Each layer captures the filesystem delta produced by one Dockerfile instruction. Layers are content-addressed (hashed), immutable, and shared across images that reuse the same base. At runtime a thin **writable** layer is added on top to capture container-local changes.

A **union filesystem** stitches the layers into a single view:

- **UnionFS** — original concept; merges multiple read-only branches with one writable branch on top.
- **OverlayFS** — current Linux default; same idea, faster, fewer edge cases.

Tooling: **`dive`** is the standard CLI for inspecting layer composition and finding wasted space.

## Dockerfile Instructions

The instructions you write 90% of the time:

| Instruction | What it does | Creates layer? |
|-------------|--------------|----------------|
| `FROM` | Sets the base image | First layer |
| `ARG` | Build-time variable (visible only during build) | No |
| `ENV` | Runtime environment variable | Yes |
| `WORKDIR` | Sets the working directory for subsequent instructions | Yes (metadata) |
| `COPY` | Copies files from build context into the image | Yes |
| `ADD` | Like `COPY` plus URL fetch and tar auto-extract | Yes |
| `RUN` | Executes a command in a new layer | Yes |
| `EXPOSE` | Documents which ports the container listens on | No (metadata) |
| `USER` | Sets the user for subsequent commands and the runtime | Yes (metadata) |
| `CMD` | Default command (overridable at `docker run`) | No (metadata) |
| `ENTRYPOINT` | Fixed command; CMD becomes its arguments | No (metadata) |

### CMD vs ENTRYPOINT

The pair confuses everyone once:

- `CMD ["python", "app.py"]` — runs by default, replaced if the user supplies a command at `docker run`.
- `ENTRYPOINT ["python", "app.py"]` — always runs; anything after `docker run image ...` becomes arguments to it.
- `ENTRYPOINT ["python"]` + `CMD ["app.py"]` — combine the two: the entrypoint is fixed, CMD is the default argument list.

### CMD Forms

- **Exec form** (preferred): `CMD ["python", "app.py"]`. PID 1 is the binary itself, signals reach it.
- **Shell form**: `CMD python app.py`. PID 1 is `/bin/sh`, the binary is its child, signals may not propagate. Use only when you need shell features.

## The Build Cache

Docker reuses cached layers as long as the inputs to an instruction haven't changed. Practical rules:

1. **Order instructions from least to most volatile.** Install OS packages first, then app dependencies, then source code last. Source changes are the most frequent; you want them to invalidate as few subsequent layers as possible.
2. **Copy lockfiles before source.** `COPY package.json package-lock.json ./` then `RUN npm ci` then `COPY . .`. Dependency installs are cached unless lockfiles change.
3. **Combine `RUN` commands that share a logical step.** Each `RUN` is a layer; chaining `apt-get update && apt-get install && rm -rf /var/lib/apt/lists/*` in one `RUN` keeps the cleanup in the same layer that created the garbage.
4. **Use `.dockerignore`.** Exclude `node_modules`, `.git`, build artifacts, secrets — anything that would invalidate the `COPY . .` layer without contributing to the image.

## Multi-Stage Builds

Multi-stage builds separate **build dependencies** from **runtime dependencies**:

```dockerfile
FROM golang:1.22 AS build
WORKDIR /src
COPY . .
RUN go build -o /out/app

FROM gcr.io/distroless/base
COPY --from=build /out/app /app
ENTRYPOINT ["/app"]
```

The final image contains only the compiled binary; the Go toolchain stays in the first stage. This pattern is universal across compiled languages and is the main lever for image size.

## Inspecting Images

- `docker image ls` — sizes and tags.
- `docker history <image>` — layer-by-layer breakdown.
- `dive <image>` — interactive TUI showing per-layer wasted space and file diffs.

## See Also

- [Introduction to Containerization](introduction-to-containerization.md)
- [Optimizing Docker Images for Java](optimizing-docker-images-java.md)
- [Docker Compose Orchestration](docker-compose-orchestration.md)
