import { afterEach, describe, expect, mock, test } from "bun:test";
import { runProbe } from "../src/probe/run-probe";

describe("runProbe", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("uses candidate only (one API call)", async () => {
    let calls = 0;
    globalThis.fetch = mock(async () => {
      calls += 1;
      const auditJson = JSON.stringify({
        summary: "clean",
        terminology_findings: [],
        equity_notes: [],
        model_limitations_disclosed: true,
        recommended_followups: [],
        confidence_in_audit: 0.8,
      });
      return new Response(
        JSON.stringify({
          choices: [{ message: { content: auditJson, role: "assistant" } }],
          base_resp: { status_code: 0, status_msg: "" },
          usage: { total_tokens: 50 },
        }),
        { status: 200 },
      );
    }) as unknown as typeof fetch;

    const trace = await runProbe("key", {
      task: "Explain hiring",
      candidateOutput: "We should hire the best person.",
    });

    expect(calls).toBe(1);
    expect(trace.draft_text).toContain("best person");
    expect(trace.audit?.summary).toBe("clean");
  });
});
