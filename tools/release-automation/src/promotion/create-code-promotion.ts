import { appendFile } from "node:fs/promises";
import { GitHubClient, type GitHubPullRequest } from "../core/github";
import {
  encodeMarker,
  isPrereleaseMarker,
  isStablePromotionMarker,
  parseMarker,
  validateGeneratedPr,
  type CodePromotionMarker,
  type StablePromotionMarker,
} from "../core/marker";
import type { LaneName, PromotionTargetPlan, PullRequestIdentity } from "../core/types";
import {
  codePromotionPreflightStatusContext,
  isValidationStatusBoundToRun,
  latestValidationStatus,
  type ReleaseValidationStatus,
  type ReleaseValidationWorkflowRun,
  validationRunIdFromStatus,
} from "../core/validation-status";
import { controlPlaneFingerprint } from "../sync/sync-control-plane";
import { computeCodePromotionTrees, type CodePromotionSourceEffect } from "./code-promotion-tree";
import { selectPromotionSources, type PromotionFirstParentCommit } from "./source-selection";
import { recordPromotionStatus } from "./promotion-status";

const gitShaPattern = /^[0-9a-f]{40}$/;
const markerPattern = /<!-- seed-release:\{[^\n]+\} -->/;

interface GitResult {
  code: number;
  stdout: string;
  stderr: string;
}

export interface PrepareCodePromotionInput {
  repositoryPath: string;
  repository: string;
  token: string;
  sourceLane: "minor" | "major";
  operationId: string;
  exitPr: number;
  exitMergeSha: string;
  stablePr: number;
  stableVersionHeadSha: string;
  controlSha: string;
}

export interface PreparedCodePromotion {
  marker: StablePromotionMarker;
  promotionPulls: Array<{ lane: LaneName; number: number; headSha: string }>;
  preflightReady: boolean;
}

async function hasTrustedPreflight(client: GitHubClient, headSha: string): Promise<boolean> {
  const statuses = await client.paginate<ReleaseValidationStatus>(
    `/repos/${client.repository}/commits/${headSha}/statuses`,
  );
  const status = latestValidationStatus(
    statuses,
    client.repository,
    headSha,
    "workflow_dispatch",
    codePromotionPreflightStatusContext,
  );
  const runId = status ? validationRunIdFromStatus(status, client.repository) : null;
  if (!status || !runId) return false;
  const run = await client.request<ReleaseValidationWorkflowRun>(
    `/repos/${client.repository}/actions/runs/${runId}`,
  );
  return isValidationStatusBoundToRun(
    status,
    run,
    client.repository,
    headSha,
    codePromotionPreflightStatusContext,
  );
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

async function git(
  cwd: string,
  args: string[],
  options: { allowFailure?: boolean; environment?: Record<string, string | undefined> } = {},
): Promise<GitResult> {
  const child = Bun.spawn(["git", ...args], {
    cwd,
    env: options.environment ?? {
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
  if (code !== 0 && !options.allowFailure) {
    throw new Error(`git ${args.join(" ")} 실패:\n${stderr.trim()}`);
  }
  return { code, stdout: stdout.trim(), stderr: stderr.trim() };
}

function authenticatedEnvironment(token: string): Record<string, string | undefined> {
  const authorization = Buffer.from(`x-access-token:${token}`).toString("base64");
  return {
    ...process.env,
    GH_TOKEN: undefined,
    GITHUB_TOKEN: undefined,
    NODE_AUTH_TOKEN: undefined,
    NPM_TOKEN: undefined,
    GIT_CONFIG_COUNT: "1",
    GIT_CONFIG_KEY_0: "http.https://github.com/.extraheader",
    GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${authorization}`,
  };
}

function siblingLane(lane: "minor" | "major"): "minor" | "major" {
  return lane === "minor" ? "major" : "minor";
}

function parseFirstParentLines(value: string): PromotionFirstParentCommit[] {
  return value
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [sha, ...parents] = line.split(/\s+/);
      if (!sha) throw new Error("first-parent commit SHA가 비었습니다.");
      return { sha, parents };
    });
}

async function remoteBranchSha(
  repositoryPath: string,
  branch: string,
  environment: Record<string, string | undefined>,
): Promise<string | null> {
  const result = await git(
    repositoryPath,
    ["ls-remote", "--heads", "origin", `refs/heads/${branch}`],
    { environment },
  );
  if (!result.stdout) return null;
  const sha = result.stdout.split(/\s+/)[0] ?? "";
  if (!gitShaPattern.test(sha))
    throw new Error(`reserved branch ${branch} SHA가 올바르지 않습니다.`);
  return sha;
}

async function deterministicCommit(
  repositoryPath: string,
  treeSha: string,
  parentSha: string,
  sourceLane: "minor" | "major",
  targetLane: LaneName,
): Promise<string> {
  const result = await git(
    repositoryPath,
    [
      "commit-tree",
      treeSha,
      "-p",
      parentSha,
      "-m",
      `feat(release): promote ${sourceLane} code to ${targetLane}`,
    ],
    {
      environment: {
        ...process.env,
        GH_TOKEN: undefined,
        GITHUB_TOKEN: undefined,
        NODE_AUTH_TOKEN: undefined,
        NPM_TOKEN: undefined,
        GIT_AUTHOR_NAME: "github-actions[bot]",
        GIT_AUTHOR_EMAIL: "41898282+github-actions[bot]@users.noreply.github.com",
        GIT_AUTHOR_DATE: "2000-01-01T00:00:00Z",
        GIT_COMMITTER_NAME: "github-actions[bot]",
        GIT_COMMITTER_EMAIL: "41898282+github-actions[bot]@users.noreply.github.com",
        GIT_COMMITTER_DATE: "2000-01-01T00:00:00Z",
      },
    },
  );
  if (!gitShaPattern.test(result.stdout))
    throw new Error("code promotion commit SHA가 올바르지 않습니다.");
  return result.stdout;
}

async function dispatchPreflight(
  repository: string,
  token: string,
  headRef: string,
  headSha: string,
): Promise<void> {
  const response = await fetch(
    `https://api.github.com/repos/${repository}/actions/workflows/release-pr-validation.yml/dispatches`,
    {
      method: "POST",
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "x-github-api-version": "2022-11-28",
      },
      body: JSON.stringify({
        ref: "dev",
        inputs: {
          head_ref: headRef,
          head_sha: headSha,
          validation_kind: "code-promotion-preflight",
        },
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`code promotion preflight dispatch 실패: ${response.status}`);
  }
}

async function markLaneValidationPending(
  client: GitHubClient,
  headSha: string,
  promotionId: string,
): Promise<void> {
  await client.request(`/repos/${client.repository}/statuses/${headSha}`, {
    method: "POST",
    body: JSON.stringify({
      state: "pending",
      context: "Validate release lane",
      description: `seed-release-promotion-lock:${promotionId}:${headSha}`,
    }),
  });
}

async function createOrUpdatePromotionPull(options: {
  client: GitHubClient;
  repositoryPath: string;
  environment: Record<string, string | undefined>;
  marker: CodePromotionMarker;
  sourcePulls: number[];
}): Promise<{ number: number; headSha: string }> {
  const { client, environment, marker, repositoryPath, sourcePulls } = options;
  const branch = `release-code-promotion/${marker.lane}/${marker.stablePr}-${marker.promotionManifestSha256.slice(0, 12)}`;
  const expectedHeadSha = marker.expectedHeadSha;
  const remoteSha = await remoteBranchSha(repositoryPath, branch, environment);
  const pulls = await client.paginate<GitHubPullRequest>(
    `/repos/${client.repository}/pulls?state=open&base=${marker.lane}&sort=created&direction=asc`,
  );
  const exact = pulls.filter(
    (pull) =>
      pull.head.ref === branch &&
      pull.head.repo?.full_name === client.repository &&
      pull.base.ref === marker.lane &&
      pull.base.repo.full_name === client.repository,
  );
  if (exact.length > 1) throw new Error(`${marker.lane} code promotion PR이 둘 이상입니다.`);
  if (remoteSha && remoteSha !== expectedHeadSha) {
    throw new Error(`${marker.lane} reserved code promotion branch가 expected head와 다릅니다.`);
  }
  const current = exact[0];
  if (
    current &&
    (current.user.login !== "github-actions[bot]" ||
      !current.draft ||
      current.head.sha !== expectedHeadSha)
  ) {
    throw new Error(`기존 ${marker.lane} code promotion PR identity/draft/head가 다릅니다.`);
  }
  if (remoteSha !== expectedHeadSha) {
    const lease = remoteSha
      ? `--force-with-lease=refs/heads/${branch}:${remoteSha}`
      : `--force-with-lease=refs/heads/${branch}:`;
    await git(
      repositoryPath,
      ["push", lease, "origin", `${expectedHeadSha}:refs/heads/${branch}`],
      { environment },
    );
  }
  const title = `release: promote ${marker.sourceLane} code to ${marker.lane}`;
  const body = [
    encodeMarker(marker),
    "",
    `## ${marker.sourceLane} → ${marker.lane} 코드 승격`,
    "",
    "이 PR은 stable 게시 전에는 draft와 merge 잠금 상태를 유지합니다.",
    "",
    `Source PR: ${sourcePulls.map((number) => `#${number}`).join(", ") || "없음"}`,
    `Manifest: \`${marker.promotionManifestSha256}\``,
  ].join("\n");
  let pull: GitHubPullRequest;
  if (current) {
    pull = await client.request<GitHubPullRequest>(
      `/repos/${client.repository}/pulls/${current.number}`,
      { method: "PATCH", body: JSON.stringify({ title, body }) },
    );
  } else {
    pull = await client.request<GitHubPullRequest>(`/repos/${client.repository}/pulls`, {
      method: "POST",
      body: JSON.stringify({ title, body, head: branch, base: marker.lane, draft: true }),
    });
  }
  if (pull.head.sha !== expectedHeadSha || !pull.draft) {
    throw new Error(`생성된 ${marker.lane} code promotion PR이 exact draft head가 아닙니다.`);
  }
  await client.ensureLabel("release:code-promotion", "0e8a16", "Stable lane code promotion");
  await client.request(`/repos/${client.repository}/issues/${pull.number}/labels`, {
    method: "POST",
    body: JSON.stringify({ labels: ["release:code-promotion"] }),
  });
  return { number: pull.number, headSha: expectedHeadSha };
}

export async function prepareCodePromotions(
  input: PrepareCodePromotionInput,
): Promise<PreparedCodePromotion> {
  const {
    controlSha,
    exitMergeSha,
    exitPr,
    operationId,
    repository,
    repositoryPath,
    sourceLane,
    stablePr,
    stableVersionHeadSha,
    token,
  } = input;
  if (
    !/^[^/\s]+\/[^/\s]+$/.test(repository) ||
    !/^[1-9][0-9]*$/.test(operationId) ||
    !Number.isSafeInteger(exitPr) ||
    exitPr <= 0 ||
    !Number.isSafeInteger(stablePr) ||
    stablePr <= 0 ||
    !gitShaPattern.test(exitMergeSha) ||
    !gitShaPattern.test(stableVersionHeadSha) ||
    !gitShaPattern.test(controlSha)
  ) {
    throw new Error("code promotion preparation identity가 올바르지 않습니다.");
  }
  const client = new GitHubClient(repository, token);
  const sibling = siblingLane(sourceLane);
  const targets: LaneName[] = ["dev", sibling];
  await git(repositoryPath, [
    "fetch",
    "--no-tags",
    "origin",
    "+refs/heads/dev:refs/remotes/origin/dev",
    `+refs/heads/${sourceLane}:refs/remotes/origin/${sourceLane}`,
    `+refs/heads/${sibling}:refs/remotes/origin/${sibling}`,
    `+refs/pull/${exitPr}/head:refs/remotes/promotion-exit-head`,
    `+refs/pull/${stablePr}/head:refs/remotes/promotion-stable-head`,
  ]);
  const [currentDev, currentSource, exitHead, stableHead] = await Promise.all([
    git(repositoryPath, ["rev-parse", "origin/dev"]),
    git(repositoryPath, ["rev-parse", `origin/${sourceLane}`]),
    git(repositoryPath, ["rev-parse", "refs/remotes/promotion-exit-head"]),
    git(repositoryPath, ["rev-parse", "refs/remotes/promotion-stable-head"]),
  ]);
  if (
    currentDev.stdout !== controlSha ||
    currentSource.stdout !== exitMergeSha ||
    stableHead.stdout !== stableVersionHeadSha
  ) {
    throw new Error("code promotion preparation의 dev/source/stable exact SHA가 stale합니다.");
  }
  const [exitPull, versionPull] = await Promise.all([
    client.request<GitHubPullRequest>(`/repos/${repository}/pulls/${exitPr}`),
    client.request<GitHubPullRequest>(`/repos/${repository}/pulls/${stablePr}`),
  ]);
  const exitMarker = validateGeneratedPr(identity(exitPull));
  if (
    !exitMarker ||
    !isPrereleaseMarker(exitMarker) ||
    exitMarker.operation !== "exit" ||
    exitMarker.lane !== sourceLane ||
    exitMarker.operationId !== operationId ||
    exitPull.merge_commit_sha !== exitMergeSha ||
    exitPull.head.sha !== exitHead.stdout ||
    exitPull.base.sha !== exitMarker.expectedBaseSha ||
    !exitPull.merged_at ||
    !exitPull.merged_by?.login ||
    exitPull.merged_by.login.endsWith("[bot]")
  ) {
    throw new Error(
      "code promotion preparation이 exact trusted Exit Intent에 결속되지 않았습니다.",
    );
  }
  const previousVersionMarker = parseMarker(versionPull.body ?? "");
  if (
    versionPull.user.login !== "github-actions[bot]" ||
    versionPull.base.ref !== sourceLane ||
    versionPull.base.sha !== exitMergeSha ||
    versionPull.head.ref !== `changeset-release/${sourceLane}` ||
    versionPull.head.sha !== stableVersionHeadSha ||
    versionPull.base.repo.full_name !== repository ||
    versionPull.head.repo?.full_name !== repository ||
    (!versionPull.draft &&
      (!previousVersionMarker || !isStablePromotionMarker(previousVersionMarker)))
  ) {
    throw new Error("code promotion preparation 대상 Stable Version PR identity가 다릅니다.");
  }
  const interval = parseFirstParentLines(
    (
      await git(repositoryPath, [
        "rev-list",
        "--first-parent",
        "--reverse",
        "--parents",
        `${exitMarker.enterMergeSha}..${exitMarker.expectedBaseSha}`,
      ])
    ).stdout,
  );
  const closedPulls = await client.paginate<GitHubPullRequest>(
    `/repos/${repository}/pulls?state=closed&base=${sourceLane}&sort=updated&direction=asc`,
  );
  const commits = new Map(interval.map((commit) => [commit.sha, commit]));
  const sourceDiffs = new Map<number, string>();
  for (const pull of closedPulls) {
    const commit = pull.merge_commit_sha ? commits.get(pull.merge_commit_sha) : undefined;
    if (!commit || validateGeneratedPr(identity(pull))) continue;
    const parent = commit.parents[0];
    if (!parent) throw new Error(`source PR #${pull.number} squash parent가 없습니다.`);
    const effect = await git(repositoryPath, [
      "diff",
      "--binary",
      "--full-index",
      "--no-ext-diff",
      parent,
      commit.sha,
      "--",
    ]);
    if (!effect.stdout) throw new Error(`source PR #${pull.number} merge effect가 비었습니다.`);
    sourceDiffs.set(pull.number, effect.stdout);
  }
  const selected = selectPromotionSources({
    repository,
    sourceLane,
    enterMergeSha: exitMarker.enterMergeSha,
    exitBaseSha: exitMarker.expectedBaseSha,
    firstParentCommits: interval,
    pulls: closedPulls,
    sourceDiffs,
  });
  const sourceEffects: CodePromotionSourceEffect[] = selected.sources.map((source) => {
    const parent = commits.get(source.mergeSha)?.parents[0];
    if (!parent) throw new Error(`source PR #${source.pr} parent를 찾지 못했습니다.`);
    return { sourcePr: source.pr, parentSha: parent, mergeSha: source.mergeSha };
  });
  const controlTreeSha256 = await controlPlaneFingerprint(repositoryPath, controlSha);
  const targetPlans: PromotionTargetPlan[] = [];
  const promotionPulls: PreparedCodePromotion["promotionPulls"] = [];
  let stablePatchSha256: string | null = null;
  const environment = authenticatedEnvironment(token);
  for (const target of targets) {
    const targetBaseSha = (
      await git(repositoryPath, ["rev-parse", `refs/remotes/origin/${target}`])
    ).stdout;
    const tree = await computeCodePromotionTrees({
      repositoryPath,
      targetBaseSha,
      sourceEffects,
      projectedBaseline: { baseSha: exitMergeSha, headSha: stableVersionHeadSha },
    });
    if (!tree.projectedBaseline) throw new Error(`${target} projected baseline tree가 없습니다.`);
    stablePatchSha256 ??= tree.projectedBaseline.patchSha256;
    if (stablePatchSha256 !== tree.projectedBaseline.patchSha256) {
      throw new Error("target별 Stable Version patch digest가 다릅니다.");
    }
    const expectedHeadSha = tree.noOp
      ? targetBaseSha
      : await deterministicCommit(
          repositoryPath,
          tree.codeTreeSha,
          targetBaseSha,
          sourceLane,
          target,
        );
    targetPlans.push({
      lane: target,
      expectedBaseSha: targetBaseSha,
      expectedHeadSha,
      expectedCodeTreeSha: tree.codeTreeSha,
      expectedBaselineTreeSha: tree.projectedBaseline.treeSha,
      patchSha256: tree.patchSha256,
      noOp: tree.noOp,
    });
    if (tree.noOp) continue;
    const marker: CodePromotionMarker = {
      schemaVersion: 1,
      type: "code-promotion",
      lane: target,
      sourceLane,
      stablePr,
      stableVersionHeadSha,
      enterPr: exitMarker.enterPr,
      enterMergeSha: exitMarker.enterMergeSha,
      exitPr,
      exitBaseSha: exitMarker.expectedBaseSha,
      exitMergeSha,
      expectedBaseSha: targetBaseSha,
      expectedHeadSha,
      expectedCodeTreeSha: tree.codeTreeSha,
      expectedBaselineTreeSha: tree.projectedBaseline.treeSha,
      promotionManifestSha256: selected.manifestSha256,
      patchSha256: tree.patchSha256,
      stablePatchSha256: tree.projectedBaseline.patchSha256,
      controlSha,
      controlTreeSha256,
    };
    const pull = await createOrUpdatePromotionPull({
      client,
      repositoryPath,
      environment,
      marker,
      sourcePulls: selected.sources.map((source) => source.pr),
    });
    promotionPulls.push({ lane: target, number: pull.number, headSha: pull.headSha });
  }
  if (!stablePatchSha256) throw new Error("Stable Version patch digest를 계산하지 못했습니다.");
  const marker: StablePromotionMarker = {
    schemaVersion: 1,
    type: "version",
    lane: sourceLane,
    releaseKind: "stable-promotion",
    operationId,
    enterPr: exitMarker.enterPr,
    enterMergeSha: exitMarker.enterMergeSha,
    exitPr,
    exitBaseSha: exitMarker.expectedBaseSha,
    exitMergeSha,
    expectedBaseSha: exitMergeSha,
    expectedHeadSha: stableVersionHeadSha,
    controlSha,
    promotionManifestSha256: selected.manifestSha256,
    stablePatchSha256,
    promotionTargets: targetPlans,
  };
  if (!isStablePromotionMarker(marker))
    throw new Error("Stable promotion marker 생성에 실패했습니다.");
  const body = versionPull.body ?? "";
  if (!markerPattern.test(body)) throw new Error("Stable Version PR marker body가 없습니다.");
  const nextBody = body.replace(markerPattern, encodeMarker(marker));
  await client.request(`/repos/${repository}/pulls/${stablePr}`, {
    method: "PATCH",
    body: JSON.stringify({ body: nextBody }),
  });
  await recordPromotionStatus({
    client,
    headSha: stableVersionHeadSha,
    stablePr,
    manifestSha256: selected.manifestSha256,
    state: "pending",
  });
  const openPulls = (
    await Promise.all(
      (["dev", "minor", "major"] as const).map((lane) =>
        client.paginate<GitHubPullRequest>(
          `/repos/${repository}/pulls?state=open&base=${lane}&sort=created&direction=asc`,
        ),
      ),
    )
  ).flat();
  const uniqueHeads = [...new Set(openPulls.map((pull) => pull.head.sha))];
  await Promise.all(
    uniqueHeads.map((headSha) => markLaneValidationPending(client, headSha, operationId)),
  );
  const readiness = await Promise.all(
    promotionPulls.map(async (pull) => {
      const target = targetPlans.find((plan) => plan.lane === pull.lane);
      if (!target) throw new Error(`${pull.lane} target plan이 없습니다.`);
      if (await hasTrustedPreflight(client, pull.headSha)) return true;
      await dispatchPreflight(
        repository,
        token,
        `release-code-promotion/${pull.lane}/${stablePr}-${selected.manifestSha256.slice(0, 12)}`,
        pull.headSha,
      );
      return false;
    }),
  );
  const preflightReady = readiness.every(Boolean);
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `promotionManifestSha256=${selected.manifestSha256}\npromotionPulls=${JSON.stringify(promotionPulls)}\n`,
    );
  }
  return { marker, promotionPulls, preflightReady };
}
