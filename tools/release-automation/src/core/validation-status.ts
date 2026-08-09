import {
  releaseAutomationLogin,
  releaseValidationWorkflowName,
  type ValidationWorkflowRun,
} from "../sync/sync-policy";

export { releaseValidationWorkflowName };

export const releaseValidationStatusContext = "Validate release lane";
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

export function releaseValidationRunName(headSha: string): string {
  return `${releaseValidationRunPrefix}${headSha}`;
}

export function releaseValidationStatusDescription(
  event: ReleaseValidationEvent,
  headSha: string,
): string {
  return `${releaseValidationRunPrefix}${event}:${headSha}`;
}

export function validationHeadShaFromRun(run: ReleaseValidationWorkflowRun): string | null {
  if (!run.display_title.startsWith(releaseValidationRunPrefix)) return null;
  const headSha = run.display_title.slice(releaseValidationRunPrefix.length);
  return gitShaPattern.test(headSha) && releaseValidationRunName(headSha) === run.display_title
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
): boolean {
  return (
    run.name === releaseValidationWorkflowName &&
    run.path === releaseValidationWorkflowPath &&
    run.repository.full_name === repository &&
    run.event === "workflow_dispatch" &&
    run.status === "completed" &&
    run.conclusion === "success" &&
    run.head_branch === "dev" &&
    validationHeadShaFromRun(run) === headSha
  );
}

export function isValidationStatusForHead(
  status: ReleaseValidationStatus,
  repository: string,
  headSha: string,
  event: ReleaseValidationEvent,
): boolean {
  return (
    gitShaPattern.test(headSha) &&
    status.creator?.login === releaseAutomationLogin &&
    status.context === releaseValidationStatusContext &&
    status.description === releaseValidationStatusDescription(event, headSha) &&
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
): ReleaseValidationStatus | null {
  return (
    statuses
      .filter((status) => isValidationStatusForHead(status, repository, headSha, event))
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
    name: releaseValidationWorkflowName,
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
): boolean {
  return (
    status.state === "success" &&
    isValidationStatusForHead(status, repository, headSha, "workflow_dispatch") &&
    validationRunIdFromStatus(status, repository) === run.id &&
    isTrustedValidationWorkflowRun(run, repository, headSha)
  );
}

export function isValidationStatusConsistentWithRun(
  status: ReleaseValidationStatus,
  run: ReleaseValidationWorkflowRun,
  repository: string,
  headSha: string,
): boolean {
  if (
    !isValidationStatusForHead(status, repository, headSha, "workflow_dispatch") ||
    validationRunIdFromStatus(status, repository) !== run.id ||
    run.name !== releaseValidationWorkflowName ||
    run.path !== releaseValidationWorkflowPath ||
    run.repository.full_name !== repository ||
    run.event !== "workflow_dispatch" ||
    run.head_branch !== "dev" ||
    validationHeadShaFromRun(run) !== headSha
  ) {
    return false;
  }
  if (status.state === "pending") return run.status !== "completed";
  if (status.state === "success") {
    return run.status === "completed" && run.conclusion === "success";
  }
  return run.status === "completed" && run.conclusion !== "success";
}
