import { expect, it } from "bun:test";
import { ArchiveSourceMismatchError } from "../verify";
import { verifyArchivePreview } from "../verify-preview";

const options = {
  channel: "react/v1.1",
  sourceBranch: "feat/react-v1-1-archive",
  sourceSha: "a".repeat(40),
  deploymentUrl: "https://fixed.example.pages.dev",
  aliasUrl: "https://branch.example.pages.dev",
};

function fixture(badOrigin?: string, staleResponses = Number.POSITIVE_INFINITY) {
  const origins: string[] = [];
  const manifests: Record<string, number> = {};
  const fetcher = (async (input: URL | RequestInfo) => {
    const url = new URL(input instanceof Request ? input.url : input.toString());
    const prefix = "/react/v1.1";
    origins.push(url.origin);
    const suffix = url.pathname.slice(prefix.length);
    if (suffix === "/archive.json") {
      manifests[url.origin] = (manifests[url.origin] ?? 0) + 1;
      return Response.json({
        platform: "react",
        version: "v1.1",
        prefix,
        sourceDirty: false,
        sourceSha:
          url.origin === badOrigin && manifests[url.origin] <= staleResponses
            ? "b".repeat(40)
            : options.sourceSha,
      });
    }
    if (suffix === "/")
      return new Response(
        `<link rel="canonical" href="https://seed-design.io${prefix}/"><script src="${prefix}/_assets/_next/app.js"></script>`,
      );
    if (suffix === "/__docs__/index.json") return Response.json({ categories: [{ id: "react" }] });
    if (suffix.startsWith("/__archive_missing_")) return new Response("missing", { status: 404 });
    if (
      [
        "/api/search",
        "/__registry__/react/index.json",
        "/__registry__/react/ui/action-button.json",
      ].includes(suffix)
    )
      return Response.json({});
    return new Response("fixture");
  }) as typeof fetch;
  return { fetcher, origins, manifests };
}

it("verifies the checked-out SHA at both Pages URLs without a registry file", async () => {
  const { fetcher, origins } = fixture();
  const summary = await verifyArchivePreview(options, fetcher);
  expect(new Set(origins)).toEqual(new Set([options.deploymentUrl, options.aliasUrl]));
  expect(summary).toBe(
    [
      "## Verified archive preview",
      "",
      "- Path: /react/v1.1",
      `- Verified Pages alias: ${options.aliasUrl}`,
      "- Build channel: react/v1.1",
      "- Source branch: feat/react-v1-1-archive",
      `- Source SHA: ${options.sourceSha}`,
      "- Verification passed for both immutable deployment and branch alias.",
      "",
    ].join("\n"),
  );
});

it.each([
  options.deploymentUrl,
  `${options.deploymentUrl}/`,
  "https://FIXED.EXAMPLE.pages.dev",
])("rejects deployment and alias URLs sharing an origin before fetching", async (aliasUrl) => {
  const { fetcher, origins } = fixture();
  await expect(verifyArchivePreview({ ...options, aliasUrl }, fetcher)).rejects.toThrow();
  expect(origins).toEqual([]);
});

it("rejects an alias still serving a different source commit", async () => {
  const { fetcher, manifests } = fixture(options.aliasUrl);
  const delays: number[] = [];
  await expect(
    verifyArchivePreview(options, fetcher, async (milliseconds) => {
      delays.push(milliseconds);
    }),
  ).rejects.toThrow(ArchiveSourceMismatchError);
  expect(delays).toEqual([10_000, 10_000, 10_000, 10_000, 10_000]);
  expect(manifests).toEqual({ [options.deploymentUrl]: 1, [options.aliasUrl]: 6 });
});

it.each([
  options.deploymentUrl,
  options.aliasUrl,
])("waits for the reviewed SHA to reach either Pages origin", async (staleOrigin) => {
  const { fetcher, manifests } = fixture(staleOrigin, 2);
  const delays: number[] = [];
  await verifyArchivePreview(options, fetcher, async (milliseconds) => {
    delays.push(milliseconds);
  });
  expect(delays).toEqual([10_000, 10_000]);
  expect(manifests).toEqual({
    [options.deploymentUrl]: staleOrigin === options.deploymentUrl ? 3 : 1,
    [options.aliasUrl]: staleOrigin === options.aliasUrl ? 3 : 1,
  });
});

it.each([
  "dirty",
  "http",
  "canonical",
  "network",
])("does not retry other verification failures: %s", async (failure) => {
  const { fetcher, manifests } = fixture();
  const failingFetcher = (async (input: URL | RequestInfo, init?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : input.toString());
    if (failure === "network") throw new Error("network failure");
    if (failure === "http") return new Response("failure", { status: 500 });
    if (failure === "dirty" && url.pathname.endsWith("/archive.json"))
      return Response.json({
        platform: "react",
        version: "v1.1",
        prefix: "/react/v1.1",
        sourceSha: options.sourceSha,
        sourceDirty: true,
      });
    if (failure === "canonical" && url.pathname === "/react/v1.1/")
      return new Response("<html></html>");
    return fetcher(input, init);
  }) as typeof fetch;
  const delays: number[] = [];
  await expect(
    verifyArchivePreview(options, failingFetcher, async (milliseconds) => {
      delays.push(milliseconds);
    }),
  ).rejects.toThrow();
  expect(delays).toEqual([]);
  expect(manifests[options.aliasUrl]).toBeUndefined();
});

it.each([
  { ...options, deploymentUrl: undefined },
  { ...options, aliasUrl: undefined },
  { ...options, channel: "dev" },
  { ...options, sourceSha: "" },
])("requires an archive channel, source SHA and both deployment URLs", async (value) => {
  const { fetcher } = fixture();
  await expect(verifyArchivePreview(value, fetcher)).rejects.toThrow();
});
