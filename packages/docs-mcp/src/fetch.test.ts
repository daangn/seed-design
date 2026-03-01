import { afterEach, describe, expect, it, mock } from "bun:test";
import { clearCache, fetchDoc } from "./fetch.js";
import { setDocsBaseUrl } from "./runtime-config.js";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  clearCache();
  setDocsBaseUrl();
});

describe("fetch", () => {
  it("rejects HTML responses for read_doc", async () => {
    globalThis.fetch = mock(async () => {
      return new Response("<html><body>nope</body></html>", {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    }) as unknown as typeof fetch;

    await expect(fetchDoc("react", "components/box")).rejects.toThrow(
      "HTML response is not allowed for docs-mcp",
    );
  });

  it("rejects invalid document paths before network request", async () => {
    const fetchMock = mock(async () => {
      return new Response("unused", { status: 200, headers: { "content-type": "text/plain" } });
    });

    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(fetchDoc("react", "../secret")).rejects.toThrow("Invalid document path");
    expect(fetchMock).toHaveBeenCalledTimes(0);
  });

  it("fetches docs from overridden baseUrl", async () => {
    setDocsBaseUrl("http://127.0.0.1:3000");
    const expectedUrl = "http://127.0.0.1:3000/llms/react/components/box.txt";

    globalThis.fetch = mock(async (input) => {
      const requestUrl = typeof input === "string" ? input : input.toString();
      expect(requestUrl).toBe(expectedUrl);

      return new Response("# Box\nLocal docs", {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      });
    }) as unknown as typeof fetch;

    const result = await fetchDoc("react", "components/box");
    expect(result.txtUrl).toBe(expectedUrl);
    expect(result.content).toContain("Local docs");
  });
});
