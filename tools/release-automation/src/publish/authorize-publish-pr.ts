import { appendFile } from "node:fs/promises";
import { GitHubClient, type GitHubPullRequest } from "../core/github";
import { authorizePublish } from "./publish";
import { isLaneName, parseReleaseControl } from "../core/config";
import {
  assertCompletePullFileList,
  authorizedPackageManifestPaths,
  isTrustedLegacyPublishRecovery,
  trustedPublishVersionMarker,
} from "./publish-state";
import {
  isValidationStatusBoundToRun,
  latestValidationStatus,
  type ReleaseValidationStatus,
  type ReleaseValidationWorkflowRun,
  validationRunIdFromStatus,
} from "../core/validation-status";
import type { LaneName, ReleaseMarker } from "../core/types";
import { isStablePromotionMarker } from "../core/marker";
import {
  assertStablePromotionControlMode,
  verifyStablePromotionPreflight,
} from "../validation/stable-promotion";
import { assertDevStablePublishReconciled } from "./baseline-reconciliation-state";

interface PublishAuthorizationClient {
  request<T>(path: string): Promise<T>;
  paginate<T>(path: string): Promise<T[]>;
}

export interface VerifiedPublishPull {
  pull: GitHubPullRequest & { changed_files: number };
  marker: ReleaseMarker;
  lane: LaneName;
  packagePaths: string[];
  stablePromotion: boolean;
}

export function requiresStableBaselineReconciliation(
  mode: "dry-run" | "production",
  lane: LaneName,
  stablePromotion: boolean,
): boolean {
  return mode === "production" && (lane === "dev" || stablePromotion);
}

async function assertCurrentSiblingDormant(lane: "minor" | "major"): Promise<void> {
  const sibling = lane === "minor" ? "major" : "minor";
  const fetch = Bun.spawn(
    [
      "git",
      "fetch",
      "--no-tags",
      "origin",
      `+refs/heads/${sibling}:refs/remotes/origin/${sibling}`,
    ],
    { stdout: "pipe", stderr: "pipe" },
  );
  if ((await fetch.exited) !== 0) throw new Error(`${sibling} sibling ref를 읽지 못했습니다.`);
  const show = Bun.spawn(["git", "show", `origin/${sibling}:.changeset/pre.json`], {
    stdout: "pipe",
    stderr: "pipe",
  });
  await new Response(show.stdout).text();
  if ((await show.exited) === 0) {
    throw new Error(`stable promotion 전 sibling ${sibling} lane은 dormant여야 합니다.`);
  }
}

export async function verifyPublishPullForAuthorization(options: {
  repository: string;
  number: number;
  client: PublishAuthorizationClient;
}): Promise<VerifiedPublishPull> {
  const { client, number, repository } = options;
  const pull = await client.request<GitHubPullRequest & { changed_files: number }>(
    `/repos/${repository}/pulls/${number}`,
  );
  if (
    !pull.merged_at ||
    !pull.merge_commit_sha ||
    !pull.merged_by?.login ||
    pull.merged_by.login.endsWith("[bot]")
  ) {
    throw new Error(`PR #${number}은 사람이 merge한 PR이 아닙니다.`);
  }
  const lane = pull.base.ref;
  if (!isLaneName(lane)) throw new Error(`${lane}은 릴리즈 레인이 아닙니다.`);
  const identity = {
    author: pull.user.login,
    body: pull.body ?? "",
    baseRef: pull.base.ref,
    headRef: pull.head.ref,
    baseRepository: pull.base.repo.full_name,
    headRepository: pull.head.repo?.full_name ?? "",
  };
  const marker = trustedPublishVersionMarker(
    identity,
    pull.head.sha,
    pull.number,
    pull.merge_commit_sha,
  );
  if (!marker) throw new Error(`PR #${number}은 신뢰할 수 있는 Version Packages PR이 아닙니다.`);
  const stablePromotion = isStablePromotionMarker(marker);
  if (stablePromotion) {
    await verifyStablePromotionPreflight({
      repositoryPath: process.cwd(),
      repository,
      marker,
      versionPull: pull,
      client,
    });
  }
  const legacyRecovery = isTrustedLegacyPublishRecovery(
    identity,
    pull.head.sha,
    pull.number,
    pull.merge_commit_sha,
  );

  const [pullFiles, statuses] = await Promise.all([
    client.paginate<{ filename: string }>(`/repos/${repository}/pulls/${number}/files`),
    legacyRecovery
      ? Promise.resolve([])
      : client.paginate<ReleaseValidationStatus>(
          `/repos/${repository}/commits/${pull.head.sha}/statuses`,
        ),
  ]);
  assertCompletePullFileList(pull.changed_files, pullFiles.length);
  const packagePaths = authorizedPackageManifestPaths(pullFiles);
  if (packagePaths.length === 0) {
    throw new Error(`PR #${number}에 게시 대상으로 승인할 package.json 변경이 없습니다.`);
  }

  if (!legacyRecovery) {
    const status = latestValidationStatus(statuses, repository, pull.head.sha, "workflow_dispatch");
    const runId = status ? validationRunIdFromStatus(status, repository) : null;
    if (!status || !runId) {
      throw new Error(`PR #${number} exact head의 trusted validation status가 없습니다.`);
    }
    const run = await client.request<ReleaseValidationWorkflowRun>(
      `/repos/${repository}/actions/runs/${runId}`,
    );
    if (!isValidationStatusBoundToRun(status, run, repository, pull.head.sha)) {
      throw new Error(`PR #${number} validation status와 workflow run 결속이 올바르지 않습니다.`);
    }
  }
  return { pull, marker, lane, packagePaths, stablePromotion };
}

async function main(): Promise<void> {
  const token = process.env.GH_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  const number = Number(Bun.argv[2]);
  if (!token || !repository || !Number.isInteger(number)) {
    throw new Error("GitHub workflow 환경과 PR 번호가 필요합니다.");
  }
  const client = new GitHubClient(repository, token);
  const { lane, marker, packagePaths, pull, stablePromotion } =
    await verifyPublishPullForAuthorization({ repository, number, client });

  const gitShow = Bun.spawn(["git", "show", "origin/dev:.github/release/control.json"], {
    stdout: "pipe",
    stderr: "inherit",
  });
  const controlText = await new Response(gitShow.stdout).text();
  if ((await gitShow.exited) !== 0) throw new Error("dev release control을 읽지 못했습니다.");
  const control = parseReleaseControl(JSON.parse(controlText));
  const mode = authorizePublish(marker, pull.merged_by?.login ?? "", lane, pull.head.ref, control);
  if (stablePromotion) {
    assertStablePromotionControlMode(mode);
    await assertCurrentSiblingDormant(lane as "minor" | "major");
  }
  const controlShaProcess = Bun.spawn(["git", "rev-parse", "HEAD"], {
    stdout: "pipe",
    stderr: "inherit",
  });
  const controlSha = (await new Response(controlShaProcess.stdout).text()).trim();
  if ((await controlShaProcess.exited) !== 0 || !/^[0-9a-f]{40}$/.test(controlSha)) {
    throw new Error("checkout한 trusted dev control SHA를 읽지 못했습니다.");
  }
  if (requiresStableBaselineReconciliation(mode, lane, stablePromotion)) {
    await assertDevStablePublishReconciled({
      repository,
      currentDevSha: controlSha,
      client,
      allowedPendingStableMergeSha: stablePromotion
        ? (pull.merge_commit_sha ?? undefined)
        : undefined,
    });
  }

  const outputPath = process.env.GITHUB_OUTPUT;
  if (outputPath) {
    await appendFile(
      outputPath,
      `${[
        `mode=${mode}`,
        `lane=${lane}`,
        `mergeSha=${pull.merge_commit_sha}`,
        `controlSha=${controlSha}`,
        `packagePaths=${JSON.stringify(packagePaths)}`,
        `number=${pull.number}`,
        `stablePromotion=${stablePromotion}`,
      ].join("\n")}\n`,
    );
  }
}

if (import.meta.main) await main();
