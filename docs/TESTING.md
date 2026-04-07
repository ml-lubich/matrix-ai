# Testing

## Commands

```bash
bun test        # suite rooted at ./tests (see bunfig.toml)
bun run typecheck
```

## Scope

`bunfig.toml` sets `[test] root = "tests"` so vendored trees (`Ix/`, `mcp-atom-of-thoughts/`) are **not** executed when developing matrix-ai.

## What is covered

- Zod validation and JSON extraction for audits.
- MiniMax client behavior with `fetch` mocked.
- `runProbe` orchestration with a single mocked audit response.

## Live integration

Manual smoke (requires real `MINIMAX_API_TOKEN`):

```bash
bun run src/cli.ts --task "smoke test" --json tmp/out.json
```

Do not commit outputs containing sensitive prompts.
