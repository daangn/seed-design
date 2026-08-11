import { describe, expect, test } from "bun:test";
import {
  codePromotionPreflightStatusContext,
  isTrustedValidationWorkflowRun,
  isValidationStatusBoundToRun,
  isValidationStatusConsistentWithRun,
  isValidationStatusForHead,
  latestValidationStatus,
  releaseValidationRunName,
  releaseValidationStatusDescription,
  releaseValidationWorkflowPath,
  validationHeadShaFromRun,
  validationRunIdFromStatus,
  type ReleaseValidationStatus,
  type ReleaseValidationWorkflowRun,
} from "./validation-status";

const repository = "daangn/seed-design";
const headSha = "a".repeat(40);

function workflowRun(
  overrides: Partial<ReleaseValidationWorkflowRun> = {},
): ReleaseValidationWorkflowRun {
  return {
    id: 1234,
    name: releaseValidationRunName(headSha),
    path: releaseValidationWorkflowPath,
    display_title: releaseValidationRunName(headSha),
    event: "workflow_dispatch",
    status: "completed",
    conclusion: "success",
    head_branch: "dev",
    head_sha: "b".repeat(40),
    repository: { full_name: repository },
    ...overrides,
  };
}

function status(overrides: Partial<ReleaseValidationStatus> = {}): ReleaseValidationStatus {
  return {
    id: 10,
    state: "success",
    context: "Validate release lane",
    description: releaseValidationStatusDescription("workflow_dispatch", headSha),
    target_url: `https://github.com/${repository}/actions/runs/1234`,
    updated_at: "2026-08-09T01:00:00.000Z",
    creator: { login: "github-actions[bot]" },
    ...overrides,
  };
}

describe("trusted release validation status", () => {
  test("dev workflow run title에서 exact generated head를 복원한다", () => {
    const run = workflowRun();
    expect(validationHeadShaFromRun(run)).toBe(headSha);
    expect(isTrustedValidationWorkflowRun(run, repository, headSha)).toBe(true);
    expect(
      isTrustedValidationWorkflowRun(
        workflowRun({ name: "Release lane PR validation" }),
        repository,
        headSha,
      ),
    ).toBe(false);
    const preflightRunName = releaseValidationRunName(headSha, codePromotionPreflightStatusContext);
    expect(
      isTrustedValidationWorkflowRun(workflowRun({ name: preflightRunName }), repository, headSha),
    ).toBe(false);
    expect(
      isTrustedValidationWorkflowRun(
        workflowRun({ display_title: preflightRunName }),
        repository,
        headSha,
      ),
    ).toBe(false);
    expect(
      isTrustedValidationWorkflowRun(
        workflowRun({ display_title: `prefix-${headSha}` }),
        repository,
        headSha,
      ),
    ).toBe(false);
    expect(
      isTrustedValidationWorkflowRun(
        workflowRun({ head_branch: "release-sync/x" }),
        repository,
        headSha,
      ),
    ).toBe(false);
    expect(
      isTrustedValidationWorkflowRun(
        workflowRun({ path: ".github/workflows/spoof.yml" }),
        repository,
        headSha,
      ),
    ).toBe(false);
    expect(
      isTrustedValidationWorkflowRun(
        workflowRun({ repository: { full_name: "attacker/fork" } }),
        repository,
        headSha,
      ),
    ).toBe(false);
  });

  test("status schema와 target run id를 exact head에 결속한다", () => {
    const run = workflowRun();
    const exact = status();
    expect(isValidationStatusForHead(exact, repository, headSha, "workflow_dispatch")).toBe(true);
    expect(validationRunIdFromStatus(exact, repository)).toBe(run.id);
    expect(isValidationStatusBoundToRun(exact, run, repository, headSha)).toBe(true);
    expect(isValidationStatusConsistentWithRun(exact, run, repository, headSha)).toBe(true);
    expect(
      isValidationStatusBoundToRun(
        status({ target_url: `https://github.com/${repository}/actions/runs/9999` }),
        run,
        repository,
        headSha,
      ),
    ).toBe(false);
    expect(
      isValidationStatusForHead(
        status({ creator: { login: "human" } }),
        repository,
        headSha,
        "workflow_dispatch",
      ),
    ).toBe(false);
    expect(
      isValidationStatusConsistentWithRun(
        status({
          description: releaseValidationStatusDescription("pull_request_target", headSha),
        }),
        workflowRun({ event: "pull_request_target", head_branch: "minor" }),
        repository,
        headSha,
      ),
    ).toBe(false);
    expect(
      isValidationStatusForHead(
        status({ description: "success" }),
        repository,
        headSha,
        "workflow_dispatch",
      ),
    ).toBe(false);
    expect(
      isValidationStatusForHead(
        status({
          description: releaseValidationStatusDescription("pull_request_target", headSha),
        }),
        repository,
        headSha,
        "workflow_dispatch",
      ),
    ).toBe(false);
  });

  test("같은 exact schema 안에서 최신 status만 선택한다", () => {
    const older = status({ id: 1, state: "pending", updated_at: "2026-08-09T00:00:00.000Z" });
    const newer = status({ id: 2, updated_at: "2026-08-09T02:00:00.000Z" });
    expect(latestValidationStatus([older, newer], repository, headSha, "workflow_dispatch")).toBe(
      newer,
    );
    expect(
      latestValidationStatus(
        [status({ context: "another-check" }), status({ creator: { login: "human" } })],
        repository,
        headSha,
        "workflow_dispatch",
      ),
    ).toBeNull();
  });

  test("lane run을 code promotion preflight receipt로 재사용하지 않는다", () => {
    const preflightStatus = status({
      context: codePromotionPreflightStatusContext,
      description: releaseValidationStatusDescription(
        "workflow_dispatch",
        headSha,
        codePromotionPreflightStatusContext,
      ),
    });
    expect(
      isValidationStatusBoundToRun(
        preflightStatus,
        workflowRun(),
        repository,
        headSha,
        codePromotionPreflightStatusContext,
      ),
    ).toBe(false);
    expect(
      isValidationStatusBoundToRun(
        preflightStatus,
        workflowRun({
          name: releaseValidationRunName(headSha, codePromotionPreflightStatusContext),
          display_title: releaseValidationRunName(headSha, codePromotionPreflightStatusContext),
        }),
        repository,
        headSha,
        codePromotionPreflightStatusContext,
      ),
    ).toBe(true);
  });
});
