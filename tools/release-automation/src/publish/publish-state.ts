import { parseMarker } from "../core/marker";
import { parseSemver } from "./publish";
import type { PullRequestIdentity, ReleaseMarker } from "../core/types";

const gitShaPattern = /^[0-9a-f]{40}$/;
const packageNamePattern = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/;
const distTagPattern = /^[a-z][a-z0-9-]{0,31}$/;
const npmIntegrityPattern = /^sha512-[A-Za-z0-9+/]{86}==$/;
const publishRecordPattern = /^<!-- seed-release-publish:([0-9a-f]{40}):(dry-run|production) -->$/;

export type PublishMode = "dry-run" | "production";

export interface PublishRecord {
  mergeSha: string;
  mode: PublishMode;
}

export interface PublishComment {
  body: string | null;
  user: { login: string } | null;
}

export interface PublishCommitStatus {
  id: number;
  context: string;
  state: string;
  description: string | null;
  target_url: string | null;
  creator: { login: string } | null;
}

export interface PublishWorkflowRun {
  id: number;
  name: string;
  path: string;
  event: string;
  status: string;
  conclusion: string | null;
  head_branch: string | null;
  repository: { full_name: string };
}

export interface PublishWorkflowJob {
  id: number;
  run_id: number;
  name: string;
  status: string;
  conclusion: string | null;
}

export interface PublishPackage {
  name: string;
  version: string;
  integrity?: string;
}

export interface RegistryPackageDocument {
  versions?: Record<string, { gitHead?: unknown; dist?: { integrity?: unknown } }>;
  "dist-tags"?: Record<string, unknown>;
}

export interface RegistryGitHeadInspection {
  missing: PublishPackage[];
  distTagMismatches: Array<{
    package: PublishPackage;
    tag: string;
    actualVersion: unknown;
  }>;
  integrityMismatches: Array<{
    package: PublishPackage & { integrity: string };
    actualIntegrity: unknown;
  }>;
}

export type TagReconciliation = "already-pushed" | "push-local" | "create-and-push";

const legacyPublishRecoveries = new Map<number, { headSha: string; mergeSha: string }>([
  [
    1943,
    {
      headSha: "afa180444a6e70f5b6a60878318f2eae5d6f672d",
      mergeSha: "6c32fa75002bb093e555dd3f769950548bf275e6",
    },
  ],
  [
    1950,
    {
      headSha: "94d72dc51167bf5d65b5d06a38ce5f6f7b71f2f4",
      mergeSha: "4ea0b7e286ae784a3ec7c21731e78dbe88309b5f",
    },
  ],
  [
    1955,
    {
      headSha: "b3d26c2357b945fc9ecff477fc193451f2391687",
      mergeSha: "b1c26fe31295a5b51ec58f6126d91cf7dc1337d8",
    },
  ],
]);

export interface PublishReceiptClient {
  request<T>(path: string): Promise<T>;
  paginate<T>(path: string): Promise<T[]>;
}

function explicitVersionMarker(identity: PullRequestIdentity): ReleaseMarker | null {
  if (identity.author !== "github-actions[bot]") return null;
  if (!identity.baseRepository || identity.headRepository !== identity.baseRepository) return null;
  const marker = parseMarker(identity.body);
  if (!marker || marker.type !== "version" || marker.lane !== identity.baseRef) return null;
  if (identity.headRef !== `changeset-release/${marker.lane}`) return null;
  return marker;
}

export function trustedVersionMarker(
  identity: PullRequestIdentity,
  headSha: string,
): ReleaseMarker | null {
  const marker = explicitVersionMarker(identity);
  if (
    !marker ||
    !gitShaPattern.test(headSha) ||
    marker.expectedHeadSha !== headSha ||
    typeof marker.controlSha !== "string" ||
    !gitShaPattern.test(marker.controlSha)
  ) {
    return null;
  }
  return marker;
}

export function trustedPublishVersionMarker(
  identity: PullRequestIdentity,
  headSha: string,
  pullNumber: number,
  mergeSha: string,
): ReleaseMarker | null {
  const strict = trustedVersionMarker(identity, headSha);
  if (strict) return strict;

  return isTrustedLegacyPublishRecovery(identity, headSha, pullNumber, mergeSha)
    ? explicitVersionMarker(identity)
    : null;
}

export function isTrustedLegacyPublishRecovery(
  identity: PullRequestIdentity,
  headSha: string,
  pullNumber: number,
  mergeSha: string,
): boolean {
  const marker = explicitVersionMarker(identity);
  const recovery = legacyPublishRecoveries.get(pullNumber);
  return Boolean(
    marker &&
      recovery &&
      recovery.headSha === headSha &&
      recovery.mergeSha === mergeSha &&
      marker.expectedHeadSha === undefined &&
      marker.controlSha === undefined,
  );
}

function isPackageManifestPath(path: string): boolean {
  if (path !== "package.json" && !path.endsWith("/package.json")) return false;
  if (path.startsWith("/") || path.includes("\\") || /[\0\r\n]/.test(path)) return false;
  return path.split("/").every((part) => part !== "" && part !== "." && part !== "..");
}

export function authorizedPackageManifestPaths(files: Array<{ filename: string }>): string[] {
  const paths = files.map((file) => file.filename).filter(isPackageManifestPath);
  return [...new Set(paths)].sort();
}

export function assertCompletePullFileList(changedFiles: number, receivedFiles: number): void {
  if (!Number.isSafeInteger(changedFiles) || changedFiles < 0) {
    throw new Error("PR changed_files count가 올바르지 않습니다.");
  }
  if (!Number.isSafeInteger(receivedFiles) || receivedFiles < 0) {
    throw new Error("PR files 응답 count가 올바르지 않습니다.");
  }
  if (changedFiles >= 3_000) {
    throw new Error("PR file 목록이 GitHub API 검증 한도에 도달했습니다.");
  }
  if (receivedFiles !== changedFiles) {
    throw new Error(
      `PR file 목록이 완전하지 않습니다: changed_files=${changedFiles}, received=${receivedFiles}`,
    );
  }
}

export function parseAuthorizedPackageManifestPaths(value: string): string[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || !parsed.every((path) => typeof path === "string")) {
    throw new Error("승인된 Version PR package manifest 목록이 문자열 배열이 아닙니다.");
  }
  if (parsed.length === 0 || parsed.some((path) => !isPackageManifestPath(path))) {
    throw new Error("승인된 Version PR package manifest 목록이 비어 있거나 올바르지 않습니다.");
  }
  if (new Set(parsed).size !== parsed.length) {
    throw new Error("승인된 Version PR package manifest 목록에 중복 경로가 있습니다.");
  }
  return [...parsed].sort();
}

export function parsePublishRecord(body: string, repository: string): PublishRecord | null {
  const lines = body.split("\n");
  if (lines.length !== 4 || lines[2] !== "") return null;

  const marker = lines[0]?.match(publishRecordPattern);
  if (!marker?.[1] || !marker[2]) return null;
  const mode = marker[2] as PublishMode;
  if (lines[1] !== `게시 queue가 이 Version Packages PR을 \`${mode}\`로 처리했습니다.`) {
    return null;
  }

  const runValue = lines[3]?.slice("Run: ".length);
  if (!lines[3]?.startsWith("Run: ") || !runValue) return null;
  try {
    const runUrl = new URL(runValue);
    const escapedRepository = repository.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (
      runUrl.protocol !== "https:" ||
      runUrl.username !== "" ||
      runUrl.password !== "" ||
      runUrl.search !== "" ||
      runUrl.hash !== "" ||
      runUrl.origin !== "https://github.com" ||
      !new RegExp(`^/${escapedRepository}/actions/runs/[1-9]\\d*$`).test(runUrl.pathname)
    ) {
      return null;
    }
  } catch {
    return null;
  }

  return { mergeSha: marker[1], mode };
}

export function isTrustedPublishComment(
  comment: PublishComment,
  repository: string,
  mergeSha: string,
): boolean {
  if (comment.user?.login !== "github-actions[bot]") return false;
  if (!comment.body) return false;
  return parsePublishRecord(comment.body, repository)?.mergeSha === mergeSha;
}

export function isTrustedPublishStatus(status: PublishCommitStatus, mergeSha: string): boolean {
  if (status.creator?.login !== "github-actions[bot]") return false;
  if (status.context !== "seed-release/publish" || status.state !== "success") return false;
  return (
    status.description === `seed-release-publish:${mergeSha}:dry-run` ||
    status.description === `seed-release-publish:${mergeSha}:production`
  );
}

export function publishRunIdFromStatus(
  status: PublishCommitStatus,
  repository: string,
): number | null {
  const prefix = `https://github.com/${repository}/actions/runs/`;
  if (!status.target_url?.startsWith(prefix)) return null;
  const value = status.target_url.slice(prefix.length);
  if (!/^[1-9][0-9]*$/.test(value)) return null;
  const runId = Number(value);
  return Number.isSafeInteger(runId) ? runId : null;
}

export function isPublishStatusBoundToRun(
  status: PublishCommitStatus,
  run: PublishWorkflowRun,
  jobs: PublishWorkflowJob[],
  repository: string,
  mergeSha: string,
): boolean {
  const trustedBranch =
    run.event === "workflow_dispatch" || run.event === "schedule"
      ? run.head_branch === "dev"
      : run.event === "pull_request_target" &&
        (run.head_branch === "dev" || run.head_branch === "minor" || run.head_branch === "major");
  return (
    isTrustedPublishStatus(status, mergeSha) &&
    publishRunIdFromStatus(status, repository) === run.id &&
    run.name === "Release publish" &&
    run.path === ".github/workflows/release-publish.yml" &&
    run.status === "completed" &&
    run.conclusion === "success" &&
    run.repository.full_name === repository &&
    trustedBranch &&
    jobs.some(
      (job) =>
        job.run_id === run.id &&
        job.name === `Record successful queue item ${mergeSha}` &&
        job.status === "completed" &&
        job.conclusion === "success",
    )
  );
}

export async function hasBoundPublishReceipt(
  client: PublishReceiptClient,
  repository: string,
  mergeSha: string,
  requiredMode?: PublishMode,
): Promise<boolean> {
  if (!gitShaPattern.test(mergeSha)) return false;
  const statuses = await client.paginate<PublishCommitStatus>(
    `/repos/${repository}/commits/${mergeSha}/statuses`,
  );
  for (const status of statuses) {
    if (!isTrustedPublishStatus(status, mergeSha)) continue;
    if (
      requiredMode !== undefined &&
      status.description !== `seed-release-publish:${mergeSha}:${requiredMode}`
    ) {
      continue;
    }
    const runId = publishRunIdFromStatus(status, repository);
    if (!runId) continue;
    try {
      const [run, jobs] = await Promise.all([
        client.request<PublishWorkflowRun>(`/repos/${repository}/actions/runs/${runId}`),
        client.paginate<PublishWorkflowJob>(
          `/repos/${repository}/actions/runs/${runId}/jobs?filter=all`,
        ),
      ]);
      if (isPublishStatusBoundToRun(status, run, jobs, repository, mergeSha)) return true;
    } catch {
      // Deleted, stale, or unauthorized targets cannot serve as durable receipts.
    }
  }
  return false;
}

export function parsePublishPackages(value: string): PublishPackage[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error("게시 package 목록은 배열이어야 합니다.");

  const tags = new Set<string>();
  return parsed.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error("게시 package 항목이 객체가 아닙니다.");
    }
    const { name, version, integrity } = item as Record<string, unknown>;
    if (typeof name !== "string" || !packageNamePattern.test(name)) {
      throw new Error(`유효하지 않은 package 이름입니다: ${String(name)}`);
    }
    if (typeof version !== "string") {
      throw new Error(`${name}의 version이 문자열이 아닙니다.`);
    }
    parseSemver(version);

    const tag = packageTag({ name, version });
    if (tags.has(tag)) throw new Error(`중복 package tag입니다: ${tag}`);
    tags.add(tag);
    if (
      integrity !== undefined &&
      (typeof integrity !== "string" || !npmIntegrityPattern.test(integrity))
    ) {
      throw new Error(`${name}의 npm integrity가 올바르지 않습니다.`);
    }
    return { name, version, ...(typeof integrity === "string" ? { integrity } : {}) };
  });
}

export function parsePublishDistTag(value: string): string {
  if (!distTagPattern.test(value)) throw new Error(`유효하지 않은 npm dist-tag입니다: ${value}`);
  return value;
}

export function parseNpmIntegrity(value: string): string {
  if (!npmIntegrityPattern.test(value)) throw new Error("유효하지 않은 npm integrity입니다.");
  return value;
}

export function packageTag(item: PublishPackage): string {
  return `${item.name}@${item.version}`;
}

export async function fetchRegistryDocuments(
  packages: PublishPackage[],
  options: {
    registryUrl?: string;
    fetcher?: typeof fetch;
  } = {},
): Promise<Map<string, RegistryPackageDocument | null>> {
  const registryUrl = (options.registryUrl ?? "https://registry.npmjs.org").replace(/\/$/, "");
  const fetcher = options.fetcher ?? fetch;
  const entries = await Promise.all(
    packages.map(async (item) => {
      const response = await fetcher(`${registryUrl}/${encodeURIComponent(item.name)}`, {
        headers: { accept: "application/json", "cache-control": "no-cache" },
        cache: "no-store",
      });
      if (response.status === 404) return [item.name, null] as const;
      if (!response.ok) {
        throw new Error(`${item.name} registry 조회 실패: ${response.status}`);
      }
      return [item.name, (await response.json()) as RegistryPackageDocument] as const;
    }),
  );
  return new Map(entries);
}

export function inspectRegistryGitHeads(
  packages: PublishPackage[],
  documents: ReadonlyMap<string, RegistryPackageDocument | null>,
  expectedSha: string,
  expectedDistTag?: string,
): RegistryGitHeadInspection {
  if (!gitShaPattern.test(expectedSha)) throw new Error("승인 merge SHA가 올바르지 않습니다.");
  if (expectedDistTag !== undefined) parsePublishDistTag(expectedDistTag);
  const missing: PublishPackage[] = [];
  const distTagMismatches: RegistryGitHeadInspection["distTagMismatches"] = [];
  const integrityMismatches: RegistryGitHeadInspection["integrityMismatches"] = [];
  for (const item of packages) {
    const document = documents.get(item.name);
    const version = document?.versions?.[item.version];
    if (!version) {
      missing.push(item);
      continue;
    }
    if (version.gitHead !== expectedSha) {
      throw new Error(
        `${item.name}@${item.version}의 npm gitHead가 승인 merge SHA와 다릅니다: ${String(
          version.gitHead,
        )}`,
      );
    }
    if (
      expectedDistTag !== undefined &&
      document?.["dist-tags"]?.[expectedDistTag] !== item.version
    ) {
      distTagMismatches.push({
        package: item,
        tag: expectedDistTag,
        actualVersion: document?.["dist-tags"]?.[expectedDistTag],
      });
    }
    if (item.integrity !== undefined && version.dist?.integrity !== item.integrity) {
      integrityMismatches.push({
        package: { ...item, integrity: item.integrity },
        actualIntegrity: version.dist?.integrity,
      });
    }
  }
  return { missing, distTagMismatches, integrityMismatches };
}

export function assertExactRegistryDistTags(
  mismatches: RegistryGitHeadInspection["distTagMismatches"],
): void {
  if (mismatches.length === 0) return;
  throw new Error(
    mismatches
      .map(
        ({ package: item, tag, actualVersion }) =>
          `${item.name}@${item.version}의 npm dist-tag '${tag}'가 exact version을 가리키지 않습니다: ${String(actualVersion)}`,
      )
      .join("\n"),
  );
}

export function assertExactRegistryIntegrities(
  mismatches: RegistryGitHeadInspection["integrityMismatches"],
): void {
  if (mismatches.length === 0) return;
  throw new Error(
    mismatches
      .map(
        ({ package: item, actualIntegrity }) =>
          `${item.name}@${item.version}의 npm integrity가 승인 artifact와 다릅니다: ${String(actualIntegrity)}`,
      )
      .join("\n"),
  );
}

export function commitFromLsRemote(output: string, tag: string): string | null {
  return commitsFromLsRemote(output, [tag]).get(tag) ?? null;
}

export function commitsFromLsRemote(output: string, tags: string[]): Map<string, string | null> {
  const states = new Map(
    tags.map((tag) => [tag, { direct: null as string | null, peeled: null as string | null }]),
  );
  const tagByRef = new Map(tags.map((tag) => [`refs/tags/${tag}`, tag]));
  for (const line of output.trim().split("\n")) {
    if (!line) continue;
    const [sha, name, extra] = line.split("\t");
    if (extra !== undefined || !sha || !name || !gitShaPattern.test(sha)) {
      throw new Error("원격 tag 응답이 올바르지 않습니다.");
    }
    const peeled = name.endsWith("^{}");
    const ref = peeled ? name.slice(0, -3) : name;
    const tag = tagByRef.get(ref);
    const state = tag ? states.get(tag) : null;
    if (!tag || !state) {
      throw new Error(`예상하지 않은 원격 tag ref를 받았습니다: ${name}`);
    }
    if (peeled && state.peeled) throw new Error(`${tag} peeled tag가 중복되었습니다.`);
    if (!peeled && state.direct) throw new Error(`${tag} 원격 tag가 중복되었습니다.`);
    if (peeled) state.peeled = sha;
    else state.direct = sha;
  }

  return new Map(
    [...states].map(([tag, state]) => {
      if (state.peeled && !state.direct) {
        throw new Error(`${tag} peeled tag에 원본 tag가 없습니다.`);
      }
      return [tag, state.peeled ?? state.direct] as const;
    }),
  );
}

export function planTagReconciliation(
  expectedSha: string,
  localCommit: string | null,
  remoteCommit: string | null,
): TagReconciliation {
  if (!gitShaPattern.test(expectedSha)) throw new Error("승인 merge SHA가 올바르지 않습니다.");
  for (const [location, commit] of [
    ["로컬", localCommit],
    ["원격", remoteCommit],
  ] as const) {
    if (commit !== null && !gitShaPattern.test(commit)) {
      throw new Error(`${location} tag commit SHA가 올바르지 않습니다.`);
    }
    if (commit !== null && commit !== expectedSha) {
      throw new Error(`${location} tag가 승인 merge SHA와 다릅니다: ${commit}`);
    }
  }
  if (remoteCommit) return "already-pushed";
  return localCommit ? "push-local" : "create-and-push";
}
