FROM ubuntu:24.04

ARG DEBIAN_FRONTEND=noninteractive

# C/C++, Python, SQL clients, and core utilities
RUN apt-get update && apt-get install -y \
    curl wget git \
    build-essential cmake ninja-build \
    gcc g++ \
    python3 python3-pip python3-venv python3-dev \
    sqlite3 postgresql-client \
    ca-certificates gnupg lsb-release \
    && rm -rf /var/lib/apt/lists/*

# Node.js (LTS) for JavaScript/TypeScript workflows
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g typescript \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# Install Python requirements (includes numpy and SQL-related libs)
COPY requirements.txt /workspace/requirements.txt
RUN python3 -m pip install --upgrade pip --break-system-packages \
    && pip install --no-cache-dir --break-system-packages -r /workspace/requirements.txt

EXPOSE 8000
CMD ["python3", "-m", "http.server", "8000", "--directory", "wiki"]
