import { afterEach, describe, expect, mock, test } from "bun:test";
import { chatCompletionV2 } from "../src/minimax/client";

describe("chatCompletionV2", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("returns assistant text on success", async () => {
    globalThis.fetch = mock(async () => {
      return new Response(
        JSON.stringify({
          choices: [
            { message: { role: "assistant", content: "hello" }, finish_reason: "stop" },
          ],
          base_resp: { status_code: 0, status_msg: "" },
          usage: { total_tokens: 10 },
        }),
        { status: 200 },
      );
    }) as unknown as typeof fetch;

    const r = await chatCompletionV2("k", {
      model: "M2-her",
      messages: [{ role: "user", content: "hi" }],
    });
    expect(r.text).toBe("hello");
    expect(r.raw.usage?.total_tokens).toBe(10);
  });

  test("throws on non-zero base_resp", async () => {
    globalThis.fetch = mock(async () => {
      return new Response(
        JSON.stringify({
          base_resp: { status_code: 1004, status_msg: "auth" },
        }),
        { status: 200 },
      );
    }) as unknown as typeof fetch;

    expect(chatCompletionV2("k", { model: "M2-her", messages: [{ role: "user", content: "x" }] })).rejects.toThrow(
      "1004",
    );
  });
});
