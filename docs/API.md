# API (internal contracts)

## MiniMax client

`chatCompletionV2(apiKey, body)` → `{ text, raw }`

- **Endpoint**: `{MINIMAX_API_BASE}/v1/text/chatcompletion_v2`
- **Auth**: `Authorization: Bearer <MINIMAX_API_TOKEN>`
- **Errors**: Non-HTTP errors use `base_resp.status_code` ([error reference](https://platform.minimax.io/docs/api-reference/errorcode)).

## Probe trace

`runProbe(apiKey, { task, candidateOutput?, model? })` → `ProbeTrace`

Fields:

- `draft_text` — audited surface string.
- `audit` — `ProbeAudit` or `null` if parsing fails.
- `audit_parse_error` — parse/validation message when `audit` is null.
- `provider_flags` — transparency subset from provider JSON.

## CLI

```
bun run probe --task "<text>" [--task-file path] [--candidate path] [--html path] [--json path]
```

Exit code `1` on missing task or thrown errors; stdout is always JSON for successful completion.
