import { describe, expect, test } from "bun:test";
import { parseAuditJson, ProbeAuditSchema } from "../src/probe/audit-schema";

const valid = `{
  "summary": "ok",
  "terminology_findings": [],
  "equity_notes": ["n1"],
  "model_limitations_disclosed": true,
  "recommended_followups": [],
  "confidence_in_audit": 0.5
}`;

describe("parseAuditJson", () => {
  test("parses raw JSON", () => {
    const r = parseAuditJson(valid);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.summary).toBe("ok");
    }
  });

  test("strips markdown fence", () => {
    const r = parseAuditJson("```json\n" + valid + "\n```");
    expect(r.ok).toBe(true);
  });

  test("extracts JSON from preamble text", () => {
    const r = parseAuditJson("Sure. Here is the audit.\n" + valid + "\nHope this helps.");
    expect(r.ok).toBe(true);
  });

  test("rejects invalid shape", () => {
    const r = parseAuditJson("{}");
    expect(r.ok).toBe(false);
  });
});

describe("ProbeAuditSchema", () => {
  test("accepts finding", () => {
    const data = {
      summary: "s",
      terminology_findings: [
        {
          excerpt: "guys",
          category: "assumed_default_identity",
          severity: "low",
          rationale: "r",
          suggested_replacement: "folks",
        },
      ],
      equity_notes: [],
      model_limitations_disclosed: false,
      recommended_followups: [],
      confidence_in_audit: 0.9,
    };
    const r = ProbeAuditSchema.safeParse(data);
    expect(r.success).toBe(true);
  });
});
