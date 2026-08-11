import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { parse } from "yaml";
import {
  assertProductionNotificationBinding,
  isExactCompletedProductionPublishReceipt,
  selectReleaseChangelogPaths,
} from "./release-notification";

interface WorkflowStep {
  "continue-on-error"?: boolean;
  env?: Record<string, string>;
  if?: string;
  name?: string;
  run?: string;
  uses?: string;
  with?: Record<string, unknown>;
  "working-directory"?: string;
}

interface WorkflowJob {
  if?: string;
  needs?: string | string[];
  outputs?: Record<string, string>;
  permissions?: Record<string, string>;
  secrets?: Record<string, string> | string;
  steps?: WorkflowStep[];
  uses?: string;
  with?: Record<string, unknown>;
}

interface Workflow {
  on?: Record<string, unknown>;
  permissions?: Record<string, string>;
  jobs: Record<string, WorkflowJob>;
}

async function workflow(path: string): Promise<Workflow> {
  return parse(await readFile(path, "utf8")) as Workflow;
}

const controlSha = "a".repeat(40);
const mergeSha = "b".repeat(40);

describe("release success notification binding", () => {
  test("production publish의 exact PR/merge/control만 승인한다", () => {
    expect(() =>
      assertProductionNotificationBinding({
        mode: "production",
        expectedControlSha: controlSha,
        actualControlSha: controlSha,
        expectedMergeSha: mergeSha,
        actualMergeSha: mergeSha,
        sourceHeadSha: mergeSha,
        expectedPullNumber: 1926,
        actualPullNumber: 1926,
      }),
    ).not.toThrow();
  });

  test("dry-run과 stale PR/merge/control 입력을 모두 거부한다", () => {
    const valid = {
      mode: "production" as const,
      expectedControlSha: controlSha,
      actualControlSha: controlSha,
      expectedMergeSha: mergeSha,
      actualMergeSha: mergeSha,
      sourceHeadSha: mergeSha,
      expectedPullNumber: 1926,
      actualPullNumber: 1926,
    };
    expect(() => assertProductionNotificationBinding({ ...valid, mode: "dry-run" })).toThrow(
      "dry-run",
    );
    expect(() =>
      assertProductionNotificationBinding({ ...valid, actualControlSha: "c".repeat(40) }),
    ).toThrow("exact authorized");
    expect(() =>
      assertProductionNotificationBinding({ ...valid, actualMergeSha: "c".repeat(40) }),
    ).toThrow("exact authorized");
    expect(() =>
      assertProductionNotificationBinding({ ...valid, sourceHeadSha: "c".repeat(40) }),
    ).toThrow("exact authorized");
    expect(() => assertProductionNotificationBinding({ ...valid, actualPullNumber: 1927 })).toThrow(
      "exact authorized",
    );
  });

  test("승인 package와 실제 PR diff가 함께 가리키는 changelog만 data로 선택한다", () => {
    expect(
      selectReleaseChangelogPaths(
        ["packages/alpha/package.json", "packages/beta/package.json"],
        [
          { filename: "packages/alpha/package.json" },
          { filename: "packages/alpha/CHANGELOG.md" },
          { filename: "packages/beta/package.json" },
          { filename: "docs/CHANGELOG.md" },
        ],
      ),
    ).toEqual(["packages/alpha/CHANGELOG.md"]);
    expect(() =>
      selectReleaseChangelogPaths(
        ["packages/alpha/package.json"],
        [{ filename: "docs/CHANGELOG.md" }],
      ),
    ).toThrow("결속된 CHANGELOG.md");
  });

  test("production durable status를 exact completed publish run의 성공 record job에 결속한다", () => {
    const repository = "daangn/seed-design";
    const runId = 123;
    const status = {
      id: 1,
      context: "seed-release/publish",
      state: "success",
      description: `seed-release-publish:${mergeSha}:production`,
      target_url: `https://github.com/${repository}/actions/runs/${runId}`,
      creator: { login: "github-actions[bot]" },
    };
    const run = {
      id: runId,
      name: "Release publish",
      path: ".github/workflows/release-publish.yml",
      event: "workflow_dispatch",
      status: "completed",
      conclusion: "success",
      head_branch: "dev",
      repository: { full_name: repository },
    };
    const jobs = [
      {
        id: 456,
        run_id: runId,
        name: `Record successful queue item ${mergeSha}`,
        status: "completed",
        conclusion: "success",
      },
    ];
    expect(
      isExactCompletedProductionPublishReceipt(status, run, jobs, repository, mergeSha, runId),
    ).toBe(true);
    expect(
      isExactCompletedProductionPublishReceipt(
        status,
        { ...run, status: "in_progress", conclusion: null },
        jobs,
        repository,
        mergeSha,
        runId,
      ),
    ).toBe(false);
    expect(
      isExactCompletedProductionPublishReceipt(
        { ...status, description: `seed-release-publish:${mergeSha}:dry-run` },
        run,
        jobs,
        repository,
        mergeSha,
        runId,
      ),
    ).toBe(false);
    expect(
      isExactCompletedProductionPublishReceipt(status, run, jobs, repository, mergeSha, runId + 1),
    ).toBe(false);
    expect(
      isExactCompletedProductionPublishReceipt(
        status,
        run,
        [{ ...jobs[0], conclusion: "failure" }],
        repository,
        mergeSha,
        runId,
      ),
    ).toBe(false);
  });
});

describe("release success notification workflow", () => {
  test("PR title trigger 대신 durable production record 뒤 격리 dispatch로만 호출된다", async () => {
    const [notification, publish, notificationSource] = await Promise.all([
      workflow(".github/workflows/release-notification.yml"),
      workflow(".github/workflows/release-publish.yml"),
      readFile(".github/workflows/release-notification.yml", "utf8"),
    ]);
    expect(notification.on).toEqual({
      workflow_dispatch: {
        inputs: {
          "pr-number": {
            description: "Exact authorized Version Packages PR number",
            required: true,
            type: "string",
          },
          "merge-sha": {
            description: "Exact successfully published merge SHA",
            required: true,
            type: "string",
          },
          "control-sha": {
            description: "Immutable trusted dev control SHA",
            required: true,
            type: "string",
          },
          "publish-run-id": {
            description: "Release publish run that wrote the durable production record",
            required: true,
            type: "string",
          },
        },
      },
    });
    expect(notificationSource).not.toContain("pull_request:");
    expect(notificationSource).not.toContain("release: version packages");

    expect(publish.jobs["notify-success"]).toBeUndefined();
    const recordSteps = publish.jobs.record.steps ?? [];
    const checkpointIndex = recordSteps.findIndex(
      (step) => step.name === "Persist durable publish checkpoint",
    );
    const dispatch = recordSteps.find(
      (step) => step.name === "Dispatch isolated production success notification",
    );
    const dispatchIndex = recordSteps.indexOf(dispatch ?? {});
    expect(dispatchIndex).toBeGreaterThan(checkpointIndex);
    expect(dispatch?.if).toBe("needs.authorize.outputs.mode == 'production'");
    expect(dispatch?.["continue-on-error"]).toBe(true);
    expect(dispatch?.env).toMatchObject({
      RELEASE_NOTIFICATION_PR_NUMBER: ["$", "{{ needs.authorize.outputs.number }}"].join(""),
      RELEASE_NOTIFICATION_MERGE_SHA: ["$", "{{ needs.authorize.outputs.merge-sha }}"].join(""),
      RELEASE_NOTIFICATION_CONTROL_SHA: ["$", "{{ needs.authorize.outputs.control-sha }}"].join(""),
      RELEASE_NOTIFICATION_PUBLISH_RUN_ID: ["$", "{{ github.run_id }}"].join(""),
    });
    expect(dispatch?.run).toContain("gh workflow run release-notification.yml --ref dev");
    expect(dispatch?.run).toContain('-f pr-number="$RELEASE_NOTIFICATION_PR_NUMBER"');
    expect(dispatch?.run).toContain('-f merge-sha="$RELEASE_NOTIFICATION_MERGE_SHA"');
    expect(dispatch?.run).toContain('-f control-sha="$RELEASE_NOTIFICATION_CONTROL_SHA"');
    expect(dispatch?.run).toContain('-f publish-run-id="$RELEASE_NOTIFICATION_PUBLISH_RUN_ID"');
  });

  test("trusted control만 payload를 만들고 Slack secret job은 repository code를 실행하지 않는다", async () => {
    const notification = await workflow(".github/workflows/release-notification.yml");
    const prepare = notification.jobs.prepare;
    const send = notification.jobs.send;
    const prepareSteps = prepare.steps ?? [];
    const checkouts = prepareSteps.filter((step) => step.uses === "actions/checkout@v6");

    expect(notification.permissions).toEqual({});
    expect(prepare.if).toContain("github.ref == 'refs/heads/dev'");
    expect(prepare.if).toContain("github.actor == 'github-actions[bot]'");
    expect(prepare.if).toContain("github.triggering_actor == github.actor");
    expect(prepare.permissions).toEqual({
      actions: "read",
      contents: "read",
      "pull-requests": "read",
      statuses: "read",
    });
    expect(checkouts.map((step) => step.with)).toEqual([
      {
        ref: ["$", "{{ inputs.control-sha }}"].join(""),
        path: "control",
        "fetch-depth": 0,
        "persist-credentials": false,
      },
      {
        ref: ["$", "{{ inputs.merge-sha }}"].join(""),
        path: "source",
        "fetch-depth": 0,
        "persist-credentials": false,
      },
    ]);
    const authorize = prepareSteps.find(
      (step) => step.name === "Reauthorize exact production publish and select changelogs",
    );
    const payload = prepareSteps.find(
      (step) => step.name === "Build Slack payload with trusted control code",
    );
    expect(authorize?.["working-directory"]).toBe("control");
    expect(authorize?.run).toBe("bun tools/release-automation/src/publish/release-notification.ts");
    expect(authorize?.env).toMatchObject({
      RELEASE_NOTIFICATION_PR_NUMBER: ["$", "{{ inputs.pr-number }}"].join(""),
      RELEASE_NOTIFICATION_MERGE_SHA: ["$", "{{ inputs.merge-sha }}"].join(""),
      RELEASE_NOTIFICATION_CONTROL_SHA: ["$", "{{ inputs.control-sha }}"].join(""),
      RELEASE_NOTIFICATION_PUBLISH_RUN_ID: ["$", "{{ inputs.publish-run-id }}"].join(""),
    });
    expect(payload?.["working-directory"]).toBe("source");
    expect(payload?.run).toBe("node ../control/.github/scripts/notify-release.js");
    expect(JSON.stringify(prepare)).not.toContain("SLACK_BOT_TOKEN");
    expect(JSON.stringify(prepare)).not.toContain("SLACK_FRONTEND_CHANNEL_ID");
    expect(JSON.stringify(prepare)).not.toContain("actions/cache");
    expect(JSON.stringify(prepare)).not.toContain("./.github/actions/setup");

    expect(send.needs).toBe("prepare");
    expect(send.permissions).toEqual({});
    expect(send.steps).toHaveLength(1);
    expect(send.steps?.[0]?.uses).toMatch(/^slackapi\/slack-github-action@[0-9a-f]{40}$/);
    expect(send.steps?.[0]?.run).toBeUndefined();
    expect(send.steps?.[0]?.["working-directory"]).toBeUndefined();
  });

  test("notification helper는 strict Version identity와 production control을 재검증한다", async () => {
    const helper = await readFile(
      "tools/release-automation/src/publish/release-notification.ts",
      "utf8",
    );
    expect(helper).toContain("verifyPublishPullForAuthorization({");
    expect(helper).toContain("authorizePublish(");
    expect(helper).toContain("assertProductionNotificationBinding({");
    expect(helper).toContain("waitForCompletedProductionPublishReceipt(");
    expect(helper).toContain("isExactCompletedProductionPublishReceipt(");
    expect(helper).toContain("isPublishStatusBoundToRun(");
    expect(helper).toContain("assertCompletePullFileList(");
    expect(helper).toContain("selectReleaseChangelogPaths(packageManifestPaths, pullFiles)");
  });
});
