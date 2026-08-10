import { validateGeneratedPr } from "../core/marker";
import type { ReleaseMarker } from "../core/types";

export const releaseAutomationLogin = "github-actions[bot]";
export const releaseValidationWorkflowName = "Release lane PR validation";

export interface PullCommitIdentity {
  author: { login: string } | null;
  commit?: { author?: { email: string | null } };
}

export interface SyncAlertComment {
  body: string | null;
  user: { login: string };
}

export interface ValidationWorkflowRun {
  id: number;
  name: string;
  event: string;
  status: string;
  conclusion: string | null;
  head_sha: string;
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface SyncPullIdentity {
  body: string | null;
  user: { login: string };
  base: { ref: string; repo: { full_name: string } };
  head: { ref: string; sha: string; repo: { full_name: string } | null };
}

export interface SyncPullCandidate extends SyncPullIdentity {
  number: number;
  state: string;
  draft: boolean;
  merged_at: string | null;
}

export interface SyncReceiptComment {
  body: string | null;
  user: { login: string };
}

export interface SyncSkipCommand {
  target: "minor" | "major";
  reason: string;
  evidence: string;
}

export type SyncAlertKind =
  | "draft-conflict"
  | "validation-missing"
  | "validation-stalled"
  | "merge-stalled"
  | `validation-${string}`;

export interface SyncAlertPlan {
  kind: SyncAlertKind;
  detail: string;
  runUrl?: string;
}

const terminalBlockerConclusions = new Set([
  "action_required",
  "cancelled",
  "failed",
  "failure",
  "neutral",
  "skipped",
  "stale",
  "startup_failure",
  "timed_out",
]);

function timestamp(value: string): number {
  const result = Date.parse(value);
  return Number.isFinite(result) ? result : 0;
}

function isOlderThan(value: string, threshold: number): boolean {
  return timestamp(value) <= threshold;
}

export function latestValidationRun(
  runs: ValidationWorkflowRun[],
  headSha: string,
  event?: "pull_request" | "workflow_dispatch",
): ValidationWorkflowRun | null {
  return (
    runs
      .filter(
        (run) =>
          run.name === releaseValidationWorkflowName &&
          run.head_sha === headSha &&
          (!event || run.event === event),
      )
      .sort((left, right) => {
        const byUpdatedAt = timestamp(right.updated_at) - timestamp(left.updated_at);
        return byUpdatedAt === 0 ? right.id - left.id : byUpdatedAt;
      })[0] ?? null
  );
}

export function shouldDispatchSyncValidation(
  run: ValidationWorkflowRun | null,
  successStaleBefore?: number,
): boolean {
  if (run === null) return true;
  if (run.status !== "completed") return false;
  if (run.conclusion !== "success") return true;
  return successStaleBefore !== undefined && isOlderThan(run.updated_at, successStaleBefore);
}

export function planSyncAlert(input: {
  draft: boolean;
  pullCreatedAt: string;
  threshold: number;
  validationRun: ValidationWorkflowRun | null;
}): SyncAlertPlan | null {
  if (input.draft) {
    return isOlderThan(input.pullCreatedAt, input.threshold)
      ? {
          kind: "draft-conflict",
          detail: "자동 적용 충돌이 장시간 해결되지 않았습니다.",
        }
      : null;
  }

  const run = input.validationRun;
  if (!run) {
    return isOlderThan(input.pullCreatedAt, input.threshold)
      ? {
          kind: "validation-missing",
          detail: "PR head에 연결된 검증 workflow run이 없습니다.",
        }
      : null;
  }

  if (run.status === "completed") {
    if (run.conclusion === "success") {
      return isOlderThan(run.updated_at, input.threshold)
        ? {
            kind: "merge-stalled",
            detail: "검증은 성공했지만 자동 merge가 완료되지 않았습니다.",
            runUrl: run.html_url,
          }
        : null;
    }

    const conclusion = run.conclusion ?? "unknown";
    if (terminalBlockerConclusions.has(conclusion) || conclusion !== "success") {
      return {
        kind: `validation-${conclusion}`,
        detail: `검증 workflow가 '${conclusion}' 결론으로 종료됐습니다.`,
        runUrl: run.html_url,
      };
    }
  }

  return isOlderThan(run.updated_at, input.threshold)
    ? {
        kind: "validation-stalled",
        detail: `검증 workflow가 '${run.status}' 상태에서 장시간 진행되지 않았습니다.`,
        runUrl: run.html_url,
      }
    : null;
}

export function hasOnlyAutomationCommits(commits: PullCommitIdentity[]): boolean {
  return (
    commits.length > 0 && commits.every((commit) => commit.author?.login === releaseAutomationLogin)
  );
}

export function parseSyncSkipCommand(body: string): SyncSkipCommand | null {
  const firstLine = body.split(/\r?\n/, 1)[0] ?? "";
  const match = firstLine.match(
    /^\/release-sync skip target=(minor|major) reason=([a-z0-9][a-z0-9._-]{0,63}) evidence=(#(?:[1-9][0-9]*)|[0-9a-f]{7,40})$/,
  );
  return match?.[1] && match[2] && match[3]
    ? {
        target: match[1] as SyncSkipCommand["target"],
        reason: match[2],
        evidence: match[3],
      }
    : null;
}

export function hasTrustedSyncAlertComment(
  comments: SyncAlertComment[],
  markers: string[],
): boolean {
  return comments.some(
    (comment) =>
      comment.user.login === releaseAutomationLogin &&
      markers.some((marker) => comment.body?.includes(marker)),
  );
}

export function isWorkflowRunBoundToPull(workflowHeadSha: string, pullHeadSha: string): boolean {
  return workflowHeadSha.length > 0 && workflowHeadSha === pullHeadSha;
}

export function isDirectSyncHead(
  parentLine: string,
  expectedHeadSha: string,
  expectedBaseSha: string,
): boolean {
  const commits = parentLine.trim().split(/\s+/).filter(Boolean);
  return commits.length === 2 && commits[0] === expectedHeadSha && commits[1] === expectedBaseSha;
}

export function isCompleteSyncMarker(
  marker: ReleaseMarker,
  repository: string,
): marker is ReleaseMarker & {
  sourceRepository: string;
  sourcePr: number;
  patchSha256: string;
  expectedHeadSha: string;
  targetBump: "patch" | "minor" | "major";
  controlSha: string;
  controlTreeSha256: string;
} {
  const expectedBump = { dev: "patch", minor: "minor", major: "major" }[marker.lane];
  return (
    marker.type === "sync" &&
    marker.sourceRepository === repository &&
    Number.isSafeInteger(marker.sourcePr) &&
    Number(marker.sourcePr) > 0 &&
    typeof marker.patchSha256 === "string" &&
    /^[0-9a-f]{64}$/.test(marker.patchSha256) &&
    typeof marker.expectedHeadSha === "string" &&
    /^[0-9a-f]{40,64}$/.test(marker.expectedHeadSha) &&
    marker.targetBump === expectedBump &&
    isControlShaMarker(marker) &&
    typeof marker.controlTreeSha256 === "string" &&
    /^[0-9a-f]{64}$/.test(marker.controlTreeSha256)
  );
}

export function isControlShaMarker(
  marker: ReleaseMarker,
): marker is ReleaseMarker & { controlSha: string } {
  return typeof marker.controlSha === "string" && /^[0-9a-f]{40,64}$/.test(marker.controlSha);
}

export function hasCurrentSyncControlPlane(
  marker: ReleaseMarker,
  currentControlTreeSha256: string,
): boolean {
  return (
    marker.type === "sync" &&
    typeof marker.controlTreeSha256 === "string" &&
    marker.controlTreeSha256 === currentControlTreeSha256
  );
}

function hasExpectedSyncHeadRef(pull: SyncPullIdentity, marker: ReleaseMarker): boolean {
  if (!Number.isSafeInteger(marker.sourcePr) || Number(marker.sourcePr) <= 0) return false;
  return (["dev", "minor", "major"] as const).some((sourceLane) => {
    const base = `release-sync/${sourceLane}-${marker.sourcePr}-to-${marker.lane}`;
    if (pull.head.ref === base) return true;
    if (!pull.head.ref.startsWith(`${base}-attempt-`)) return false;
    return /^(?:[2-9]|[1-9][0-9]+)$/.test(pull.head.ref.slice(`${base}-attempt-`.length));
  });
}

export function generatedSyncMarkerForPull(
  pull: SyncPullIdentity,
  repository: string,
): (ReleaseMarker & { sourceRepository: string; sourcePr: number }) | null {
  const marker = generatedMarkerForPull(pull, repository);
  return marker?.type === "sync" &&
    marker.sourceRepository === repository &&
    Number.isSafeInteger(marker.sourcePr) &&
    Number(marker.sourcePr) > 0 &&
    hasExpectedSyncHeadRef(pull, marker)
    ? (marker as ReleaseMarker & { sourceRepository: string; sourcePr: number })
    : null;
}

export function generatedMarkerForPull(
  pull: SyncPullIdentity,
  repository: string,
): ReleaseMarker | null {
  if (pull.base.repo.full_name !== repository || pull.head.repo?.full_name !== repository) {
    return null;
  }
  return validateGeneratedPr({
    author: pull.user.login,
    body: pull.body ?? "",
    baseRef: pull.base.ref,
    headRef: pull.head.ref,
    baseRepository: pull.base.repo.full_name,
    headRepository: pull.head.repo?.full_name ?? "",
  });
}

export function trustedSyncMarkerForPull(
  pull: SyncPullIdentity,
  repository: string,
):
  | (ReleaseMarker & {
      sourceRepository: string;
      sourcePr: number;
      patchSha256: string;
      expectedHeadSha: string;
      targetBump: "patch" | "minor" | "major";
      controlSha: string;
      controlTreeSha256: string;
    })
  | null {
  const marker = generatedSyncMarkerForPull(pull, repository);
  return marker &&
    isCompleteSyncMarker(marker, repository) &&
    marker.expectedHeadSha === pull.head.sha
    ? marker
    : null;
}

export function selectTrustedSyncPullForHead<T extends SyncPullCandidate>(
  pulls: T[],
  repository: string,
  headSha: string,
  headRef?: string,
): T | null {
  const selected = selectTrustedGeneratedPullForHead(pulls, repository, headSha, headRef);
  return selected && trustedSyncMarkerForPull(selected.pull, repository) ? selected.pull : null;
}

export function selectTrustedGeneratedPullForHead<T extends SyncPullCandidate>(
  pulls: T[],
  repository: string,
  headSha: string,
  headRef?: string,
  options: { allowDraftCodePromotion?: boolean } = {},
): { pull: T; marker: ReleaseMarker & { expectedHeadSha: string } } | null {
  const candidates = pulls.flatMap((pull) => {
    const marker = validateGeneratedPr({
      author: pull.user.login,
      body: pull.body ?? "",
      baseRef: pull.base.ref,
      headRef: pull.head.ref,
      baseRepository: pull.base.repo.full_name,
      headRepository: pull.head.repo?.full_name ?? "",
    });
    const allowedDraft =
      options.allowDraftCodePromotion === true && marker?.type === "code-promotion";
    return pull.state === "open" &&
      (!pull.draft || allowedDraft) &&
      pull.head.sha === headSha &&
      pull.base.repo.full_name === repository &&
      pull.head.repo?.full_name === repository &&
      marker &&
      marker.expectedHeadSha === headSha &&
      (!headRef || pull.head.ref === headRef)
      ? [{ pull, marker: marker as ReleaseMarker & { expectedHeadSha: string } }]
      : [];
  });
  return candidates.length === 1 ? candidates[0] : null;
}

export function hasTrustedSyncReceipt(comments: SyncReceiptComment[], key: string): boolean {
  const accepted = new Set(
    ["merged", "no-op", "skipped"].map((outcome) => `<!-- seed-release-sync:${key}:${outcome} -->`),
  );
  return comments.some(
    (comment) =>
      comment.user.login === releaseAutomationLogin &&
      accepted.has(comment.body?.split("\n", 1)[0] ?? ""),
  );
}

export function nextSyncAttemptBranch(baseBranch: string, usedBranches: string[]): string {
  const used = new Set(usedBranches);
  if (!used.has(baseBranch)) return baseBranch;
  for (let attempt = 2; ; attempt += 1) {
    const candidate = `${baseBranch}-attempt-${attempt}`;
    if (!used.has(candidate)) return candidate;
  }
}
