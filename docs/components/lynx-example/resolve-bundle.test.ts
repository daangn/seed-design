import { describe, expect, it } from "bun:test";
import { resolveLynxExampleBundle } from "./resolve-bundle";

const oldPath = "/__lynx__/app-bar/preview.4f75d929.lynx.bundle";
const newPath = "/__lynx__/app-bar/preview.9df621b8.lynx.bundle";
const origin = "https://preview.example.com";
const manifest = {
  schemaVersion: 1,
  examples: {
    "lynx/app-bar/preview": {
      web: "/__lynx__/app-bar/preview.12345678.web.bundle",
      lynx: newPath,
    },
  },
};

function requester(responses: Response[]) {
  const calls: { url: string; options?: RequestInit }[] = [];
  const request = (async (url: string | URL | Request, options?: RequestInit) => {
    calls.push({ url: String(url), options });
    const response = responses.shift();
    if (!response) throw new Error("unexpected request");
    return response;
  }) as typeof fetch;
  return { calls, request };
}

function resolve(request: typeof fetch, signal?: AbortSignal) {
  return resolveLynxExampleBundle("lynx/app-bar/preview", oldPath, origin, signal, request);
}

describe("Lynx Explorer bundle resolution", () => {
  it("keeps the page's bundle when it is still available", async () => {
    const { calls, request } = requester([new Response()]);
    expect(await resolve(request)).toEqual({ bundlePath: oldPath, updated: false });
    expect(calls).toHaveLength(1);
  });

  it("recovers a removed hash from the same origin and verifies its replacement", async () => {
    const { calls, request } = requester([
      new Response(null, { status: 404 }),
      Response.json(manifest),
      new Response(),
    ]);
    const signal = new AbortController().signal;
    expect(await resolve(request, signal)).toEqual({ bundlePath: newPath, updated: true });
    expect(calls.map(({ url }) => url)).toEqual([
      `${origin}${oldPath}`,
      `${origin}/__lynx__/manifest.json`,
      `${origin}${newPath}`,
    ]);
    expect(calls.map(({ options }) => options?.method ?? "GET")).toEqual(["HEAD", "GET", "HEAD"]);
    expect(
      calls.every(({ options }) => options?.cache === "no-store" && options.signal === signal),
    ).toBe(true);
  });

  it("does not replace an access-denied bundle with another version", async () => {
    const { calls, request } = requester([new Response(null, { status: 403 })]);
    await expect(resolve(request)).rejects.toThrow();
    expect(calls).toHaveLength(1);
  });

  it.each([
    new Response(null, { status: 404 }),
    Response.json({ schemaVersion: 1, examples: {} }),
    Response.json({ schemaVersion: 2, examples: {} }),
    Response.json({
      ...manifest,
      examples: {
        "lynx/app-bar/preview": { ...manifest.examples["lynx/app-bar/preview"], lynx: oldPath },
      },
    }),
  ])("rejects a missing, invalid, or stale manifest", async (response) => {
    const { request } = requester([new Response(null, { status: 404 }), response]);
    await expect(resolve(request)).rejects.toThrow();
  });

  it("does not expose a missing replacement", async () => {
    const { request } = requester([
      new Response(null, { status: 404 }),
      Response.json(manifest),
      new Response(null, { status: 404 }),
    ]);
    await expect(resolve(request)).rejects.toThrow();
  });
});
