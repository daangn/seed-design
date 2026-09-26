import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveBuildCache } from "./kapture-build-cache.mjs";
import { parse } from "yaml";
import { cacheName } from "./kapture-build-cache.mjs";

const CAPTURE_WORKFLOW = ".github/workflows/kapture-capture.yml";
const config = parse(await readFile(new URL(`../${CAPTURE_WORKFLOW}`, import.meta.url), "utf8"));
const POLICY_FILES = [config.env.KAPTURE_CAPTURE_WORKFLOW, "scripts/kapture-build-cache.mjs"];
const prefix = config.env.KAPTURE_BUILD_CACHE_PREFIX;
const now = Date.UTC(2026, 0, 1);
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
const name = cacheName(prefix, "minor", sha, hash.digest("hex"));

function fixture({
  changedPolicy = false,
  fork = false,
  failed = false,
  missing = false,
  producerPolicyChanged = false,
} = {}) {
  const outputs: Record<string, string> = {};
  const run = {
    id: 99,
    status: "completed",
    conclusion: failed ? "failure" : "success",
    event: "pull_request",
    path: CAPTURE_WORKFLOW,
    head_sha: "c".repeat(40),
    head_repository: { id: fork ? 2 : 1 },
  };
  const artifact = {
    id: 42,
    name,
    expired: false,
    created_at: new Date(now).toISOString(),
    digest: `sha256:${"d".repeat(64)}`,
    workflow_run: { id: run.id, head_repository_id: 1 },
  };
  const github = {
    rest: {
      repos: {
        get: async () => ({ data: { id: 1, default_branch: "dev" } }),
        getBranch: async () => ({ data: { commit: { sha: "b".repeat(40) } } }),
        getContent: async ({ path, ref }: { path: string; ref: string }) => {
          if (missing) throw new Error("404");
          return {
            data: {
              encoding: "base64",
              content: (changedPolicy || (producerPolicyChanged && ref === run.head_sha)
                ? Buffer.from("different")
                : source.get(path)
              )?.toString("base64"),
            },
          };
        },
      },
      actions: {
        listArtifactsForRepo: () => {},
        getWorkflowRun: async () => ({ data: run }),
      },
    },
    paginate: async () => [artifact],
  };
  return {
    artifact,
    run,
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
      workflow: config.env.KAPTURE_CAPTURE_WORKFLOW,
      prefix,
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

test("cache identity rejects unsafe names and malformed revisions", () => {
  expect(() => cacheName(prefix, "feature/x", sha, "b".repeat(64))).toThrow();
  expect(() => cacheName(prefix, "dev", "latest", "b".repeat(64))).toThrow();
  expect(() => cacheName(prefix, "dev", sha, "invalid")).toThrow();
});

test.each([
  ["expired", { expired: true }],
  ["different identity", { name: "another-cache" }],
  ["missing digest", { digest: "" }],
  ["invalid digest", { digest: "sha256:invalid" }],
  ["fork artifact", { workflow_run: { id: 99, head_repository_id: 2 } }],
])("does not reuse %s artifacts", async (_, override) => {
  const f = fixture();
  Object.assign(f.artifact, override);
  await resolveBuildCache(f.options);
  expect(f.outputs["cache-hit"]).toBe("false");
  expect(f.outputs).not.toHaveProperty("artifact-id");
});

test.each([
  ["incomplete run", { status: "in_progress" }],
  ["wrong event", { event: "push" }],
  ["wrong workflow", { path: ".github/workflows/untrusted.yml" }],
])("does not reuse a producer with %s", async (_, override) => {
  const f = fixture();
  Object.assign(f.run, override);
  await resolveBuildCache(f.options);
  expect(f.outputs["cache-hit"]).toBe("false");
  expect(f.outputs).not.toHaveProperty("run-id");
});

test("changed producer policy cannot supply a trusted build", async () => {
  const f = fixture({ producerPolicyChanged: true });
  await resolveBuildCache(f.options);
  expect(f.outputs["cache-hit"]).toBe("false");
});

test("API failures are cache misses, not capture failures", async () => {
  const f = fixture();
  f.options.github.paginate = async () => {
    throw new Error("API unavailable");
  };
  await expect(resolveBuildCache(f.options)).resolves.toBeUndefined();
  expect(f.outputs["cache-hit"]).toBe("false");
  expect(f.outputs).not.toHaveProperty("artifact-id");
});

// Reproduce the actual Git sparse-checkout boundary, not a full-checkout mock.
test("the workflow sparse checkout contains every cache policy input", async () => {
  const checkout = config.jobs["build-base"].steps.find(
    (step: any) => step.with?.path === "_kapture-policy",
  );
  const directory = await mkdtemp(join(tmpdir(), "seed-kapture-checkout-"));
  const git = (...args: string[]) => {
    const result = spawnSync("git", args, { cwd: directory, encoding: "utf8" });
    expect({ code: result.status, error: result.stderr }).toEqual({ code: 0, error: "" });
  };
  try {
    for (const [path, bytes] of source) {
      await mkdir(dirname(join(directory, path)), { recursive: true });
      await writeFile(join(directory, path), bytes);
    }
    git("init", "-q");
    git("add", ".");
    git(
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.com",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-qm",
      "fixture",
    );
    git(
      "sparse-checkout",
      "set",
      "--cone",
      ...checkout.with["sparse-checkout"].trim().split(/\s+/),
    );
    const f = fixture();
    await resolveBuildCache({ ...f.options, policyRoot: directory });
    expect(f.outputs["cache-hit"]).toBe("true");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
