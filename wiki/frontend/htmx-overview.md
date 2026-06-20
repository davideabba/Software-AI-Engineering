# HTMX Overview

> Sources: Frontend notes
> Raw: [HTMX](../../raw/Frontend/HTMX.md)

## Overview

**HTMX** is a small JavaScript library (around 14 KB gzipped) that extends HTML with attributes for AJAX, CSS transitions, WebSockets, and Server-Sent Events. The pitch: keep the server rendering HTML, and let the page swap fragments in and out without a SPA framework. For server-side stacks (Django, Rails, Phoenix, FastAPI + Jinja), HTMX collapses most of the "we need React for this" cases back into plain HTML.

## What It Adds

HTMX exposes its features as `hx-*` attributes on regular HTML elements:

- `hx-get`, `hx-post`, `hx-put`, `hx-delete` — issue an HTTP request to the given URL.
- `hx-target` — CSS selector for which element receives the response HTML.
- `hx-swap` — how the response replaces the target (`innerHTML`, `outerHTML`, `beforeend`, etc.).
- `hx-trigger` — which event triggers the request (`click`, `change`, `keyup changed delay:300ms`).
- `hx-ws`, `hx-sse` — bind to WebSocket or SSE streams.

A search box that updates a results list as you type:

```html
<input type="search" name="q"
       hx-get="/search"
       hx-target="#results"
       hx-trigger="keyup changed delay:300ms"
       hx-swap="innerHTML">

<div id="results"></div>
```

The server returns an HTML fragment; HTMX swaps it into `#results`. No JSON, no client-side templating, no router.

## Where It Shines

- **Server-rendered apps that need interactivity in spots.** A traditional Django or Rails app gets autocomplete, infinite scroll, inline editing, and live updates without adding a SPA build pipeline.
- **Small teams.** One backend language, one templating language, no separate frontend stack.
- **Pages that are mostly content.** Forms, lists, dashboards. The "thin client" model is correct here.

## Where It Doesn't

- **Heavy client-side state.** Drag-and-drop editors, real-time canvases, offline-first apps. The round trip per interaction is wrong for these.
- **Mobile apps.** HTMX is HTML; you still need a real native or hybrid story for app stores.
- **Apps where the backend is decoupled by policy.** If multiple frontends consume the same JSON API, HTMX adds a second contract (HTML fragments) that the backend has to maintain.

## Mental Model

HTMX is best understood as **HTML with hypertext primitives finished**. The original web could only swap the entire page. HTMX adds the missing piece: "swap this fragment in response to this event." It is closer in spirit to early-2000s server-rendered apps than to React, but with the ergonomic AJAX layer those apps never had.

## See Also

- [Simple AI Deployment Patterns](../mlops/simple-ai-deployment.md)
