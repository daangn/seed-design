import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { encodeMarker, type CodePromotionMarker, type StablePromotionMarker } from "../core/marker";
import type { PromotionTargetPlan } from "../core/types";
import {
  releaseValidationRunName,
  releaseValidationStatusDescription,
} from "../core/validation-status";
import { resolveCodePromotionReceipt } from "./code-promotion-state";

const repositories: string[] = [];
const repositoryName = "daangn/seed-design";
const manifest = "1".repeat(64);

async function git(cwd: string, ...args: string[]): Promise<string> {
  const child = Bun.spawn(["git", ...args], { cwd, stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(stderr);
  return stdout.trim();
}

async function fixture() {
  const repository = await mkdtemp(join(tmpdir(), "seed-code-receipt-"));
  repositories.push(repository);
  await git(repository, "init", "-q");
  await git(repository, "config", "user.name", "test");
  await git(repository, "config", "user.email", "test@example.com");
  await writeFile(join(repository, "value.txt"), "base\n");
  await git(repository, "add", "value.txt");
  await git(repository, "commit", "-qm", "base");
  const base = await git(repository, "rev-parse", "HEAD");
  await writeFile(join(repository, "value.txt"), "promoted\n");
  await git(repository, "commit", "-qam", "promotion");
  const head = await git(repository, "rev-parse", "HEAD");
  const tree = await git(repository, "rev-parse", "HEAD^{tree}");
  await git(repository, "remote", "add", "origin", repository);
  return { repository, base, head, tree };
}

afterEach(async () => {
  await Promise.all(
    repositories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

function stableMarker(target: PromotionTargetPlan): StablePromotionMarker {
  return {
    schemaVersion: 1,
    type: "version",
    lane: "minor",
    releaseKind: "stable-promotion",
    operationId: "9",
    expectedBaseSha: "2".repeat(40),
    expectedHeadSha: "3".repeat(40),
    controlSha: "4".repeat(40),
    exitPr: 8,
    exitBaseSha: "5".repeat(40),
    exitMergeSha: "2".repeat(40),
    enterPr: 7,
    enterMergeSha: "6".repeat(40),
    promotionManifestSha256: manifest,
    stablePatchSha256: "7".repeat(64),
    promotionTargets: [target],
  };
}

describe("code promotion merge receipt", () => {
  test("exact human merge, lane validation, current SHA와 tree를 함께 요구한다", async () => {
    const repository = await fixture();
    const target: PromotionTargetPlan = {
      lane: "dev",
      expectedBaseSha: repository.base,
      expectedHeadSha: repository.head,
      expectedCodeTreeSha: repository.tree,
      expectedBaselineTreeSha: "8".repeat(40),
      patchSha256: "9".repeat(64),
      noOp: false,
    };
    const stable = stableMarker(target);
    const marker: CodePromotionMarker = {
      schemaVersion: 1,
      type: "code-promotion",
      lane: "dev",
      sourceLane: "minor",
      stablePr: 10,
      stableVersionHeadSha: stable.expectedHeadSha,
      enterPr: stable.enterPr,
      enterMergeSha: stable.enterMergeSha,
      exitPr: stable.exitPr,
      exitBaseSha: stable.exitBaseSha,
      exitMergeSha: stable.exitMergeSha,
      expectedBaseSha: target.expectedBaseSha,
      expectedHeadSha: target.expectedHeadSha,
      expectedCodeTreeSha: target.expectedCodeTreeSha,
      expectedBaselineTreeSha: target.expectedBaselineTreeSha,
      promotionManifestSha256: manifest,
      patchSha256: target.patchSha256,
      stablePatchSha256: stable.stablePatchSha256,
      controlSha: stable.controlSha,
      controlTreeSha256: "a".repeat(64),
    };
    const pull = {
      number: 11,
      body: encodeMarker(marker),
      draft: false,
      merged_at: "2026-08-10T00:00:00Z",
      merge_commit_sha: repository.head,
      created_at: "2026-08-10T00:00:00Z",
      user: { login: "github-actions[bot]" },
      merged_by: { login: "human" },
      base: { ref: "dev", sha: repository.base, repo: { full_name: repositoryName } },
      head: {
        ref: `release-code-promotion/dev/10-${manifest.slice(0, 12)}`,
        sha: repository.head,
        repo: { full_name: repositoryName },
      },
    };
    const runId = 99;
    const client = {
      async paginate<T>(path: string): Promise<T[]> {
        if (path.includes("pulls?state=closed")) return [pull] as T[];
        if (path.includes("/statuses")) {
          return [
            {
              id: 1,
              state: "success",
              context: "Validate release lane",
              description: releaseValidationStatusDescription("workflow_dispatch", repository.head),
              target_url: `https://github.com/${repositoryName}/actions/runs/${runId}`,
              updated_at: "2026-08-10T00:01:00Z",
              creator: { login: "github-actions[bot]" },
            },
          ] as T[];
        }
        throw new Error(path);
      },
      async request<T>(path: string): Promise<T> {
        if (path.includes("/branches/dev")) return { commit: { sha: repository.head } } as T;
        if (path.includes(`/actions/runs/${runId}`)) {
          return {
            id: runId,
            name: releaseValidationRunName(repository.head),
            path: ".github/workflows/release-pr-validation.yml",
            display_title: releaseValidationRunName(repository.head),
            event: "workflow_dispatch",
            status: "completed",
            conclusion: "success",
            head_branch: "dev",
            head_sha: "b".repeat(40),
            repository: { full_name: repositoryName },
          } as T;
        }
        throw new Error(path);
      },
    };
    await expect(
      resolveCodePromotionReceipt({
        client,
        repository: repositoryName,
        repositoryPath: repository.repository,
        stablePr: 10,
        stableMarker: stable,
        target,
      }),
    ).resolves.toEqual({ lane: "dev", mergeSha: repository.head, noOp: false });
    const drifted = {
      ...client,
      async request<T>(path: string): Promise<T> {
        if (path.includes("/branches/dev")) return { commit: { sha: repository.base } } as T;
        return client.request<T>(path);
      },
    };
    await expect(
      resolveCodePromotionReceipt({
        client: drifted,
        repository: repositoryName,
        repositoryPath: repository.repository,
        stablePr: 10,
        stableMarker: stable,
        target,
      }),
    ).resolves.toBeNull();
  });

  test("no-op은 exact target base가 current일 때만 인정한다", async () => {
    const target: PromotionTargetPlan = {
      lane: "major",
      expectedBaseSha: "b".repeat(40),
      expectedHeadSha: "b".repeat(40),
      expectedCodeTreeSha: "c".repeat(40),
      expectedBaselineTreeSha: "d".repeat(40),
      patchSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      noOp: true,
    };
    const client = (sha: string) => ({
      async paginate<T>(): Promise<T[]> {
        return [];
      },
      async request<T>(): Promise<T> {
        return { commit: { sha } } as T;
      },
    });
    await expect(
      resolveCodePromotionReceipt({
        client: client(target.expectedBaseSha),
        repository: repositoryName,
        repositoryPath: ".",
        stablePr: 10,
        stableMarker: stableMarker(target),
        target,
      }),
    ).resolves.toEqual({ lane: "major", mergeSha: target.expectedBaseSha, noOp: true });
    await expect(
      resolveCodePromotionReceipt({
        client: client("f".repeat(40)),
        repository: repositoryName,
        repositoryPath: ".",
        stablePr: 10,
        stableMarker: stableMarker(target),
        target,
      }),
    ).resolves.toBeNull();
  });
});
