import { createHash } from "node:crypto";
import { parseLaneConfig, parseReleaseControl } from "../core/config";
import type { GitHubPullRequest } from "../core/github";
import {
  isLegacyNormalizationMarker,
  type LegacyNormalizationMarker,
  validateGeneratedPr,
} from "../core/marker";
import type { PullRequestIdentity, ReleaseMarker } from "../core/types";
import {
  isValidationStatusBoundToRun,
  latestValidationStatus,
  type ReleaseValidationStatus,
  type ReleaseValidationWorkflowRun,
  validationRunIdFromStatus,
} from "../core/validation-status";
import { parsePrereleaseState } from "../lane/prerelease-state";
import { isTrustedDevControlCommit } from "../sync/sync-control-plane";

export const legacyNormalizationRepository = "daangn/seed-design";
export const legacyPreSha256 = "edcbf1bcb9b4e2320be6041629ff423290106bb8c684d56c71fad2eb26a7872e";
export const legacyLaneHeads = {
  minor: "080815d86023ae8c0d3747e1482e634250263e3a",
  major: "44a6c1f3f53a0ad8a558565909c70fcfe499feb1",
} as const;
export const releaseWorkflowsThatMustRemainDisabled = [
  "release-packages.yml",
  "release-publish.yml",
  "release-sync.yml",
] as const;

export type LegacyNormalizationLane = keyof typeof legacyLaneHeads;

export interface LegacyNormalizationClient {
  request<T>(path: string): Promise<T>;
  paginate<T>(path: string): Promise<T[]>;
}

export interface LegacyNormalizationStatus {
  complete: boolean;
  lanes: Record<LegacyNormalizationLane, "legacy" | "normalized">;
}

interface GitResult {
  code: number;
  output: string;
}

async function git(
  repositoryPath: string,
  arguments_: string[],
  options: { allowFailure?: boolean; trim?: boolean } = {},
): Promise<GitResult> {
  const child = Bun.spawn(["git", ...arguments_], {
    cwd: repositoryPath,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0 && !options.allowFailure) {
    throw new Error(`git ${arguments_.join(" ")} 실패:\n${stderr.trim()}`);
  }
  return { code, output: options.trim === false ? stdout : stdout.trim() };
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function identityFromPull(pull: GitHubPullRequest): PullRequestIdentity {
  return {
    author: pull.user.login,
    body: pull.body ?? "",
    baseRef: pull.base.ref,
    headRef: pull.head.ref,
    baseRepository: pull.base.repo.full_name,
    headRepository: pull.head.repo?.full_name ?? "",
  };
}

export function legacyNormalizationBranch(
  lane: LegacyNormalizationLane,
  operationId: string,
): string {
  if (!/^[1-9][0-9]*$/.test(operationId)) {
    throw new Error("legacy normalization operation ID가 올바르지 않습니다.");
  }
  return `release-legacy-normalization/${lane}-${operationId}`;
}

export function assertLegacyNormalizationMarkerContract(
  marker: ReleaseMarker,
): asserts marker is LegacyNormalizationMarker {
  if (
    !isLegacyNormalizationMarker(marker) ||
    marker.sourceRepository !== legacyNormalizationRepository ||
    marker.expectedBaseSha !== legacyLaneHeads[marker.lane] ||
    marker.expectedPreSha256 !== legacyPreSha256
  ) {
    throw new Error("legacy normalization marker가 exact one-time 계약과 다릅니다.");
  }
}

async function assertControlState(repositoryPath: string, ref: string): Promise<void> {
  const [controlText, lanesText] = await Promise.all([
    git(repositoryPath, ["show", `${ref}:.github/release/control.json`]),
    git(repositoryPath, ["show", `${ref}:.github/release/lanes.json`]),
  ]);
  const control = parseReleaseControl(JSON.parse(controlText.output) as unknown);
  const config = parseLaneConfig(JSON.parse(lanesText.output) as unknown);
  if (
    control.mode !== "dry-run" ||
    !control.rootageContractReady ||
    config.repository !== legacyNormalizationRepository
  ) {
    throw new Error(
      "legacy normalization은 exact repository의 Rootage-ready dry-run control에서만 허용됩니다.",
    );
  }
}

export async function assertLegacyPreState(
  repositoryPath: string,
  ref: string,
  lane: LegacyNormalizationLane,
): Promise<void> {
  const result = await git(repositoryPath, ["show", `${ref}:.changeset/pre.json`], {
    trim: false,
  });
  if (sha256(result.output) !== legacyPreSha256) {
    throw new Error(`${lane} pre.json이 expected legacy bootstrap 내용과 다릅니다.`);
  }
  const state = parsePrereleaseState(
    JSON.parse(result.output) as unknown,
    `${lane} legacy prerelease state`,
  );
  if (state.mode !== "pre" || state.tag !== "beta" || state.changesets.length !== 0) {
    throw new Error(`${lane} legacy prerelease state는 changesets가 빈 beta pre 상태여야 합니다.`);
  }
}

async function assertPreStateAbsent(
  repositoryPath: string,
  ref: string,
  lane: LegacyNormalizationLane,
): Promise<void> {
  const result = await git(repositoryPath, ["cat-file", "-e", `${ref}:.changeset/pre.json`], {
    allowFailure: true,
  });
  if (result.code === 0) throw new Error(`${lane} normalized tree에 pre.json이 남아 있습니다.`);
}

async function assertDeletionCommit(
  repositoryPath: string,
  marker: LegacyNormalizationMarker,
  headSha: string,
): Promise<void> {
  const [parents, files, patch, tree] = await Promise.all([
    git(repositoryPath, ["rev-list", "--parents", "-n", "1", headSha]),
    git(repositoryPath, ["diff", "--name-status", marker.expectedBaseSha, headSha, "--"]),
    git(
      repositoryPath,
      ["diff", "--binary", "--full-index", "--no-ext-diff", marker.expectedBaseSha, headSha, "--"],
      { trim: false },
    ),
    git(repositoryPath, ["rev-parse", `${headSha}^{tree}`]),
  ]);
  const commitParents = parents.output.split(/\s+/);
  if (
    commitParents.length !== 2 ||
    commitParents[0] !== headSha ||
    commitParents[1] !== marker.expectedBaseSha
  ) {
    throw new Error("legacy normalization head는 expected base의 단일 자식이어야 합니다.");
  }
  if (files.output !== "D\t.changeset/pre.json") {
    throw new Error("legacy normalization PR은 자신의 .changeset/pre.json 삭제만 포함해야 합니다.");
  }
  if (sha256(patch.output) !== marker.patchSha256) {
    throw new Error("legacy normalization patch SHA-256이 exact diff와 다릅니다.");
  }
  if (!/^[0-9a-f]{40}$/.test(tree.output)) {
    throw new Error("legacy normalization tree SHA를 읽지 못했습니다.");
  }
  await assertPreStateAbsent(repositoryPath, headSha, marker.lane);
}

export async function verifyLegacyNormalizationPull(input: {
  repositoryPath?: string;
  repository: string;
  marker: ReleaseMarker;
  pull: GitHubPullRequest;
}): Promise<void> {
  const repositoryPath = input.repositoryPath ?? process.cwd();
  assertLegacyNormalizationMarkerContract(input.marker);
  const marker = input.marker;
  const { pull } = input;
  if (
    input.repository !== legacyNormalizationRepository ||
    pull.user.login !== "github-actions[bot]" ||
    pull.base.repo.full_name !== input.repository ||
    pull.head.repo?.full_name !== input.repository ||
    pull.base.ref !== marker.lane ||
    pull.head.ref !== legacyNormalizationBranch(marker.lane, marker.operationId) ||
    pull.base.sha !== marker.expectedBaseSha ||
    pull.head.sha !== marker.expectedHeadSha
  ) {
    throw new Error("legacy normalization PR identity가 exact marker/repository와 다릅니다.");
  }
  const [currentDev, currentLane] = await Promise.all([
    git(repositoryPath, ["rev-parse", "origin/dev"]),
    git(repositoryPath, ["rev-parse", `origin/${marker.lane}`]),
  ]);
  if (currentDev.output !== marker.controlSha) {
    throw new Error("legacy normalization trusted dev control SHA가 stale합니다.");
  }
  if (currentLane.output !== marker.expectedBaseSha) {
    throw new Error("legacy normalization PR base가 current exact legacy lane head가 아닙니다.");
  }
  await Promise.all([
    assertControlState(repositoryPath, "origin/dev"),
    assertLegacyPreState(repositoryPath, marker.expectedBaseSha, marker.lane),
    assertDeletionCommit(repositoryPath, marker, marker.expectedHeadSha),
  ]);
}

async function exactMergedNormalizationPull(input: {
  repositoryPath: string;
  repository: string;
  lane: LegacyNormalizationLane;
  laneHead: string;
  client: LegacyNormalizationClient;
}): Promise<GitHubPullRequest | null> {
  const pulls = await input.client.paginate<GitHubPullRequest>(
    `/repos/${input.repository}/pulls?state=closed&base=${input.lane}&sort=updated&direction=desc`,
  );
  const matches = pulls.flatMap((pull) => {
    const marker = validateGeneratedPr(identityFromPull(pull));
    if (!marker || !isLegacyNormalizationMarker(marker)) return [];
    try {
      assertLegacyNormalizationMarkerContract(marker);
    } catch {
      return [];
    }
    return marker.lane === input.lane &&
      pull.merged_at &&
      pull.merge_commit_sha === input.laneHead &&
      pull.merged_by?.login &&
      !pull.merged_by.login.endsWith("[bot]") &&
      pull.base.sha === marker.expectedBaseSha &&
      pull.head.sha === marker.expectedHeadSha
      ? [{ pull, marker }]
      : [];
  });
  if (matches.length === 0) return null;
  if (matches.length !== 1) {
    throw new Error(`${input.lane} normalization merge 증명이 유일하지 않습니다.`);
  }
  const { marker, pull } = matches[0];
  await git(input.repositoryPath, [
    "fetch",
    "--no-tags",
    "origin",
    `+refs/pull/${pull.number}/head:refs/remotes/pull/${pull.number}/head`,
  ]);
  if (!(await isTrustedDevControlCommit(input.repositoryPath, marker.controlSha))) {
    throw new Error(`${input.lane} normalization control SHA가 trusted dev 이력이 아닙니다.`);
  }
  const [mergeParents, mergeTree, generatedTree, statuses] = await Promise.all([
    git(input.repositoryPath, ["rev-list", "--parents", "-n", "1", input.laneHead]),
    git(input.repositoryPath, ["rev-parse", `${input.laneHead}^{tree}`]),
    git(input.repositoryPath, ["rev-parse", `${marker.expectedHeadSha}^{tree}`]),
    input.client.paginate<ReleaseValidationStatus>(
      `/repos/${input.repository}/commits/${marker.expectedHeadSha}/statuses`,
    ),
  ]);
  const parents = mergeParents.output.split(/\s+/);
  if (
    parents.length !== 2 ||
    parents[1] !== marker.expectedBaseSha ||
    input.laneHead === marker.expectedHeadSha ||
    mergeTree.output !== generatedTree.output
  ) {
    throw new Error(
      `${input.lane} normalization은 expected base에 human squash merge되어야 합니다.`,
    );
  }
  const status = latestValidationStatus(
    statuses,
    input.repository,
    marker.expectedHeadSha,
    "workflow_dispatch",
  );
  const runId = status ? validationRunIdFromStatus(status, input.repository) : null;
  if (!status || !runId) {
    throw new Error(`${input.lane} normalization trusted validation receipt가 없습니다.`);
  }
  const run = await input.client.request<ReleaseValidationWorkflowRun>(
    `/repos/${input.repository}/actions/runs/${runId}`,
  );
  if (
    run.head_sha !== marker.controlSha ||
    !isValidationStatusBoundToRun(status, run, input.repository, marker.expectedHeadSha)
  ) {
    throw new Error(`${input.lane} normalization validation receipt/run/control 결속이 다릅니다.`);
  }
  await Promise.all([
    assertDeletionCommit(input.repositoryPath, marker, marker.expectedHeadSha),
    assertPreStateAbsent(input.repositoryPath, input.laneHead, input.lane),
  ]);
  return pull;
}

export async function inspectLegacyNormalization(input: {
  repositoryPath?: string;
  repository: string;
  client: LegacyNormalizationClient;
}): Promise<LegacyNormalizationStatus> {
  const repositoryPath = input.repositoryPath ?? process.cwd();
  if (input.repository !== legacyNormalizationRepository) {
    throw new Error("legacy normalization repository가 exact 계약과 다릅니다.");
  }
  await assertControlState(repositoryPath, "origin/dev");
  const lanes = {} as LegacyNormalizationStatus["lanes"];
  for (const lane of ["minor", "major"] as const) {
    const laneHead = (await git(repositoryPath, ["rev-parse", `origin/${lane}`])).output;
    if (laneHead === legacyLaneHeads[lane]) {
      await assertLegacyPreState(repositoryPath, laneHead, lane);
      lanes[lane] = "legacy";
      continue;
    }
    const pull = await exactMergedNormalizationPull({
      repositoryPath,
      repository: input.repository,
      lane,
      laneHead,
      client: input.client,
    });
    if (!pull) {
      throw new Error(`${lane} head가 expected legacy 또는 trusted normalized 상태가 아닙니다.`);
    }
    lanes[lane] = "normalized";
  }
  return {
    complete: lanes.minor === "normalized" && lanes.major === "normalized",
    lanes,
  };
}

export async function assertLegacyNormalizationBoundary(input: {
  repositoryPath?: string;
  repository: string;
  client: LegacyNormalizationClient;
  marker: ReleaseMarker | null;
}): Promise<void> {
  const status = await inspectLegacyNormalization(input);
  if (status.complete) return;
  if (input.marker?.type === "legacy-normalization") {
    assertLegacyNormalizationMarkerContract(input.marker);
    if (status.lanes[input.marker.lane] === "legacy") return;
  }
  throw new Error(
    "minor와 major legacy prerelease normalization이 모두 완료되기 전에는 다른 release operation을 진행할 수 없습니다.",
  );
}

export async function assertReleaseWorkflowsDisabled(
  repository: string,
  client: LegacyNormalizationClient,
): Promise<void> {
  if (repository !== legacyNormalizationRepository) {
    throw new Error("release workflow 상태를 확인할 repository가 exact 계약과 다릅니다.");
  }
  for (const workflow of releaseWorkflowsThatMustRemainDisabled) {
    const state = await client.request<{ state: string }>(
      `/repos/${repository}/actions/workflows/${workflow}`,
    );
    if (state.state !== "disabled_manually") {
      throw new Error(`${workflow}는 legacy normalization 동안 disabled_manually여야 합니다.`);
    }
  }
}
