import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  assertExactRegistryDistTags,
  assertExactRegistryIntegrities,
  assertCompletePullFileList,
  commitFromLsRemote,
  commitsFromLsRemote,
  authorizedPackageManifestPaths,
  fetchRegistryDocuments,
  hasBoundPublishReceipt,
  inspectRegistryGitHeads,
  isTrustedLegacyPublishRecovery,
  isTrustedPublishComment,
  isTrustedPublishStatus,
  isPublishStatusBoundToRun,
  packageTag,
  parseAuthorizedPackageManifestPaths,
  parsePublishPackages,
  parsePublishRecord,
  planTagReconciliation,
  trustedPublishVersionMarker,
  trustedVersionMarker,
} from "./publish-state";
import { verifyPublishPullForAuthorization } from "./authorize-publish-pr";
import { packagesFromAuthorizedPullFiles } from "./publish-plan";
import { trustedPublishQueuePulls } from "./publish-queue";
import {
  releaseValidationRunName,
  releaseValidationStatusDescription,
} from "../core/validation-status";
import { releaseValidationWorkflowName } from "../sync/sync-policy";
import type { PullRequestIdentity, ReleaseMarker } from "../core/types";
import type { GitHubPullRequest } from "../core/github";

const repository = "daangn/seed-design";
const mergeSha = "a".repeat(40);
const npmIntegrity = `sha512-${"A".repeat(86)}==`;
const temporaryDirectories: string[] = [];
const body = [
  `<!-- seed-release-publish:${mergeSha}:production -->`,
  "게시 queue가 이 Version Packages PR을 `production`로 처리했습니다.",
  "",
  `Run: https://github.com/${repository}/actions/runs/123`,
].join("\n");

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

async function command(
  args: string[],
  cwd?: string,
  env?: Record<string, string>,
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  const child = Bun.spawn(args, {
    cwd,
    env: env ? { ...process.env, ...env } : undefined,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [exitCode, stdout, stderr] = await Promise.all([
    child.exited,
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
  ]);
  return { exitCode, stdout, stderr };
}

describe("publish queue 신뢰 경계", () => {
  const headSha = "b".repeat(40);
  const controlSha = "c".repeat(40);
  const strictMarker = {
    schemaVersion: 1,
    type: "version",
    lane: "minor",
    expectedHeadSha: headSha,
    controlSha,
  } as const;
  const identity: PullRequestIdentity = {
    author: "github-actions[bot]",
    body: `<!-- seed-release:${JSON.stringify(strictMarker)} -->`,
    baseRef: "minor",
    headRef: "changeset-release/minor",
    baseRepository: repository,
    headRepository: repository,
  };

  test("explicit marker의 exact head/control과 bot same-repository identity만 승인한다", () => {
    expect(trustedVersionMarker(identity, headSha)).toEqual(strictMarker);
    expect(trustedVersionMarker({ ...identity, body: "Version Packages" }, headSha)).toBeNull();
    expect(
      trustedVersionMarker(
        {
          ...identity,
          body: `<!-- seed-release:${JSON.stringify({ schemaVersion: 1, type: "version", lane: "minor" })} -->`,
        },
        headSha,
      ),
    ).toBeNull();
    expect(trustedVersionMarker({ ...identity, author: "maintainer" }, headSha)).toBeNull();
    expect(
      trustedVersionMarker({ ...identity, headRepository: "fork/seed-design" }, headSha),
    ).toBeNull();
    expect(
      trustedVersionMarker({ ...identity, headRef: "changeset-release/minor-spoof" }, headSha),
    ).toBeNull();
    expect(trustedVersionMarker(identity, "d".repeat(40))).toBeNull();
    expect(
      trustedVersionMarker(
        {
          ...identity,
          body: `<!-- seed-release:${JSON.stringify({ ...strictMarker, controlSha: "short" })} -->`,
        },
        headSha,
      ),
    ).toBeNull();
  });

  test("one-time legacy recovery는 explicit marker와 exact PR/merge SHA만 승인한다", () => {
    const legacyIdentity = {
      ...identity,
      body: `<!-- seed-release:${JSON.stringify({ schemaVersion: 1, type: "version", lane: "minor" })} -->`,
    };
    const recoveries = [
      [
        1943,
        "afa180444a6e70f5b6a60878318f2eae5d6f672d",
        "6c32fa75002bb093e555dd3f769950548bf275e6",
      ],
      [
        1950,
        "94d72dc51167bf5d65b5d06a38ce5f6f7b71f2f4",
        "4ea0b7e286ae784a3ec7c21731e78dbe88309b5f",
      ],
      [
        1955,
        "b3d26c2357b945fc9ecff477fc193451f2391687",
        "b1c26fe31295a5b51ec58f6126d91cf7dc1337d8",
      ],
    ] as const;
    for (const [pullNumber, legacyHeadSha, legacyMergeSha] of recoveries) {
      expect(
        trustedPublishVersionMarker(legacyIdentity, legacyHeadSha, pullNumber, legacyMergeSha),
      ).toMatchObject({ type: "version", lane: "minor" });
      expect(
        isTrustedLegacyPublishRecovery(legacyIdentity, legacyHeadSha, pullNumber, legacyMergeSha),
      ).toBe(true);
    }
    const [, legacyHeadSha, legacyMergeSha] = recoveries[1];
    expect(
      trustedPublishVersionMarker(legacyIdentity, legacyHeadSha, 1950, "d".repeat(40)),
    ).toBeNull();
    expect(
      trustedPublishVersionMarker(legacyIdentity, "d".repeat(40), 1950, legacyMergeSha),
    ).toBeNull();
    expect(
      trustedPublishVersionMarker(legacyIdentity, legacyHeadSha, 1949, legacyMergeSha),
    ).toBeNull();
    expect(
      trustedPublishVersionMarker(
        { ...legacyIdentity, body: "Version Packages" },
        legacyHeadSha,
        1950,
        legacyMergeSha,
      ),
    ).toBeNull();
    expect(
      trustedPublishVersionMarker(
        { ...legacyIdentity, author: "maintainer" },
        legacyHeadSha,
        1950,
        legacyMergeSha,
      ),
    ).toBeNull();
    expect(
      trustedPublishVersionMarker(
        { ...legacyIdentity, headRef: "changeset-release/minor-spoof" },
        legacyHeadSha,
        1950,
        legacyMergeSha,
      ),
    ).toBeNull();
  });

  test("정확한 schema의 GitHub Actions bot 완료 댓글만 인정한다", () => {
    expect(parsePublishRecord(body, repository)).toEqual({ mergeSha, mode: "production" });
    expect(
      isTrustedPublishComment(
        { body, user: { login: "github-actions[bot]" } },
        repository,
        mergeSha,
      ),
    ).toBe(true);
    expect(isTrustedPublishComment({ body, user: { login: "person" } }, repository, mergeSha)).toBe(
      false,
    );
    expect(parsePublishRecord(`${body}\nforged`, repository)).toBeNull();
    expect(parsePublishRecord(body.replace("production`", "dry-run`"), repository)).toBeNull();
    expect(parsePublishRecord(body.replace(repository, "fork/seed-design"), repository)).toBeNull();
    expect(parsePublishRecord(body.replace("github.com", "example.com"), repository)).toBeNull();
    expect(
      parsePublishRecord(body.replace("github.com/", "github.com/prefix/"), repository),
    ).toBeNull();
  });

  test("정확한 bot commit status를 댓글 실패 시 durable checkpoint로 인정한다", () => {
    const status = {
      id: 1,
      context: "seed-release/publish",
      state: "success",
      description: `seed-release-publish:${mergeSha}:production`,
      target_url: `https://github.com/${repository}/actions/runs/123`,
      creator: { login: "github-actions[bot]" },
    };
    expect(isTrustedPublishStatus(status, mergeSha)).toBe(true);
    expect(isTrustedPublishStatus({ ...status, creator: { login: "person" } }, mergeSha)).toBe(
      false,
    );
    expect(isTrustedPublishStatus({ ...status, state: "pending" }, mergeSha)).toBe(false);
  });

  test("trusted eligible 전체를 lane 우선순위 없이 mergedAt/PR FIFO로 정렬한다", () => {
    function queuePull(
      number: number,
      lane: "dev" | "minor" | "major",
      mergedAt: string | null,
      trusted = true,
    ): GitHubPullRequest {
      const queueHeadSha = number.toString(16).padStart(40, "0");
      const queueMergeSha = (number + 100).toString(16).padStart(40, "0");
      const marker: ReleaseMarker = {
        schemaVersion: 1,
        type: "version",
        lane,
        expectedHeadSha: queueHeadSha,
        controlSha: "c".repeat(40),
      };
      return {
        number,
        body: `<!-- seed-release:${JSON.stringify(marker)} -->`,
        draft: false,
        merged_at: mergedAt,
        merge_commit_sha: queueMergeSha,
        created_at: "2026-08-08T00:00:00Z",
        user: { login: trusted ? "github-actions[bot]" : "maintainer" },
        merged_by: { login: "release-maintainer" },
        base: { ref: lane, sha: "d".repeat(40), repo: { full_name: repository } },
        head: {
          ref: `changeset-release/${lane}`,
          sha: queueHeadSha,
          repo: { full_name: repository },
        },
      };
    }

    expect(
      trustedPublishQueuePulls(
        [
          queuePull(30, "major", "2026-08-09T00:00:01Z"),
          queuePull(20, "dev", "2026-08-09T00:00:00Z"),
          queuePull(10, "minor", "2026-08-09T00:00:00Z"),
          queuePull(5, "major", null),
          queuePull(1, "dev", "2026-08-08T00:00:00Z", false),
        ],
        repository,
      ).map((pull) => pull.number),
    ).toEqual([10, 20, 30]);
  });

  test("durable status는 exact Release publish run과 merge-bound record job에 결속한다", async () => {
    const status = {
      id: 1,
      context: "seed-release/publish",
      state: "success",
      description: `seed-release-publish:${mergeSha}:production`,
      target_url: `https://github.com/${repository}/actions/runs/123`,
      creator: { login: "github-actions[bot]" },
    };
    const run = {
      id: 123,
      name: "Release publish",
      path: ".github/workflows/release-publish.yml",
      event: "workflow_dispatch",
      status: "completed",
      conclusion: "success",
      head_branch: "dev",
      repository: { full_name: repository },
    };
    const jobs = [
      {
        id: 456,
        run_id: 123,
        name: `Record successful queue item ${mergeSha}`,
        status: "completed",
        conclusion: "success",
      },
    ];
    expect(isPublishStatusBoundToRun(status, run, jobs, repository, mergeSha)).toBe(true);
    expect(
      isPublishStatusBoundToRun(status, { ...run, event: "push" }, jobs, repository, mergeSha),
    ).toBe(false);
    expect(
      isPublishStatusBoundToRun(
        status,
        run,
        [{ ...jobs[0], name: "Record successful queue item spoof" }],
        repository,
        mergeSha,
      ),
    ).toBe(false);
    expect(
      isPublishStatusBoundToRun(
        { ...status, target_url: `https://github.com/${repository}/actions/runs/999` },
        run,
        jobs,
        repository,
        mergeSha,
      ),
    ).toBe(false);
    const receiptClient = {
      async request<T>(path: string): Promise<T> {
        if (path.endsWith("/actions/runs/123")) return run as T;
        throw new Error(`unexpected request ${path}`);
      },
      async paginate<T>(path: string): Promise<T[]> {
        if (path.endsWith(`/commits/${mergeSha}/statuses`)) return [status] as T[];
        if (path.endsWith("/actions/runs/123/jobs?filter=all")) return jobs as T[];
        throw new Error(`unexpected paginate ${path}`);
      },
    };
    await expect(
      hasBoundPublishReceipt(receiptClient, repository, mergeSha, "production"),
    ).resolves.toBe(true);
    await expect(
      hasBoundPublishReceipt(receiptClient, repository, mergeSha, "dry-run"),
    ).resolves.toBe(false);
    await expect(
      hasBoundPublishReceipt(
        {
          ...receiptClient,
          async paginate<T>(path: string): Promise<T[]> {
            if (path.endsWith(`/commits/${mergeSha}/statuses`)) {
              return [{ ...status, creator: { login: "maintainer" } }] as T[];
            }
            throw new Error(`spoof status must not trigger run lookup: ${path}`);
          },
        },
        repository,
        mergeSha,
      ),
    ).resolves.toBe(false);
    const queueSource = await readFile(join(import.meta.dir, "publish-queue.ts"), "utf8");
    expect(queueSource).not.toContain("/comments");
    expect(queueSource).toContain("hasBoundPublishReceipt");
  });
});

describe("publish authorization validation receipt", () => {
  const headSha = "b".repeat(40);
  const controlSha = "c".repeat(40);
  const approvedMergeSha = "d".repeat(40);
  const pullNumber = 2001;
  const pull = {
    number: pullNumber,
    body: `<!-- seed-release:${JSON.stringify({
      schemaVersion: 1,
      type: "version",
      lane: "minor",
      expectedHeadSha: headSha,
      controlSha,
    })} -->`,
    draft: false,
    merged_at: "2026-08-09T00:00:00Z",
    merge_commit_sha: approvedMergeSha,
    created_at: "2026-08-08T00:00:00Z",
    changed_files: 1,
    user: { login: "github-actions[bot]" },
    merged_by: { login: "release-maintainer" },
    base: { ref: "minor", sha: "e".repeat(40), repo: { full_name: repository } },
    head: {
      ref: "changeset-release/minor",
      sha: headSha,
      repo: { full_name: repository },
    },
  };
  const status = {
    id: 10,
    state: "success" as const,
    context: "Validate release lane",
    description: releaseValidationStatusDescription("workflow_dispatch", headSha),
    target_url: `https://github.com/${repository}/actions/runs/101`,
    updated_at: "2026-08-09T00:01:00Z",
    creator: { login: "github-actions[bot]" },
  };
  const run = {
    id: 101,
    name: releaseValidationWorkflowName,
    path: ".github/workflows/release-pr-validation.yml",
    display_title: releaseValidationRunName(headSha),
    event: "workflow_dispatch",
    status: "completed",
    conclusion: "success",
    head_branch: "dev",
    head_sha: controlSha,
    repository: { full_name: repository },
  };

  function client(
    overrides: { pull?: typeof pull; status?: typeof status; run?: typeof run } = {},
  ) {
    const currentPull = overrides.pull ?? pull;
    const currentStatus = overrides.status ?? status;
    const currentRun = overrides.run ?? run;
    return {
      async request<T>(path: string): Promise<T> {
        if (path.endsWith(`/pulls/${pullNumber}`)) return currentPull as T;
        if (path.endsWith("/actions/runs/101")) return currentRun as T;
        throw new Error(`unexpected request ${path}`);
      },
      async paginate<T>(path: string): Promise<T[]> {
        if (path.includes("/files")) return [{ filename: "packages/a/package.json" }] as T[];
        if (path.includes("/statuses")) return [currentStatus] as T[];
        throw new Error(`unexpected paginate ${path}`);
      },
    };
  }

  test("human merge의 exact head status와 workflow_dispatch run만 authorize한다", async () => {
    await expect(
      verifyPublishPullForAuthorization({ repository, number: pullNumber, client: client() }),
    ).resolves.toMatchObject({
      lane: "minor",
      packagePaths: ["packages/a/package.json"],
      pull: { merge_commit_sha: approvedMergeSha },
    });
  });

  test("spoof/stale status와 run mismatch 및 bot merge를 거부한다", async () => {
    await expect(
      verifyPublishPullForAuthorization({
        repository,
        number: pullNumber,
        client: client({ status: { ...status, creator: { login: "maintainer" } } }),
      }),
    ).rejects.toThrow("validation status");
    await expect(
      verifyPublishPullForAuthorization({
        repository,
        number: pullNumber,
        client: client({
          status: {
            ...status,
            description: releaseValidationStatusDescription("workflow_dispatch", "f".repeat(40)),
          },
        }),
      }),
    ).rejects.toThrow("validation status");
    await expect(
      verifyPublishPullForAuthorization({
        repository,
        number: pullNumber,
        client: client({ run: { ...run, event: "pull_request_target" } }),
      }),
    ).rejects.toThrow("결속");
    await expect(
      verifyPublishPullForAuthorization({
        repository,
        number: pullNumber,
        client: client({ pull: { ...pull, merged_by: { login: "merge-bot[bot]" } } }),
      }),
    ).rejects.toThrow("사람이 merge");
  });

  test("exact legacy PR/head/merge만 validation receipt 없이 one-time 복구한다", async () => {
    const legacyPull = {
      ...pull,
      number: 1950,
      body: `<!-- seed-release:${JSON.stringify({
        schemaVersion: 1,
        type: "version",
        lane: "minor",
      })} -->`,
      head: {
        ...pull.head,
        sha: "94d72dc51167bf5d65b5d06a38ce5f6f7b71f2f4",
      },
      merge_commit_sha: "4ea0b7e286ae784a3ec7c21731e78dbe88309b5f",
    };
    const legacyClient = {
      async request<T>(path: string): Promise<T> {
        if (path.endsWith("/pulls/1950")) return legacyPull as T;
        throw new Error(`legacy recovery must not request validation run: ${path}`);
      },
      async paginate<T>(path: string): Promise<T[]> {
        if (path.endsWith("/pulls/1950/files")) {
          return [{ filename: "packages/a/package.json" }] as T[];
        }
        throw new Error(`legacy recovery must not request validation status: ${path}`);
      },
    };
    await expect(
      verifyPublishPullForAuthorization({ repository, number: 1950, client: legacyClient }),
    ).resolves.toMatchObject({ pull: { number: 1950 } });
    await expect(
      verifyPublishPullForAuthorization({
        repository,
        number: 1950,
        client: {
          ...legacyClient,
          async request<T>(path: string): Promise<T> {
            if (path.endsWith("/pulls/1950")) {
              return {
                ...legacyPull,
                head: { ...legacyPull.head, sha: "f".repeat(40) },
              } as T;
            }
            throw new Error(`unexpected request ${path}`);
          },
        },
      }),
    ).rejects.toThrow("신뢰할 수 있는 Version Packages PR");
  });
});

describe("authoritative publish package input", () => {
  test("GitHub PR changed_files와 paginated files가 exact 일치해야 한다", () => {
    expect(() => assertCompletePullFileList(2, 2)).not.toThrow();
    expect(() => assertCompletePullFileList(2, 1)).toThrow("완전하지 않습니다");
    expect(() => assertCompletePullFileList(3_000, 3_000)).toThrow("검증 한도");
    expect(() => assertCompletePullFileList(Number.NaN, 0)).toThrow("changed_files");
  });

  test("PR files에서 package manifest 경로만 고정하고 unsafe 입력을 거부한다", () => {
    const paths = authorizedPackageManifestPaths([
      { filename: "packages/z/package.json" },
      { filename: "packages/a/package.json" },
      { filename: "packages/a/package.json" },
      { filename: "packages/a/CHANGELOG.md" },
    ]);
    expect(paths).toEqual(["packages/a/package.json", "packages/z/package.json"]);
    expect(parseAuthorizedPackageManifestPaths(JSON.stringify(paths))).toEqual(paths);
    for (const invalid of [
      "[]",
      '["../package.json"]',
      '["packages/a/package.json","packages/a/package.json"]',
    ]) {
      expect(() => parseAuthorizedPackageManifestPaths(invalid)).toThrow();
    }
  });

  test("여러 commit에 나뉜 package 변경도 승인된 PR files 전체에서 읽는다", async () => {
    const repositoryPath = await mkdtemp(join(tmpdir(), "publish-plan-files-test-"));
    temporaryDirectories.push(repositoryPath);
    expect((await command(["git", "init", "--initial-branch=dev"], repositoryPath)).exitCode).toBe(
      0,
    );
    expect(
      (await command(["git", "config", "user.name", "Release Test"], repositoryPath)).exitCode,
    ).toBe(0);
    expect(
      (await command(["git", "config", "user.email", "release@example.com"], repositoryPath))
        .exitCode,
    ).toBe(0);
    expect(
      (await command(["git", "config", "commit.gpgsign", "false"], repositoryPath)).exitCode,
    ).toBe(0);

    await mkdir(join(repositoryPath, "packages/a"), { recursive: true });
    await writeFile(
      join(repositoryPath, "packages/a/package.json"),
      `${JSON.stringify({ name: "@seed-design/a", version: "1.0.0" })}\n`,
    );
    expect((await command(["git", "add", "--all"], repositoryPath)).exitCode).toBe(0);
    expect((await command(["git", "commit", "-m", "version a"], repositoryPath)).exitCode).toBe(0);

    await mkdir(join(repositoryPath, "packages/b"), { recursive: true });
    await writeFile(
      join(repositoryPath, "packages/b/package.json"),
      `${JSON.stringify({ name: "@seed-design/b", version: "2.0.0" })}\n`,
    );
    expect((await command(["git", "add", "--all"], repositoryPath)).exitCode).toBe(0);
    expect((await command(["git", "commit", "-m", "version b"], repositoryPath)).exitCode).toBe(0);
    const approvedSha = (await command(["git", "rev-parse", "HEAD"], repositoryPath)).stdout.trim();

    await expect(
      packagesFromAuthorizedPullFiles(
        ["packages/a/package.json", "packages/b/package.json"],
        approvedSha,
        repositoryPath,
      ),
    ).resolves.toEqual([
      { name: "@seed-design/a", version: "1.0.0", path: "packages/a" },
      { name: "@seed-design/b", version: "2.0.0", path: "packages/b" },
    ]);
    await expect(
      packagesFromAuthorizedPullFiles(["packages/a/package.json"], "d".repeat(40), repositoryPath),
    ).rejects.toThrow("승인 merge SHA");
  });
});

describe("package tag reconciliation", () => {
  test("registry fetch를 mock하고 existing version의 gitHead를 fail-closed 검증한다", async () => {
    const packages = [{ name: "@seed-design/react", version: "1.2.3" }];
    const requested: string[] = [];
    const documents = await fetchRegistryDocuments(packages, {
      registryUrl: "https://registry.test/",
      fetcher: (async (input) => {
        requested.push(String(input));
        return new Response(JSON.stringify({ versions: { "1.2.3": { gitHead: mergeSha } } }), {
          status: 200,
        });
      }) as typeof fetch,
    });
    expect(requested).toEqual(["https://registry.test/%40seed-design%2Freact"]);
    expect(inspectRegistryGitHeads(packages, documents, mergeSha).missing).toEqual([]);
    expect(() =>
      inspectRegistryGitHeads(
        packages,
        new Map([["@seed-design/react", { versions: { "1.2.3": { gitHead: "b".repeat(40) } } }]]),
        mergeSha,
      ),
    ).toThrow("npm gitHead가 승인 merge SHA와 다릅니다");
    expect(
      inspectRegistryGitHeads(packages, new Map([["@seed-design/react", null]]), mergeSha).missing,
    ).toEqual(packages);
  });

  test("partial retry는 existing dist-tag/integrity를 exact artifact에 결속하고 missing은 허용한다", () => {
    const packages = [
      { name: "@seed-design/react", version: "1.2.3-beta.1", integrity: npmIntegrity },
    ];
    const exactDocument = {
      versions: {
        "1.2.3-beta.1": { gitHead: mergeSha, dist: { integrity: npmIntegrity } },
      },
      "dist-tags": { beta: "1.2.3-beta.1" },
    };
    const exact = inspectRegistryGitHeads(
      packages,
      new Map([["@seed-design/react", exactDocument]]),
      mergeSha,
      "beta",
    );
    expect(exact).toEqual({
      missing: [],
      distTagMismatches: [],
      integrityMismatches: [],
    });

    const wrong = inspectRegistryGitHeads(
      packages,
      new Map([
        [
          "@seed-design/react",
          {
            ...exactDocument,
            versions: {
              "1.2.3-beta.1": {
                gitHead: mergeSha,
                dist: { integrity: `sha512-${"B".repeat(86)}==` },
              },
            },
            "dist-tags": { beta: "1.2.2-beta.9" },
          },
        ],
      ]),
      mergeSha,
      "beta",
    );
    expect(() => assertExactRegistryDistTags(wrong.distTagMismatches)).toThrow("dist-tag");
    expect(() => assertExactRegistryIntegrities(wrong.integrityMismatches)).toThrow("integrity");

    const missing = inspectRegistryGitHeads(
      packages,
      new Map([["@seed-design/react", { versions: {}, "dist-tags": { beta: "1.2.2-beta.9" } }]]),
      mergeSha,
      "beta",
    );
    expect(missing).toEqual({
      missing: packages,
      distTagMismatches: [],
      integrityMismatches: [],
    });
  });

  test("publish plan package를 strict SemVer tag로 변환한다", () => {
    const packages = parsePublishPackages(
      JSON.stringify([
        { name: "@seed-design/react", version: "1.2.3", path: "packages/react" },
        { name: "seed-cli", version: "2.0.0-beta.1" },
      ]),
    );
    expect(packages.map(packageTag)).toEqual(["@seed-design/react@1.2.3", "seed-cli@2.0.0-beta.1"]);
    expect(() => parsePublishPackages('[{"name":"-bad","version":"1.0.0"}]')).toThrow();
    expect(() => parsePublishPackages('[{"name":"valid","version":"not-semver"}]')).toThrow();
  });

  test("lightweight와 annotated 원격 tag에서 commit을 읽는다", () => {
    const tag = "@seed-design/react@1.2.3";
    expect(commitFromLsRemote(`${mergeSha}\trefs/tags/${tag}`, tag)).toBe(mergeSha);
    expect(
      commitFromLsRemote(
        `${"b".repeat(40)}\trefs/tags/${tag}\n${mergeSha}\trefs/tags/${tag}^{}`,
        tag,
      ),
    ).toBe(mergeSha);
    const other = "@seed-design/css@2.0.0";
    expect(
      commitsFromLsRemote(`${mergeSha}\trefs/tags/${tag}\n${"c".repeat(40)}\trefs/tags/${other}`, [
        tag,
        other,
      ]),
    ).toEqual(
      new Map([
        [tag, mergeSha],
        [other, "c".repeat(40)],
      ]),
    );
  });

  test("누락 tag만 만들거나 push하고 SHA 불일치는 fail-closed다", () => {
    expect(planTagReconciliation(mergeSha, null, null)).toBe("create-and-push");
    expect(planTagReconciliation(mergeSha, mergeSha, null)).toBe("push-local");
    expect(planTagReconciliation(mergeSha, mergeSha, mergeSha)).toBe("already-pushed");
    expect(() => planTagReconciliation(mergeSha, "b".repeat(40), null)).toThrow(
      "승인 merge SHA와 다릅니다",
    );
    expect(() => planTagReconciliation(mergeSha, mergeSha, "b".repeat(40))).toThrow(
      "승인 merge SHA와 다릅니다",
    );
  });

  test("CLI가 누락 package tag를 exact commit에 atomic push하고 불일치를 거부한다", async () => {
    const directory = await mkdtemp(join(tmpdir(), "publish-tag-test-"));
    temporaryDirectories.push(directory);
    const remote = join(directory, "remote.git");
    const checkout = join(directory, "checkout");
    expect((await command(["git", "init", "--bare", remote])).exitCode).toBe(0);
    expect((await command(["git", "clone", remote, checkout])).exitCode).toBe(0);
    expect((await command(["git", "config", "user.name", "Release Test"], checkout)).exitCode).toBe(
      0,
    );
    expect(
      (await command(["git", "config", "user.email", "release@example.com"], checkout)).exitCode,
    ).toBe(0);
    expect((await command(["git", "config", "commit.gpgsign", "false"], checkout)).exitCode).toBe(
      0,
    );
    expect(
      (await command(["git", "commit", "--allow-empty", "-m", "version packages"], checkout))
        .exitCode,
    ).toBe(0);
    const approvedSha = (await command(["git", "rev-parse", "HEAD"], checkout)).stdout.trim();
    const packages = JSON.stringify([
      { name: "@seed-design/react", version: "1.2.3", integrity: npmIntegrity },
    ]);
    const registryFixture = (gitHead: string) =>
      JSON.stringify({
        "@seed-design/react": {
          versions: { "1.2.3": { gitHead, dist: { integrity: npmIntegrity } } },
          "dist-tags": { latest: "1.2.3" },
        },
      });
    const script = join(import.meta.dir, "reconcile-publish-tags.ts");

    const write = await command(["bun", script, "write"], checkout, {
      PUBLISH_MERGE_SHA: approvedSha,
      PUBLISH_PACKAGES: packages,
      PUBLISH_DIST_TAG: "latest",
      NPM_REGISTRY_FIXTURE_JSON: registryFixture(approvedSha),
    });
    expect(write.exitCode, write.stderr).toBe(0);
    const remoteTag = await command(
      ["git", "ls-remote", "--tags", "origin", "refs/tags/@seed-design/react@1.2.3"],
      checkout,
    );
    expect(remoteTag.stdout).toContain(approvedSha);
    const retry = await command(["bun", script, "write"], checkout, {
      PUBLISH_MERGE_SHA: approvedSha,
      PUBLISH_PACKAGES: packages,
      PUBLISH_DIST_TAG: "latest",
      NPM_REGISTRY_FIXTURE_JSON: registryFixture(approvedSha),
    });
    expect(retry.exitCode, retry.stderr).toBe(0);
    expect(retry.stdout).toContain("이미 승인 merge SHA를 가리킵니다");

    expect(
      (await command(["git", "commit", "--allow-empty", "-m", "next version"], checkout)).exitCode,
    ).toBe(0);
    const differentSha = (await command(["git", "rev-parse", "HEAD"], checkout)).stdout.trim();
    const mismatch = await command(["bun", script, "check"], checkout, {
      PUBLISH_MERGE_SHA: differentSha,
      PUBLISH_PACKAGES: packages,
      PUBLISH_DIST_TAG: "latest",
      NPM_REGISTRY_FIXTURE_JSON: registryFixture(differentSha),
    });
    expect(mismatch.exitCode).not.toBe(0);
    expect(mismatch.stderr).toContain("승인 merge SHA와 다릅니다");
  });
});
