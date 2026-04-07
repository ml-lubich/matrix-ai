import { chatCompletionV2 } from "../minimax/client.js";
import {
  buildAuditorSystemPrompt,
  parseAuditJson,
  type ProbeAudit,
} from "./audit-schema.js";

export type ProbeInput = {
  task: string;
  /** If omitted, the model generates a draft answer that is then audited. */
  candidateOutput?: string;
  model?: string;
};

export type ProbeTrace = {
  model: string;
  generator_temperature: number;
  auditor_temperature: number;
  draft_text: string;
  audit: ProbeAudit | null;
  audit_parse_error: string | null;
  provider_flags: {
    input_sensitive?: boolean;
    output_sensitive?: boolean;
    input_sensitive_type?: number;
    output_sensitive_type?: number;
    total_tokens_draft?: number;
    total_tokens_audit?: number;
  };
};

/** Default per MiniMax Text Chat V2 OpenAPI; override with MINIMAX_MODEL. */
const DEFAULT_MODEL = "M2-her";

function resolveModel(explicit?: string): string {
  return (explicit ?? process.env.MINIMAX_MODEL ?? DEFAULT_MODEL).trim();
}

export async function runProbe(apiKey: string, input: ProbeInput): Promise<ProbeTrace> {
  const model = resolveModel(input.model);
  const genTemp = Number(process.env.MINIMAX_GEN_TEMPERATURE ?? 0.3);
  const auditTemp = Number(process.env.MINIMAX_AUDIT_TEMPERATURE ?? 0.2);

  let draft = input.candidateOutput?.trim() ?? "";
  const flags: ProbeTrace["provider_flags"] = {};

  if (!draft) {
    const gen = await chatCompletionV2(apiKey, {
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a careful assistant. Answer clearly. Note major uncertainties briefly when relevant.",
        },
        { role: "user", content: input.task },
      ],
      temperature: Number.isFinite(genTemp) ? genTemp : 0.3,
      max_completion_tokens: 1024,
    });
    draft = gen.text;
    flags.input_sensitive = gen.raw.input_sensitive;
    flags.output_sensitive = gen.raw.output_sensitive;
    flags.input_sensitive_type = gen.raw.input_sensitive_type;
    flags.output_sensitive_type = gen.raw.output_sensitive_type;
    flags.total_tokens_draft = gen.raw.usage?.total_tokens;
  }

  const auditPrompt = [
    "Task (context):\n" + input.task,
    "",
    "Candidate output to audit:\n" + draft,
  ].join("\n");

  const auditCall = await chatCompletionV2(apiKey, {
    model,
    messages: [
      { role: "system", content: buildAuditorSystemPrompt() },
      { role: "user", content: auditPrompt },
    ],
    temperature: Number.isFinite(auditTemp) ? auditTemp : 0.2,
    max_completion_tokens: 2048,
  });

  flags.total_tokens_audit = auditCall.raw.usage?.total_tokens;

  const parsed = parseAuditJson(auditCall.text);
  return {
    model,
    generator_temperature: Number.isFinite(genTemp) ? genTemp : 0.3,
    auditor_temperature: Number.isFinite(auditTemp) ? auditTemp : 0.2,
    draft_text: draft,
    audit: parsed.ok ? parsed.data : null,
    audit_parse_error: parsed.ok ? null : parsed.error,
    provider_flags: flags,
  };
}
