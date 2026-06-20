# LangChain Ecosystem

> Sources: Davide Abba, 2025
> Raw: [LangChain](../../raw/AI/Master's Thesis/Notes/LangChain.md)

## Overview

LangChain is a Python (and TypeScript) framework for building applications backed by large language models. Around the core library sits a small ecosystem of complementary tools: **LangSmith** for observability and evaluation, **LangGraph** for stateful agent orchestration, and a growing catalog of integrations covering model providers, vector stores, retrievers, and tools. This article maps the pieces and the canonical execution interface.

## The Pieces

### LangChain (core)

The base library. Provides primitives for prompts, models, retrievers, chains, agents, and output parsers, plus the LCEL (LangChain Expression Language) composition syntax. The package boundary matters: most production code imports from `langchain` and provider-specific packages (e.g. `langchain_openai`, `langchain_community`), with `langchain_core` reserved for the lowest-level abstractions used by integration authors.

### LangSmith

Observability and evaluation platform. Every LCEL chain run can be auto-instrumented to send traces to LangSmith, where you get:

- A per-run trace tree showing every prompt, LLM call, tool invocation, and output.
- Datasets of input/output examples for regression testing.
- Evaluators (LLM-as-a-judge, exact match, embeddings similarity) run over datasets.
- Production monitoring with cost and latency dashboards.

Activated with two environment variables (`LANGSMITH_API_KEY`, `LANGSMITH_TRACING=true`) — no code changes needed for basic tracing.

### LangGraph

Stateful graph-based orchestration. Where LCEL chains are DAGs, LangGraph models computations as **graphs with cycles and shared state**, which is what agent loops actually need:

- Nodes are functions (LLM calls, tools, transforms).
- Edges are transitions, optionally conditional on state.
- State is a typed dict updated by each node.

LangGraph is the recommended path for any agent more complex than a single tool-calling loop. It pairs naturally with the [LangChain Academy course](langchain-academy-course.md).

## Execution Interface

Every Runnable (chains, models, retrievers, tools) exposes a consistent execution surface:

| Method | Behaviour |
|--------|-----------|
| `invoke(input)` | Run once, return the full output |
| `batch(inputs)` | Run on a list of inputs, in parallel where possible |
| `stream(input)` | Yield output incrementally as it is produced |
| `ainvoke` / `abatch` / `astream` | Async variants of all of the above |

The same four methods work identically on a single LLM call, a five-step chain, or a full agent. This uniform surface is what makes LCEL composition tractable.

## Composition with LCEL

LCEL uses the `|` operator to pipe Runnables:

```python
chain = prompt | model | StrOutputParser()
chain.invoke({"question": "What is RAG?"})
```

Under the hood, `|` builds a `RunnableSequence`. Parallel branches use `RunnableParallel`; conditional branches use `RunnableBranch`. The whole graph remains a Runnable, so it can be composed further.

## Integrations

The integration surface is split across three categories:

- **Models.** Chat and embedding providers (OpenAI, Anthropic, Google, local via Ollama and llama-cpp).
- **Vector stores.** Pinecone, Chroma, PgVector, Weaviate, Qdrant, FAISS, Milvus.
- **Tools and retrievers.** Search APIs (Tavily, SerpAPI), document loaders, structured-data tools, MCP servers.

Provider packages are versioned independently of core LangChain, which means upgrades can be done piecewise but also means version skew is a real failure mode in production.

## Where Each Piece Fits

- Building a single chain with retrieval and an LLM → LangChain core + LCEL.
- Tracing runs, building datasets, running evals → add LangSmith.
- Multi-step agents with branching state → LangGraph.
- Production monitoring → LangSmith with sampling enabled.

## See Also

- [LangChain Academy Course Overview](langchain-academy-course.md)
- [RAG Paradigms](../rag/rag-paradigms.md)
- [Two-Level RAG Customer Support Assistant](../rag/two-level-rag-assistant.md)
