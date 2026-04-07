# Deployment

## Runtime

- **Bun** ≥ 1.x (see `package.json` scripts).
- Network egress to `https://api.minimax.io` unless `MINIMAX_API_BASE` overrides the origin.

## Configuration

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `MINIMAX_API_TOKEN` | yes | Bearer token from MiniMax |
| `MINIMAX_MODEL` | no | Default `M2-her` |
| `MINIMAX_API_BASE` | no | Default `https://api.minimax.io` |
| `MINIMAX_GEN_TEMPERATURE` | no | Generator temperature (default `0.3`) |
| `MINIMAX_AUDIT_TEMPERATURE` | no | Auditor temperature (default `0.2`) |

Store secrets only in `.env` or your orchestrator’s secret store. Repository default `.gitignore` excludes `.env`.

## Operations note

Optional HTML/JSON artifacts may contain **prompts and model outputs** — treat them as **data governed by your privacy policy**, not as public logs.
