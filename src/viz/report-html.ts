import type { ProbeAudit } from "../probe/audit-schema.js";
import type { ProbeTrace } from "../probe/run-probe.js";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function severityColor(sev: string): string {
  if (sev === "high") return "#b91c1c";
  if (sev === "medium") return "#ca8a04";
  return "#64748b";
}

function auditTable(audit: ProbeAudit): string {
  if (audit.terminology_findings.length === 0) {
    return "<p><em>No terminology findings recorded.</em></p>";
  }
  const rows = audit.terminology_findings
    .map(
      (f) => `<tr>
  <td>${escapeHtml(f.excerpt)}</td>
  <td>${escapeHtml(f.category)}</td>
  <td style="color:${severityColor(f.severity)};font-weight:600">${escapeHtml(f.severity)}</td>
  <td>${escapeHtml(f.rationale)}</td>
  <td>${f.suggested_replacement ? escapeHtml(f.suggested_replacement) : "—"}</td>
</tr>`,
    )
    .join("\n");
  return `<table class="findings"><thead><tr>
<th>Excerpt</th><th>Category</th><th>Severity</th><th>Rationale</th><th>Suggested</th>
</tr></thead><tbody>${rows}</tbody></table>`;
}

export function traceToHtml(title: string, task: string, trace: ProbeTrace): string {
  const audit = trace.audit;
  const flagsJson = escapeHtml(JSON.stringify(trace.provider_flags, null, 2));
  const parseErr = trace.audit_parse_error
    ? `<div class="banner error">Audit JSON parse failed: ${escapeHtml(trace.audit_parse_error)}</div>`
    : "";

  const auditSection = audit
    ? `<section><h2>Audit summary</h2><p>${escapeHtml(audit.summary)}</p>
<h3>Findings</h3>${auditTable(audit)}
<h3>Equity notes</h3><ul>${audit.equity_notes.map((n) => `<li>${escapeHtml(n)}</li>`).join("")}</ul>
<h3>Follow-ups</h3><ul>${audit.recommended_followups.map((n) => `<li>${escapeHtml(n)}</li>`).join("")}</ul>
<p class="meta">Auditor self-reported confidence: ${(audit.confidence_in_audit * 100).toFixed(0)}%</p>
</section>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(title)}</title>
<style>
:root { font-family: system-ui, sans-serif; line-height: 1.45; color: #0f172a; background: #f8fafc; }
body { max-width: 960px; margin: 2rem auto; padding: 0 1rem; }
h1 { font-size: 1.35rem; }
pre { background: #1e293b; color: #e2e8f0; padding: 1rem; overflow: auto; border-radius: 8px; font-size: 0.85rem; }
section { margin: 1.5rem 0; background: #fff; padding: 1rem 1.25rem; border-radius: 12px; box-shadow: 0 1px 3px rgb(0 0 0 / 0.08); }
table.findings { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
table.findings th, table.findings td { border: 1px solid #e2e8f0; padding: 0.5rem 0.6rem; vertical-align: top; }
table.findings th { background: #f1f5f9; text-align: left; }
.banner.error { background: #fef2f2; color: #991b1b; padding: 0.75rem 1rem; border-radius: 8px; margin: 1rem 0; }
.meta { color: #64748b; font-size: 0.9rem; }
</style>
</head>
<body>
<h1>${escapeHtml(title)}</h1>
<p class="meta">Model: ${escapeHtml(trace.model)} · gen temp ${trace.generator_temperature} · audit temp ${trace.auditor_temperature}</p>
${parseErr}
<section><h2>Task</h2><pre>${escapeHtml(task)}</pre></section>
<section><h2>Candidate output (black-box surface)</h2><pre>${escapeHtml(trace.draft_text)}</pre></section>
${auditSection}
<section><h2>Provider flags (transparency)</h2><pre>${flagsJson}</pre></section>
</body>
</html>`;
}
