# matrix-ai

**Status — pre-release:** This is an **experimental v0.x** build. Behavior and schemas may change without notice. Automated coverage is **limited**; do not treat outputs as production-ready compliance or safety guarantees—validate in your own environment.

Local lab for **inspectable AI outputs**: generate a candidate answer with [MiniMax](https://platform.minimax.io/docs/api-reference/text-chat) (`M2-her`), then run a **structured equity / terminology audit** with JSON validation and an optional HTML report.

```mermaid
flowchart LR
    USER(("👤<br/>--task prompt"))
    CLI{{"💻 src/cli.ts<br/>bun run probe"}}
    GEN["✨ generate<br/>MiniMax M2-her"]
    AUDIT["🔍 audit<br/>equity / terminology<br/>+ Zod JSON"]
    MM(("🤖 MiniMax"))
    JSON[/"🧾 report.json"/]
    HTML[/"🌐 report.html"/]

    USER --> CLI --> GEN --> MM
    GEN --> AUDIT --> MM
    AUDIT --> JSON
    AUDIT --> HTML

    classDef io fill:#0e1116,stroke:#2f81f7,stroke-width:1.5px,color:#e6edf3;
    classDef brain fill:#161b22,stroke:#d29922,stroke-width:1.5px,color:#e6edf3;
    classDef tool fill:#161b22,stroke:#3fb950,stroke-width:1.5px,color:#e6edf3;
    classDef out fill:#0e1116,stroke:#a371f7,stroke-width:1.5px,color:#e6edf3;
    class USER,MM io;
    class CLI brain;
    class GEN,AUDIT tool;
    class JSON,HTML out;
```

## Table of contents

- [Quick start](#quick-start)
- [Optional local clones](#optional-local-clones)
- [Security](#security)

## Optional local clones

Not tracked in this repo (avoids broken nested-git commits):

```bash
git clone git@github.com:dioptx/mcp-atom-of-thoughts.git mcp-atom-of-thoughts
git clone https://github.com/ix-infrastructure/Ix.git Ix
```

- **mcp-atom-of-thoughts** — MCP reasoning graph toolkit.
- **Ix** — system / codebase mapping CLI ([upstream](https://github.com/ix-infrastructure/Ix)).

## Quick start

```bash
bun install
cp .env.example .env
# set MINIMAX_API_TOKEN
bun run probe --task "Your prompt" --html tmp/report.html --json tmp/report.json
```

Authoritative product intent lives in `docs/`. Tests are scoped to this repo via `bunfig.toml`.

## Security

Never commit `.env`. If a key was pasted into chat or logs, **rotate** it in the MiniMax console.
