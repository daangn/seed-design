import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { parse } from "yaml";

interface WorkflowStep {
  env?: Record<string, string>;
  name?: string;
  run?: string;
  uses?: string;
  with?: Record<string, unknown>;
}

interface WorkflowJob {
  if?: string;
  needs?: string | string[];
  permissions?: Record<string, string>;
  steps?: WorkflowStep[];
}

interface Workflow {
  jobs: Record<string, WorkflowJob>;
}

async function readWorkflow(path: string): Promise<Workflow> {
  return parse(await readFile(path, "utf8")) as Workflow;
}

describe("generated release PR workflow dispatch", () => {
  test("Version Packages PR은 tokenless lane plan과 trusted dev writer를 분리한다", async () => {
    const workflow = await readWorkflow(".github/workflows/release-packages.yml");
    const plan = workflow.jobs.plan;
    const write = workflow.jobs.write;
    const planCommand = plan.steps?.find(
      (step) => step.name === "Create immutable Version Packages write plan",
    );
    const writeCommand = write.steps?.find(
      (step) => step.name === "Write Version Packages pull request",
    );

    expect(plan.permissions).toEqual({ contents: "read" });
    expect(planCommand?.run).toContain("create-version /tmp/seed-release-plan");
    expect(planCommand?.env).not.toHaveProperty("GH_TOKEN");
    expect(write.needs).toEqual(["select-lanes", "plan"]);
    expect(write.if).toContain("always()");
    expect(write.if).toContain("needs.select-lanes.result == 'success'");
    expect(write.permissions).toEqual({
      actions: "write",
      contents: "write",
      issues: "write",
      "pull-requests": "write",
    });
    expect(writeCommand?.run).toBe(
      "bun tools/release-automation/src/lane/lane-write-plan.ts write-version /tmp/seed-release-plan",
    );
    expect(writeCommand?.env?.GH_TOKEN).toBe(["$", "{{ secrets.GITHUB_TOKEN }}"].join(""));
    expect(write.steps?.filter((step) => step.uses === "./.github/actions/setup")).toHaveLength(0);
  });

  test.each([
    {
      path: ".github/workflows/release-activation.yml",
      jobName: "create-pr",
      stepName: "Create activation PR",
      markerType: "activation",
    },
    {
      path: ".github/workflows/release-bootstrap.yml",
      jobName: "configure",
      stepName: "Create bootstrap PR",
      markerType: "bootstrap",
    },
  ])("$path는 PR 생성 뒤 exact branch 검증을 명시적으로 실행한다", async (entry) => {
    const workflow = await readWorkflow(entry.path);
    const job = workflow.jobs[entry.jobName];
    const run = job.steps?.find((step) => step.name === entry.stepName)?.run ?? "";

    expect(job.permissions).toMatchObject({ actions: "write" });
    expect(run).toContain(`marker --type ${entry.markerType}`);
    expect(run).toContain('--expectedHeadSha "$HEAD_SHA"');
    expect(run).toContain('--controlSha "$CONTROL_SHA"');
    expect(run).toContain(
      'gh workflow run release-pr-validation.yml --ref dev -f head_ref="$BRANCH" -f head_sha="$HEAD_SHA"',
    );
    expect(run.indexOf("gh pr create")).toBeLessThan(
      run.indexOf("gh workflow run release-pr-validation.yml"),
    );
  });

  test("bootstrap과 enable-sync는 exact dev/lane readiness를 먼저 검증한다", async () => {
    const [bootstrap, activation] = await Promise.all([
      readFile(".github/workflows/release-bootstrap.yml", "utf8"),
      readFile(".github/workflows/release-activation.yml", "utf8"),
    ]);
    expect(bootstrap).toContain("BOOTSTRAP_DEV_SHA: $" + "{{ needs.preflight.outputs.dev_sha }}");
    expect(bootstrap).toContain("ref: $" + "{{ needs.create-branches.outputs.dev_sha }}");
    expect(bootstrap).toContain(
      ["release-bootstrap/", "$", "{LANE}-", "$", "{GITHUB_RUN_ID}"].join(""),
    );
    expect(bootstrap).toContain('test "$REMOTE_LANE_SHA" = "$BASELINE_SHA"');
    expect(activation).toContain("Verify exact lane bootstrap readiness");
    expect(activation).toContain("bun tools/release-automation/bin/control.ts bootstrap-readiness");
  });

  test("sync worker는 dev validator에 exact ref/SHA inputs만 전달한다", async () => {
    const [syncWorkflow, syncWorker, syncAlert, syncMerge] = await Promise.all([
      readWorkflow(".github/workflows/release-sync.yml"),
      readFile("tools/release-automation/src/sync/sync-worker.ts", "utf8"),
      readFile("tools/release-automation/src/sync/sync-alert.ts", "utf8"),
      readFile("tools/release-automation/src/sync/sync-merge.ts", "utf8"),
    ]);
    expect(Object.keys(syncWorkflow.jobs)).toEqual(["prepare", "drain", "merge", "alert"]);
    expect(syncWorkflow.jobs.drain.if).toContain("inputs.operation == 'drain'");
    expect(syncWorkflow.jobs.merge.if).toContain("github.event_name == 'workflow_run'");
    expect(syncWorkflow.jobs.alert.if).toContain("inputs.operation == 'alert'");
    expect(syncWorker).toContain('ref: "dev"');
    expect(syncWorker).toContain("head_ref:");
    expect(syncWorker).toContain("head_sha:");
    expect(syncWorker).not.toContain("JSON.stringify({ ref:");
    for (const consumer of [syncWorker, syncAlert]) {
      expect(consumer).toContain("validationRunIdFromStatus");
      expect(consumer).toContain("isValidationStatusConsistentWithRun");
      expect(consumer).toContain("/actions/runs/");
    }
    expect(syncMerge).toContain("isValidationStatusBoundToRun");
    expect(syncMerge).toContain("validationHeadShaFromRun");
    expect(syncMerge).toContain("verifyTrustedGeneratedSync({");
    expect(syncMerge.indexOf("verifySyncMergePreconditions({")).toBeLessThan(
      syncMerge.indexOf("/merge`"),
    );
  });

  test("trusted validator는 API current ref와 fetched exact SHA를 head content보다 먼저 결속한다", async () => {
    const [cli, generated] = await Promise.all([
      readFile("tools/release-automation/bin/control.ts", "utf8"),
      readFile("tools/release-automation/src/validation/generated-pr-validation.ts", "utf8"),
    ]);
    expect(cli).toContain("pull.head.sha !== event.pull_request.head.sha");
    expect(cli).toContain(["refs/pull/", "$", "{pull.number}/head"].join(""));
    expect(cli).toContain("fetchedHeadSha !== pull.head.sha");
    expect(generated).toContain("process.env.VALIDATION_HEAD_SHA");
    expect(generated).toContain("process.env.VALIDATION_HEAD_REF");
    expect(generated).toContain("pull.head.sha !== headSha");
    expect(generated).toContain("pull.head.ref !== headRef");
    for (const validator of [cli, generated]) {
      expect(validator).toContain("verifyBootstrapPull");
      expect(validator).toContain("verifyBootstrapReadiness");
      expect(validator).toContain("verifyGeneratedLaneWritePlan");
      expect(validator).toContain("proposedConfig");
      expect(validator).toContain("verifyTrustedGeneratedSync({");
    }
    expect(cli.indexOf("verifyGeneratedLaneWritePlan(")).toBeLessThan(
      cli.indexOf('await writeOutput({ generated: "true"'),
    );
    expect(generated.indexOf("verifyGeneratedLaneWritePlan(")).toBeLessThan(
      generated.indexOf("const output = process.env.GITHUB_OUTPUT"),
    );
    expect(cli.indexOf("verifyTrustedGeneratedSync({")).toBeLessThan(
      cli.indexOf('await writeOutput({ generated: "true"'),
    );
    expect(generated.indexOf("verifyTrustedGeneratedSync({")).toBeLessThan(
      generated.indexOf("const output = process.env.GITHUB_OUTPUT"),
    );
    expect(generated.indexOf("fetchedHeadSha !== headSha")).toBeLessThan(
      generated.indexOf("assertLanePullAllowed({"),
    );
  });
});
