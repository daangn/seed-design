import { afterEach, describe, expect, it, mock } from "bun:test";
import { clearCache, fetchDoc } from "./fetch.js";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  clearCache();
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
});
