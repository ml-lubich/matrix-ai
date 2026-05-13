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

- [Probe pipeline (algorithm)](#probe-pipeline-algorithm)
- [Audit sequence](#audit-sequence)
- [Optional local clones](#optional-local-clones)
- [Quick start](#quick-start)
- [Security](#security)
- [🗺️ Repository map](#️-repository-map)
- [📊 Code composition](#-code-composition)

## Probe pipeline (algorithm)

```mermaid
flowchart LR
    A([bun run probe --task X])
    B["load .env<br/>MINIMAX_API_TOKEN"]
    C["generate<br/>MiniMax M2-her"]
    D["build audit prompt<br/>equity + terminology"]
    E["audit call<br/>MiniMax M2-her"]
    F["Zod validate JSON"]
    G{"valid?"}
    H["write report.json"]
    I["render report.html"]
    R["retry with stricter prompt"]
    Z([done])
    A --> B --> C --> D --> E --> F --> G
    G -- yes --> H --> I --> Z
    G -- no  --> R --> E
```

## Audit sequence

```mermaid
sequenceDiagram
    participant U as user
    participant CLI as src/cli.ts
    participant G as generate
    participant A as audit
    participant MM as MiniMax
    participant Z as Zod schema

    U->>CLI: --task prompt
    CLI->>G: generate(prompt)
    G->>MM: chat completion
    MM-->>G: candidate answer
    CLI->>A: audit(candidate)
    A->>MM: structured-output prompt
    MM-->>A: JSON
    A->>Z: parse(json)
    Z-->>A: typed report | error
    A-->>CLI: report
    CLI-->>U: report.json + report.html
```

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


## 🗺️ Repository map

Top-level layout of `matrix-ai` rendered as a Mermaid mindmap (auto-generated from the on-disk tree).

```mermaid
mindmap
  root((matrix-ai))
    Ix/
      CLAUDE.md
      CONTRIBUTING.md
      Formula
      LICENSE
      NOTICE
      README.md
    docs/
      API.md
      ARCHITECTURE.md
      DEPLOYMENT.md
      DESIGN.md
      OVERVIEW.md
      REQUIREMENTS.md
    mcp-atom-of-thoughts/
      CHANGELOG.md
      CLAUDE.md
      CONTRIBUTING.md
      Dockerfile
      LICENSE
      README.md
    src/
      cli.ts
      env.ts
      minimax
      probe
      viz
    tests/
      audit-schema.test.ts
      minimax-client.test.ts
      run-probe.test.ts
    tmp/
      probe-out.html
      probe-out.json
      probe-out2.json
    files
      README.md
      package.json
      tsconfig.json
```


## 📊 Code composition

File-type breakdown of source under this repo (skips `.git`, `node_modules`, build caches, lockfiles).

```mermaid
pie showData title File-type composition of matrix-ai (221 files)
    "TypeScript" : 152
    "Markdown" : 17
    "Other" : 17
    "JSON" : 12
    "Shell" : 12
    "Image" : 5
    "JavaScript" : 4
    "YAML" : 2
```
