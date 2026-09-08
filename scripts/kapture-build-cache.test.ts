import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolveBuildCache } from "./kapture-build-cache.mjs";
import { cacheName, CAPTURE_WORKFLOW, POLICY_FILES } from "./kapture-policy.mjs";

const policyRoot = fileURLToPath(new URL("../", import.meta.url));
const sha = "a".repeat(40);
const source = new Map(
  await Promise.all(
    POLICY_FILES.map(
      async (path: string) =>
        [path, await readFile(new URL(`../${path}`, import.meta.url))] as const,
    ),
  ),
);
const hash = createHash("sha256");
for (const [path, content] of source) hash.update(path).update("\0").update(content).update("\0");
const name = cacheName("minor", sha, hash.digest("hex"));

function fixture({ changedPolicy = false, fork = false, failed = false, missing = false } = {}) {
  const outputs: Record<string, string> = {};
  const github = {
    rest: {
      repos: {
        get: async () => ({ data: { id: 1, default_branch: "dev" } }),
        getBranch: async () => ({ data: { commit: { sha: "b".repeat(40) } } }),
        getContent: async ({ path }: { path: string }) => {
          if (missing) throw new Error("404");
          return {
            data: {
              encoding: "base64",
              content: (changedPolicy ? Buffer.from("different") : source.get(path))?.toString(
                "base64",
              ),
            },
          };
        },
      },
      actions: {
        listArtifactsForRepo: () => {},
        getWorkflowRun: async () => ({
          data: {
            id: 99,
            status: "completed",
            conclusion: failed ? "failure" : "success",
            event: "pull_request",
            path: CAPTURE_WORKFLOW,
            head_sha: "c".repeat(40),
            head_repository: { id: fork ? 2 : 1 },
          },
        }),
      },
    },
    paginate: async () => [
      {
        id: 42,
        name,
        expired: false,
        created_at: new Date().toISOString(),
        digest: `sha256:${"d".repeat(64)}`,
        workflow_run: { id: 99, head_repository_id: 1 },
      },
    ],
  };
  return {
    outputs,
    options: {
      github,
      context: { repo: { owner: "example", repo: "design" } },
      core: {
        info: () => {},
        warning: () => {},
        setOutput: (key: string, value: string) => {
          outputs[key] = value;
        },
      },
      policyRoot,
      branch: "minor",
      sha,
    },
  };
}

test("reuses only an exact-identity successful trusted producer", async () => {
  const f = fixture();
  await resolveBuildCache(f.options);
  expect(f.outputs).toEqual({
    "cache-hit": "true",
    "cache-name": name,
    "artifact-id": "42",
    "run-id": "99",
  });
});

test("unmerged policy and missing default-branch files disable reuse and publication", async () => {
  for (const option of [{ changedPolicy: true }, { missing: true }]) {
    const f = fixture(option);
    await resolveBuildCache(f.options);
    expect(f.outputs).toEqual({ "cache-hit": "false", "cache-name": "" });
  }
});

test("failed and fork producers cannot supply builds", async () => {
  for (const option of [{ fork: true }, { failed: true }]) {
    const f = fixture(option);
    await resolveBuildCache(f.options);
    expect(f.outputs).toEqual({ "cache-hit": "false", "cache-name": name });
  }
});

test("unsupported branches never use a default-branch fallback", async () => {
  const f = fixture();
  await resolveBuildCache({ ...f.options, branch: "feature/stack" });
  expect(f.outputs).toEqual({ "cache-hit": "false", "cache-name": "" });
});
