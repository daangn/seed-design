import { describe, expect, it } from "bun:test";
import { handleChatRequest } from "./handle-chat-request";

describe("handleChatRequest", () => {
  it("returns 500 when required llm router config is missing", async () => {
    const envKeys = [
      "LLM_ROUTER_URL",
      "LLM_ROUTER_KATALOG_ID",
      "LLM_ROUTER_KATALOG_NAME",
      "SEED_DOCS_MCP_SERVER_URL",
    ] as const;
    const previousValues = envKeys.map((key) => [key, process.env[key]] as const);

    for (const [key] of previousValues) {
      process.env[key] = "";
    }

    try {
      const req = new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: [{ id: "u1", role: "user", parts: [{ type: "text", text: "안녕" }] }],
        }),
      });

      const res = await handleChatRequest(req, { env: {} });
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body).toEqual({
        error: "Missing LLM router configuration",
        missing: ["LLM_ROUTER_URL", "LLM_ROUTER_KATALOG_ID", "LLM_ROUTER_KATALOG_NAME"],
      });
    } finally {
      for (const [key, value] of previousValues) {
        if (typeof value === "undefined") {
          delete process.env[key];
        } else {
          process.env[key] = value;
        }
      }
    }
  });
});
