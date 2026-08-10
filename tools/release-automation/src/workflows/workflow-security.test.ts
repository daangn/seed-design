import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { parse } from "yaml";
import { activationOperations } from "../core/types";

interface WorkflowJob {
  concurrency?: {
    group?: string;
    "cancel-in-progress"?: boolean;
  };
  name?: string;
  if?: string;
  needs?: string | string[];
  environment?: string;
  env?: Record<string, string>;
  outputs?: Record<string, string>;
  permissions?: Record<string, string> | string;
  strategy?: {
    "fail-fast"?: boolean;
    matrix?: { include?: string };
  };
  steps?: Array<{
    id?: string;
    if?: string;
    name?: string;
    run?: string;
    "working-directory"?: string;
    uses?: string;
    env?: Record<string, string>;
    with?: Record<string, string | boolean | number>;
    "continue-on-error"?: boolean;
  }>;
}

interface Workflow {
  on?: Record<string, unknown>;
  "run-name"?: string;
  concurrency?: {
    group?: string;
    "cancel-in-progress"?: boolean;
  };
  permissions?: Record<string, string> | string;
  jobs: Record<string, WorkflowJob>;
}

async function workflow(path: string): Promise<Workflow> {
  return parse(await readFile(path, "utf8")) as Workflow;
}

describe("릴리즈 workflow 권한 경계", () => {
  test("PR 검증은 exact head status 외에는 read-only다", async () => {
    const [validation, validator, reconciliationGate] = await Promise.all([
      workflow(".github/workflows/release-pr-validation.yml"),
      readFile("tools/release-automation/src/validation/generated-pr-validation.ts", "utf8"),
      readFile("tools/release-automation/src/publish/baseline-reconciliation-state.ts", "utf8"),
    ]);
    expect(validation.permissions).toEqual({ contents: "read" });
    expect(validation.jobs.validate.permissions).toEqual({
      actions: "read",
      contents: "read",
      "pull-requests": "read",
      statuses: "read",
    });
    expect(validator).toContain("assertDevStablePublishReconciled");
    expect(reconciliationGate).toContain("/statuses");
    expect(reconciliationGate).toContain("/actions/runs/${validationRunId}");
    expect(validation.jobs["mark-pending"].permissions).toEqual({ statuses: "write" });
    expect(validation.jobs["record-result"].permissions).toEqual({ statuses: "write" });
    expect(
      validation.jobs["mark-pending"].steps?.some((step) => step.uses?.includes("checkout")),
    ).toBe(false);
    expect(
      validation.jobs["record-result"].steps?.some((step) => step.uses?.includes("checkout")),
    ).toBe(false);
  });

  test("dev trust root가 PR을 검증하고 provenance 성공 뒤 exact sync head만 실행한다", async () => {
    const [validation, e2e] = await Promise.all([
      workflow(".github/workflows/release-pr-validation.yml"),
      workflow(".github/workflows/release-e2e.yml"),
    ]);

    const pending = validation.jobs["mark-pending"];
    const job = validation.jobs.validate;
    const record = validation.jobs["record-result"];
    const triggers = validation.on as
      | {
          pull_request_target?: unknown;
          workflow_dispatch?: {
            inputs?: Record<string, { required?: boolean; type?: string }>;
          };
        }
      | undefined;
    expect(triggers?.pull_request_target).toBeDefined();
    expect(triggers?.workflow_dispatch?.inputs).toMatchObject({
      head_ref: { required: true, type: "string" },
      head_sha: { required: true, type: "string" },
    });
    expect(pending.if).toContain("github.event_name == 'pull_request_target'");
    expect(pending.if).toContain("github.ref_name == 'dev'");
    expect(job.needs).toBe("mark-pending");
    expect(job.if).toContain("needs.mark-pending.result == 'success'");
    expect(validation["run-name"]).toContain("inputs.head_sha");
    const steps = job.steps ?? [];
    const trustedCheckout = steps.find(
      (step) => step.name === "Checkout trusted dev validation control plane",
    );
    const trustedSetup = steps.findIndex(
      (step) => step.uses === "./.github/actions/setup" && !step.with?.["build-packages"],
    );
    const trustedValidation = steps.find(
      (step) => step.name === "Validate current PR with trusted dev code",
    );
    const trustedValidationIndex = steps.indexOf(trustedValidation ?? {});
    const syncCheckout = steps.find((step) => step.name === "Checkout exact validated sync head");
    const syncCheckoutIndex = steps.indexOf(syncCheckout ?? {});
    const syncSetup = steps.find((step) => step.name === "Setup exact validated sync head");
    const finalStatus = record.steps?.find(
      (step) => step.name === "Record exact PR head validation result",
    );
    expect(validation.jobs.validate.name).toBe(
      "Run release lane validation without write credentials",
    );
    expect(job.permissions).toEqual({
      actions: "read",
      contents: "read",
      "pull-requests": "read",
      statuses: "read",
    });
    expect(trustedCheckout?.with).toMatchObject({
      ref: "dev",
      "fetch-depth": 0,
      "persist-credentials": false,
    });
    expect(trustedSetup).toBeGreaterThan(-1);
    expect(trustedValidation?.run).toContain(
      "bun tools/release-automation/src/validation/generated-pr-validation.ts",
    );
    expect(trustedValidation?.run).toContain(
      "bun tools/release-automation/bin/control.ts validate-pr",
    );
    expect(
      steps
        .slice(0, trustedValidationIndex)
        .filter((step) => step.uses?.startsWith("actions/checkout@"))
        .map((step) => step.with?.ref),
    ).toEqual(["dev"]);
    expect(syncCheckout?.with?.ref).toBe(["$", "{{ env.VALIDATION_HEAD_SHA }}"].join(""));
    expect(syncCheckout?.with?.["persist-credentials"]).toBe(false);
    expect(syncSetup?.with?.["build-packages"]).toBe(true);
    expect(trustedValidationIndex).toBeLessThan(syncCheckoutIndex);
    expect(syncCheckoutIndex).toBeLessThan(steps.indexOf(syncSetup ?? {}));
    expect(record.needs).toEqual(["mark-pending", "validate"]);
    expect(record.if).toContain("always()");
    expect(record.env?.VALIDATION_RESULT).toBe(["$", "{{ needs.validate.result }}"].join(""));
    expect(String(finalStatus?.with?.script)).toContain(
      [
        "seed-release-validation:",
        "$",
        "{process.env.VALIDATION_EVENT_KIND}:",
        "$",
        "{process.env.VALIDATION_HEAD_SHA}",
      ].join(""),
    );
    expect(String(finalStatus?.with?.script)).toContain(
      ["/actions/runs/", "$", "{context.runId}"].join(""),
    );
    const sharedVerify = e2e.jobs.verify.steps?.find(
      (step) => step.name === "Run the same release verification used locally",
    );
    expect(sharedVerify?.run).toBe("bun release:verify --skip-setup");
  });

  test("sync merge는 검증 SHA 재확인에 필요한 전체 history를 받는다", async () => {
    const sync = await workflow(".github/workflows/release-sync.yml");
    const merge = sync.jobs.merge;
    const checkout = merge.steps?.find((step) => step.name === "Checkout trusted dev workflow");

    expect(checkout?.with?.ref).toBe("dev");
    expect(checkout?.with?.["fetch-depth"]).toBe(0);
    expect(merge.if).toContain("github.event_name == 'workflow_run'");
    expect(merge.if).toContain("workflow_run.event == 'workflow_dispatch'");
    expect(merge.if).toContain("workflow_run.head_branch == 'dev'");
    expect(merge.if).toContain("seed-release-validation:");
    expect(merge.permissions).toEqual({
      contents: "write",
      "pull-requests": "write",
      statuses: "read",
    });
  });

  test("sync worker는 trusted dev code를 target worktree에 실행하고 dispatch 권한만 추가한다", async () => {
    const sync = await workflow(".github/workflows/release-sync.yml");
    const checkout = sync.jobs.drain.steps?.find(
      (step) => step.name === "Checkout trusted dev control plane",
    );
    const apply = sync.jobs.drain.steps?.find(
      (step) => step.name === "Apply the oldest unprocessed source PR",
    );

    expect(checkout?.with).toMatchObject({ ref: "dev", "fetch-depth": 0 });
    expect(sync.jobs.drain.permissions).toEqual({
      actions: "write",
      contents: "write",
      issues: "write",
      "pull-requests": "write",
      statuses: "read",
    });
    expect(apply?.run).toContain(
      'bun "$DEV_WORKSPACE/tools/release-automation/src/sync/sync-worker.ts"',
    );
    expect(apply?.run).toContain('git worktree add --detach "$TARGET_WORKTREE"');
    expect(apply?.run).not.toContain('cd "$TARGET_WORKTREE"');
    expect(apply?.run).toContain('SYNC_REPOSITORY_PATH="$TARGET_WORKTREE" bun');
  });

  test("sync blocker 감시는 Actions run을 read-only로 조회한다", async () => {
    const sync = await workflow(".github/workflows/release-sync.yml");
    const alert = sync.jobs.alert;
    expect(alert.permissions).toEqual({
      actions: "read",
      contents: "read",
      issues: "write",
      "pull-requests": "read",
      statuses: "read",
    });
    expect(alert.if).toContain("github.event.schedule == '17 * * * *'");
    expect(alert.if).toContain("github.ref == 'refs/heads/dev'");
    expect(alert.if).toContain("inputs.operation == 'alert'");
  });

  test("단일 sync workflow는 이벤트와 dispatch operation을 job별로 exact 분리한다", async () => {
    const sync = await workflow(".github/workflows/release-sync.yml");
    const triggers = sync.on as
      | {
          pull_request_target?: { branches?: string[]; types?: string[] };
          schedule?: Array<{ cron?: string }>;
          workflow_dispatch?: {
            inputs?: Record<string, { default?: string; options?: string[]; type?: string }>;
          };
          workflow_run?: { workflows?: string[]; types?: string[] };
        }
      | undefined;

    expect(Object.keys(sync.jobs)).toEqual(["prepare", "drain", "merge", "alert"]);
    expect(triggers?.pull_request_target?.types).toEqual(["closed"]);
    expect(triggers?.schedule).toEqual([{ cron: "*/10 * * * *" }, { cron: "17 * * * *" }]);
    expect(triggers?.workflow_dispatch?.inputs?.operation).toMatchObject({
      default: "drain",
      type: "choice",
      options: ["drain", "alert"],
    });
    expect(triggers?.workflow_run).toEqual({
      workflows: ["Release lane PR validation"],
      types: ["completed"],
    });
    expect(sync.jobs.prepare.permissions).toEqual({ contents: "read" });
    expect(sync.jobs.prepare.if).toContain("github.event.schedule == '*/10 * * * *'");
    expect(sync.jobs.prepare.if).toContain("github.event.action == 'closed'");
    expect(sync.jobs.prepare.if).toContain("inputs.operation == 'drain'");
    expect(sync.jobs.prepare.if).toContain("github.ref == 'refs/heads/dev'");
    expect(sync.jobs.drain.if).toContain("needs.prepare.result == 'success'");
    expect(sync.jobs.merge.if).toContain("github.event_name == 'workflow_run'");
    expect(sync.jobs.alert.if).toContain("github.event.schedule == '17 * * * *'");
  });

  test("Version Packages는 dev trust root에서 lane별 tokenless plan만 생성한다", async () => {
    const [version, raw, prereleaseWriter, reconciliationGate] = await Promise.all([
      workflow(".github/workflows/release-packages.yml"),
      readFile(".github/workflows/release-packages.yml", "utf8"),
      readFile("tools/release-automation/src/lane/prerelease-write-plan.ts", "utf8"),
      readFile("tools/release-automation/src/publish/baseline-reconciliation-state.ts", "utf8"),
    ]);
    const triggers = version.on as
      | {
          push?: { branches?: string[] };
          pull_request_target?: { branches?: string[]; types?: string[] };
          schedule?: Array<{ cron?: string }>;
          workflow_dispatch?: {
            inputs?: {
              operation?: {
                description?: string;
                required?: boolean;
                default?: string;
                options?: string[];
                type?: string;
              };
              lane?: {
                description?: string;
                required?: boolean;
                default?: string;
                options?: string[];
                type?: string;
              };
            };
          };
        }
      | undefined;
    const select = version.jobs["select-lanes"];
    const plan = version.jobs.plan;
    const write = version.jobs.write;
    expect(version.concurrency).toEqual({
      group: "release-version-global-operation",
      "cancel-in-progress": false,
    });
    const planCheckout = plan.steps?.find(
      (step) => step.name === "Checkout exact lane without credentials",
    );
    const planVersion = plan.steps?.find(
      (step) => step.name === "Apply package versions without write credentials",
    );
    const planCommand = plan.steps?.find(
      (step) => step.name === "Create immutable Version Packages write plan",
    );
    const install = plan.steps?.find(
      (step) => step.name === "Install lane dependencies without shared cache",
    );
    const upload = plan.steps?.find(
      (step) => step.name === "Upload immutable Version Packages write plan",
    );
    const writerCheckout = write.steps?.find((step) => step.name === "Checkout trusted dev writer");
    const download = write.steps?.find(
      (step) => step.name === "Download immutable Version Packages write plan",
    );
    const trustedChangesetsInstall = write.steps?.find(
      (step) => step.name === "Install trusted Changesets without lifecycle scripts",
    );
    const writerCommand = write.steps?.find(
      (step) => step.name === "Write Version Packages pull request",
    );

    expect(triggers?.push?.branches).toEqual(["dev"]);
    expect(triggers?.pull_request_target).toEqual({
      branches: ["minor", "major"],
      types: ["closed"],
    });
    expect(triggers?.schedule?.length).toBeGreaterThan(0);
    expect(triggers?.workflow_dispatch?.inputs?.lane).toEqual({
      description: "Release lane to operate",
      required: true,
      default: "all",
      type: "choice",
      options: ["all", "dev", "minor", "major"],
    });
    expect(triggers?.workflow_dispatch?.inputs?.operation).toEqual({
      description: "Version packages or change prerelease state",
      required: true,
      default: "version",
      type: "choice",
      options: ["version", "enter", "exit"],
    });
    expect(select.if).toContain("github.event_name == 'workflow_dispatch'");
    expect(select.if).toContain("github.ref == 'refs/heads/dev'");
    expect(select.if).toContain("github.event.pull_request.merged == true");
    const selection = select.steps?.find((step) => step.name === "Select exact current lane heads");
    expect(select.permissions).toEqual({
      actions: "read",
      contents: "read",
      "pull-requests": "read",
      statuses: "read",
    });
    expect(selection?.run).toBe("bun tools/release-automation/src/validation/release-selection.ts");
    expect(selection?.env).toMatchObject({
      GH_TOKEN: ["$", "{{ secrets.GITHUB_TOKEN }}"].join(""),
      REQUESTED_OPERATION: ["$", "{{ inputs.operation || 'version' }}"].join(""),
      RELEASE_OPERATION_ID: ["$", "{{ github.run_id }}"].join(""),
    });

    expect(plan.permissions).toEqual({ contents: "read" });
    expect(plan.if).toContain("github.event.pull_request.merged == true");
    expect(plan.strategy?.matrix?.include).toBe(
      ["$", "{{ fromJSON(needs.select-lanes.outputs.matrix) }}"].join(""),
    );
    expect(planCheckout?.with).toMatchObject({
      ref: ["$", "{{ matrix.base_sha }}"].join(""),
      "persist-credentials": false,
    });
    expect(plan.env?.BUN_INSTALL_CACHE_DIR).toBe(
      ["/tmp/seed-release-bun-cache-$", "{{ matrix.lane }}-$", "{{ github.run_id }}"].join(""),
    );
    expect(plan.steps?.some((step) => step.uses === "./.github/actions/setup")).toBe(false);
    expect(plan.steps?.some((step) => step.uses?.startsWith("actions/cache@"))).toBe(false);
    expect(plan.steps?.filter((step) => step.uses === "oven-sh/setup-bun@v2")).toHaveLength(1);
    expect(install?.run).toBe(
      "bun install --frozen-lockfile\nbun ecosystem:build\nbun install --frozen-lockfile\n",
    );
    expect(planVersion?.run).toBe("bun tools/release-automation/src/lane/version.ts");
    expect(planCommand?.run).toContain("create-version /tmp/seed-release-plan");
    expect(planCommand?.env).not.toHaveProperty("GH_TOKEN");
    expect(upload?.with).toMatchObject({
      name: ["release-$", "{{ matrix.kind }}-plan-$", "{{ matrix.lane }}"].join(""),
      path: "/tmp/seed-release-plan",
    });

    expect(write.needs).toEqual(["select-lanes", "plan"]);
    expect(write.if).toContain("github.event.pull_request.merged == true");
    expect(write.strategy?.matrix?.include).toBe(
      ["$", "{{ fromJSON(needs.select-lanes.outputs.matrix) }}"].join(""),
    );
    expect(write.concurrency).toEqual({
      group: ["release-version-write-$", "{{ matrix.lane }}"].join(""),
      "cancel-in-progress": false,
    });
    expect(write.permissions).toEqual({
      actions: "write",
      contents: "write",
      issues: "write",
      "pull-requests": "write",
      statuses: "read",
    });
    expect(prereleaseWriter).toContain("assertDevStablePublishReconciled");
    expect(reconciliationGate).toContain("/statuses");
    expect(writerCheckout?.with).toMatchObject({
      ref: "dev",
      "persist-credentials": false,
    });
    expect(write.steps?.some((step) => step.uses === "./.github/actions/setup")).toBe(false);
    expect(write.if).toContain("always()");
    expect(write.if).toContain("needs.select-lanes.result == 'success'");
    expect(write.steps?.filter((step) => step.uses === "oven-sh/setup-bun@v2")).toHaveLength(1);
    expect(write.env?.BUN_INSTALL_CACHE_DIR).toBe(
      ["/tmp/seed-release-trusted-bun-cache-$", "{{ matrix.lane }}-$", "{{ github.run_id }}"].join(
        "",
      ),
    );
    expect(trustedChangesetsInstall?.run).toBe("bun install --frozen-lockfile --ignore-scripts");
    expect(trustedChangesetsInstall?.env).not.toHaveProperty("GH_TOKEN");
    expect(download?.with).toMatchObject({
      name: ["release-$", "{{ matrix.kind }}-plan-$", "{{ matrix.lane }}"].join(""),
      path: "/tmp/seed-release-plan",
    });
    expect(writerCommand?.run).toBe(
      "bun tools/release-automation/src/lane/lane-write-plan.ts write-version /tmp/seed-release-plan",
    );
    expect(writerCommand?.env?.GH_TOKEN).toBe(["$", "{{ secrets.GITHUB_TOKEN }}"].join(""));
    expect(write.steps?.indexOf(trustedChangesetsInstall ?? {})).toBeLessThan(
      write.steps?.indexOf(writerCommand ?? {}) ?? -1,
    );
    expect(
      [...(select.steps ?? []), ...(plan.steps ?? []), ...(write.steps ?? [])]
        .filter((step) => step.env?.GH_TOKEN)
        .map((step) => step.name),
    ).toEqual([
      "Select exact current lane heads",
      "Write Version Packages pull request",
      "Bind Stable Version PR to exact Exit Intent merge",
      "Write prerelease state pull request",
    ]);
    const prereleasePlan = plan.steps?.find(
      (step) => step.name === "Create immutable prerelease write plan",
    );
    const prereleaseWrite = write.steps?.find(
      (step) => step.name === "Write prerelease state pull request",
    );
    const stableBinder = write.steps?.find(
      (step) => step.name === "Bind Stable Version PR to exact Exit Intent merge",
    );
    expect(prereleasePlan?.run).toContain("create-prerelease /tmp/seed-release-plan");
    expect(prereleasePlan?.env).not.toHaveProperty("GH_TOKEN");
    expect(prereleaseWrite?.run).toContain("write-prerelease /tmp/seed-release-plan");
    expect(stableBinder?.if).toBe("matrix.release_kind == 'stable-promotion'");
    expect(stableBinder?.env).toMatchObject({
      RELEASE_PROMOTION_EXIT_PR: ["$", "{{ matrix.exit_pr }}"].join(""),
      RELEASE_PROMOTION_EXIT_MERGE_SHA: ["$", "{{ matrix.exit_merge_sha }}"].join(""),
      RELEASE_VERSION_HEAD_SHA: ["$", "{{ steps.write-version.outputs.headSha }}"].join(""),
    });
    expect(raw).not.toContain("changesets/action");
  });

  test("npm publish job만 OIDC를 가진다", async () => {
    const publish = await workflow(".github/workflows/release-publish.yml");
    const oidcJobs = Object.entries(publish.jobs)
      .filter(
        ([, job]) => typeof job.permissions === "object" && job.permissions["id-token"] === "write",
      )
      .map(([name]) => name);
    expect(oidcJobs).toEqual(["publish-npm"]);
  });

  test("publish는 tokenless artifact, OIDC publish, trusted tag writer를 job 단위로 분리한다", async () => {
    const publish = await workflow(".github/workflows/release-publish.yml");
    const authorize = publish.jobs.authorize;
    const build = publish.jobs["build-artifact"];
    const dryRun = publish.jobs["dry-run"];
    const oidc = publish.jobs["publish-npm"];
    const tags = publish.jobs["tag-packages"];
    const artifactPath = ["$", "{{ runner.temp }}/release-package-artifact"].join("");
    const buildControl = build.steps?.find(
      (step) => step.name === "Checkout immutable trusted dev control plane",
    );
    const buildSource = build.steps?.find(
      (step) => step.name === "Checkout exact merged source without credentials",
    );
    const upload = build.steps?.find((step) => step.name === "Upload immutable package artifact");
    const buildPlan = build.steps?.find(
      (step) => step.name === "Plan exact approved package versions",
    );
    const sourceBuild = build.steps?.find(
      (step) => step.name === "Install and build exact source without mutation credentials",
    );
    const buildBinding = build.steps?.find(
      (step) => step.name === "Bind trusted dev state for release policy",
    );
    const dryPlan = dryRun.steps?.find(
      (step) => step.name === "Independently re-plan exact approved packages",
    );
    const dryDownload = dryRun.steps?.find((step) => step.name === "Download package artifact");
    const dryVerify = dryRun.steps?.find(
      (step) => step.name === "Reverify package artifact without registry writes",
    );
    const dryBinding = dryRun.steps?.find(
      (step) => step.name === "Bind immutable trusted dev state for dry-run policy",
    );
    const oidcControl = oidc.steps?.find(
      (step) => step.name === "Checkout immutable trusted dev control plane",
    );
    const oidcSource = oidc.steps?.find(
      (step) => step.name === "Checkout exact merge as inert gitHead root",
    );
    const oidcDownload = oidc.steps?.find((step) => step.name === "Download package artifact");
    const publishArtifact = oidc.steps?.find(
      (step) => step.name === "Reverify and publish only sanitized missing packages",
    );
    const oidcBinding = oidc.steps?.find(
      (step) => step.name === "Bind immutable trusted dev state for publish policy",
    );
    const preflight = oidc.steps?.find(
      (step) => step.name === "Fail before npm writes on wrong existing tags or gitHead",
    );
    const postflight = oidc.steps?.find(
      (step) => step.name === "Verify every registry version has the exact merge gitHead",
    );
    const artifactContract = oidc.steps?.find(
      (step) => step.name === "Reverify artifact and bind registry integrity",
    );
    const tagCheckout = tags.steps?.find(
      (step) => step.name === "Checkout immutable trusted dev control plane",
    );
    const tagSource = tags.steps?.find(
      (step) => step.name === "Checkout exact approved merge as inert tag repository",
    );
    const reconcileTags = tags.steps?.find(
      (step) => step.name === "Atomically reconcile exact package tags",
    );

    expect(authorize.outputs?.["package-paths"]).toBe(
      ["$", "{{ steps.authorize.outputs.packagePaths }}"].join(""),
    );
    expect(authorize.outputs?.["control-sha"]).toBe(
      ["$", "{{ steps.authorize.outputs.controlSha }}"].join(""),
    );
    expect(authorize.outputs?.["stable-promotion"]).toBe(
      ["$", "{{ steps.authorize.outputs.stablePromotion }}"].join(""),
    );
    expect(authorize.permissions).toMatchObject({ actions: "read", statuses: "read" });
    expect(build.permissions).toEqual({ contents: "read" });
    expect(buildControl?.with).toMatchObject({
      ref: ["$", "{{ needs.authorize.outputs.control-sha }}"].join(""),
      path: "control",
      "persist-credentials": false,
    });
    expect(buildSource?.with).toMatchObject({
      ref: ["$", "{{ needs.authorize.outputs.merge-sha }}"].join(""),
      path: "source",
      "persist-credentials": false,
    });
    expect(upload?.uses).toBe("actions/upload-artifact@v4");
    expect(sourceBuild?.env?.BUN_INSTALL_CACHE_DIR).toBe(
      ["$", "{{ runner.temp }}/release-bun-cache"].join(""),
    );
    expect(build.steps?.some((step) => step.uses?.startsWith("actions/cache@"))).toBe(false);
    expect(buildBinding?.run).toContain('"+$PUBLISH_CONTROL_SHA:refs/remotes/origin/dev"');
    expect(buildPlan?.["working-directory"]).toBe("control");
    expect(buildPlan?.env?.PUBLISH_REPOSITORY_PATH).toBe(
      ["$", "{{ github.workspace }}/source"].join(""),
    );
    for (const plan of [
      buildPlan,
      dryPlan,
      oidc.steps?.find((step) => step.name === "Independently re-plan exact approved packages"),
    ]) {
      expect(plan?.env?.PUBLISH_STABLE_PROMOTION).toBe(
        ["$", "{{ needs.authorize.outputs.stable-promotion }}"].join(""),
      );
    }
    expect(dryPlan?.env?.PUBLISH_PACKAGE_PATHS).toBe(
      ["$", "{{ needs.authorize.outputs.package-paths }}"].join(""),
    );
    expect(dryDownload?.with?.path).toBe(artifactPath);
    expect(dryVerify?.env?.PUBLISH_ARTIFACT_PATH).toBe(artifactPath);
    expect(dryVerify?.run).toBe(
      "bun tools/release-automation/src/publish/publish-artifact.ts verify",
    );
    expect(dryBinding?.run).toContain('"+$PUBLISH_CONTROL_SHA:refs/remotes/origin/dev"');
    expect(dryPlan?.["working-directory"]).toBeUndefined();
    expect(dryPlan?.env?.PUBLISH_REPOSITORY_PATH).toBe(
      ["$", "{{ github.workspace }}/source"].join(""),
    );

    expect(oidc.permissions).toEqual({ contents: "read", "id-token": "write" });
    expect(oidc.environment).toBe("npm-production");
    expect(oidcControl?.with).toMatchObject({
      ref: ["$", "{{ needs.authorize.outputs.control-sha }}"].join(""),
      "persist-credentials": false,
    });
    expect(oidcSource?.with).toMatchObject({
      ref: ["$", "{{ needs.authorize.outputs.merge-sha }}"].join(""),
      path: "source",
      "persist-credentials": false,
    });
    expect(oidcDownload?.with?.path).toBe(artifactPath);
    expect(artifactContract?.env?.PUBLISH_ARTIFACT_PATH).toBe(artifactPath);
    expect(publishArtifact?.env?.PUBLISH_ARTIFACT_PATH).toBe(artifactPath);
    expect(
      oidc.steps?.find((step) => step.uses === "actions/setup-node@v6")?.with?.["node-version"],
    ).toBe("24");
    expect(
      oidc.steps?.find((step) => step.uses === "actions/setup-node@v6")?.with?.[
        "package-manager-cache"
      ],
    ).toBe(false);
    expect(
      oidc.steps?.find(
        (step) => step.name === "Install reviewed Changesets CLI without lifecycle scripts",
      )?.run,
    ).toBe("bun install --frozen-lockfile --ignore-scripts");
    expect(publishArtifact?.env).toMatchObject({
      NPM_CONFIG_IGNORE_SCRIPTS: "true",
      NPM_CONFIG_PROVENANCE: "true",
      NPM_CONFIG_REGISTRY: "https://registry.npmjs.org",
      PUBLISH_REPOSITORY_PATH: ["$", "{{ github.workspace }}/source"].join(""),
    });
    expect(publishArtifact?.run).toBe(
      "bun tools/release-automation/src/publish/publish-artifact.ts publish",
    );
    expect(oidcBinding?.run).toContain('"+$PUBLISH_CONTROL_SHA:refs/remotes/origin/dev"');
    expect(preflight?.run).toBe(
      "bun tools/release-automation/src/publish/reconcile-publish-tags.ts check",
    );
    expect(artifactContract?.id).toBe("artifact");
    expect(preflight?.env?.PUBLISH_PACKAGES).toBe(
      ["$", "{{ steps.artifact.outputs.registryPackages }}"].join(""),
    );
    expect(postflight?.env?.PUBLISH_PACKAGES).toBe(
      ["$", "{{ steps.artifact.outputs.registryPackages }}"].join(""),
    );
    expect(preflight?.env?.GH_TOKEN).toBe(["$", "{{ secrets.GITHUB_TOKEN }}"].join(""));
    expect(postflight?.env?.GH_TOKEN).toBe(["$", "{{ secrets.GITHUB_TOKEN }}"].join(""));
    expect(oidc.steps?.indexOf(preflight ?? {})).toBeLessThan(
      oidc.steps?.indexOf(publishArtifact ?? {}) ?? -1,
    );
    expect(oidc.steps?.indexOf(publishArtifact ?? {})).toBeLessThan(
      oidc.steps?.indexOf(postflight ?? {}) ?? -1,
    );
    expect(publishArtifact?.env).not.toHaveProperty("GH_TOKEN");
    expect(
      (oidc.steps ?? [])
        .filter((step) => step.run?.trimStart().startsWith("bun "))
        .some((step) => step["working-directory"] === "source"),
    ).toBe(false);
    expect((oidc.steps ?? []).map((step) => step.run ?? "").join("\n")).not.toContain(
      "bun release",
    );
    expect((oidc.steps ?? []).map((step) => step.run ?? "").join("\n")).not.toMatch(
      /\bnpm\s+publish\b/,
    );

    expect(tags.permissions).toEqual({ contents: "write" });
    expect(tagCheckout?.with).toMatchObject({
      ref: ["$", "{{ needs.authorize.outputs.control-sha }}"].join(""),
      path: "control",
      "persist-credentials": false,
    });
    expect(tagSource?.with).toMatchObject({
      ref: ["$", "{{ needs.authorize.outputs.merge-sha }}"].join(""),
      path: "source",
      "persist-credentials": false,
    });
    expect(reconcileTags?.["working-directory"]).toBe("control");
    expect(reconcileTags?.env).toMatchObject({
      GH_TOKEN: ["$", "{{ secrets.GITHUB_TOKEN }}"].join(""),
      PUBLISH_DIST_TAG: ["$", "{{ needs.publish-npm.outputs.dist-tag }}"].join(""),
      PUBLISH_REPOSITORY_PATH: ["$", "{{ github.workspace }}/source"].join(""),
    });
    expect(reconcileTags?.run).toBe(
      "bun tools/release-automation/src/publish/reconcile-publish-tags.ts write",
    );
    expect(reconcileTags?.run).not.toContain("--tags");
    expect(
      (tags.steps ?? []).filter((step) => step.env?.GH_TOKEN).map((step) => step.name),
    ).toEqual(["Atomically reconcile exact package tags"]);
    const tagWriterSource = await readFile(
      "tools/release-automation/src/publish/reconcile-publish-tags.ts",
      "utf8",
    );
    expect(tagWriterSource).toContain('GIT_CONFIG_KEY_0: "http.https://github.com/.extraheader"');
    expect(tagWriterSource).not.toContain('GIT_CONFIG_KEY_0: "http.extraheader"');
  });

  test("publish 완료는 durable status를 먼저 기록하고 PR 댓글 실패를 격리한다", async () => {
    const publish = await workflow(".github/workflows/release-publish.yml");
    expect(publish.jobs.select.permissions).toMatchObject({ actions: "read", statuses: "read" });
    const record = publish.jobs.record;
    const checkout = record.steps?.find((step) => step.uses?.startsWith("actions/checkout@"));
    const checkpoint = record.steps?.find(
      (step) => step.name === "Persist durable publish checkpoint",
    );
    const comment = record.steps?.find(
      (step) => step.name === "Persist human-readable publish result",
    );

    expect(record.permissions).toMatchObject({
      contents: "read",
      issues: "write",
      "pull-requests": "write",
      statuses: "write",
    });
    expect(record.name).toBe(
      ["Record successful queue item $", "{{ needs.authorize.outputs.merge-sha }}"].join(""),
    );
    expect(checkout?.with).toMatchObject({
      ref: ["$", "{{ needs.authorize.outputs.control-sha }}"].join(""),
      "persist-credentials": false,
    });
    expect(
      (record.steps ?? []).filter((step) => step.env?.GH_TOKEN).map((step) => step.name),
    ).toEqual([
      "Persist durable publish checkpoint",
      "Persist human-readable publish result",
      "Dispatch isolated production success notification",
      "Drain the next FIFO item",
    ]);
    expect(checkpoint?.run).toContain(["statuses/", "$", "{PUBLISH_MERGE_SHA}"].join(""));
    expect(comment?.["continue-on-error"]).toBe(true);
    expect(publish.jobs["notify-failure"].needs).toContain("record");
  });

  test("baseline reconciliation은 completed record 뒤 최소 권한 trusted dev job에서만 실행한다", async () => {
    const publish = await workflow(".github/workflows/release-publish.yml");
    const job = publish.jobs["baseline-reconcile"];
    expect(job.needs).toEqual(["authorize", "publish-npm", "record"]);
    expect(job.if).toContain("needs.record.result == 'success'");
    expect(job.if).toContain("needs.authorize.outputs.mode == 'production'");
    expect(job.if).toContain("needs.authorize.outputs.stable-promotion == 'true'");
    expect(job.permissions).toEqual({
      actions: "write",
      contents: "write",
      "pull-requests": "write",
      statuses: "read",
    });
    expect(job.environment).toBeUndefined();
    expect((job as WorkflowJob & { secrets?: unknown }).secrets).toBeUndefined();
    expect((job.permissions as Record<string, string>)["id-token"]).toBeUndefined();

    const checkouts = (job.steps ?? []).filter((step) =>
      step.uses?.startsWith("actions/checkout@"),
    );
    expect(checkouts).toHaveLength(2);
    expect(checkouts[0]?.with).toMatchObject({
      ref: ["$", "{{ needs.authorize.outputs.control-sha }}"].join(""),
      path: "control",
      "persist-credentials": false,
    });
    expect(checkouts[1]?.with).toMatchObject({
      ref: ["$", "{{ needs.authorize.outputs.merge-sha }}"].join(""),
      path: "baseline-source",
      "persist-credentials": false,
    });
    const writer = (job.steps ?? []).find(
      (step) => step.name === "Reverify receipt and create baseline reconciliation pull request",
    );
    expect(writer?.["working-directory"]).toBe("control");
    expect(writer?.env).toMatchObject({
      GH_TOKEN: ["$", "{{ secrets.GITHUB_TOKEN }}"].join(""),
      BASELINE_PUBLISH_RUN_ID: ["$", "{{ github.run_id }}"].join(""),
      BASELINE_CONTROL_SHA: ["$", "{{ needs.authorize.outputs.control-sha }}"].join(""),
      BASELINE_STABLE_MERGE_SHA: ["$", "{{ needs.authorize.outputs.merge-sha }}"].join(""),
    });
    expect((job.steps ?? []).filter((step) => step.env?.GH_TOKEN).map((step) => step.name)).toEqual(
      ["Reverify receipt and create baseline reconciliation pull request"],
    );
    const creator = await readFile(
      "tools/release-automation/src/publish/create-baseline-reconciliation.ts",
      "utf8",
    );
    expect(creator).toContain("actions/workflows/release-pr-validation.yml/dispatches");
    expect(creator).toContain("inputs: { head_ref: branch, head_sha: headSha }");
    expect(publish.jobs["notify-failure"].needs).toContain("baseline-reconcile");
  });

  test("publish queue는 신뢰된 Version Packages merge만 PR 이벤트로 처리한다", async () => {
    const publish = await workflow(".github/workflows/release-publish.yml");
    const selectCondition = publish.jobs.select.if ?? "";
    const concurrencyGroup = publish.concurrency?.group ?? "";

    for (const fragment of [
      "github.event.pull_request.merged == true",
      "github.event.pull_request.user.login == 'github-actions[bot]'",
      "github.event.pull_request.head.repo.full_name == github.repository",
      "format('changeset-release/{0}', github.event.pull_request.base.ref)",
    ]) {
      expect(selectCondition).toContain(fragment);
      expect(concurrencyGroup).toContain(fragment);
    }
    expect(concurrencyGroup).toContain("format('release-publish-ignored-{0}', github.run_id)");
    expect(selectCondition).toContain(
      "github.event_name == 'workflow_dispatch' && github.ref == 'refs/heads/dev'",
    );
    expect(concurrencyGroup).toContain(
      "github.event_name == 'workflow_dispatch' && github.ref == 'refs/heads/dev'",
    );
    expect(publish.concurrency?.["cancel-in-progress"]).toBe(false);
  });

  test("pull_request_target control workflow는 PR head를 checkout하지 않는다", async () => {
    const workflows = await Promise.all([
      workflow(".github/workflows/release-publish.yml"),
      workflow(".github/workflows/release-sync.yml"),
    ]);
    const untrustedHeadRef = ["$", "{{ github.event.pull_request.head.sha }}"].join("");
    for (const candidate of workflows) {
      for (const job of Object.values(candidate.jobs)) {
        for (const step of job.steps ?? []) {
          if (step.uses?.startsWith("actions/checkout@")) {
            expect(step.with?.ref).not.toBe(untrustedHeadRef);
          }
        }
      }
    }
  });

  test("모든 release workflow YAML을 읽을 수 있다", async () => {
    const paths = [
      ".github/workflows/release-packages.yml",
      ".github/workflows/release-pr-validation.yml",
      ".github/workflows/release-publish.yml",
      ".github/workflows/release-notification.yml",
      ".github/workflows/release-sync.yml",
      ".github/workflows/release-e2e.yml",
      ".github/workflows/release-bootstrap.yml",
      ".github/workflows/release-activation.yml",
      ".github/workflows/rootage-release-contract.yml",
      ".github/workflows/rootage-cdn-deploy.yml",
      ".github/workflows/rootage-cdn-operations.yml",
    ];
    const parsed = await Promise.all(paths.map(workflow));
    expect(parsed.every((item) => Object.keys(item.jobs).length > 0)).toBe(true);
  });

  test("bootstrap token은 브랜치만 생성하고 보호 규칙은 수동 설정한다", async () => {
    const [bootstrapWorkflow, bootstrapScript, bootstrap] = await Promise.all([
      readFile(".github/workflows/release-bootstrap.yml", "utf8"),
      readFile("tools/release-automation/src/setup/bootstrap.ts", "utf8"),
      workflow(".github/workflows/release-bootstrap.yml"),
    ]);

    expect(bootstrapWorkflow).toContain("secrets.RELEASE_BOOTSTRAP_TOKEN");
    expect(bootstrapWorkflow).not.toContain("RELEASE_ADMIN_TOKEN");
    expect(bootstrapWorkflow).not.toContain("permission-administration");
    expect(bootstrapScript).not.toContain("/protection");
    expect(bootstrapScript).toContain("existing.object.sha !== expectedDevSha");
    expect(bootstrapScript).toContain("dev.object.sha !== expectedDevSha");
    expect(bootstrap.jobs.preflight.if).toBe("github.ref == 'refs/heads/dev'");
    expect(bootstrap.jobs["create-branches"].if).toBe("github.ref == 'refs/heads/dev'");
    expect(bootstrap.jobs.configure.if).toBe("github.ref == 'refs/heads/dev'");
    expect(bootstrapWorkflow).toContain("ref: $" + "{{ needs.create-branches.outputs.dev_sha }}");
    expect(bootstrapWorkflow.indexOf("Bind checkout and remote lane")).toBeLessThan(
      bootstrapWorkflow.indexOf("uses: ./.github/actions/setup"),
    );
  });

  test("DES-2201 계약은 승인된 소스와 production 환경에서만 R2를 갱신한다", async () => {
    const contract = await workflow(".github/workflows/rootage-release-contract.yml");
    const publish = contract.jobs.publish;
    const controlCheckout = publish.steps?.find(
      (step) => step.name === "Checkout immutable trusted control plane",
    );
    const verify = publish.steps?.find(
      (step) => step.name === "Verify control commit belongs to trusted dev history",
    );
    const mutate = publish.steps?.find(
      (step) => step.name === "Publish, read back and verify Rootage",
    );
    const setupIndex = publish.steps?.findIndex((step) => step.uses === "./.github/actions/setup");
    expect(publish.environment).toBe("rootage-production");
    expect(controlCheckout?.with).toMatchObject({
      ref: ["$", "{{ inputs.control-sha }}"].join(""),
      "persist-credentials": false,
    });
    expect(verify?.run).toContain('git merge-base --is-ancestor "$ROOTAGE_CONTROL_SHA"');
    expect(publish.steps?.indexOf(verify ?? {})).toBeLessThan(setupIndex ?? -1);
    expect(
      publish.steps
        ?.filter((step) => step.uses?.startsWith("actions/checkout@"))
        .map((step) => step.with?.ref),
    ).not.toContain(["$", "{{ inputs.source-sha }}"].join(""));
    expect(mutate?.env?.ROOTAGE_SOURCE_SHA).toBe(["$", "{{ inputs.source-sha }}"].join(""));
    expect(mutate?.env?.ROOTAGE_R2_SECRET_ACCESS_KEY).toBe(
      ["$", "{{ secrets.ROOTAGE_R2_SECRET_ACCESS_KEY }}"].join(""),
    );
    expect(String(contract.on)).not.toContain("pull_request_target");
  });

  test("Rootage production 입력은 shell source에 직접 보간하지 않는다", async () => {
    const paths = [
      ".github/workflows/rootage-release-contract.yml",
      ".github/workflows/rootage-cdn-deploy.yml",
      ".github/workflows/rootage-cdn-operations.yml",
    ];
    const workflows = await Promise.all(paths.map(workflow));
    for (const candidate of workflows) {
      for (const job of Object.values(candidate.jobs)) {
        for (const step of job.steps ?? []) {
          expect(step.run ?? "").not.toContain("${{ inputs.");
        }
      }
    }
  });

  test("모든 Rootage production mutation은 같은 lock을 공유한다", async () => {
    const [contract, deploy, operations] = await Promise.all([
      workflow(".github/workflows/rootage-release-contract.yml"),
      workflow(".github/workflows/rootage-cdn-deploy.yml"),
      workflow(".github/workflows/rootage-cdn-operations.yml"),
    ]);

    expect(contract.concurrency?.group).toBe("rootage-cdn-production-mutation");
    expect(operations.concurrency?.group).toBe("rootage-cdn-production-mutation");
    expect(deploy.concurrency?.group).toBe(
      ["rootage-cdn-$", "{{ inputs.target }}-mutation"].join(""),
    );
    expect(operations.jobs.validate.environment).toBeUndefined();
    expect(operations.jobs.operate.needs).toBe("validate");
    expect(operations.jobs.operate.environment).toBe("rootage-production");
    const exactDispatchSha = ["$", "{{ github.sha }}"].join("");
    expect(
      operations.jobs.validate.steps?.find((step) => step.uses?.startsWith("actions/checkout@"))
        ?.with?.ref,
    ).toBe(exactDispatchSha);
    expect(
      operations.jobs.operate.steps?.find((step) => step.uses?.startsWith("actions/checkout@"))
        ?.with?.ref,
    ).toBe(exactDispatchSha);
  });

  test("Rootage production deploy는 고정 smoke 실패 시 자신이 만든 버전만 rollback한다", async () => {
    const deploy = await workflow(".github/workflows/rootage-cdn-deploy.yml");
    const steps = deploy.jobs.deploy.steps ?? [];
    const before = steps.find((step) => step.name === "Record exact production rollback target");
    const deployWorker = steps.find((step) => step.id === "deploy-worker");
    const deployed = steps.find((step) => step.name === "Record exact deployed production version");
    const smoke = steps.find((step) => step.id === "production-smoke");
    const rollback = steps.find(
      (step) => step.name === "Roll back only this job's production deployment",
    );
    const checkout = steps.find((step) => step.uses?.startsWith("actions/checkout@"));

    expect(deploy.jobs.deploy.environment).toBe(["rootage-$", "{{ inputs.target }}"].join(""));
    expect(deploy.jobs.deploy.if).toBe("github.ref == 'refs/heads/dev'");
    expect(checkout?.with?.ref).toBe(["$", "{{ github.sha }}"].join(""));
    expect(checkout?.with?.["persist-credentials"]).toBe(false);
    expect(before?.id).toBe("record-production-rollback-target");
    expect(before?.if).toBe("inputs.target == 'production'");
    expect(before?.run).toBe("bun tools/rootage-cdn/src/deployment-guard.ts before");
    expect(deployWorker?.run).toBe(
      'bunx wrangler deploy --config tools/rootage-cdn/wrangler.jsonc --env "$ROOTAGE_DEPLOY_TARGET"',
    );
    expect(deployWorker?.env?.WRANGLER_OUTPUT_FILE_PATH).toBe("/tmp/wrangler-rootage-deploy.jsonl");
    expect(deployed?.if).toBe("inputs.target == 'production'");
    expect(deployed?.run).toBe("bun tools/rootage-cdn/src/deployment-guard.ts after");
    expect(smoke?.if).toBe("inputs.target == 'production'");
    expect(smoke?.run).toBe("bun tools/rootage-cdn/src/verify-deployment.ts");
    expect(smoke?.env?.ROOTAGE_DEPLOY_STATE).toBe("/tmp/rootage-production-deploy-state.json");
    expect(rollback?.run).toBe("bun tools/rootage-cdn/src/deployment-guard.ts rollback-if-owned");
    expect(rollback?.if).toContain("failure()");
    expect(rollback?.if).toContain("steps.record-production-rollback-target.outcome == 'success'");
    expect(rollback?.if).not.toContain("steps.deploy-worker.outcome == 'success'");
    expect(rollback?.if).not.toContain("steps.record-production-deployment.outcome");
    expect(rollback?.if).not.toContain("steps.production-smoke.outcome");

    const wrangler = JSON.parse(await readFile("tools/rootage-cdn/wrangler.jsonc", "utf8")) as {
      env: Record<string, { version_metadata?: { binding?: string } }>;
    };
    expect(wrangler.env.preview?.version_metadata?.binding).toBe("CF_VERSION_METADATA");
    expect(wrangler.env.production?.version_metadata?.binding).toBe("CF_VERSION_METADATA");

    const help = Bun.spawn(["bunx", "wrangler", "rollback", "--help"], {
      env: {
        ...process.env,
        WRANGLER_LOG_PATH: "/tmp/wrangler-rootage-rollback-help.log",
      },
      stdout: "pipe",
      stderr: "pipe",
    });
    const [stdout, exitCode] = await Promise.all([new Response(help.stdout).text(), help.exited]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("wrangler rollback [version-id]");
    expect(stdout).toContain("--name");
    expect(stdout).toContain("--message");
    expect(stdout).toContain("--yes");
  });

  test("Rootage 계약 준비 상태는 activation workflow가 PR로 변경한다", async () => {
    const [source, activation] = await Promise.all([
      readFile(".github/workflows/release-activation.yml", "utf8"),
      workflow(".github/workflows/release-activation.yml"),
    ]);
    const options = (
      activation.on as {
        workflow_dispatch: { inputs: { operation: { options: string[] } } };
      }
    ).workflow_dispatch.inputs.operation.options;
    expect(options).toEqual([...activationOperations]);
    expect(source).toContain("bun tools/release-automation/bin/control.ts activation");
    expect(source).toContain("git add .github/release/lanes.json .github/release/control.json");
  });
});
