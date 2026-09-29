import { describe, expect, it } from "bun:test";
import { archiveOrigin, handleArchiveRequest } from "./worker";

const origin = "https://verified-branch.example.pages.dev";
const request = (path: string, init?: RequestInit) =>
  new Request(`https://seed-design.io${path}`, init);
const stub = (handler: (request: Request) => Response | Promise<Response>) =>
  ((input: Request) => Promise.resolve(handler(input))) as typeof fetch;

describe("archive routing", () => {
  it("canonicalizes the root without losing query parameters", async () => {
    const response = await handleArchiveRequest(request("/react/v2?q=1"), origin);
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://seed-design.io/react/v2/?q=1");
  });

  it.each([
    "/react",
    "/react/latest",
    "/react/v20",
    "/react/v2-other",
    "/lynx/v1",
  ])("leaves %s on Pages", async (path) => {
    const input = request(path);
    await handleArchiveRequest(
      input,
      origin,
      stub((forwarded) => {
        expect(forwarded).toBe(input);
        return new Response("latest");
      }),
    );
  });

  it("forwards path/query, streams bytes and preserves conditional response headers", async () => {
    const response = await handleArchiveRequest(
      request("/react/v2/_assets/a.js?v=1", {
        headers: { Range: "bytes=0-2", Cookie: "secret=1", Authorization: "secret" },
      }),
      origin,
      stub((forwarded) => {
        expect(forwarded.url).toBe(`${origin}/react/v2/_assets/a.js?v=1`);
        expect(forwarded.headers.get("range")).toBe("bytes=0-2");
        expect(forwarded.headers.has("cookie")).toBe(false);
        expect(forwarded.headers.has("authorization")).toBe(false);
        return new Response("abc", {
          status: 206,
          headers: {
            "content-type": "application/javascript",
            etag: '"hash"',
            "cache-control": "public, max-age=31536000, immutable",
            "x-robots-tag": "noindex",
            "set-cookie": "secret=1",
          },
        });
      }),
    );
    expect(response.status).toBe(206);
    expect(await response.text()).toBe("abc");
    expect(response.headers.get("etag")).toBe('"hash"');
    expect(response.headers.get("cache-control")).toContain("immutable");
    expect(response.headers.has("x-robots-tag")).toBe(false);
    expect(response.headers.has("set-cookie")).toBe(false);
  });

  it.each([
    404, 304,
  ])("preserves HTTP %s instead of returning a success fallback", async (status) => {
    const response = await handleArchiveRequest(
      request("/react/v2/missing", { method: "HEAD" }),
      origin,
      stub((forwarded) => {
        expect(forwarded.method).toBe("HEAD");
        return new Response(null, { status });
      }),
    );
    expect(response.status).toBe(status);
  });

  it("rewrites Pages redirects to the public archive", async () => {
    const response = await handleArchiveRequest(
      request("/react/v2/button"),
      origin,
      stub(
        () =>
          new Response(null, {
            status: 308,
            headers: { location: `${origin}/react/v2/button/?q=1` },
          }),
      ),
    );
    expect(response.headers.get("location")).toBe("https://seed-design.io/react/v2/button/?q=1");
  });

  it("rejects upstream redirects escaping to an unscoped Pages root", async () => {
    const response = await handleArchiveRequest(
      request("/react/v2/button"),
      origin,
      stub(() => new Response(null, { status: 302, headers: { location: "/react" } })),
    );
    expect(response.status).toBe(502);
  });

  it("keeps Worker previews noindex", async () => {
    const response = await handleArchiveRequest(
      new Request("https://preview.example.workers.dev/react/v2/"),
      origin,
      stub(() => new Response("preview")),
    );
    expect(response.headers.get("x-robots-tag")).toBe("noindex");
  });

  it("fails closed when origin is missing or the method is unsafe", async () => {
    expect((await handleArchiveRequest(request("/react/v2/"), "")).status).toBe(503);
    expect(
      (await handleArchiveRequest(request("/react/v2/", { method: "POST" }), origin)).status,
    ).toBe(405);
  });

  it.each([
    "https://seed-design.io",
    "http://a.pages.dev",
    "https://a.pages.dev/path",
    "https://a.pages.dev:444",
    "https://user@a.pages.dev",
    "https://a.pages.dev?x=1",
  ])("rejects untrusted origin %s", (value) => {
    expect(() => archiveOrigin(value)).toThrow();
  });
});
