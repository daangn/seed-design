import type { GitHubClient, GitHubPullRequest } from "../core/github";
import type { LaneConfig } from "../core/types";
import { sha256 } from "./sync";
import { generatedMarkerForPull, isDirectSyncHead, trustedSyncMarkerForPull } from "./sync-policy";
import { verifyGeneratedSyncTree, type SyncTreeVerification } from "./sync-tree";

export type CurrentGitHubPullRequest = GitHubPullRequest & { state: "open" | "closed" };
export type TrustedSyncMarker = NonNullable<ReturnType<typeof trustedSyncMarkerForPull>>;

export interface TrustedSyncValidationClient {
  getPull(repository: string, pullNumber: number): Promise<CurrentGitHubPullRequest>;
  getBranchSha(repository: string, branch: string): Promise<string>;
}

export type SyncPullDiffFetcher = (repository: string, pullNumber: number) => Promise<string>;
export type SyncTreeVerifier = (
  repositoryPath: string,
  headSha: string,
  expectedBaseSha: string,
  sourceDiff: string,
  targetBump: TrustedSyncMarker["targetBump"],
  controlSha: string,
  expectedControlTreeSha256: string,
) => Promise<SyncTreeVerification>;
export type SyncParentLineReader = (repositoryPath: string, headSha: string) => Promise<string>;

export interface TrustedSyncValidationInput {
  repository: string;
  repositoryPath?: string;
  pull: GitHubPullRequest;
  marker: TrustedSyncMarker;
  config: LaneConfig;
  client: TrustedSyncValidationClient;
  fetchPullDiff: SyncPullDiffFetcher;
  verifyTree?: SyncTreeVerifier;
}

export interface TrustedSyncValidationResult {
  sourcePull: CurrentGitHubPullRequest;
  sourceDiff: string;
  targetBaseSha: string;
}

export interface SyncMergePreconditionInput {
  repository: string;
  repositoryPath?: string;
  pull: GitHubPullRequest;
  marker: TrustedSyncMarker;
  expectedBaseSha: string;
  client: TrustedSyncValidationClient;
  readParentLine?: SyncParentLineReader;
}

export function createTrustedSyncValidationClient(
  client: Pick<GitHubClient, "request">,
): TrustedSyncValidationClient {
  return {
    getPull: (repository, pullNumber) =>
      client.request<CurrentGitHubPullRequest>(`/repos/${repository}/pulls/${pullNumber}`),
    async getBranchSha(repository, branch) {
      const response = await client.request<{ commit: { sha: string } }>(
        `/repos/${repository}/branches/${encodeURIComponent(branch)}`,
      );
      return response.commit.sha;
    },
  };
}

export function createGitHubSyncPullDiffFetcher(
  token: string,
  fetchImplementation: typeof fetch = fetch,
): SyncPullDiffFetcher {
  return async (repository, pullNumber) => {
    const response = await fetchImplementation(
      `https://api.github.com/repos/${repository}/pulls/${pullNumber}`,
      {
        headers: {
          accept: "application/vnd.github.diff",
          authorization: `Bearer ${token}`,
          "x-github-api-version": "2022-11-28",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`source PR #${pullNumber} diff 조회 실패: ${response.status}`);
    }
    return response.text();
  };
}

function sameSyncMarker(left: TrustedSyncMarker, right: TrustedSyncMarker): boolean {
  return (
    left.schemaVersion === right.schemaVersion &&
    left.type === right.type &&
    left.lane === right.lane &&
    left.targetLane === right.targetLane &&
    left.sourceRepository === right.sourceRepository &&
    left.sourcePr === right.sourcePr &&
    left.patchSha256 === right.patchSha256 &&
    left.expectedHeadSha === right.expectedHeadSha &&
    left.targetBump === right.targetBump &&
    left.controlSha === right.controlSha &&
    left.controlTreeSha256 === right.controlTreeSha256
  );
}

function assertPullStillCarriesMarker(
  pull: GitHubPullRequest,
  repository: string,
  marker: TrustedSyncMarker,
): void {
  const currentMarker = trustedSyncMarkerForPull(pull, repository);
  if (!currentMarker || !sameSyncMarker(currentMarker, marker)) {
    throw new Error("current sync PR identity/marker가 최초 trusted validation과 다릅니다.");
  }
}

function assertSourcePullAllowed(
  sourcePull: CurrentGitHubPullRequest,
  input: TrustedSyncValidationInput,
): void {
  const { repository, marker, config } = input;
  const activation = config.sync.activation;
  const mergedAt = sourcePull.merged_at ? Date.parse(sourcePull.merged_at) : Number.NaN;
  const activationAt = activation ? Date.parse(activation) : Number.NaN;
  const allowedSources = config.lanes[marker.lane].sources as readonly string[];

  if (
    sourcePull.number !== marker.sourcePr ||
    sourcePull.state !== "closed" ||
    !sourcePull.merged_at ||
    !Number.isFinite(mergedAt) ||
    !activation ||
    !Number.isFinite(activationAt) ||
    mergedAt < activationAt ||
    !sourcePull.merge_commit_sha ||
    !/^[0-9a-f]{40}$/.test(sourcePull.merge_commit_sha) ||
    sourcePull.base.repo.full_name !== repository ||
    !allowedSources.includes(sourcePull.base.ref) ||
    generatedMarkerForPull(sourcePull, repository)
  ) {
    throw new Error("marker가 가리키는 source가 activation 이후 승인된 일반 merge PR이 아닙니다.");
  }
}

export async function verifyTrustedGeneratedSync(
  input: TrustedSyncValidationInput,
): Promise<TrustedSyncValidationResult> {
  const repositoryPath = input.repositoryPath ?? process.cwd();
  const verifyTree = input.verifyTree ?? verifyGeneratedSyncTree;
  const { repository, pull, marker, config, client } = input;

  assertPullStillCarriesMarker(pull, repository, marker);
  if (
    config.repository !== repository ||
    marker.sourceRepository !== repository ||
    marker.targetLane !== marker.lane ||
    pull.base.ref !== marker.lane ||
    pull.base.repo.full_name !== repository ||
    pull.head.repo?.full_name !== repository
  ) {
    throw new Error("sync PR의 repository/target lane identity가 trusted config와 다릅니다.");
  }

  const sourcePull = await client.getPull(repository, marker.sourcePr);
  assertSourcePullAllowed(sourcePull, input);
  const sourceDiff = await input.fetchPullDiff(repository, marker.sourcePr);
  if (sha256(sourceDiff) !== marker.patchSha256) {
    throw new Error("현재 source PR diff가 생성 시 기록한 exact hash와 다릅니다.");
  }

  const targetBaseSha = await client.getBranchSha(repository, marker.lane);
  if (targetBaseSha !== pull.base.sha) {
    throw new Error("현재 target branch SHA가 sync PR이 고정한 base SHA와 다릅니다.");
  }

  const tree = await verifyTree(
    repositoryPath,
    pull.head.sha,
    targetBaseSha,
    sourceDiff,
    marker.targetBump,
    marker.controlSha,
    marker.controlTreeSha256,
  );
  if (!tree.matches) {
    throw new Error(`${tree.reason} trusted sync tree 검증에 실패했습니다.`);
  }
  return { sourcePull, sourceDiff, targetBaseSha };
}

async function git(repositoryPath: string, arguments_: string[]): Promise<string> {
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
  if (code !== 0) throw new Error(`git ${arguments_.join(" ")} 실패:\n${stderr}`);
  return stdout.trim();
}

export async function readSyncParentLine(repositoryPath: string, headSha: string): Promise<string> {
  await git(repositoryPath, ["fetch", "--no-tags", "origin", headSha]);
  return git(repositoryPath, ["rev-list", "--parents", "-n", "1", headSha]);
}

export async function verifySyncMergePreconditions(
  input: SyncMergePreconditionInput,
): Promise<CurrentGitHubPullRequest> {
  const repositoryPath = input.repositoryPath ?? process.cwd();
  const readParentLine = input.readParentLine ?? readSyncParentLine;
  const [currentPull, currentTargetBaseSha] = await Promise.all([
    input.client.getPull(input.repository, input.pull.number),
    input.client.getBranchSha(input.repository, input.marker.lane),
  ]);

  assertPullStillCarriesMarker(currentPull, input.repository, input.marker);
  if (
    currentPull.number !== input.pull.number ||
    currentPull.state !== "open" ||
    currentPull.draft ||
    currentPull.head.sha !== input.pull.head.sha ||
    currentPull.head.ref !== input.pull.head.ref ||
    currentPull.base.ref !== input.pull.base.ref ||
    currentPull.base.repo.full_name !== input.repository ||
    currentPull.head.repo?.full_name !== input.repository ||
    currentPull.base.sha !== input.expectedBaseSha ||
    input.pull.base.sha !== input.expectedBaseSha ||
    currentTargetBaseSha !== input.expectedBaseSha
  ) {
    throw new Error("merge 직전 sync PR head/base 또는 current target branch가 변경됐습니다.");
  }

  const parentLine = await readParentLine(repositoryPath, currentPull.head.sha);
  if (!isDirectSyncHead(parentLine, currentPull.head.sha, input.expectedBaseSha)) {
    throw new Error("merge 직전 sync head가 exact target base의 direct single-parent가 아닙니다.");
  }
  return currentPull;
}
