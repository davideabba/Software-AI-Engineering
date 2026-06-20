See [[Foundation Introduction to LangChain - Python]] 
# LangChain Academy - Introduction to LangChain (Python)

## Project Summary

This is the **LangChain Academy "Introduction to LangChain"** course repository (`lca-lc-foundations`). It teaches how to build LLM-powered agents using the LangChain framework through three progressive modules of Jupyter notebooks, culminating in deployable LangGraph agents. The course covers: foundational model interaction, tool creation, memory/state management, MCP integration, multi-agent delegation, human-in-the-loop workflows, and production middleware patterns.

## Tech Stack

|Layer|Technology|
|---|---|
|Language|Python 3.12–3.13|
|Package manager|`uv` (preferred) or `pip`|
|Framework|LangChain >= 1.1.3, LangGraph >= 1.0.3|
|Primary LLM|OpenAI `gpt-5-nano` via `langchain-openai`|
|Optional LLMs|Anthropic `claude-sonnet-4-5`, Google `gemini-2.5-flash-lite`|
|Web search|Tavily (`langchain-tavily`, `tavily-python`)|
|MCP|`mcp >= 1.21.1`, `langchain-mcp-adapters >= 0.1.13`|
|Notebooks|JupyterLab >= 4.5.1|
|Observability|LangSmith (optional tracing/evaluation)|
|Agent runtime|LangGraph Studio (`langgraph dev`)|
|Bonus UI|Next.js 16, React 19, pnpm, Tailwind (in `notebooks/module-3/agent-chat-ui/`)|

## Project Structure

```
lca-lc-foundations/
├── .env                    # API keys (gitignored, copy from example.env)
├── example.env             # Template with placeholder values
├── env_utils.py            # Setup verification script
├── pyproject.toml          # Project definition and dependencies
├── requirements.txt        # Pip-compatible dependency list
├── uv.lock                 # Reproducible lockfile
├── notebooks/
│   ├── module-1/           # Create Agent (fundamentals)
│   │   ├── 1.1_foundational_models.ipynb
│   │   ├── 1.1_prompting.ipynb
│   │   ├── 1.2_tools.ipynb
│   │   ├── 1.2_web_search.ipynb
│   │   ├── 1.3_memory.ipynb
│   │   ├── 1.4_multimodal_messages.ipynb
│   │   ├── 1.5_personal_chef.ipynb   # Module project
│   │   ├── 1.5_personal_chef.py      # LangGraph agent script
│   │   └── langgraph.json            # Studio config
│   ├── module-2/           # Advanced Agent (MCP, state, multi-agent)
│   │   ├── 2.1_mcp.ipynb
│   │   ├── 2.1_travel_agent.ipynb
│   │   ├── 2.2_runtime_context.ipynb
│   │   ├── 2.2_state.ipynb
│   │   ├── 2.3_multi_agent.ipynb
│   │   ├── 2.4_wedding_planners.ipynb # Module project
│   │   ├── bonus_rag.ipynb
│   │   ├── bonus_sql.ipynb
│   │   └── resources/
│   │       ├── 2.1_mcp_server.py     # MCP server (stdio)
│   │       ├── Chinook.db            # SQLite sample DB
│   │       └── acmecorp-employee-handbook.pdf
│   └── module-3/           # Production-Ready Agent
│       ├── 3.2_managing_messages.ipynb
│       ├── 3.3_hitl.ipynb
│       ├── 3.4_dynamic_models.ipynb
│       ├── 3.4_dynamic_prompts.ipynb
│       ├── 3.4_dynamic_tools.ipynb
│       ├── 3.5_email_agent.ipynb      # Module project
│       ├── 3.5_email_agent.py         # Full production agent
│       ├── langgraph.json
│       └── agent-chat-ui/             # Next.js chat interface (pnpm)
```

## Environment Setup

1. **Install dependencies**: `uv sync` (or `pip install -r requirements.txt`)
2. **Configure API keys**: Copy `example.env` to `.env`, fill in real keys
3. **Verify setup**: `uv run python env_utils.py`
4. **Run notebooks**: `uv run jupyter lab`
5. **Run LangGraph Studio**: `cd notebooks/module-1 && uv run langgraph dev`

### Required Environment Variables

- `OPENAI_API_KEY` — primary model provider (used throughout all modules)
- `TAVILY_API_KEY` — web search tool (modules 1–2)

### Optional Environment Variables

- `ANTHROPIC_API_KEY` — only module 1, lesson 1
- `GOOGLE_API_KEY` — only module 1, lesson 1
- `LANGSMITH_API_KEY` / `LANGSMITH_TRACING=true` / `LANGSMITH_PROJECT` — observability

## Coding Guidelines

### Notebook Pattern (every notebook follows this)

```python
# Cell 1: always load environment
from dotenv import load_dotenv
load_dotenv()

# Cell 2+: imports and code
from langchain.agents import create_agent
from langchain.messages import HumanMessage
```

### LangGraph Agent Script Pattern

```python
from dotenv import load_dotenv
load_dotenv()

from langchain.tools import tool
from langchain.agents import create_agent

@tool
def my_tool(param: str) -> str:
    """Tool description used by the LLM for tool selection"""
    return result

agent = create_agent(
    model="gpt-5-nano",
    tools=[my_tool],
    system_prompt="..."
)
```

### Key Conventions

- Always call `load_dotenv()` before any LangChain imports that need API keys.
- Use `init_chat_model("model-name")` for provider-agnostic model initialization.
- Use `create_agent(model, tools, system_prompt)` as the primary agent factory.
- Use type annotations on `@tool` functions — LangChain generates JSON schema from them.
- For stateful agents, subclass `AgentState` and pass `state_schema=` to `create_agent`.
- Use `InMemorySaver` as checkpointer with `config={"configurable": {"thread_id": "..."}}` for memory.
- Middleware list order: `[wrap_model_call, dynamic_prompt, HumanInTheLoopMiddleware]`.
- MCP operations are async — use `await client.get_tools()` and `agent.ainvoke()`.
- LangGraph JSON configs reference `"env": "../../.env"` relative to their module directory.

## Core LangChain Concepts (Module Progression)

### Module 1 — Fundamentals

|Concept|API|Description|
|---|---|---|
|Model initialization|`init_chat_model("gpt-5-nano")`|Provider-agnostic model factory; resolves provider from model name|
|Agent creation|`create_agent(model, tools, system_prompt)`|Wires model + tools into a tool-calling loop|
|Invocation|`agent.invoke({"messages": [HumanMessage(...)]})`|Synchronous agent call returning message list|
|Streaming|`agent.stream(input, stream_mode="messages")`|Token-by-token output as `(token, metadata)` tuples|
|Tool definition|`@tool` decorator|Three forms: bare, named, named+described; type hints become JSON schema|
|Memory|`InMemorySaver` checkpointer|Thread-based persistence via `thread_id` in config|
|Multimodal|`HumanMessage` with image content|Pass images as base64 or URLs in message content blocks|

### Module 2 — Advanced Patterns

|Concept|API|Description|
|---|---|---|
|MCP client|`MultiServerMCPClient`|Connects to MCP servers (stdio/SSE); exposes tools/resources/prompts|
|Custom state|`class MyState(AgentState)`|Add domain fields to agent state; pass via `state_schema=`|
|State updates|`Command(update={...})`|Tools return Commands to atomically update state fields|
|Tool runtime|`ToolRuntime` parameter|Injected into tools; provides `tool_call_id`, `state`, `context`|
|Multi-agent|Tools wrapping subagents|Orchestrator delegates via `@tool` functions that call `subagent.invoke()`|
|RAG|Document loaders + vector stores|Load PDFs, split, embed, retrieve for context augmentation|

### Module 3 — Production Patterns

|Concept|API|Description|
|---|---|---|
|Dynamic tools|`@wrap_model_call`|Middleware that intercepts model requests to filter/replace tools dynamically|
|Dynamic prompts|`@dynamic_prompt`|Middleware that generates system prompts based on current state|
|HITL|`HumanInTheLoopMiddleware`|Interrupts execution for human approve/reject/edit before tool runs|
|Resumption|`Command(resume={"decisions": [...]})`|Three decision types: approve, reject (with message), edit (replace args)|
|Context schema|`@dataclass` + `context_schema=`|Inject runtime configuration accessible via `runtime.context`|
|Middleware composition|`middleware=[...]` list|Pipeline of interceptors executed in order on every model call|

## Tools and Resources

|Tool|Command|Purpose|
|---|---|---|
|Setup verification|`uv run python env_utils.py`|Validates Python, venv, packages, API keys|
|Jupyter|`uv run jupyter lab`|Run notebooks|
|LangGraph Studio|`uv run langgraph dev`|Visual agent debugging (from module dirs)|
|Agent Chat UI|`cd notebooks/module-3/agent-chat-ui && pnpm install && pnpm dev`|Next.js chat interface|
|LangSmith|Enable `LANGSMITH_TRACING=true`|Trace and debug agent runs at smith.langchain.com|

## Canonical Import Paths

These are the exact imports used throughout this codebase (not `langchain_core`):

```python
# Core agent and model
from langchain.agents import create_agent
from langchain.agents import AgentState
from langchain.chat_models import init_chat_model

# Messages
from langchain.messages import HumanMessage, AIMessage, ToolMessage, RemoveMessage

# Tools
from langchain.tools import tool, ToolRuntime

# Middleware (Module 3)
from langchain.agents.middleware import wrap_model_call, dynamic_prompt
from langchain.agents.middleware import HumanInTheLoopMiddleware, SummarizationMiddleware
from langchain.agents.middleware import ModelRequest, ModelResponse
from langchain.agents.middleware import before_agent

# LangGraph primitives
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import Command

# MCP (Module 2)
from langchain_mcp_adapters.client import MultiServerMCPClient

# External tools
from tavily import TavilyClient
from langchain_community.utilities import SQLDatabase
```

## Common Pitfalls

- **Import errors**: Always run within the virtual environment (`uv run` or activate `.venv`).
- **Import paths**: This project uses `from langchain.*` (not `langchain_core.*`). Do not use `langchain_core` imports.
- **Env conflicts**: `load_dotenv()` does NOT override existing system env vars. Use `load_dotenv(override=True)` if system vars differ from `.env`.
- **Windows + MCP**: Set `asyncio.WindowsProactorEventLoopPolicy` for MCP in Jupyter on Windows.
- **LangGraph JSON**: The `"env"` path is relative to the `langgraph.json` file location, not the project root.
- **No linting config**: This project has no Python linter/formatter config. Follow existing notebook style.