# Requirements

## Goals

1. **Observable outputs**: capture model text plus provider transparency flags in one trace.
2. **Equity-oriented review**: structured audit emphasizing inclusive terminology and exclusion risks.
3. **Inspectable outputs**: JSON and static HTML suitable for archival and human review.
4. **Repeatability**: deterministic report layout given the same trace payload.

## Constraints

- Must not embed API tokens in source or documentation.
- Must tolerate minor formatting noise from auditors (prose around JSON).
- Must run with Bun without requiring Docker for core CLI functionality.

## Out of scope (current revision)

- Multi-tenant auth, RBAC, or hosted SaaS.
- Training or fine-tuning models.
- Guaranteed absence of harmful content (provider + human safeguards still required).

## Stakeholder assumptions

Operators understand that **LLM auditors are imperfect** and that high-stakes decisions require organizational policy, human review, and domain-specific test suites (for inspiration: [BEATS](https://arxiv.org/abs/2503.24310), [Meta-Fair](https://arxiv.org/abs/2507.02533)).
