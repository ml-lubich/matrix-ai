# Design

## User flow

1. Operator provides a **task** string (and optionally a **candidate** model output).
2. If no candidate is supplied, the **generator** system prompt produces `draft_text`.
3. The **auditor** system prompt (see `buildAuditorSystemPrompt`) must return JSON validated by `ProbeAuditSchema`.
4. CLI prints combined JSON; optional `--html` writes a static report; optional `--json` writes the same payload to disk.

## Audit schema (behavioral contract)

- `summary` — short neutral overview.
- `terminology_findings[]` — excerpt-level items with `category`, `severity`, `rationale`, optional `suggested_replacement`.
- `equity_notes[]` — qualitative observations not tied to a single excerpt.
- `model_limitations_disclosed` — whether the *candidate output* explicitly signaled limits/uncertainty (heuristic via auditor).
- `recommended_followups[]` — concrete next reviews or process steps.
- `confidence_in_audit` — auditor self-calibration (0–1), not a statistical guarantee.

## Visualization

HTML reports intentionally avoid third-party CDNs: inline CSS, embedded escaped text, and a JSON dump of provider flags for reproducibility.

## Non-goals

- Deterministic detection of slurs across all languages (use dedicated classifiers and human review for production).
- Legal compliance signing; this is an engineering aid, not a GRC product.
