import { createHash } from "node:crypto";
import { appendFile, lstat, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { GitHubClient, type GitHubPullRequest } from "../core/github";
import { encodeMarker, isPrereleaseMarker, validateGeneratedPr } from "../core/marker";
import type { PrereleaseOperation, ReleaseMarker } from "../core/types";
import {
  assertPrereleaseTransition,
  classifyPrereleaseState,
  isWorkspaceDirectory,
  parseOptionalPrereleaseState,
  type PrereleaseState,
} from "./prerelease-state";
import { assertDevStablePublishReconciled } from "../publish/baseline-reconciliation-state";
import { selectActiveEnterPull } from "../promotion/source-selection";
import { assertNoCompetingOpenStablePromotion } from "../promotion/promotion-state";

const gitShaPattern = /^[0-9a-f]{40}$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const operationIdPattern = /^[1-9][0-9]*$/;
const maxPatchBytes = 4 * 1024 * 1024;
const maxPlanBytes = 128 * 1024;
const planKeys = [
  "baseSha",
  "controlSha",
  "files",
  "kind",
  "lane",
  "operation",
  "operationId",
  "patchSha256",
  "schemaVersion",
  "treeSha",
] as const;

export interface PrereleaseWritePlan {
  schemaVersion: 1;
  kind: "prerelease";
  lane: "minor" | "major";
  operation: PrereleaseOperation;
  operationId: string;
  baseSha: string;
  controlSha: string;
  treeSha: string;
  patchSha256: string;
  files: [".changeset/pre.json"];
}

interface GitOptions {
  allowFailure?: boolean;
  environment?: Record<string, string | undefined>;
  trimOutput?: boolean;
}

interface GitResult {
  code: number;
  stdout: string;
  stderr: string;
}

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label}이 객체가 아닙니다.`);
  }
  return value as Record<string, unknown>;
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "undefined";
}

function assertSameJson(actual: unknown, expected: unknown, label: string): void {
  if (canonicalJson(actual) !== canonicalJson(expected)) {
    throw new Error(`${label}이 exact trusted plan과 다릅니다.`);
  }
}

function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

function parseLane(value: unknown): "minor" | "major" {
  if (value !== "minor" && value !== "major") {
    throw new Error(`prerelease operation은 minor/major만 지원합니다: ${String(value)}`);
  }
  return value;
}

function parseOperation(value: unknown): PrereleaseOperation {
  if (value !== "enter" && value !== "exit") {
    throw new Error(`지원하지 않는 prerelease operation입니다: ${String(value)}`);
  }
  return value;
}

export function parsePrereleaseWritePlan(value: unknown): PrereleaseWritePlan {
  const plan = asRecord(value, "prerelease write plan");
  assertSameJson(Object.keys(plan).sort(), [...planKeys].sort(), "prerelease plan key");
  if (plan.schemaVersion !== 1 || plan.kind !== "prerelease") {
    throw new Error("prerelease plan schema/kind가 올바르지 않습니다.");
  }
  const lane = parseLane(plan.lane);
  const operation = parseOperation(plan.operation);
  if (typeof plan.operationId !== "string" || !operationIdPattern.test(plan.operationId)) {
    throw new Error("prerelease operation ID가 올바르지 않습니다.");
  }
  for (const [label, value_] of [
    ["base", plan.baseSha],
    ["control", plan.controlSha],
    ["tree", plan.treeSha],
  ] as const) {
    if (typeof value_ !== "string" || !gitShaPattern.test(value_)) {
      throw new Error(`${label} SHA가 올바르지 않습니다.`);
    }
  }
  if (typeof plan.patchSha256 !== "string" || !sha256Pattern.test(plan.patchSha256)) {
    throw new Error("prerelease patch SHA-256이 올바르지 않습니다.");
  }
  assertSameJson(plan.files, [".changeset/pre.json"], "prerelease plan files");
  return {
    schemaVersion: 1,
    kind: "prerelease",
    lane,
    operation,
    operationId: plan.operationId,
    baseSha: plan.baseSha as string,
    controlSha: plan.controlSha as string,
    treeSha: plan.treeSha as string,
    patchSha256: plan.patchSha256,
    files: [".changeset/pre.json"],
  };
}

async function git(
  repositoryPath: string,
  arguments_: string[],
  options: GitOptions = {},
): Promise<GitResult> {
  const child = Bun.spawn(["git", ...arguments_], {
    cwd: repositoryPath,
    env: options.environment ?? {
      ...process.env,
      GH_TOKEN: undefined,
      GITHUB_TOKEN: undefined,
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
    throw new Error(`git ${arguments_.join(" ")} 실패:\n${stderr.trim()}`);
  }
  return {
    code,
    stdout: options.trimOutput === false ? stdout : stdout.trim(),
    stderr: stderr.trim(),
  };
}

async function readTextAt(
  repositoryPath: string,
  ref: string,
  path: string,
  optional = false,
): Promise<string | null> {
  const result = await git(repositoryPath, ["show", `${ref}:${path}`], { allowFailure: optional });
  return result.code === 0 ? result.stdout : null;
}

async function workspaceVersionsAt(
  repositoryPath: string,
  ref: string,
): Promise<Record<string, string>> {
  const rootText = await readTextAt(repositoryPath, ref, "package.json");
  if (!rootText) throw new Error(`${ref}:package.json을 읽지 못했습니다.`);
  const root = asRecord(JSON.parse(rootText) as unknown, `${ref}:package.json`);
  if (
    !Array.isArray(root.workspaces) ||
    !root.workspaces.every((item) => typeof item === "string")
  ) {
    throw new Error("root workspaces가 문자열 배열이 아닙니다.");
  }
  const tree = await git(repositoryPath, ["ls-tree", "-r", "--name-only", ref, "--"]);
  const versions: Record<string, string> = {};
  for (const path of tree.stdout.split("\n").filter((item) => item.endsWith("/package.json"))) {
    if (!isWorkspaceDirectory(dirname(path), root.workspaces as string[])) continue;
    const text = await readTextAt(repositoryPath, ref, path);
    if (!text) throw new Error(`${ref}:${path}을 읽지 못했습니다.`);
    const manifest = asRecord(JSON.parse(text) as unknown, `${ref}:${path}`);
    if (typeof manifest.name !== "string" || typeof manifest.version !== "string") {
      throw new Error(`${ref}:${path}의 workspace package name/version이 올바르지 않습니다.`);
    }
    if (versions[manifest.name])
      throw new Error(`workspace package name이 중복됩니다: ${manifest.name}`);
    versions[manifest.name] = manifest.version;
  }
  if (Object.keys(versions).length === 0) throw new Error("workspace package가 없습니다.");
  return versions;
}

async function stateAt(
  repositoryPath: string,
  ref: string,
  label: string,
): Promise<PrereleaseState | null> {
  return parseOptionalPrereleaseState(
    await readTextAt(repositoryPath, ref, ".changeset/pre.json", true),
    label,
  );
}

export async function verifyPrereleasePlanTree(
  repositoryPath: string,
  plan: PrereleaseWritePlan,
  proposedRef: string,
): Promise<void> {
  const [filesResult, tree, baseState, proposedState] = await Promise.all([
    git(repositoryPath, ["diff", "--name-only", plan.baseSha, proposedRef, "--"]),
    git(repositoryPath, ["rev-parse", `${proposedRef}^{tree}`]),
    stateAt(repositoryPath, plan.baseSha, "base prerelease state"),
    stateAt(repositoryPath, proposedRef, "proposed prerelease state"),
  ]);
  const files = filesResult.stdout ? filesResult.stdout.split("\n").sort() : [];
  assertSameJson(files, plan.files, "prerelease changed files");
  if (tree.stdout !== plan.treeSha) throw new Error("prerelease plan tree SHA가 다릅니다.");
  const workspaceVersions =
    plan.operation === "enter"
      ? await workspaceVersionsAt(repositoryPath, plan.baseSha)
      : undefined;
  assertPrereleaseTransition({
    lane: plan.lane,
    operation: plan.operation,
    base: baseState,
    proposed: proposedState,
    workspaceVersions,
  });
}

export async function verifyGeneratedPrereleasePlan(
  repositoryPath: string,
  marker: ReleaseMarker,
  baseSha: string,
  headSha: string,
): Promise<void> {
  if (!isPrereleaseMarker(marker)) throw new Error("exact prerelease marker가 없습니다.");
  if (marker.expectedBaseSha !== baseSha || marker.expectedHeadSha !== headSha) {
    throw new Error("prerelease marker의 base/head SHA 결속이 올바르지 않습니다.");
  }
  const [currentLane, commit, tree, patch] = await Promise.all([
    git(repositoryPath, ["rev-parse", `refs/remotes/origin/${marker.lane}`]),
    git(repositoryPath, ["rev-list", "--parents", "-n", "1", headSha]),
    git(repositoryPath, ["rev-parse", `${headSha}^{tree}`]),
    git(
      repositoryPath,
      ["diff", "--binary", "--full-index", "--no-ext-diff", baseSha, headSha, "--"],
      { trimOutput: false },
    ),
  ]);
  const parents = commit.stdout.split(/\s+/);
  if (currentLane.stdout !== baseSha || parents.length !== 2 || parents[1] !== baseSha) {
    throw new Error("prerelease head가 current exact lane base의 단일 자식이 아닙니다.");
  }
  if (sha256(patch.stdout) !== marker.patchSha256) {
    throw new Error("prerelease marker patch SHA-256이 exact diff와 다릅니다.");
  }
  const plan: PrereleaseWritePlan = {
    schemaVersion: 1,
    kind: "prerelease",
    lane: marker.lane,
    operation: marker.operation,
    operationId: marker.operationId,
    baseSha,
    controlSha: marker.controlSha,
    treeSha: tree.stdout,
    patchSha256: marker.patchSha256,
    files: [".changeset/pre.json"],
  };
  await verifyPrereleasePlanTree(repositoryPath, plan, headSha);
}

function requiredEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경 변수가 필요합니다.`);
  return value;
}

function environmentIdentity(): Omit<
  PrereleaseWritePlan,
  "schemaVersion" | "kind" | "treeSha" | "patchSha256" | "files"
> {
  const lane = parseLane(requiredEnvironment("RELEASE_PLAN_LANE"));
  const operation = parseOperation(requiredEnvironment("RELEASE_PLAN_OPERATION"));
  const operationId = requiredEnvironment("RELEASE_PLAN_OPERATION_ID");
  const baseSha = requiredEnvironment("RELEASE_PLAN_BASE_SHA");
  const controlSha = requiredEnvironment("RELEASE_PLAN_CONTROL_SHA");
  if (!operationIdPattern.test(operationId)) throw new Error("operation ID가 올바르지 않습니다.");
  if (!gitShaPattern.test(baseSha) || !gitShaPattern.test(controlSha)) {
    throw new Error("base/control SHA가 올바르지 않습니다.");
  }
  return { lane, operation, operationId, baseSha, controlSha };
}

async function createPlan(artifactPath: string): Promise<void> {
  const repositoryPath = process.cwd();
  const identity = environmentIdentity();
  const [head, control] = await Promise.all([
    git(repositoryPath, ["rev-parse", "HEAD"]),
    git(repositoryPath, ["rev-parse", "origin/dev"]),
  ]);
  if (head.stdout !== identity.baseSha || control.stdout !== identity.controlSha) {
    throw new Error("planner checkout이 exact lane/dev SHA와 다릅니다.");
  }
  await git(repositoryPath, ["add", "-A"]);
  const filesResult = await git(repositoryPath, [
    "diff",
    "--cached",
    "--name-only",
    identity.baseSha,
    "--",
  ]);
  const files = filesResult.stdout ? filesResult.stdout.split("\n").sort() : [];
  assertSameJson(files, [".changeset/pre.json"], "prerelease planner files");
  const patch = (
    await git(
      repositoryPath,
      ["diff", "--cached", "--binary", "--full-index", "--no-ext-diff", identity.baseSha, "--"],
      { trimOutput: false },
    )
  ).stdout;
  const treeSha = (await git(repositoryPath, ["write-tree"])).stdout;
  const plan: PrereleaseWritePlan = {
    schemaVersion: 1,
    kind: "prerelease",
    ...identity,
    treeSha,
    patchSha256: sha256(patch),
    files: [".changeset/pre.json"],
  };
  await verifyPrereleasePlanTree(repositoryPath, plan, treeSha);
  await mkdir(artifactPath, { recursive: true });
  await Promise.all([
    writeFile(join(artifactPath, "plan.json"), `${JSON.stringify(plan, null, 2)}\n`),
    writeFile(join(artifactPath, "plan.patch"), patch),
  ]);
}

async function loadArtifact(
  artifactPath: string,
): Promise<{ plan: PrereleaseWritePlan; patch: string }> {
  const planPath = join(artifactPath, "plan.json");
  const patchPath = join(artifactPath, "plan.patch");
  const [planStat, patchStat] = await Promise.all([lstat(planPath), lstat(patchPath)]);
  if (
    !planStat.isFile() ||
    planStat.isSymbolicLink() ||
    planStat.size <= 0 ||
    planStat.size > maxPlanBytes ||
    !patchStat.isFile() ||
    patchStat.isSymbolicLink() ||
    patchStat.size <= 0 ||
    patchStat.size > maxPatchBytes
  ) {
    throw new Error("prerelease plan artifact가 없거나 안전한 크기가 아닙니다.");
  }
  const [rawPlan, patch] = await Promise.all([
    readFile(planPath, "utf8"),
    readFile(patchPath, "utf8"),
  ]);
  const plan = parsePrereleaseWritePlan(JSON.parse(rawPlan) as unknown);
  if (sha256(patch) !== plan.patchSha256) throw new Error("prerelease plan patch hash가 다릅니다.");
  return { plan, patch };
}

function authenticatedEnvironment(token: string): Record<string, string | undefined> {
  const authorization = Buffer.from(`x-access-token:${token}`).toString("base64");
  return {
    ...process.env,
    GH_TOKEN: undefined,
    GITHUB_TOKEN: undefined,
    GIT_CONFIG_COUNT: "1",
    GIT_CONFIG_KEY_0: "http.https://github.com/.extraheader",
    GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${authorization}`,
  };
}

async function currentRemoteBranch(
  repositoryPath: string,
  branch: string,
  environment: Record<string, string | undefined>,
): Promise<string | null> {
  const result = await git(
    repositoryPath,
    ["ls-remote", "--heads", "origin", `refs/heads/${branch}`],
    {
      environment,
    },
  );
  const sha = result.stdout.split(/\s+/)[0];
  return sha && gitShaPattern.test(sha) ? sha : null;
}

async function prepareCommit(
  repositoryPath: string,
  plan: PrereleaseWritePlan,
  patch: string,
): Promise<string> {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), "seed-release-prerelease-write-"));
  let worktreeAdded = false;
  try {
    await git(repositoryPath, ["worktree", "add", "--detach", temporaryDirectory, plan.baseSha]);
    worktreeAdded = true;
    const patchPath = join(temporaryDirectory, "release-plan.patch");
    await writeFile(patchPath, patch);
    await git(temporaryDirectory, [
      "apply",
      "--index",
      "--binary",
      "--whitespace=nowarn",
      patchPath,
    ]);
    const treeSha = (await git(temporaryDirectory, ["write-tree"])).stdout;
    if (treeSha !== plan.treeSha) throw new Error("writer prerelease tree가 plan과 다릅니다.");
    await verifyPrereleasePlanTree(repositoryPath, plan, treeSha);
    const environment: Record<string, string | undefined> = {
      ...process.env,
      GH_TOKEN: undefined,
      GITHUB_TOKEN: undefined,
      GIT_AUTHOR_NAME: "github-actions[bot]",
      GIT_AUTHOR_EMAIL: "41898282+github-actions[bot]@users.noreply.github.com",
      GIT_AUTHOR_DATE: "2000-01-01T00:00:00Z",
      GIT_COMMITTER_NAME: "github-actions[bot]",
      GIT_COMMITTER_EMAIL: "41898282+github-actions[bot]@users.noreply.github.com",
      GIT_COMMITTER_DATE: "2000-01-01T00:00:00Z",
    };
    return (
      await git(
        repositoryPath,
        [
          "commit-tree",
          plan.treeSha,
          "-p",
          plan.baseSha,
          "-m",
          `chore(release): ${plan.operation} ${plan.lane} prerelease`,
        ],
        { environment },
      )
    ).stdout;
  } finally {
    if (worktreeAdded) {
      await git(repositoryPath, ["worktree", "remove", "--force", temporaryDirectory], {
        allowFailure: true,
      });
    }
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

function identityFromPull(pull: GitHubPullRequest) {
  return {
    author: pull.user.login,
    body: pull.body ?? "",
    baseRef: pull.base.ref,
    headRef: pull.head.ref,
    baseRepository: pull.base.repo.full_name,
    headRepository: pull.head.repo?.full_name ?? "",
  };
}

async function dispatchValidation(
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
      body: JSON.stringify({ ref: "dev", inputs: { head_ref: headRef, head_sha: headSha } }),
    },
  );
  if (!response.ok) throw new Error(`prerelease validation dispatch 실패: ${response.status}`);
}

async function writePlan(artifactPath: string): Promise<void> {
  const repositoryPath = process.cwd();
  const token = requiredEnvironment("GH_TOKEN");
  const repository = requiredEnvironment("GITHUB_REPOSITORY");
  const identity = environmentIdentity();
  const { plan, patch } = await loadArtifact(artifactPath);
  assertSameJson(
    {
      lane: plan.lane,
      operation: plan.operation,
      operationId: plan.operationId,
      baseSha: plan.baseSha,
      controlSha: plan.controlSha,
    },
    identity,
    "prerelease writer environment identity",
  );
  const environment = authenticatedEnvironment(token);
  const sibling = plan.lane === "minor" ? "major" : "minor";
  await git(
    repositoryPath,
    [
      "fetch",
      "--no-tags",
      "origin",
      "+refs/heads/dev:refs/remotes/origin/dev",
      `+refs/heads/${plan.lane}:refs/remotes/origin/${plan.lane}`,
      `+refs/heads/${sibling}:refs/remotes/origin/${sibling}`,
    ],
    { environment },
  );
  const [writerHead, devHead, laneHead] = await Promise.all([
    git(repositoryPath, ["rev-parse", "HEAD"]),
    git(repositoryPath, ["rev-parse", "origin/dev"]),
    git(repositoryPath, ["rev-parse", `origin/${plan.lane}`]),
  ]);
  if (
    writerHead.stdout !== plan.controlSha ||
    devHead.stdout !== plan.controlSha ||
    laneHead.stdout !== plan.baseSha
  ) {
    throw new Error("prerelease writer의 dev/lane SHA가 stale합니다.");
  }
  const siblingStateResult = await git(
    repositoryPath,
    ["show", `origin/${sibling}:.changeset/pre.json`],
    { allowFailure: true },
  );
  const siblingState = parseOptionalPrereleaseState(
    siblingStateResult.code === 0 ? siblingStateResult.stdout : null,
    `${sibling} sibling prerelease state`,
  );
  if (classifyPrereleaseState(sibling, siblingState) !== "dormant") {
    throw new Error(
      `prerelease ${plan.operation} 전 sibling ${sibling} lane은 dormant여야 합니다.`,
    );
  }
  const client = new GitHubClient(repository, token);
  const siblingPulls = await client.paginate<GitHubPullRequest>(
    `/repos/${repository}/pulls?state=open&base=${sibling}&sort=created&direction=asc`,
  );
  if (
    siblingPulls.some((pull) => {
      const marker = validateGeneratedPr(identityFromPull(pull));
      return (
        marker?.type === "version" || marker?.type === "prerelease" || marker?.type === "baseline"
      );
    })
  ) {
    throw new Error(`sibling ${sibling} lane에 경쟁 중인 state/Version PR이 있습니다.`);
  }
  await assertNoCompetingOpenStablePromotion({ repository, client });
  await assertDevStablePublishReconciled({
    repository,
    currentDevSha: plan.controlSha,
    client,
  });
  const headSha = await prepareCommit(repositoryPath, plan, patch);
  const branch = `release-prerelease/${plan.lane}/${plan.operation}-${plan.operationId}`;
  const pulls = await client.paginate<GitHubPullRequest>(
    `/repos/${repository}/pulls?state=open&base=${plan.lane}&sort=created&direction=asc`,
  );
  const exact = pulls.filter(
    (pull) =>
      pull.head.ref === branch &&
      pull.head.repo?.full_name === repository &&
      pull.base.ref === plan.lane &&
      pull.base.repo.full_name === repository,
  );
  if (exact.length > 1) throw new Error("동일 prerelease operation PR이 둘 이상입니다.");
  const blockers = pulls.filter((pull) => {
    if (exact.includes(pull)) return false;
    const generated = validateGeneratedPr(identityFromPull(pull));
    return (
      pull.head.ref === `changeset-release/${plan.lane}` ||
      pull.head.ref.startsWith(`release-prerelease/${plan.lane}/`) ||
      generated?.type === "version" ||
      generated?.type === "prerelease"
    );
  });
  if (blockers.length > 0) {
    throw new Error(
      `${plan.lane}에 경쟁 중인 Version/prerelease PR이 있습니다: ${blockers.map((pull) => `#${pull.number}`).join(", ")}`,
    );
  }
  const remoteSha = await currentRemoteBranch(repositoryPath, branch, environment);
  if (exact[0]) {
    const marker = validateGeneratedPr(identityFromPull(exact[0]));
    if (!marker || !isPrereleaseMarker(marker) || exact[0].head.sha !== remoteSha) {
      throw new Error("기존 prerelease PR identity/head가 trusted state가 아닙니다.");
    }
  } else if (remoteSha && remoteSha !== headSha) {
    throw new Error("PR 없는 prerelease reserved branch가 expected head와 다릅니다.");
  }
  if (remoteSha !== headSha) {
    const lease = remoteSha
      ? `--force-with-lease=refs/heads/${branch}:${remoteSha}`
      : `--force-with-lease=refs/heads/${branch}:`;
    await git(repositoryPath, ["push", lease, "origin", `${headSha}:refs/heads/${branch}`], {
      environment,
    });
  }
  const [remoteBranch, currentDev, currentLane] = await Promise.all([
    client.request<{ commit: { sha: string } }>(
      `/repos/${repository}/branches/${encodeURIComponent(branch)}`,
    ),
    client.request<{ commit: { sha: string } }>(`/repos/${repository}/branches/dev`),
    client.request<{ commit: { sha: string } }>(`/repos/${repository}/branches/${plan.lane}`),
  ]);
  if (
    remoteBranch.commit.sha !== headSha ||
    currentDev.commit.sha !== plan.controlSha ||
    currentLane.commit.sha !== plan.baseSha
  ) {
    throw new Error("prerelease PR 생성 직전 remote dev/lane/head가 plan과 다릅니다.");
  }
  const marker: ReleaseMarker = {
    schemaVersion: 1,
    type: "prerelease",
    lane: plan.lane,
    operation: plan.operation,
    operationId: plan.operationId,
    expectedBaseSha: plan.baseSha,
    expectedHeadSha: headSha,
    controlSha: plan.controlSha,
    patchSha256: plan.patchSha256,
    ...(plan.operation === "exit"
      ? await (async () => {
          const [closedPulls, history] = await Promise.all([
            client.paginate<GitHubPullRequest>(
              `/repos/${repository}/pulls?state=closed&base=${plan.lane}&sort=updated&direction=asc`,
            ),
            git(repositoryPath, ["rev-list", "--first-parent", "--reverse", plan.baseSha]),
          ]);
          const enter = selectActiveEnterPull({
            repository,
            sourceLane: plan.lane,
            currentFirstParentHistory: history.stdout.split("\n").filter(Boolean),
            pulls: closedPulls,
          });
          return { enterPr: enter.pull.number, enterMergeSha: enter.mergeSha };
        })()
      : {}),
  };
  const title = `release: ${plan.operation} ${plan.lane} prerelease`;
  const body = [
    encodeMarker(marker),
    "",
    `## ${plan.lane} prerelease ${plan.operation}`,
    "",
    `Operation \`${plan.operationId}\`; exact base \`${plan.baseSha}\`; trusted control \`${plan.controlSha}\`.`,
    "",
    plan.operation === "exit"
      ? "이 PR은 exit intent state만 반영하며 package를 게시하지 않습니다. 병합 후 별도의 Stable Version Packages PR이 생성됩니다."
      : "이 PR은 beta prerelease state만 반영하며 package를 게시하지 않습니다.",
  ].join("\n");
  let pullNumber: number;
  if (exact[0]) {
    const updated = await client.request<GitHubPullRequest>(
      `/repos/${repository}/pulls/${exact[0].number}`,
      { method: "PATCH", body: JSON.stringify({ title, body }) },
    );
    pullNumber = updated.number;
  } else {
    const created = await client.request<GitHubPullRequest>(`/repos/${repository}/pulls`, {
      method: "POST",
      body: JSON.stringify({ title, body, head: branch, base: plan.lane }),
    });
    pullNumber = created.number;
  }
  await client.ensureLabel("release:prerelease", "7057ff", "Prerelease state operation");
  await client.request(`/repos/${repository}/issues/${pullNumber}/labels`, {
    method: "POST",
    body: JSON.stringify({ labels: ["release:prerelease"] }),
  });
  await dispatchValidation(repository, token, branch, headSha);
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `changed=true\nlane=${plan.lane}\noperation=${plan.operation}\noperationId=${plan.operationId}\nheadSha=${headSha}\npr=${pullNumber}\n`,
    );
  }
}

async function main(): Promise<void> {
  const [command, artifactPath] = Bun.argv.slice(2);
  if (!artifactPath) throw new Error("prerelease plan artifact 경로가 필요합니다.");
  if (command === "create-prerelease") return createPlan(artifactPath);
  if (command === "write-prerelease") return writePlan(artifactPath);
  throw new Error(`지원하지 않는 prerelease plan command입니다: ${command ?? "없음"}`);
}

if (import.meta.main) await main();
