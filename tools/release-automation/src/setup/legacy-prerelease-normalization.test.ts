import { afterEach, describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { GitHubPullRequest } from "../core/github";
import { encodeMarker, type LegacyNormalizationMarker } from "../core/marker";
import {
  releaseValidationRunName,
  releaseValidationStatusDescription,
  type ReleaseValidationStatus,
  type ReleaseValidationWorkflowRun,
} from "../core/validation-status";
import {
  assertLegacyNormalizationBoundary,
  assertLegacyPreState,
  assertReleaseWorkflowsDisabled,
  inspectLegacyNormalization,
  legacyLaneHeads,
  legacyNormalizationBranch,
  legacyNormalizationRepository,
  legacyPreSha256,
  type LegacyNormalizationClient,
  type LegacyNormalizationLane,
  verifyLegacyNormalizationPull,
} from "./legacy-prerelease-normalization";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

async function git(cwd: string, arguments_: string[], trim = true): Promise<string> {
  const child = Bun.spawn(["git", ...arguments_], { cwd, stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`git ${arguments_.join(" ")} 실패:\n${stderr}`);
  return trim ? stdout.trim() : stdout;
}

interface GeneratedNormalization {
  marker: LegacyNormalizationMarker;
  pull: GitHubPullRequest;
  mergeSha: string;
  run: ReleaseValidationWorkflowRun;
  status: ReleaseValidationStatus;
}

interface Fixture {
  repository: string;
  controlSha: string;
  generated: GeneratedNormalization[];
}

async function fixture(): Promise<Fixture> {
  const root = await mkdtemp(join(tmpdir(), "seed-legacy-normalization-test-"));
  temporaryDirectories.push(root);
  const origin = join(root, "origin.git");
  const repository = join(root, "repository");
  await git(root, ["clone", "--mirror", process.cwd(), origin]);
  await git(root, ["clone", origin, repository]);
  await git(repository, ["config", "user.name", "github-actions[bot]"]);
  await git(repository, [
    "config",
    "user.email",
    "41898282+github-actions[bot]@users.noreply.github.com",
  ]);
  await git(repository, ["config", "commit.gpgsign", "false"]);
  const controlSha = await git(repository, ["rev-parse", "HEAD"]);
  await git(repository, ["update-ref", "refs/remotes/origin/dev", controlSha]);
  await git(repository, ["update-ref", "refs/remotes/origin/minor", legacyLaneHeads.minor]);
  await git(repository, ["update-ref", "refs/remotes/origin/major", legacyLaneHeads.major]);
  return { repository, controlSha, generated: [] };
}

async function generate(
  value: Fixture,
  lane: LegacyNormalizationLane,
  number: number,
): Promise<GeneratedNormalization> {
  const baseSha = legacyLaneHeads[lane];
  const operationId = String(700 + number);
  await git(value.repository, ["switch", "--detach", baseSha]);
  await git(value.repository, ["rm", ".changeset/pre.json"]);
  await git(value.repository, [
    "commit",
    "-m",
    `chore(release): normalize legacy ${lane} prerelease`,
  ]);
  const headSha = await git(value.repository, ["rev-parse", "HEAD"]);
  const patch = await git(
    value.repository,
    ["diff", "--binary", "--full-index", "--no-ext-diff", baseSha, headSha, "--"],
    false,
  );
  const patchSha256 = createHash("sha256").update(patch).digest("hex");
  const marker: LegacyNormalizationMarker = {
    schemaVersion: 1,
    type: "legacy-normalization",
    lane,
    operationId,
    sourceRepository: legacyNormalizationRepository,
    expectedBaseSha: baseSha,
    expectedHeadSha: headSha,
    expectedPreSha256: legacyPreSha256,
    patchSha256,
    controlSha: value.controlSha,
  };
  await git(value.repository, ["push", "origin", `${headSha}:refs/pull/${number}/head`]);
  const treeSha = await git(value.repository, ["rev-parse", `${headSha}^{tree}`]);
  const mergeSha = await git(value.repository, [
    "commit-tree",
    treeSha,
    "-p",
    baseSha,
    "-m",
    `Squash ${lane} normalization`,
  ]);
  const status: ReleaseValidationStatus = {
    id: number,
    state: "success",
    context: "Validate release lane",
    description: releaseValidationStatusDescription("workflow_dispatch", headSha),
    target_url: `https://github.com/${legacyNormalizationRepository}/actions/runs/${number}`,
    updated_at: "2026-08-10T00:00:00.000Z",
    creator: { login: "github-actions[bot]" },
  };
  const run: ReleaseValidationWorkflowRun = {
    id: number,
    name: releaseValidationRunName(headSha),
    path: ".github/workflows/release-pr-validation.yml",
    display_title: releaseValidationRunName(headSha),
    event: "workflow_dispatch",
    status: "completed",
    conclusion: "success",
    head_branch: "dev",
    head_sha: value.controlSha,
    repository: { full_name: legacyNormalizationRepository },
  };
  const pull: GitHubPullRequest = {
    number,
    body: encodeMarker(marker),
    draft: false,
    merged_at: "2026-08-10T00:00:00.000Z",
    merge_commit_sha: mergeSha,
    created_at: "2026-08-10T00:00:00.000Z",
    user: { login: "github-actions[bot]" },
    merged_by: { login: "maintainer" },
    base: { ref: lane, sha: baseSha, repo: { full_name: legacyNormalizationRepository } },
    head: {
      ref: legacyNormalizationBranch(lane, operationId),
      sha: headSha,
      repo: { full_name: legacyNormalizationRepository },
    },
  };
  const generated = { marker, pull, mergeSha, run, status };
  value.generated.push(generated);
  return generated;
}

function client(
  value: Fixture,
  options: {
    listedPulls?: (pull: GitHubPullRequest) => GitHubPullRequest;
    detailedPulls?: (pull: GitHubPullRequest) => GitHubPullRequest;
  } = {},
): LegacyNormalizationClient {
  return {
    async paginate<T>(path: string): Promise<T[]> {
      if (path.includes("pulls?")) {
        const lane = path.includes("base=minor") ? "minor" : "major";
        return value.generated
          .filter((item) => item.marker.lane === lane)
          .map((item) => options.listedPulls?.(item.pull) ?? item.pull) as T[];
      }
      if (path.includes("/statuses")) {
        const item = value.generated.find((candidate) =>
          path.includes(candidate.marker.expectedHeadSha),
        );
        return (item ? [item.status] : []) as T[];
      }
      throw new Error(`unexpected paginate path: ${path}`);
    },
    async request<T>(path: string): Promise<T> {
      const pull = value.generated.find((candidate) =>
        path.endsWith(`/pulls/${candidate.pull.number}`),
      );
      if (pull) return (options.detailedPulls?.(pull.pull) ?? pull.pull) as T;
      const item = value.generated.find((candidate) => path.endsWith(`/${candidate.run.id}`));
      if (!item) throw new Error(`unexpected request path: ${path}`);
      return item.run as T;
    },
  };
}

async function merge(value: Fixture, generated: GeneratedNormalization): Promise<void> {
  await git(value.repository, [
    "push",
    "--force",
    "origin",
    `${generated.mergeSha}:refs/heads/${generated.marker.lane}`,
  ]);
  await git(value.repository, [
    "update-ref",
    `refs/remotes/origin/${generated.marker.lane}`,
    generated.mergeSha,
  ]);
}

describe("one-time legacy prerelease normalization", () => {
  test("publish, Version PR, sync workflow는 disabled_manually 상태를 유지한다", async () => {
    const disabledClient: LegacyNormalizationClient = {
      async paginate<T>(): Promise<T[]> {
        return [];
      },
      async request<T>(): Promise<T> {
        return { state: "disabled_manually" } as T;
      },
    };
    await expect(
      assertReleaseWorkflowsDisabled(legacyNormalizationRepository, disabledClient),
    ).resolves.toBeUndefined();
    await expect(
      assertReleaseWorkflowsDisabled(legacyNormalizationRepository, {
        ...disabledClient,
        async request<T>(): Promise<T> {
          return { state: "active" } as T;
        },
      }),
    ).rejects.toThrow("disabled_manually");
  });

  test("고정된 두 legacy head의 exact pre.json과 빈 changesets를 검증한다", async () => {
    await expect(
      assertLegacyPreState(process.cwd(), legacyLaneHeads.minor, "minor"),
    ).resolves.toBeUndefined();
    await expect(
      assertLegacyPreState(process.cwd(), legacyLaneHeads.major, "major"),
    ).resolves.toBeUndefined();
    await expect(assertLegacyPreState(process.cwd(), "HEAD", "minor")).rejects.toThrow();
  });

  test("generated PR은 exact base의 단일 자식이며 pre.json 삭제만 허용한다", async () => {
    const value = await fixture();
    const generated = await generate(value, "minor", 101);
    await expect(
      verifyLegacyNormalizationPull({
        repositoryPath: value.repository,
        repository: legacyNormalizationRepository,
        marker: generated.marker,
        pull: generated.pull,
      }),
    ).resolves.toBeUndefined();

    await expect(
      verifyLegacyNormalizationPull({
        repositoryPath: value.repository,
        repository: legacyNormalizationRepository,
        marker: { ...generated.marker, expectedPreSha256: "f".repeat(64) },
        pull: generated.pull,
      }),
    ).rejects.toThrow("exact one-time 계약");
  });

  test(
    "한 lane만 human squash merge된 중간 상태에서는 다른 operation을 잠근다",
    async () => {
      const value = await fixture();
      const minor = await generate(value, "minor", 201);
      await merge(value, minor);
      const status = await inspectLegacyNormalization({
        repositoryPath: value.repository,
        repository: legacyNormalizationRepository,
        client: client(value),
      });
      expect(status).toEqual({
        complete: false,
        lanes: { minor: "normalized", major: "legacy" },
      });
      await expect(
        assertLegacyNormalizationBoundary({
          repositoryPath: value.repository,
          repository: legacyNormalizationRepository,
          client: client(value),
          marker: null,
        }),
      ).rejects.toThrow("다른 release operation");

      const major = await generate(value, "major", 202);
      await merge(value, major);
      await expect(
        assertLegacyNormalizationBoundary({
          repositoryPath: value.repository,
          repository: legacyNormalizationRepository,
          client: client(value),
          marker: null,
        }),
      ).resolves.toBeUndefined();
    },
    { timeout: 30_000 },
  );

  test("목록의 merged_by가 null이어도 개별 PR의 human merge로 normalization 완료를 증명한다", async () => {
    const value = await fixture();
    const minor = await generate(value, "minor", 301);
    const major = await generate(value, "major", 302);
    await merge(value, minor);
    await merge(value, major);
    const listMergedByNull = client(value, {
      listedPulls: (pull) => ({ ...pull, merged_by: null }),
    });

    await expect(
      assertLegacyNormalizationBoundary({
        repositoryPath: value.repository,
        repository: legacyNormalizationRepository,
        client: listMergedByNull,
        marker: null,
      }),
    ).resolves.toBeUndefined();

    const [selection, validation] = await Promise.all([
      readFile("tools/release-automation/src/validation/release-selection.ts", "utf8"),
      readFile("tools/release-automation/src/validation/generated-pr-validation.ts", "utf8"),
    ]);
    expect(selection).toContain("await assertLegacyNormalizationBoundary({");
    expect(validation).toContain(
      "await assertLegacyNormalizationBoundary({ repository, client, marker });",
    );
  });

  test("개별 PR의 bot merger 또는 목록과 다른 identity는 fail-closed한다", async () => {
    const value = await fixture();
    const minor = await generate(value, "minor", 401);
    await merge(value, minor);

    await expect(
      inspectLegacyNormalization({
        repositoryPath: value.repository,
        repository: legacyNormalizationRepository,
        client: client(value, {
          listedPulls: (pull) => ({ ...pull, merged_by: null }),
          detailedPulls: (pull) => ({ ...pull, merged_by: { login: "github-actions[bot]" } }),
        }),
      }),
    ).rejects.toThrow("개별 PR merge identity");

    await expect(
      inspectLegacyNormalization({
        repositoryPath: value.repository,
        repository: legacyNormalizationRepository,
        client: client(value, {
          detailedPulls: (pull) => ({
            ...pull,
            head: { ...pull.head, sha: "f".repeat(40) },
          }),
        }),
      }),
    ).rejects.toThrow("목록/개별 PR identity");
  });

  test("복수의 immutable identity 후보는 individual PR 조회 뒤에도 거부한다", async () => {
    const value = await fixture();
    const minor = await generate(value, "minor", 501);
    await merge(value, minor);
    const duplicate: GeneratedNormalization = {
      ...minor,
      pull: { ...minor.pull, number: 502 },
    };
    value.generated.push(duplicate);

    await expect(
      inspectLegacyNormalization({
        repositoryPath: value.repository,
        repository: legacyNormalizationRepository,
        client: client(value, { listedPulls: (pull) => ({ ...pull, merged_by: null }) }),
      }),
    ).rejects.toThrow("merge 증명이 유일하지 않습니다");
  });
});
