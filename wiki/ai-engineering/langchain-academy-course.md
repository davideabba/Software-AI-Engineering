# LangChain Academy Course Overview

> Sources: LangChain, 2026
> Raw: [Foundation Introduction to LangChain - Python](../../raw/AI/LangChain/Corso Agentic LLMs/Foundation Introduction to LangChain - Python.md); [Corso formazione LangChain - Python](../../raw/AI/LangChain/Corso Agentic LLMs/Corso formazione LangChain - Python.md)

## Overview

The LangChain Academy "Agentic LLMs" course teaches LangChain end-to-end through a three-module project (`lca-lc-foundations`) that builds progressively more capable agents. The stack is intentionally minimal: `gpt-5-nano` as the model, Tavily for web search, MCP for tool integration, and modern LangChain middleware for human-in-the-loop and summarization. This article captures the project structure, conventions, and the topics each module covers, so the course can be navigated as reference rather than read linearly.

## Project Layout

The repo is organized one folder per module:

```
lca-lc-foundations/
├── module-1/
├── module-2/
├── module-3/
├── pyproject.toml
└── .env.example
```

Each module is a self-contained Jupyter / script project; later modules build on patterns from earlier ones but can be opened independently.

## Environment

Three environment variables drive the stack:

- `OPENAI_API_KEY` — required for the LLM (`gpt-5-nano`).
- `TAVILY_API_KEY` — required for web-search tool calls.
- `LANGSMITH_API_KEY` and `LANGSMITH_TRACING=true` — optional; turns on tracing for every run.

`.env.example` ships with these stubs; `python-dotenv` loads them.

## Canonical Imports

The course follows the **modern import contract**: high-level abstractions come from `langchain.*`, not `langchain_core.*`. The latter is reserved for integration authors and lower-level extension points.

```python
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain.tools import tool
from langchain.messages import HumanMessage
```

Provider-specific bindings still come from their own packages (`langchain_openai`, `langchain_tavily`, etc.), but the public API surface used in app code lives under `langchain`.

## Module Topics

### Module 1 — Foundations

Builds intuition for the [execution interface](langchain-ecosystem.md): `invoke`, `batch`, `stream`, and their async equivalents. Introduces prompts, chat models, output parsers, and LCEL composition. The capstone is a small retrieval-augmented chain.

### Module 2 — Agents and Tools

Introduces `create_agent` and the tool-calling loop. Covers:

- Defining tools with `@tool` decorators.
- Connecting external services via **MCP** (Model Context Protocol) servers — the course uses MCP rather than ad-hoc HTTP wrappers.
- Structured output via `with_structured_output`.

### Module 3 — Middleware and Stateful Agents

The most interesting module. Introduces LangChain **middleware** — composable wrappers around agent runs:

- `HumanInTheLoopMiddleware` for approval gates before sensitive tool calls.
- `wrap_model_call` for intercepting and modifying every LLM call.
- `dynamic_prompt` for prompts that depend on accumulated state.
- `SummarizationMiddleware` for compressing long histories so agents stay inside the context window across many turns.

Middleware is the bridge from one-shot chains to durable agents.

## Why the Course is Worth Indexing

Two reasons it earns a dedicated wiki page:

1. The **canonical imports** convention has changed over the last year; the course is one of the cleanest references for what currently belongs under `langchain.*` versus `langchain_core.*`.
2. The **middleware patterns** in module 3 (human-in-the-loop, dynamic prompts, summarization) are the production-grade glue most agent tutorials skip — and they are exactly what separates a demo from a deployable agent.

## See Also

- [LangChain Ecosystem](langchain-ecosystem.md)
- [RAG Paradigms](../rag/rag-paradigms.md)
