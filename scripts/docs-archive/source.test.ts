import { expect, it } from "bun:test";
import { resolveArchiveSource } from "./source";

const archive = {
  platform: "react",
  version: "v2",
  sourceBranch: "react/v2",
  origin: "https://release.example.pages.dev",
  probe: { document: "components/button", registryItem: "ui/button" },
};

it("resolves the exact reviewed branch, keeping credentials on GitHub only", async () => {
  const fetcher = (async (url: string, init: RequestInit) => {
    expect(url).toBe("https://api.github.com/repos/daangn/seed-design/git/ref/heads/react%2Fv2");
    expect(init.redirect).toBe("error");
    expect(new Headers(init.headers).get("Authorization")).toBe("Bearer test-token");
    return Response.json({
      ref: "refs/heads/react/v2",
      object: { type: "commit", sha: "a".repeat(40) },
    });
  }) as typeof fetch;
  const resolved = await resolveArchiveSource(archive, "test-token", fetcher);
  expect(resolved.sourceBranch).toBeUndefined();
  expect(resolved.sourceSha).toBe("a".repeat(40));
});

it("supports a pinned rollback without resolving a newer branch head", async () => {
  const resolved = await resolveArchiveSource(
    { ...archive, sourceSha: "b".repeat(40) },
    undefined,
    (async (_input: URL | RequestInfo): Promise<Response> => {
      throw new Error("A pinned rollback must not request GitHub");
    }) as typeof fetch,
  );
  expect(resolved.sourceSha).toBe("b".repeat(40));
  expect(resolved.sourceBranch).toBeUndefined();
});

it.each([
  () => new Response(null, { status: 404 }),
  () => Response.json({ ref: "refs/heads/wrong", object: { type: "commit", sha: "a".repeat(40) } }),
  () => Response.json({ ref: "refs/heads/react/v2", object: { type: "tag", sha: "a".repeat(40) } }),
  () => Response.json({ ref: "refs/heads/react/v2", object: { type: "commit", sha: "invalid" } }),
])("rejects missing or mismatched GitHub branch data", async (response) => {
  await expect(
    resolveArchiveSource(archive, undefined, (async (_input: URL | RequestInfo) =>
      response()) as typeof fetch),
  ).rejects.toThrow();
});
