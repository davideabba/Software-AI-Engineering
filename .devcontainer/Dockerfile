FROM ubuntu:24.04

ARG DEBIAN_FRONTEND=noninteractive

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

# Python: upgrade pip and install common data/AI libs
RUN python3 -m pip install --upgrade pip --break-system-packages \
    && pip install --break-system-packages \
        ipython jupyter \
        numpy pandas polars \
        scikit-learn matplotlib seaborn plotly \
        sqlalchemy psycopg2-binary \
        requests httpx pydantic \
        pytest ruff black

# Create non-root user
RUN useradd -ms /bin/bash devuser \
    && mkdir -p /home/devuser/.vscode-server/extensions
USER devuser
WORKDIR /workspace

CMD ["/bin/bash"]
