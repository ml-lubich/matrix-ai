# Architecture

## Components

| Layer | Responsibility |
| ------ | ---------------- |
| `src/minimax/` | HTTP client for `POST /v1/text/chatcompletion_v2` ([MiniMax Text Chat](https://platform.minimax.io/docs/api-reference/text-chat)) |
| `src/probe/` | Two-phase pipeline: optional generation, then auditor prompt → Zod-validated `ProbeAudit` |
| `src/viz/` | Deterministic HTML report from trace (no runtime network) |
| `src/cli.ts` | Bun entry: env loading, file I/O, JSON stdout |

## Design choices

- **Dual-pass over monolith**: separating “generator” and “auditor” roles reduces prompt entanglement and makes traces easier to store and diff.
- **Structural validation**: audits must parse as JSON matching `ProbeAuditSchema`; bracket-aware extraction tolerates common model formatting mistakes.
- **Transparency fields**: MiniMax responses can include `input_sensitive`, `output_sensitive`, and related fields; these are echoed into the trace for dashboards.

## Research anchors (2024–2026)

These inform *what we measure*, not proprietary model internals:

- **Structured decomposition** — Atom of Thoughts framing for step-wise reasoning graphs ([arXiv:2502.12018](https://arxiv.org/abs/2502.12018)); MCP implementation lives under `mcp-atom-of-thoughts/`.
- **Bias and fairness test suites** — BEATS consolidates multi-metric bias/ethics/factuality evaluation ([arXiv:2503.24310](https://arxiv.org/abs/2503.24310)).
- **Automated fairness testing** — Meta-Fair uses metamorphic-style testing with LLM-generated cases ([arXiv:2507.02533](https://arxiv.org/abs/2507.02533)).
- **Human-centered multimodal norms** — HumaniBench frames inclusive, empathetic, and robust behavior as first-class evaluation targets ([arXiv:2505.11454](https://arxiv.org/abs/2505.11454)).

## Relationship to Ix

[Ix](https://github.com/ix-infrastructure/Ix) targets **codebase context persistence**. matrix-ai targets **model output + language-risk artifacts**. They can complement each other: Ix supplies system facts; matrix-ai audits surfaced answers.
