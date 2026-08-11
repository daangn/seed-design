import { releaseAutomationLogin, type ValidationWorkflowRun } from "../sync/sync-policy";

export const releaseValidationStatusContext = "Validate release lane";
export const codePromotionPreflightStatusContext = "Validate code promotion preflight";
export const releaseValidationRunPrefix = "seed-release-validation:";
export const releaseValidationWorkflowPath = ".github/workflows/release-pr-validation.yml";
export type ReleaseValidationEvent = "pull_request_target" | "workflow_dispatch";

const gitShaPattern = /^[0-9a-f]{40}$/;

export interface ReleaseValidationStatus {
  id: number;
  state: "error" | "failure" | "pending" | "success";
  context: string;
  description: string | null;
  target_url: string | null;
  updated_at: string;
  creator: { login: string } | null;
}

export interface ReleaseValidationWorkflowRun {
  id: number;
  name: string;
  path: string;
  display_title: string;
  event: string;
  status: string;
  conclusion: string | null;
  head_branch: string | null;
  head_sha: string;
  repository: { full_name: string };
}

export function releaseValidationRunName(
  headSha: string,
  context = releaseValidationStatusContext,
): string {
  const name = expectedValidationRunName(headSha, context);
  if (!name) throw new Error(`알 수 없는 validation context입니다: ${context}`);
  return name;
}

function validationKind(context: string): "lane" | "code-promotion-preflight" | null {
  if (context === releaseValidationStatusContext) return "lane";
  if (context === codePromotionPreflightStatusContext) return "code-promotion-preflight";
  return null;
}

function expectedValidationRunName(headSha: string, context: string): string | null {
  const kind = validationKind(context);
  return kind ? `${releaseValidationRunPrefix}${kind}:${headSha}` : null;
}

export function releaseValidationStatusDescription(
  event: ReleaseValidationEvent,
  headSha: string,
  context = releaseValidationStatusContext,
): string {
  const kind = validationKind(context);
  if (!kind) throw new Error(`알 수 없는 validation context입니다: ${context}`);
  return `${releaseValidationRunPrefix}${kind}:${event}:${headSha}`;
}

export function validationHeadShaFromRun(
  run: ReleaseValidationWorkflowRun,
  context = releaseValidationStatusContext,
): string | null {
  const kind = validationKind(context);
  if (!kind) return null;
  const prefix = `${releaseValidationRunPrefix}${kind}:`;
  if (!run.display_title.startsWith(prefix)) return null;
  const headSha = run.display_title.slice(prefix.length);
  return gitShaPattern.test(headSha) && run.display_title === `${prefix}${headSha}`
    ? headSha
    : null;
}

export function validationRunUrl(repository: string, runId: number): string {
  return `https://github.com/${repository}/actions/runs/${runId}`;
}

export function isTrustedValidationWorkflowRun(
  run: ReleaseValidationWorkflowRun,
  repository: string,
  headSha: string,
  context = releaseValidationStatusContext,
): boolean {
  return (
    isValidationWorkflowRunIdentity(run, repository, headSha, context) &&
    run.status === "completed" &&
    run.conclusion === "success"
  );
}

function isValidationWorkflowRunIdentity(
  run: ReleaseValidationWorkflowRun,
  repository: string,
  headSha: string,
  context: string,
): boolean {
  const expectedName = expectedValidationRunName(headSha, context);
  return (
    expectedName !== null &&
    run.name === expectedName &&
    run.path === releaseValidationWorkflowPath &&
    run.repository.full_name === repository &&
    run.event === "workflow_dispatch" &&
    run.head_branch === "dev" &&
    validationHeadShaFromRun(run, context) === headSha
  );
}

export function isValidationStatusForHead(
  status: ReleaseValidationStatus,
  repository: string,
  headSha: string,
  event: ReleaseValidationEvent,
  context = releaseValidationStatusContext,
): boolean {
  return (
    gitShaPattern.test(headSha) &&
    status.creator?.login === releaseAutomationLogin &&
    status.context === context &&
    status.description === releaseValidationStatusDescription(event, headSha, context) &&
    typeof status.target_url === "string" &&
    new RegExp(
      `^https://github\\.com/${repository.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/actions/runs/[1-9][0-9]*$`,
    ).test(status.target_url)
  );
}

export function validationRunIdFromStatus(
  status: ReleaseValidationStatus,
  repository: string,
): number | null {
  const prefix = `https://github.com/${repository}/actions/runs/`;
  if (!status.target_url?.startsWith(prefix)) return null;
  const value = status.target_url.slice(prefix.length);
  if (!/^[1-9][0-9]*$/.test(value)) return null;
  const runId = Number(value);
  return Number.isSafeInteger(runId) ? runId : null;
}

export function latestValidationStatus(
  statuses: ReleaseValidationStatus[],
  repository: string,
  headSha: string,
  event: ReleaseValidationEvent,
  context = releaseValidationStatusContext,
): ReleaseValidationStatus | null {
  return (
    statuses
      .filter((status) => isValidationStatusForHead(status, repository, headSha, event, context))
      .sort((left, right) => {
        const byUpdatedAt = Date.parse(right.updated_at) - Date.parse(left.updated_at);
        return byUpdatedAt === 0 ? right.id - left.id : byUpdatedAt;
      })[0] ?? null
  );
}

export function validationStatusAsWorkflowRun(
  status: ReleaseValidationStatus,
  headSha: string,
): ValidationWorkflowRun {
  const completed = status.state !== "pending";
  return {
    id: status.id,
    name: releaseValidationRunName(headSha),
    event: "workflow_dispatch",
    status: completed ? "completed" : "in_progress",
    conclusion: completed ? (status.state === "success" ? "success" : status.state) : null,
    head_sha: headSha,
    created_at: status.updated_at,
    updated_at: status.updated_at,
    html_url: status.target_url ?? "",
  };
}

export function isValidationStatusBoundToRun(
  status: ReleaseValidationStatus,
  run: ReleaseValidationWorkflowRun,
  repository: string,
  headSha: string,
  context = releaseValidationStatusContext,
): boolean {
  return (
    status.state === "success" &&
    isValidationStatusForHead(status, repository, headSha, "workflow_dispatch", context) &&
    validationRunIdFromStatus(status, repository) === run.id &&
    isTrustedValidationWorkflowRun(run, repository, headSha, context)
  );
}

export function isValidationStatusConsistentWithRun(
  status: ReleaseValidationStatus,
  run: ReleaseValidationWorkflowRun,
  repository: string,
  headSha: string,
  context = releaseValidationStatusContext,
): boolean {
  if (
    !isValidationStatusForHead(status, repository, headSha, "workflow_dispatch", context) ||
    validationRunIdFromStatus(status, repository) !== run.id ||
    !isValidationWorkflowRunIdentity(run, repository, headSha, context)
  ) {
    return false;
  }
  if (status.state === "pending") return run.status !== "completed";
  if (status.state === "success") {
    return run.status === "completed" && run.conclusion === "success";
  }
  return run.status === "completed" && run.conclusion !== "success";
}
