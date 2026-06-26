FROM ubuntu:24.04

ARG DEBIAN_FRONTEND=noninteractive
ARG USERNAME=devuser
ARG USER_UID=1000
ARG USER_GID=1000

# Core tools + build essentials
RUN apt-get update && apt-get install -y \
    curl wget git vim nano \
    build-essential cmake ninja-build \
    gcc g++ gdb clang clang-format \
    python3 python3-pip python3-venv python3-dev \
    sqlite3 postgresql-client \
    ca-certificates gnupg lsb-release \
    unzip zip jq \
    && rm -rf /var/lib/apt/lists/*

# Node.js (LTS via NodeSource)
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Python: install common data/AI libs
RUN python3 -m pip install --break-system-packages \
        ipython jupyter \
        numpy pandas polars \
        scikit-learn matplotlib seaborn plotly \
        sqlalchemy psycopg2-binary \
        requests httpx pydantic \
        pytest ruff black

# Create non-root user (handle pre-existing UID/GID on base image)
RUN if getent group "$USER_GID" >/dev/null; then \
        true; \
    else \
        groupadd --gid "$USER_GID" "$USERNAME"; \
    fi \
    && if ! id -u "$USERNAME" >/dev/null 2>&1; then \
        if getent passwd "$USER_UID" >/dev/null; then \
            useradd --gid "$USER_GID" -m -s /bin/bash "$USERNAME"; \
        else \
            useradd --uid "$USER_UID" --gid "$USER_GID" -m -s /bin/bash "$USERNAME"; \
        fi; \
    fi \
    && mkdir -p "/home/$USERNAME/.vscode-server/extensions"
USER $USERNAME
WORKDIR /workspace

CMD ["/bin/bash"]
