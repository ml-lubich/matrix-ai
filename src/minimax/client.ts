import type { ChatCompletionRequest, ChatCompletionResponse } from "./types.js";

const DEFAULT_BASE = "https://api.minimax.io";

export type ChatCompletionResult = {
  text: string;
  raw: ChatCompletionResponse;
};

function getBaseUrl(): string {
  return (process.env.MINIMAX_API_BASE ?? DEFAULT_BASE).replace(/\/$/, "");
}

export async function chatCompletionV2(
  apiKey: string,
  body: ChatCompletionRequest,
): Promise<ChatCompletionResult> {
  const url = `${getBaseUrl()}/v1/text/chatcompletion_v2`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const raw = (await res.json()) as ChatCompletionResponse;
  const code = raw.base_resp?.status_code ?? 0;
  const msg = raw.base_resp?.status_msg ?? "";

  if (!res.ok) {
    throw new Error(`MiniMax HTTP ${res.status}: ${msg || res.statusText}`);
  }
  if (code !== 0) {
    throw new Error(`MiniMax API error ${code}: ${msg || "unknown"}`);
  }

  const content = raw.choices?.[0]?.message?.content ?? "";
  if (!content && (raw.output_sensitive === true || raw.input_sensitive === true)) {
    throw new Error(
      "MiniMax returned empty content with sensitivity flags set. Treat as blocked or policy-limited output.",
    );
  }

  return { text: content, raw };
}
