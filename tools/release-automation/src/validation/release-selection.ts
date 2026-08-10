import { appendFile, readFile } from "node:fs/promises";
import { parseReleaseControl } from "../core/config";
import { isPrereleaseMarker, validateGeneratedPr } from "../core/marker";
import type { LaneName, PrereleaseOperation, PullRequestIdentity } from "../core/types";
import { classifyPrereleaseState, parseOptionalPrereleaseState } from "../lane/prerelease-state";
import { assertStablePromotionControlMode } from "./stable-promotion";
import { GitHubClient, type GitHubPullRequest } from "../core/github";
import { assertDevStablePublishReconciled } from "../publish/baseline-reconciliation-state";
import {
  isValidationStatusBoundToRun,
  latestValidationStatus,
  type ReleaseValidationStatus,
  type ReleaseValidationWorkflowRun,
  validationRunIdFromStatus,
} from "../core/validation-status";

const gitShaPattern = /^[0-9a-f]{40}$/;
const operationIdPattern = /^[1-9][0-9]*$/;

interface ReleaseMatrixItem {
  kind: "version" | "prerelease";
  lane: LaneName;
  base_sha: string;
  operation?: PrereleaseOperation;
  operation_id?: string;
  release_kind?: "stable-promotion";
  exit_pr?: number;
  exit_merge_sha?: string;
}

interface PullRequestEvent {
  repository: { full_name: string };
  pull_request: {
    number: number;
    body: string | null;
    merged: boolean;
    merge_commit_sha: string | null;
    user: { login: string };
    merged_by?: { login: string } | null;
    base: { ref: string; sha: string; repo: { full_name: string } };
    head: { ref: string; sha: string; repo: { full_name: string } | null };
  };
}

interface SelectionClient {
  request<T>(path: string): Promise<T>;
  paginate<T>(path: string): Promise<T[]>;
}

async function git(arguments_: string[], allowFailure = false): Promise<string | null> {
  const child = Bun.spawn(["git", ...arguments_], { stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) {
    if (allowFailure) return null;
    throw new Error(`git ${arguments_.join(" ")} 실패:\n${stderr}`);
  }
  return stdout.trim();
}

function parseLane(value: string): LaneName | "all" {
  if (value !== "all" && value !== "dev" && value !== "minor" && value !== "major") {
    throw new Error(`지원하지 않는 release lane입니다: ${value}`);
  }
  return value;
}

function parseOperation(value: string): "version" | PrereleaseOperation {
  if (value !== "version" && value !== "enter" && value !== "exit") {
    throw new Error(`지원하지 않는 release operation입니다: ${value}`);
  }
  return value;
}

function identity(event: PullRequestEvent): PullRequestIdentity {
  const pull = event.pull_request;
  return {
    author: pull.user.login,
    body: pull.body ?? "",
    baseRef: pull.base.ref,
    headRef: pull.head.ref,
    baseRepository: pull.base.repo.full_name,
    headRepository: pull.head.repo?.full_name ?? "",
  };
}

async function laneSha(lane: LaneName, controlSha: string): Promise<string> {
  const sha = lane === "dev" ? controlSha : await git(["rev-parse", `refs/remotes/origin/${lane}`]);
  if (!sha || !gitShaPattern.test(sha)) throw new Error(`${lane} current SHA를 읽지 못했습니다.`);
  return sha;
}

async function laneState(lane: LaneName, sha: string) {
  const text = await git(["show", `${sha}:.changeset/pre.json`], true);
  return parseOptionalPrereleaseState(text, `${lane}@${sha} prerelease state`);
}

async function regularVersionItem(
  lane: LaneName,
  controlSha: string,
  options: {
    client?: SelectionClient;
    repository?: string;
    controlMode: "dry-run" | "production";
  },
): Promise<ReleaseMatrixItem | null> {
  const baseSha = await laneSha(lane, controlSha);
  const classification = classifyPrereleaseState(lane, await laneState(lane, baseSha));
  if (classification === "dormant") return null;
  if (classification === "exiting") {
    if (lane === "dev") throw new Error("dev lane은 exiting 상태일 수 없습니다.");
    assertStablePromotionControlMode(options.controlMode);
    await assertSiblingDormant(lane, controlSha);
    if (!options.client || !options.repository) {
      throw new Error(`${lane} exiting recovery에는 trusted GitHub client가 필요합니다.`);
    }
    return recoverStablePromotionItem({
      lane,
      baseSha,
      client: options.client,
      repository: options.repository,
    });
  }
  return { kind: "version", lane, base_sha: baseSha };
}

async function assertSiblingDormant(lane: "minor" | "major", controlSha: string): Promise<void> {
  const sibling = lane === "minor" ? "major" : "minor";
  const siblingSha = await laneSha(sibling, controlSha);
  const classification = classifyPrereleaseState(sibling, await laneState(sibling, siblingSha));
  if (classification !== "dormant") {
    throw new Error(`stable promotion 전 sibling ${sibling} lane은 dormant여야 합니다.`);
  }
}

export async function recoverStablePromotionItem(options: {
  lane: "minor" | "major";
  baseSha: string;
  repository: string;
  client: SelectionClient;
}): Promise<ReleaseMatrixItem> {
  const { baseSha, client, lane, repository } = options;
  const pulls = await client.paginate<GitHubPullRequest>(
    `/repos/${repository}/pulls?state=closed&base=${lane}&sort=updated&direction=desc`,
  );
  const matches = pulls.flatMap((pull) => {
    const marker = validateGeneratedPr({
      author: pull.user.login,
      body: pull.body ?? "",
      baseRef: pull.base.ref,
      headRef: pull.head.ref,
      baseRepository: pull.base.repo.full_name,
      headRepository: pull.head.repo?.full_name ?? "",
    });
    return marker &&
      isPrereleaseMarker(marker) &&
      marker.operation === "exit" &&
      marker.lane === lane &&
      pull.user.login === "github-actions[bot]" &&
      pull.merged_at &&
      pull.merge_commit_sha === baseSha &&
      pull.merged_by?.login &&
      !pull.merged_by.login.endsWith("[bot]") &&
      pull.base.repo.full_name === repository &&
      pull.head.repo?.full_name === repository &&
      pull.base.sha === marker.expectedBaseSha &&
      pull.head.sha === marker.expectedHeadSha
      ? [{ pull, marker }]
      : [];
  });
  if (matches.length !== 1) {
    throw new Error(
      `${lane} current exiting head에 결속된 exact Exit Intent PR이 유일하지 않습니다.`,
    );
  }
  const match = matches[0];
  const statuses = await client.paginate<ReleaseValidationStatus>(
    `/repos/${repository}/commits/${match.pull.head.sha}/statuses`,
  );
  const status = latestValidationStatus(
    statuses,
    repository,
    match.pull.head.sha,
    "workflow_dispatch",
  );
  const runId = status ? validationRunIdFromStatus(status, repository) : null;
  if (!status || !runId) throw new Error("Exit Intent PR trusted validation receipt가 없습니다.");
  const run = await client.request<ReleaseValidationWorkflowRun>(
    `/repos/${repository}/actions/runs/${runId}`,
  );
  if (!isValidationStatusBoundToRun(status, run, repository, match.pull.head.sha)) {
    throw new Error("Exit Intent PR validation receipt/run 결속이 올바르지 않습니다.");
  }
  return {
    kind: "version",
    lane,
    base_sha: baseSha,
    release_kind: "stable-promotion",
    operation_id: match.marker.operationId,
    exit_pr: match.pull.number,
    exit_merge_sha: baseSha,
  };
}

export async function selectReleaseWork(input: {
  eventName: string;
  requestedLane: string;
  requestedOperation: string;
  operationId: string;
  event?: PullRequestEvent;
  controlSha: string;
  controlMode: "dry-run" | "production";
  client?: SelectionClient;
  repository?: string;
}): Promise<ReleaseMatrixItem[]> {
  const requestedLane = parseLane(input.requestedLane);
  const requestedOperation = parseOperation(input.requestedOperation);
  if (!operationIdPattern.test(input.operationId))
    throw new Error("workflow run ID가 올바르지 않습니다.");

  if (input.eventName === "push") {
    const item = await regularVersionItem("dev", input.controlSha, input);
    return item ? [item] : [];
  }
  if (input.eventName === "schedule") {
    const items = await Promise.all(
      (["dev", "minor", "major"] as const).map((lane) =>
        regularVersionItem(lane, input.controlSha, input),
      ),
    );
    return items.filter((item): item is ReleaseMatrixItem => item !== null);
  }
  if (input.eventName === "workflow_dispatch") {
    if (requestedOperation === "version") {
      const lanes =
        requestedLane === "all" ? (["dev", "minor", "major"] as const) : [requestedLane];
      const items = await Promise.all(
        lanes.map((lane) => regularVersionItem(lane, input.controlSha, input)),
      );
      return items.filter((item): item is ReleaseMatrixItem => item !== null);
    }
    if (requestedLane === "all" || requestedLane === "dev") {
      throw new Error("prerelease enter/exit는 minor 또는 major 한 lane만 선택해야 합니다.");
    }
    if (requestedOperation === "exit") {
      assertStablePromotionControlMode(input.controlMode);
    }
    await assertSiblingDormant(requestedLane, input.controlSha);
    if (requestedOperation === "enter") {
      if (!input.client || !input.repository) {
        throw new Error("prerelease enter에는 trusted GitHub client가 필요합니다.");
      }
      await assertDevStablePublishReconciled({
        repository: input.repository,
        currentDevSha: input.controlSha,
        client: input.client,
      });
    }
    const baseSha = await laneSha(requestedLane, input.controlSha);
    const classification = classifyPrereleaseState(
      requestedLane,
      await laneState(requestedLane, baseSha),
    );
    if (requestedOperation === "enter" && classification !== "dormant") {
      throw new Error(`${requestedLane}은 dormant 상태가 아니므로 enter할 수 없습니다.`);
    }
    if (requestedOperation === "exit" && classification !== "active") {
      throw new Error(`${requestedLane}은 active 상태가 아니므로 exit할 수 없습니다.`);
    }
    return [
      {
        kind: "prerelease",
        lane: requestedLane,
        base_sha: baseSha,
        operation: requestedOperation,
        operation_id: input.operationId,
      },
    ];
  }
  if (input.eventName !== "pull_request_target" || !input.event) {
    throw new Error(`지원하지 않는 release event입니다: ${input.eventName}`);
  }
  const pull = input.event.pull_request;
  if (!pull.merged || !pull.merge_commit_sha || !gitShaPattern.test(pull.merge_commit_sha)) {
    return [];
  }
  if (pull.base.ref !== "minor" && pull.base.ref !== "major") {
    throw new Error(`unexpected merged release lane입니다: ${pull.base.ref}`);
  }
  const lane = pull.base.ref;
  const baseSha = await laneSha(lane, input.controlSha);
  if (baseSha !== pull.merge_commit_sha) {
    throw new Error("merged PR의 merge SHA가 current exact lane head가 아닙니다.");
  }
  const classification = classifyPrereleaseState(lane, await laneState(lane, baseSha));
  if (classification === "dormant") return [];
  if (classification === "active") return [{ kind: "version", lane, base_sha: baseSha }];
  assertStablePromotionControlMode(input.controlMode);
  await assertSiblingDormant(lane, input.controlSha);
  const marker = validateGeneratedPr(identity(input.event));
  if (
    !marker ||
    !isPrereleaseMarker(marker) ||
    marker.operation !== "exit" ||
    !pull.merged_by?.login ||
    pull.merged_by.login.endsWith("[bot]") ||
    marker.expectedBaseSha !== pull.base.sha ||
    marker.expectedHeadSha !== pull.head.sha
  ) {
    throw new Error("exiting lane은 exact trusted Exit Intent PR merge만 version할 수 있습니다.");
  }
  if (
    input.event.repository.full_name !== pull.base.repo.full_name ||
    pull.head.repo?.full_name !== pull.base.repo.full_name
  ) {
    throw new Error("Exit Intent PR repository identity가 올바르지 않습니다.");
  }
  return [
    {
      kind: "version",
      lane,
      base_sha: baseSha,
      release_kind: "stable-promotion",
      operation_id: marker.operationId,
      exit_pr: pull.number,
      exit_merge_sha: pull.merge_commit_sha,
    },
  ];
}

async function main(): Promise<void> {
  const eventName = process.env.RELEASE_EVENT_NAME ?? "";
  const eventPath = process.env.GITHUB_EVENT_PATH;
  const controlSha = await git(["rev-parse", "HEAD"]);
  if (!controlSha || !gitShaPattern.test(controlSha))
    throw new Error("trusted dev SHA가 없습니다.");
  const event =
    eventName === "pull_request_target" && eventPath
      ? (JSON.parse(await readFile(eventPath, "utf8")) as PullRequestEvent)
      : undefined;
  const control = parseReleaseControl(
    JSON.parse((await git(["show", `${controlSha}:.github/release/control.json`])) ?? ""),
  );
  const token = process.env.GH_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  const matrix = await selectReleaseWork({
    eventName,
    requestedLane: process.env.REQUESTED_LANE ?? "all",
    requestedOperation: process.env.REQUESTED_OPERATION ?? "version",
    operationId: process.env.RELEASE_OPERATION_ID ?? "",
    event,
    controlSha,
    controlMode: control.mode,
    client: token && repository ? new GitHubClient(repository, token) : undefined,
    repository,
  });
  const output = process.env.GITHUB_OUTPUT;
  if (output) {
    await appendFile(output, `control_sha=${controlSha}\nmatrix=${JSON.stringify(matrix)}\n`);
  }
  console.log(JSON.stringify({ controlSha, matrix }, null, 2));
}

if (import.meta.main) await main();
