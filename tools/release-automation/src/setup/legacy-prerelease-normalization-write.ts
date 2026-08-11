import { createHash } from "node:crypto";
import { appendFile } from "node:fs/promises";
import { GitHubClient, type GitHubPullRequest } from "../core/github";
import { encodeMarker } from "../core/marker";
import type { ReleaseMarker } from "../core/types";
import {
  assertLegacyPreState,
  assertReleaseWorkflowsDisabled,
  inspectLegacyNormalization,
  legacyLaneHeads,
  legacyNormalizationBranch,
  legacyNormalizationRepository,
  legacyPreSha256,
  type LegacyNormalizationLane,
} from "./legacy-prerelease-normalization";

const gitShaPattern = /^[0-9a-f]{40}$/;
const operationIdPattern = /^[1-9][0-9]*$/;

interface GitReference {
  object: { sha: string };
}

interface EnvironmentIdentity {
  repository: string;
  token: string;
  operationId: string;
  controlSha?: string;
  lane?: LegacyNormalizationLane;
}

interface GitOptions {
  allowFailure?: boolean;
  environment?: Record<string, string | undefined>;
  trim?: boolean;
}

interface GitResult {
  code: number;
  output: string;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경 변수가 필요합니다.`);
  return value;
}

function environmentIdentity(includeWriter: boolean): EnvironmentIdentity {
  const repository = required("GITHUB_REPOSITORY");
  const token = required("GH_TOKEN");
  const operationId = required("LEGACY_NORMALIZATION_OPERATION_ID");
  if (repository !== legacyNormalizationRepository || !operationIdPattern.test(operationId)) {
    throw new Error("legacy normalization repository 또는 operation ID가 exact 계약과 다릅니다.");
  }
  if (!includeWriter) return { repository, token, operationId };
  const lane = required("LEGACY_NORMALIZATION_LANE");
  const controlSha = required("LEGACY_NORMALIZATION_CONTROL_SHA");
  if ((lane !== "minor" && lane !== "major") || !gitShaPattern.test(controlSha)) {
    throw new Error("legacy normalization writer lane/control SHA가 올바르지 않습니다.");
  }
  return { repository, token, operationId, lane, controlSha };
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

async function git(arguments_: string[], options: GitOptions = {}): Promise<GitResult> {
  const child = Bun.spawn(["git", ...arguments_], {
    env: options.environment ?? { ...process.env, GH_TOKEN: undefined, GITHUB_TOKEN: undefined },
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

async function fetchControlAndLanes(
  environment: Record<string, string | undefined>,
): Promise<void> {
  await git(
    [
      "fetch",
      "--no-tags",
      "origin",
      "+refs/heads/dev:refs/remotes/origin/dev",
      "+refs/heads/minor:refs/remotes/origin/minor",
      "+refs/heads/major:refs/remotes/origin/major",
    ],
    { environment },
  );
}

async function assertNoPreviousSurface(
  repository: string,
  client: GitHubClient,
  environment: Record<string, string | undefined>,
): Promise<void> {
  const [minorPulls, majorPulls, branches] = await Promise.all([
    client.paginate<GitHubPullRequest>(
      `/repos/${repository}/pulls?state=all&base=minor&sort=created&direction=asc`,
    ),
    client.paginate<GitHubPullRequest>(
      `/repos/${repository}/pulls?state=all&base=major&sort=created&direction=asc`,
    ),
    git(["ls-remote", "--heads", "origin", "refs/heads/release-legacy-normalization/*"], {
      environment,
    }),
  ]);
  const previousPulls = [...minorPulls, ...majorPulls].filter((pull) =>
    pull.head.ref.startsWith("release-legacy-normalization/"),
  );
  if (previousPulls.length > 0 || branches.output) {
    throw new Error(
      "legacy normalization은 재실행하거나 closed-unmerged reserved branch를 재사용할 수 없습니다.",
    );
  }
}

async function assertRemoteIdentity(
  identity: EnvironmentIdentity & { controlSha: string },
  client: GitHubClient,
): Promise<void> {
  const [dev, minor, major, checkout] = await Promise.all([
    client.request<GitReference>(`/repos/${identity.repository}/git/ref/heads/dev`),
    client.request<GitReference>(`/repos/${identity.repository}/git/ref/heads/minor`),
    client.request<GitReference>(`/repos/${identity.repository}/git/ref/heads/major`),
    git(["rev-parse", "HEAD"]),
  ]);
  if (
    checkout.output !== identity.controlSha ||
    dev.object.sha !== identity.controlSha ||
    minor.object.sha !== legacyLaneHeads.minor ||
    major.object.sha !== legacyLaneHeads.major
  ) {
    throw new Error("legacy normalization dev/lane exact head가 stale하거나 부분 완료 상태입니다.");
  }
}

async function preflight(): Promise<void> {
  const identity = environmentIdentity(false);
  const client = new GitHubClient(identity.repository, identity.token);
  const environment = authenticatedEnvironment(identity.token);
  await fetchControlAndLanes(environment);
  const controlSha = (await git(["rev-parse", "HEAD"])).output;
  if (
    !gitShaPattern.test(controlSha) ||
    (await git(["rev-parse", "origin/dev"])).output !== controlSha
  ) {
    throw new Error("legacy normalization preflight가 current exact dev control에 있지 않습니다.");
  }
  await Promise.all([
    assertReleaseWorkflowsDisabled(identity.repository, client),
    assertRemoteIdentity({ ...identity, controlSha }, client),
    assertNoPreviousSurface(identity.repository, client, environment),
  ]);
  const status = await inspectLegacyNormalization({ repository: identity.repository, client });
  if (status.complete || status.lanes.minor !== "legacy" || status.lanes.major !== "legacy") {
    throw new Error(
      "legacy normalization preflight는 두 lane의 exact bootstrap state에서만 시작합니다.",
    );
  }
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `control_sha=${controlSha}\noperation_id=${identity.operationId}\nmatrix=${JSON.stringify([
        { lane: "minor" },
        { lane: "major" },
      ])}\n`,
    );
  }
  console.log(`legacy normalization preflight가 dev@${controlSha}에서 두 lane을 고정했습니다.`);
}

async function remoteBranch(
  branch: string,
  environment: Record<string, string | undefined>,
): Promise<string | null> {
  const result = await git(["ls-remote", "--heads", "origin", `refs/heads/${branch}`], {
    environment,
  });
  const sha = result.output.split(/\s+/)[0];
  return sha && gitShaPattern.test(sha) ? sha : null;
}

async function createDeletionCommit(input: {
  lane: LegacyNormalizationLane;
  operationId: string;
  baseSha: string;
}): Promise<{ headSha: string; patchSha256: string }> {
  const indexPath = `/tmp/seed-legacy-normalization-index-${input.lane}-${input.operationId}`;
  const indexEnvironment = {
    ...process.env,
    GH_TOKEN: undefined,
    GITHUB_TOKEN: undefined,
    GIT_INDEX_FILE: indexPath,
  };
  await git(["read-tree", input.baseSha], { environment: indexEnvironment });
  await git(["update-index", "--force-remove", ".changeset/pre.json"], {
    environment: indexEnvironment,
  });
  const treeSha = (await git(["write-tree"], { environment: indexEnvironment })).output;
  const patch = (
    await git(["diff", "--binary", "--full-index", "--no-ext-diff", input.baseSha, treeSha, "--"], {
      trim: false,
    })
  ).output;
  const commitEnvironment = {
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
  const headSha = (
    await git(
      [
        "commit-tree",
        treeSha,
        "-p",
        input.baseSha,
        "-m",
        `chore(release): normalize legacy ${input.lane} prerelease`,
      ],
      { environment: commitEnvironment },
    )
  ).output;
  return { headSha, patchSha256: createHash("sha256").update(patch).digest("hex") };
}

async function dispatchValidation(input: {
  repository: string;
  token: string;
  branch: string;
  headSha: string;
  pullNumber: number;
}): Promise<void> {
  const response = await fetch(
    `https://api.github.com/repos/${input.repository}/actions/workflows/release-pr-validation.yml/dispatches`,
    {
      method: "POST",
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${input.token}`,
        "content-type": "application/json",
        "x-github-api-version": "2022-11-28",
      },
      body: JSON.stringify({
        ref: "dev",
        inputs: {
          head_ref: input.branch,
          head_sha: input.headSha,
          pull_number: String(input.pullNumber),
        },
      }),
    },
  );
  if (!response.ok)
    throw new Error(`legacy normalization validation dispatch 실패: ${response.status}`);
}

async function writePull(): Promise<void> {
  const identity = environmentIdentity(true);
  const lane = identity.lane;
  const controlSha = identity.controlSha;
  if (!lane || !controlSha) throw new Error("legacy normalization writer identity가 없습니다.");
  const client = new GitHubClient(identity.repository, identity.token);
  const environment = authenticatedEnvironment(identity.token);
  await fetchControlAndLanes(environment);
  await Promise.all([
    assertReleaseWorkflowsDisabled(identity.repository, client),
    assertRemoteIdentity({ ...identity, controlSha }, client),
    assertLegacyPreState(process.cwd(), legacyLaneHeads[lane], lane),
  ]);
  const branch = legacyNormalizationBranch(lane, identity.operationId);
  const [existingBranch, pulls] = await Promise.all([
    remoteBranch(branch, environment),
    client.paginate<GitHubPullRequest>(
      `/repos/${identity.repository}/pulls?state=all&base=${lane}&sort=created&direction=asc`,
    ),
  ]);
  if (
    existingBranch ||
    pulls.some(
      (pull) =>
        pull.head.ref === branch || pull.head.ref.startsWith("release-legacy-normalization/"),
    )
  ) {
    throw new Error(
      `${lane} legacy normalization reserved branch/PR은 새 실행에서 재사용할 수 없습니다.`,
    );
  }
  const baseSha = legacyLaneHeads[lane];
  const { headSha, patchSha256 } = await createDeletionCommit({
    lane,
    operationId: identity.operationId,
    baseSha,
  });
  await git(["push", "origin", `${headSha}:refs/heads/${branch}`], { environment });
  const [remote, dev, currentLane] = await Promise.all([
    client.request<GitReference>(
      `/repos/${identity.repository}/git/ref/heads/${encodeURIComponent(branch)}`,
    ),
    client.request<GitReference>(`/repos/${identity.repository}/git/ref/heads/dev`),
    client.request<GitReference>(`/repos/${identity.repository}/git/ref/heads/${lane}`),
  ]);
  if (
    remote.object.sha !== headSha ||
    dev.object.sha !== controlSha ||
    currentLane.object.sha !== baseSha
  ) {
    throw new Error(`${lane} normalization PR 생성 직전 remote identity가 stale합니다.`);
  }
  const marker: ReleaseMarker = {
    schemaVersion: 1,
    type: "legacy-normalization",
    lane,
    operationId: identity.operationId,
    sourceRepository: identity.repository,
    expectedBaseSha: baseSha,
    expectedHeadSha: headSha,
    expectedPreSha256: legacyPreSha256,
    patchSha256,
    controlSha,
  };
  const title = `chore(release): normalize legacy ${lane} prerelease`;
  const body = [
    encodeMarker(marker),
    "",
    `## ${lane} legacy prerelease normalization`,
    "",
    `Exact base \`${baseSha}\`; trusted dev control \`${controlSha}\`; operation \`${identity.operationId}\`.`,
    "",
    "이 PR은 이 lane의 `.changeset/pre.json`만 삭제합니다. package version, CHANGELOG, Changeset, 코드 또는 다른 상태 파일을 바꾸지 않습니다.",
    "",
    "두 normalization PR은 각각 사람이 **Squash and merge**해야 합니다. npm, Git tag, Rootage 게시를 수행하지 않습니다.",
  ].join("\n");
  const pull = await client.request<GitHubPullRequest>(`/repos/${identity.repository}/pulls`, {
    method: "POST",
    body: JSON.stringify({ title, body, head: branch, base: lane }),
  });
  await dispatchValidation({
    repository: identity.repository,
    token: identity.token,
    branch,
    headSha,
    pullNumber: pull.number,
  });
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `lane=${lane}\nhead_sha=${headSha}\npull=${pull.number}\n`,
    );
  }
  console.log(`${lane} legacy normalization PR #${pull.number}을 생성하고 검증을 요청했습니다.`);
}

const command = Bun.argv[2];
if (command === "preflight") await preflight();
else if (command === "write") await writePull();
else throw new Error(`지원하지 않는 legacy normalization command입니다: ${command ?? "없음"}`);
