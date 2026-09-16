import { describe, expect, test } from "bun:test";
import {
  cacheName,
  DAY,
  deploymentOwner,
  MAX_BUILD_BYTES,
  selectBuildsToDelete,
  shouldDeletePreview,
} from "./kapture-policy.mjs";
import { cleanupPreviews, cloudflareClient } from "./kapture-retention.mjs";

const now = Date.parse("2026-09-20T00:00:00Z");
const sha = "a".repeat(40);
const digest = "b".repeat(64);
const name = cacheName("dev", sha, digest);
const artifact = (id: number, age = 0, branch = "dev", size = 40_000_000) => ({
  id,
  name: cacheName(branch, id.toString(16).padStart(40, "0"), digest),
  created_at: new Date(now - age * DAY).toISOString(),
  size_in_bytes: size,
  expired: false,
});
const preview = (overrides = {}) => ({
  id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  environment: "preview",
  url: "https://12345678.seed-design-storybook.pages.dev",
  created_on: "2026-08-01T00:00:00Z",
  latest_stage: { status: "success" },
  deployment_trigger: {
    metadata: {
      branch: "kapture-pr-2090",
      commit_message: "kapture-pr-2090-run-123",
      commit_hash: sha,
    },
  },
  ...overrides,
});
const openPR = { number: 2090, state: "open", closed_at: null, updated_at: "2026-08-02T00:00:00Z" };
const closedPR = { ...openPR, state: "closed", closed_at: "2026-08-02T00:00:00Z" };

describe("SEED Kapture retention policy", () => {
  test("rejects aliases, arbitrary bases, shortened SHAs and malformed identities", () => {
    expect(() => cacheName("feature/x", sha, digest)).toThrow();
    expect(() => cacheName("dev", "latest", digest)).toThrow();
    expect(name).toBe(`seed-kapture-build-dev-${sha}-${digest}`);
  });

  test("keeps at most three recent builds per branch without touching other artifacts", () => {
    const input = [
      artifact(1, 4),
      artifact(2, 3),
      artifact(3, 2),
      artifact(4, 1),
      artifact(5, 7, "minor"),
      { ...artifact(6), name: "dependency-cache" },
    ];
    expect(selectBuildsToDelete(input, now).map((a) => a.id)).toEqual([1, 5]);
  });

  test("bounds aggregate size, deduplicates identities and ignores expired records", () => {
    expect(
      selectBuildsToDelete(
        [artifact(1, 0, "dev", MAX_BUILD_BYTES), artifact(2, 1, "minor", 1)],
        now,
      ).map((a) => a.id),
    ).toEqual([2]);
    expect(
      selectBuildsToDelete(
        [
          { ...artifact(1), name },
          { ...artifact(2), name },
        ],
        now,
      ).map((a) => a.id),
    ).toEqual([1]);
    expect(selectBuildsToDelete([{ ...artifact(1, 30), expired: true }], now)).toEqual([]);
  });

  test("never identifies production, arbitrary branch previews or mismatched markers as ours", () => {
    expect(deploymentOwner(preview())).toEqual({ pr: 2090, run: 123, sha });
    expect(deploymentOwner(preview({ environment: "production" }))).toBeNull();
    expect(
      deploymentOwner(preview({ deployment_trigger: { metadata: { branch: "dev" } } })),
    ).toBeNull();
    expect(
      deploymentOwner(
        preview({
          deployment_trigger: {
            metadata: {
              branch: "kapture-pr-2090",
              commit_message: "kapture-pr-2156-run-123",
              commit_hash: sha,
            },
          },
        }),
      ),
    ).toBeNull();
  });

  test("protects latest/approved open results and waits seven days after close AND upload", () => {
    const d = preview();
    expect(shouldDeletePreview(d, openPR, new Set([d.id]), now)).toBe(false);
    expect(shouldDeletePreview(d, openPR, new Set(), now)).toBe(true);
    expect(
      shouldDeletePreview(
        d,
        { ...closedPR, closed_at: new Date(now - 6 * DAY).toISOString() },
        new Set(),
        now,
      ),
    ).toBe(false);
    expect(shouldDeletePreview(d, closedPR, new Set(), now)).toBe(true);
    expect(
      shouldDeletePreview(
        preview({ created_on: new Date(now - DAY).toISOString() }),
        closedPR,
        new Set(),
        now,
      ),
    ).toBe(false);
    expect(shouldDeletePreview(d, { ...closedPR, number: 1 }, new Set(), now)).toBe(false);
  });
});

function cleanupFixture(pr = closedPR) {
  const calls: string[] = [];
  let current = pr;
  const pulls = { get: async () => ({ data: current }) };
  const comments = {
    listComments: () => {},
    createComment: async () => {
      calls.push("comment");
    },
  };
  const github = { rest: { pulls, issues: comments }, paginate: async () => [] };
  const cf = async (path: string, method = "GET") => {
    calls.push(`${method} ${path}`);
    if (path.startsWith("/deployments?")) return { result: [preview()] };
    return { result: preview() };
  };
  const options = {
    github,
    cf,
    context: { repo: { owner: "example", repo: "design" } },
    core: { info: () => {} },
  };
  return {
    calls,
    options,
    reopen: () => {
      current = openPR;
    },
  };
}

describe("preview cleanup integration", () => {
  test("skips PR lookup when every owned preview is younger than seven days or invalid", async () => {
    const f = cleanupFixture();
    let reads = 0;
    f.options.github.rest.pulls.get = async () => {
      reads++;
      return { data: closedPR };
    };
    const cf = async () => ({
      result: [
        preview({ created_on: new Date(now - 6 * DAY).toISOString() }),
        preview({ created_on: "invalid" }),
        preview({ environment: "production" }),
      ],
    });
    expect(await cleanupPreviews({ ...f.options, cf, now })).toBe(0);
    expect(reads).toBe(0);
  });

  test("recently closed PR needs only one PR read and no evidence lookup", async () => {
    const f = cleanupFixture({ ...closedPR, closed_at: new Date(now - DAY).toISOString() });
    let reads = 0;
    const get = f.options.github.rest.pulls.get;
    f.options.github.rest.pulls.get = async () => {
      reads++;
      return get();
    };
    f.options.github.paginate = async () => {
      throw new Error("Unnecessary evidence lookup");
    };
    expect(await cleanupPreviews({ ...f.options, now, dryRun: false })).toBe(0);
    expect(reads).toBe(1);
  });

  test("latest-only open PR skips status and comment lookups", async () => {
    const f = cleanupFixture(openPR);
    f.options.github.paginate = async () => {
      throw new Error("Unnecessary evidence lookup");
    };
    expect(await cleanupPreviews({ ...f.options, now, dryRun: false })).toBe(0);
  });

  test("queries only candidate SHAs and preserves bot-linked results after a base change", async () => {
    const f = cleanupFixture({ ...openPR, base: { ref: "feature/retargeted" } } as typeof openPR);
    const latest = preview({
      id: "11111111-2222-3333-4444-555555555555",
      url: "https://87654321.seed-design-storybook.pages.dev",
      created_on: new Date(now - DAY).toISOString(),
      deployment_trigger: {
        metadata: {
          branch: "kapture-pr-2090",
          commit_message: "kapture-pr-2090-run-456",
          commit_hash: "c".repeat(40),
        },
      },
    });
    const refs: string[] = [];
    let commentReads = 0;
    const statuses = () => {};
    const github = {
      ...f.options.github,
      rest: { ...f.options.github.rest, repos: { listCommitStatusesForRef: statuses } },
      paginate: async (method: unknown, args: { ref?: string }) => {
        if (method === statuses) {
          if (!args.ref) throw new Error("Missing status SHA");
          refs.push(args.ref);
          return [];
        }
        commentReads++;
        return [{ user: { type: "Bot" }, body: preview().url }];
      },
    };
    const cf = async () => ({ result: [preview(), latest] });
    expect(await cleanupPreviews({ ...f.options, github, cf, now, dryRun: false })).toBe(0);
    expect(refs).toEqual([sha]);
    expect(commentReads).toBe(1);
  });

  test("open PR keeps latest success and historical approved evidence", async () => {
    const f = cleanupFixture(openPR);
    const latest = preview({
      id: "11111111-2222-3333-4444-555555555555",
      url: "https://87654321.seed-design-storybook.pages.dev",
      created_on: "2026-08-03T00:00:00Z",
    });
    const github = {
      ...f.options.github,
      rest: { ...f.options.github.rest, repos: { listCommitStatusesForRef: () => {} } },
      paginate: async () => [
        { context: "Kapture Visual Review", state: "success", target_url: preview().url },
      ],
    };
    const cf = async () => ({ result: [preview(), latest] });
    expect(await cleanupPreviews({ ...f.options, github, cf, dryRun: false })).toBe(0);
    expect(f.calls).toEqual([]);
  });

  test("a short page with more pages still processes every deployment", async () => {
    const f = cleanupFixture();
    const requests: string[] = [];
    const cf = async (path: string) => {
      requests.push(path);
      return path.endsWith("page=1")
        ? { result: [preview()], result_info: { total_pages: 2 } }
        : { result: [], result_info: { total_pages: 2 } };
    };
    await cleanupPreviews({ ...f.options, cf });
    expect(requests).toEqual([
      "/deployments?env=preview&per_page=100&page=1",
      "/deployments?env=preview&per_page=100&page=2",
    ]);
  });

  test("a failed deletion does not announce expiration", async () => {
    const f = cleanupFixture();
    const cf = async (path: string, method = "GET") => {
      if (method === "DELETE") throw new Error("Provider refused latest deployment deletion");
      return f.options.cf(path, method);
    };
    await expect(cleanupPreviews({ ...f.options, cf, dryRun: false })).rejects.toThrow(
      "Provider refused latest deployment deletion",
    );
    expect(f.calls).toEqual([
      "GET /deployments?env=preview&per_page=100&page=1",
      "GET /deployments/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    ]);
  });

  test("dry-run cannot delete or comment", async () => {
    const f = cleanupFixture();
    await cleanupPreviews(f.options);
    expect(f.calls).toEqual(["GET /deployments?env=preview&per_page=100&page=1"]);
  });

  test("deletes only the exact preview ID then reports expiration", async () => {
    const f = cleanupFixture();
    await cleanupPreviews({ ...f.options, dryRun: false });
    expect(f.calls).toEqual([
      "GET /deployments?env=preview&per_page=100&page=1",
      "GET /deployments/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      "DELETE /deployments/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee?force=true",
      "comment",
    ]);
  });

  test("reopen between planning and execution prevents deletion and expiration comment", async () => {
    const f = cleanupFixture();
    const get = f.options.github.rest.pulls.get;
    let reads = 0;
    f.options.github.rest.pulls.get = async () => {
      if (++reads === 2) f.reopen();
      return get();
    };
    await cleanupPreviews({ ...f.options, dryRun: false });
    expect(f.calls).toEqual(["GET /deployments?env=preview&per_page=100&page=1"]);
  });

  test("Cloudflare failures are visible and do not leak response bodies", async () => {
    const cf = cloudflareClient({
      accountId: "a".repeat(32),
      token: "fixture",
      fetchImpl: async () =>
        new Response(JSON.stringify({ success: false, secret: "do-not-log" }), { status: 403 }),
    });
    await expect(cf("/deployments")).rejects.toThrow("Cloudflare GET failed (403)");
  });
});
