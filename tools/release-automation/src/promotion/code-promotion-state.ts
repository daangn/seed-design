import type { GitHubPullRequest } from "../core/github";
import {
  isCodePromotionMarker,
  validateGeneratedPr,
  type StablePromotionMarker,
} from "../core/marker";
import type { PromotionTargetPlan, PullRequestIdentity } from "../core/types";
import {
  isValidationStatusBoundToRun,
  latestValidationStatus,
  type ReleaseValidationStatus,
  type ReleaseValidationWorkflowRun,
  validationRunIdFromStatus,
} from "../core/validation-status";

export interface CodePromotionStateClient {
  request<T>(path: string): Promise<T>;
  paginate<T>(path: string): Promise<T[]>;
}

export interface CodePromotionReceipt {
  lane: PromotionTargetPlan["lane"];
  mergeSha: string;
  noOp: boolean;
}

function identity(pull: GitHubPullRequest): PullRequestIdentity {
  return {
    author: pull.user.login,
    body: pull.body ?? "",
    baseRef: pull.base.ref,
    headRef: pull.head.ref,
    baseRepository: pull.base.repo.full_name,
    headRepository: pull.head.repo?.full_name ?? "",
  };
}

async function git(cwd: string, args: string[]): Promise<string> {
  const child = Bun.spawn(["git", ...args], {
    cwd,
    env: {
      ...process.env,
      GH_TOKEN: undefined,
      GITHUB_TOKEN: undefined,
      NODE_AUTH_TOKEN: undefined,
      NPM_TOKEN: undefined,
    },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`code promotion receipt git ${args[0]} 실패: ${stderr.trim()}`);
  return stdout.trim();
}

async function hasTrustedLaneValidation(options: {
  client: CodePromotionStateClient;
  repository: string;
  headSha: string;
}): Promise<boolean> {
  const statuses = await options.client.paginate<ReleaseValidationStatus>(
    `/repos/${options.repository}/commits/${options.headSha}/statuses`,
  );
  const status = latestValidationStatus(
    statuses,
    options.repository,
    options.headSha,
    "workflow_dispatch",
  );
  const runId = status ? validationRunIdFromStatus(status, options.repository) : null;
  if (!status || !runId) return false;
  const run = await options.client.request<ReleaseValidationWorkflowRun>(
    `/repos/${options.repository}/actions/runs/${runId}`,
  );
  return isValidationStatusBoundToRun(status, run, options.repository, options.headSha);
}

export async function resolveCodePromotionReceipt(options: {
  client: CodePromotionStateClient;
  repository: string;
  repositoryPath: string;
  stablePr: number;
  stableMarker: StablePromotionMarker;
  target: PromotionTargetPlan;
}): Promise<CodePromotionReceipt | null> {
  const { client, repository, repositoryPath, stableMarker, stablePr, target } = options;
  const current = await client.request<{ commit: { sha: string } }>(
    `/repos/${repository}/branches/${target.lane}`,
  );
  if (target.noOp) {
    return current.commit.sha === target.expectedBaseSha
      ? { lane: target.lane, mergeSha: target.expectedBaseSha, noOp: true }
      : null;
  }

  const pulls = await client.paginate<GitHubPullRequest>(
    `/repos/${repository}/pulls?state=closed&base=${target.lane}&sort=updated&direction=asc`,
  );
  const candidates = pulls.filter((pull) => {
    const marker = validateGeneratedPr(identity(pull));
    return (
      marker &&
      isCodePromotionMarker(marker) &&
      marker.stablePr === stablePr &&
      marker.promotionManifestSha256 === stableMarker.promotionManifestSha256 &&
      marker.lane === target.lane &&
      marker.expectedBaseSha === target.expectedBaseSha &&
      marker.expectedHeadSha === target.expectedHeadSha &&
      marker.expectedCodeTreeSha === target.expectedCodeTreeSha &&
      marker.expectedBaselineTreeSha === target.expectedBaselineTreeSha &&
      pull.user.login === "github-actions[bot]" &&
      pull.head.sha === target.expectedHeadSha &&
      pull.merged_at !== null &&
      pull.merge_commit_sha !== null &&
      Boolean(pull.merged_by?.login) &&
      !pull.merged_by?.login.endsWith("[bot]")
    );
  });
  if (candidates.length === 0) return null;
  if (candidates.length !== 1) {
    throw new Error(`${target.lane} exact code promotion merge receipt가 여러 개입니다.`);
  }
  const pull = candidates[0] as GitHubPullRequest;
  const mergeSha = pull.merge_commit_sha;
  if (
    !mergeSha ||
    current.commit.sha !== mergeSha ||
    !(await hasTrustedLaneValidation({ client, repository, headSha: pull.head.sha }))
  ) {
    return null;
  }
  await git(repositoryPath, ["fetch", "--no-tags", "origin", mergeSha]);
  const mergeTree = await git(repositoryPath, ["rev-parse", `${mergeSha}^{tree}`]);
  if (mergeTree !== target.expectedCodeTreeSha) {
    throw new Error(`${target.lane} code promotion merge tree가 preflight tree와 다릅니다.`);
  }
  return { lane: target.lane, mergeSha, noOp: false };
}
