# Optimizing Docker Images for Java

> Sources: AI apps orchestration notes
> Raw: [3 - Image creation (Java)](../../raw/AI/AI apps orchestration/3 - Image creation (Java).md)

## Overview

Java images get fat fast: a naive Spring Boot container weighs in around 478 MB before you ship a single line of code. The JVM, the JDK toolchain, transitive dependencies, and a generic Linux base all stack up. With layer-aware builds, build-tool plugins, and JDK modularization, the same application drops to ~170 MB — a 64% reduction with no functional change. This article walks the four-step progression.

## Stage 1: Naive Dockerfile (~478 MB)

```dockerfile
FROM openjdk:17
COPY target/app.jar /app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

Why it's heavy:

- `openjdk:17` is a Debian-based image with the full JDK (compiler + runtime), not just the runtime.
- The whole fat jar is a single layer; any rebuild invalidates everything.
- No layer separation between dependencies and application code.

## Stage 2: Spring Boot Maven Plugin (~361 MB)

Spring Boot's Maven plugin builds an image directly via Cloud Native Buildpacks:

```bash
mvn spring-boot:build-image
```

What this buys you:

- The buildpack uses a JRE base (not full JDK), shaving the toolchain.
- Layered jar: dependencies, snapshots, resources, and classes land in separate layers. Rebuilds invalidate only the changed layer.
- Sensible production defaults (memory calculation, healthcheck wiring).

Cost: a build-tool plugin tied to Spring Boot. Works only for Spring apps.

## Stage 3: Jib (~316 MB)

**Jib** is Google's plugin for both Maven and Gradle that builds OCI images **without a Docker daemon**:

```bash
mvn compile com.google.cloud.tools:jib-maven-plugin:build
```

Differences from Buildpacks:

- Distroless or minimal JRE base by default.
- Layers split by Jib's own heuristics: dependencies, resources, classes — each in its own layer.
- No daemon required, which makes it pleasant in CI.
- Framework-agnostic; works for any JVM app.

## Stage 4: jlink + Multi-Stage Alpine (~170 MB)

The aggressive approach: build a custom JRE containing only the modules the application actually uses, then ship it on Alpine.

```dockerfile
# Stage 1: build a custom runtime
FROM eclipse-temurin:17-jdk-alpine AS jre-build
RUN jlink \
    --add-modules java.base,java.logging,java.naming,java.sql,jdk.unsupported \
    --strip-debug \
    --no-man-pages \
    --no-header-files \
    --compress=2 \
    --output /jre

# Stage 2: minimal runtime image
FROM alpine:3.19
COPY --from=jre-build /jre /opt/jre
COPY target/app.jar /app.jar
ENTRYPOINT ["/opt/jre/bin/java", "-jar", "/app.jar"]
```

What's happening:

- `jlink` builds a minimal JRE with only the JPMS modules the app needs.
- `--strip-debug` and `--compress=2` shrink the runtime further.
- Alpine (musl-based) trims the OS layer to a few megabytes.
- Multi-stage build leaves the JDK behind in stage 1.

Trade-offs:

- You must know which modules your app uses (`jdeps --print-module-deps`).
- Alpine's musl libc occasionally breaks native libraries compiled against glibc; use `eclipse-temurin:17-jre-alpine` as a sanity check.
- Debug-friendliness drops; `jcmd`, `jstack`, and similar tools may be missing.

## Size Summary

| Stage | Technique | Size |
|-------|-----------|------|
| 1 | Naive `openjdk:17` + fat jar | ~478 MB |
| 2 | Spring Boot Maven Plugin | ~361 MB |
| 3 | Jib | ~316 MB |
| 4 | jlink + multi-stage Alpine | ~170 MB |

## When to Stop

Each step adds operational complexity. Pick the cheapest stage that meets your size budget:

- **Stage 2** is enough for most Spring Boot apps. One command, no Dockerfile to maintain.
- **Stage 3** wins when you need framework-agnostic builds or daemonless CI.
- **Stage 4** is for serious size pressure: edge deployments, large container fleets, cost-sensitive registries.

Below ~170 MB the marginal effort grows quickly. Native compilation via GraalVM is the next lever if size still matters.

## See Also

- [Docker Images and Dockerfile](docker-images-and-dockerfile.md)
- [Docker Compose Orchestration](docker-compose-orchestration.md)
- [Introduction to Containerization](introduction-to-containerization.md)
