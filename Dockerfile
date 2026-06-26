FROM ubuntu:24.04

ARG DEBIAN_FRONTEND=noninteractive

ARG USERNAME=dev
ARG USER_UID=1000
ARG USER_GID=1000

# C/C++, Python, SQL clients, and core utilities
RUN apt-get update && apt-get install -y \
    curl wget git \
    build-essential cmake ninja-build \
    gcc g++ gdb \
    python3 python3-pip python3-dev \
    sqlite3 postgresql-client \
    ca-certificates gnupg lsb-release \
    && rm -rf /var/lib/apt/lists/*

# Node.js (LTS) for JavaScript/TypeScript workflows
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g typescript \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user (reuse existing group id if present on base image)
RUN if getent group "$USER_GID" >/dev/null; then \
        true; \
    else \
        groupadd --gid "$USER_GID" "$USERNAME"; \
    fi \
    && if ! id -u "$USERNAME" >/dev/null 2>&1; then \
        if getent passwd "$USER_UID" >/dev/null; then \
            useradd --gid "$USER_GID" -m "$USERNAME"; \
        else \
            useradd --uid "$USER_UID" --gid "$USER_GID" -m "$USERNAME"; \
        fi; \
    fi

WORKDIR /workspace

# Install Python requirements (includes numpy and SQL-related libs)
COPY requirements.txt /workspace/requirements.txt
RUN pip install --no-cache-dir --break-system-packages -r /workspace/requirements.txt

USER $USERNAME

EXPOSE 8000
CMD ["python3", "-m", "http.server", "8000", "--directory", "wiki"]
