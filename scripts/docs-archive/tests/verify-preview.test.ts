import { expect, it } from "bun:test";
import { verifyArchivePreview } from "../verify-preview";

const options = {
  channel: "react/v1.1",
  sourceBranch: "feat/react-v1-1-archive",
  sourceSha: "a".repeat(40),
  deploymentUrl: "https://fixed.example.pages.dev",
  aliasUrl: "https://branch.example.pages.dev",
};

function fixture(badOrigin?: string) {
  const origins: string[] = [];
  const fetcher = (async (input: URL | RequestInfo) => {
    const url = new URL(input instanceof Request ? input.url : input.toString());
    const prefix = "/react/v1.1";
    origins.push(url.origin);
    const suffix = url.pathname.slice(prefix.length);
    if (suffix === "/archive.json")
      return Response.json({
        platform: "react",
        version: "v1.1",
        prefix,
        sourceDirty: false,
        sourceSha: url.origin === badOrigin ? "b".repeat(40) : options.sourceSha,
      });
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
  return { fetcher, origins };
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

it("rejects an alias still serving a different source commit", async () => {
  const { fetcher } = fixture(options.aliasUrl);
  await expect(verifyArchivePreview(options, fetcher)).rejects.toThrow();
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
