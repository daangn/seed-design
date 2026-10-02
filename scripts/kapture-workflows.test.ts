// biome-ignore-all lint/suspicious/noTemplateCurlyInString: GitHub Actions 표현식의 원문을 검사한다.
import { describe, expect, test } from "bun:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { parse } from "yaml";

const root = new URL("../", import.meta.url);
const adapterVersion = JSON.parse(readFileSync(new URL("docs/package.json", root), "utf8"))
  .devDependencies["@kaptures/storybook"];
const names = ["capture", "report", "publish", "approve"] as const;
const sources = Object.fromEntries(
  names.map((name) => [
    name,
    readFileSync(new URL(`.github/workflows/kapture-${name}.yml`, root), "utf8"),
  ]),
);
interface Step {
  if?: string | boolean;
  id?: string;
  run?: string;
  uses?: string;
  env?: Record<string, string>;
  with: Record<string, string>;
}
interface Workflow {
  name: string;
  on: Record<string, { branches?: string[]; types?: string[]; workflows?: string[] }>;
  permissions: Record<string, string>;
  concurrency?: { group: string; queue?: string; "cancel-in-progress": boolean };
  jobs: Record<
    string,
    {
      if: string;
      steps?: Step[];
      permissions?: Record<string, string>;
      concurrency?: NonNullable<Workflow["concurrency"]>;
      needs?: string;
      uses?: string;
      with?: Record<string, string>;
      secrets?: Record<string, string>;
      env?: Record<string, string>;
    }
  >;
}
const workflows = Object.fromEntries(names.map((name) => [name, parse(sources[name])])) as Record<
  string,
  Workflow
>;
function executionSteps(job: Workflow["jobs"][string]): Step[] {
  assert(job.steps, "Expected execution job steps");
  return job.steps;
}
const commands = (steps: Step[]) =>
  steps.flatMap((step) =>
    [...commandText(step).matchAll(/github ([a-z-]+)/g)].map((match) => match[1]),
  );

// Match command structure, not a particular release or YAML line wrapping.
const commandText = (step?: Step) =>
  (step?.run ?? "")
    .replace(/\\\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
function assertCliRuntimes(steps: Step[]) {
  const cliSteps = steps.filter((step) => /@kaptures\/cli(?:@|\s)/.test(step.run ?? ""));
  for (const cli of cliSteps) {
    expect(commandText(cli)).toMatch(
      /\bnpx\s+--yes\s+--registry=https:\/\/registry\.npmjs\.org\/\s+--@kaptures:registry=https:\/\/registry\.npmjs\.org\/\s+"?@kaptures\/cli@/,
    );
    const preceding = steps.slice(0, steps.indexOf(cli));
    const setup = preceding.find((step) => step.uses?.startsWith("actions/setup-node@"));
    expect(setup).toBeDefined();
    expect(setup?.if === undefined || setup.if === true || setup.if === cli.if).toBe(true);
    expect(setup?.with?.["node-version"]).toBe("24");
  }
  return cliSteps.length;
}

describe("Kapture consumer workflows", () => {
  test("metadata edits cannot cancel capture or start a report without artifacts", () => {
    expect(workflows.capture.on.pull_request.types).toEqual(["opened", "synchronize", "reopened"]);
    expect(workflows.capture.jobs.context.if).toBe(
      "github.event.pull_request.head.repo.full_name == github.repository",
    );
    expect(workflows.capture.concurrency?.["cancel-in-progress"]).toBe(true);
  });
  test("uses Node 24 and npx for CLI calls and Bun only for repository work", () => {
    let checked = 0;
    for (const workflow of Object.values(workflows)) {
      for (const job of Object.values(workflow.jobs)) {
        checked += assertCliRuntimes(job.steps ?? []);
      }
    }
    expect(checked).toBeGreaterThan(0);
    for (const [name, job] of Object.entries(workflows.capture.jobs)) {
      const usesBun = (job.steps ?? []).some((step) => step.uses?.startsWith("oven-sh/setup-bun@"));
      expect(usesBun).toBe(["workflow-tests", "build-base", "build-head"].includes(name));
    }
    for (const name of ["report", "publish", "approve"]) {
      expect(sources[name]).not.toContain("oven-sh/setup-bun@");
    }
  });
  test("enables released capture-cache integration while preserving optional fallback", () => {
    const capture = parse(sources.capture);
    expect(capture.env.KAPTURE_CAPTURE_CACHE).toBe("true");
    const restore = capture.jobs.capture.steps.find(
      (step: { id?: string }) => step.id === "capture-cache",
    );
    expect(restore.if).toBe("env.KAPTURE_CAPTURE_CACHE == 'true'");
    expect(restore["continue-on-error"]).toBe(true);
    expect(restore.run).toContain("github restore-capture");
    expect(capture.jobs.capture.permissions.actions).toBe("read");
  });
  test.each([
    ["false", "/base-cache", "/head-cache", false],
    ["true", "", "/head-cache", false],
    ["true", "/base-cache", "", false],
    ["true", "/base cache", "/head cache", true],
  ])("capture cache arguments are optional and preserve paths (%s, %s, %s)", (enabled, base, head, included) => {
    const step = executionSteps(workflows.capture.jobs.capture).find(
      (step) => step.id === "capture",
    );
    assert(step?.run);
    const result = spawnSync(
      "bash",
      [
        "-c",
        `npx() { printf '%s\\n' "$@"; }\n${step.run.replace(/\$\{\{[\s\S]*?\}\}/g, "fixture")}`,
      ],
      {
        env: {
          ...process.env,
          KAPTURE_CAPTURE_CACHE: enabled,
          KAPTURE_CACHE_DIRECTORY: base,
          KAPTURE_HEAD_CACHE_DIRECTORY: head,
        },
        encoding: "utf8",
      },
    );
    expect(result.status).toBe(0);
    const args = result.stdout.trim().split("\n");
    expect(args).toContain("test");
    for (const [option, path] of [
      ["--capture-cache-dir", base],
      ["--capture-cache-output", head],
    ]) {
      expect(args.includes(option)).toBe(included);
      if (included) expect(args[args.indexOf(option) + 1]).toBe(path);
    }
  });
  test("supports all release lanes without special stacked branches", () => {
    expect(new Set(workflows.capture.on.pull_request.branches)).toEqual(
      new Set(["dev", "minor", "major"]),
    );
    expect(sources.capture).toContain('--base-branch "$KAPTURE_BASE_BRANCH"');
    expect(workflows.capture.jobs.context.if).toContain("head.repo.full_name == github.repository");
  });

  test("runs consumer contracts in CI and leaves storage policy in YAML", () => {
    const tests = workflows.capture.jobs["workflow-tests"];
    expect(
      executionSteps(tests).some((step) =>
        step.run?.includes("bun test scripts/kapture-workflows.test.ts"),
      ),
    ).toBe(true);
    expect(sources.capture).toContain("scripts/kapture-*.test.ts");
    const yaml = parse(sources.capture);
    const uploads = [yaml.jobs["build-base"], yaml.jobs.capture]
      .flatMap((job) => job.steps)
      .filter((step) => step.name?.startsWith("Retain"));
    expect(uploads).toHaveLength(2);
    for (const step of uploads)
      expect(step.with["retention-days"]).toBe("${{ env.KAPTURE_CACHE_RETENTION_DAYS }}");
  });

  test("builds the exact base revision selected by the PR context", () => {
    expect(
      executionSteps(workflows.capture.jobs["build-base"]).find((step) =>
        step.uses?.startsWith("actions/checkout@"),
      )?.with.ref,
    ).toBe("${{ needs.context.outputs.base-sha }}");
  });

  test("delegates build restoration and safely falls back to exact-base builds", () => {
    const capture = parse(sources.capture);
    const job = capture.jobs["build-base"];
    const steps: Step[] = executionSteps(job);
    const restore = job.steps.find((step: Step) => step.id === "cache");
    expect(commandText(restore)).toContain("github restore-build");
    expect(restore["continue-on-error"]).toBe(true);
    expect(restore.env.GITHUB_TOKEN).toBe("${{ github.token }}");
    expect(job.permissions).toEqual({ contents: "read", actions: "read", "pull-requests": "read" });
    expect(steps.filter((step) => step.uses?.startsWith("actions/checkout@"))).toHaveLength(1);
    expect(steps.some((step) => step.uses?.startsWith("actions/download-artifact@"))).toBe(false);
    expect(sources.capture).not.toContain("_kapture-policy");
    expect(sources.capture).not.toContain("kapture-build-cache.mjs");
    for (const name of [
      "Install project dependencies",
      "Build Storybook",
      "Validate build boundary",
    ]) {
      expect(job.steps.find((step: { name?: string }) => step.name === name).if).toBe(
        "steps.cache.outputs.cache-directory == ''",
      );
    }
    const artifact = steps.find((step) => step.id === "artifact");
    assert(artifact);
    expect(artifact.if).toBeUndefined();
    expect(artifact.with.path).toBe(
      "${{ steps.cache.outputs.cache-directory || 'docs/.kapture/storybook-static' }}",
    );
    expect(Number(artifact.with["retention-days"])).toBeGreaterThan(0);
    const retained = job.steps.find(
      (step: { name?: string }) => step.name === "Retain reusable base build",
    );
    expect(retained.if).toBe(
      "steps.cache.outputs.cache-name != '' && steps.cache.outputs.cache-directory == ''",
    );
    expect(retained["continue-on-error"]).toBe(true);
  });

  test("initial adoption captures only head and retains artifacts without publishing", () => {
    expect(
      commandText(
        executionSteps(workflows.capture.jobs.context).find((step) => step.id === "context"),
      ),
    ).toContain("--allow-initial-adoption");
    expect(workflows.capture.jobs["build-base"].if).toBe(
      "needs.context.outputs.integration-mode == 'compare'",
    );
    expect(workflows.capture.jobs["build-head"].if).toContain(
      "integration-mode == 'initial-adoption'",
    );
    const setup = workflows.capture.jobs["setup-capture"];
    expect(setup.if).toBe("needs.context.outputs.integration-mode == 'initial-adoption'");
    const capture = executionSteps(setup).find((step) => step.id === "capture");
    expect(commandText(capture)).toContain("setup capture");
    expect(capture?.run).not.toContain("--base-dir");
    const artifact = executionSteps(setup).find((step) => step.id === "artifact");
    expect(artifact?.with.path).toContain("setup.json");
    expect(artifact?.with.path).toContain("images/*.png");
    expect(Number(artifact?.with["retention-days"])).toBeGreaterThan(0);
    expect(executionSteps(setup).some((step) => step.run?.includes("GITHUB_STEP_SUMMARY"))).toBe(
      true,
    );
    expect(
      executionSteps(setup).some((step) => commandText(step) === "exit 1" && Boolean(step.if)),
    ).toBe(true);
    expect(JSON.stringify(setup)).not.toMatch(/wrangler|publish-setup|publish-run|statuses: write/);
    for (const job of ["publish", "finalize"]) {
      expect(workflows.publish.jobs[job].permissions?.contents).toBe("read");
      expect(
        executionSteps(workflows.publish.jobs[job]).some(
          (step) =>
            commandText(step).includes("--allow-initial-adoption") &&
            commandText(step).includes("--adapter-package-json"),
        ),
      ).toBe(true);
    }
  });

  test("keeps compatible adapter upgrades in normal comparison without skip opt-in", () => {
    const handlers = [
      executionSteps(workflows.capture.jobs.context).find((step) => step.id === "context"),
      executionSteps(workflows.publish.jobs.publish).find((step) => step.id === "review"),
      executionSteps(workflows.publish.jobs.finalize).find((step) =>
        commandText(step).includes("github finalize-run"),
      ),
    ];
    for (const handler of handlers) {
      const args = commandText(handler).split(" ");
      expect(args.filter((arg) => arg === "--allow-adapter-upgrade")).toEqual([]);
      expect(args[args.indexOf("--adapter-package-json") + 1]).toBe("docs/package.json");
    }
    for (const name of ["build-base", "capture"]) {
      expect(workflows.capture.jobs[name].if).toBe(
        "needs.context.outputs.integration-mode == 'compare'",
      );
    }
    expect(workflows.capture.jobs["build-head"].if).toBe(
      "needs.context.outputs.integration-mode == 'compare' || needs.context.outputs.integration-mode == 'initial-adoption'",
    );
    expect(workflows.capture.jobs["setup-capture"].if).toBe(
      "needs.context.outputs.integration-mode == 'initial-adoption'",
    );
    for (const id of ["upload-limits", "deploy", "dashboard"]) {
      expect(
        executionSteps(workflows.publish.jobs.publish).find((step) => step.id === id)?.if,
      ).toBe("steps.review.outputs.ready == 'true'");
    }
  });

  test("delegates production report trust and approval to the released CLI", () => {
    expect(workflows.report.on.workflow_run.workflows).toContain(workflows.capture.name);
    expect(new Set(workflows.report.on.workflow_run.types)).toEqual(
      new Set(["in_progress", "completed"]),
    );
    expect(commands(executionSteps(workflows.publish.jobs.publish))).toEqual([
      "prepare-review",
      "publish-run",
    ]);
    expect(commands(executionSteps(workflows.publish.jobs.finalize))).toEqual(["finalize-run"]);
    expect(commands(executionSteps(workflows.approve.jobs.approve))).toEqual(["approve"]);
    expect(workflows.publish.jobs.finalize.if).toContain("always()");
    expect(commands(executionSteps(workflows.report.jobs.context))).toEqual(["review-context"]);
    for (const name of ["report", "publish", "approve"]) {
      expect(sources[name]).not.toContain("actions/checkout");
      expect(workflows[name].concurrency).toBeUndefined();
      expect(workflows[name].permissions).toEqual({});
    }
  });

  test("holds one verified PR queue across publication, finalization and approval", () => {
    const review = workflows.report.jobs.review;
    expect(review.needs).toBe("context");
    expect(review.if).toBe("needs.context.outputs.ready == 'true'");
    expect(review.uses).toBe("./.github/workflows/kapture-publish.yml");
    expect(review.with).toEqual({
      "pr-number": "${{ needs.context.outputs.pr-number }}",
      "base-branch": "${{ needs.context.outputs.base-branch }}",
    });
    expect(review.secrets).toEqual({
      CF_API_TOKEN: "${{ secrets.CF_API_TOKEN }}",
      CF_ACCOUNT_ID: "${{ secrets.CF_ACCOUNT_ID }}",
    });
    expect(Object.keys(workflows.publish.on)).toEqual(["workflow_call"]);
    expect(workflows.publish.jobs.finalize.needs).toBe("publish");
    expect(review.concurrency?.group).toBe(
      "kapture-review-${{ github.repository }}-pr-${{ needs.context.outputs.pr-number }}",
    );
    expect(workflows.approve.jobs.approve.concurrency?.group).toBe(
      "kapture-review-${{ github.repository }}-pr-${{ github.event.issue.number }}",
    );
    for (const job of [review, workflows.approve.jobs.approve]) {
      expect(job.concurrency?.["cancel-in-progress"]).toBe(false);
      expect(job.concurrency?.queue).toBe("max");
    }
    expect(workflows.publish.jobs.publish.concurrency).toBeUndefined();
    expect(workflows.publish.jobs.finalize.concurrency).toBeUndefined();
    for (const job of [workflows.publish.jobs.publish, workflows.publish.jobs.finalize]) {
      expect(job.env?.KAPTURE_PR_NUMBER).toBe("${{ inputs.pr-number }}");
      expect(job.env?.KAPTURE_BASE_BRANCH).toBe("${{ inputs.base-branch }}");
      const handler = executionSteps(job).find((step) =>
        /github (?:prepare-review|finalize-run)/.test(commandText(step)),
      );
      const args = commandText(handler).split(" ");
      expect(args[args.indexOf("--expected-pr-number") + 1]).toBe('"$KAPTURE_PR_NUMBER"');
    }
    expect(workflows.report.jobs.context.permissions).toEqual({
      actions: "read",
      contents: "read",
      "pull-requests": "read",
    });
    const context = executionSteps(workflows.report.jobs.context).find(
      (step) => step.id === "context",
    );
    expect(JSON.parse(context?.env?.KAPTURE_BASE_BRANCHES ?? "")).toEqual(
      workflows.capture.on.pull_request.branches,
    );
  });

  test("grants PR comment writes only to trusted publish and approval jobs", () => {
    expect(workflows.publish.jobs.publish.permissions).toEqual({
      actions: "read",
      contents: "read",
      issues: "write",
      "pull-requests": "write",
      statuses: "write",
    });
    expect(workflows.approve.jobs.approve.permissions).toEqual({
      actions: "read",
      issues: "write",
      "pull-requests": "write",
      statuses: "write",
    });
    expect(workflows.publish.jobs.finalize.permissions).toEqual({
      actions: "read",
      contents: "read",
      "pull-requests": "read",
      statuses: "write",
    });
    for (const permissions of [
      workflows.capture.permissions,
      ...Object.values(workflows.capture.jobs).map((job) => job.permissions ?? {}),
    ]) {
      expect(Object.values(permissions).every((level) => level === "read")).toBe(true);
    }
  });

  test("pins every CLI invocation to the installed adapter version", () => {
    expect(adapterVersion).toMatch(/^\d+\.\d+\.\d+$/);
    for (const name of names) {
      expect(parse(sources[name]).env.KAPTURE_CLI_VERSION).toBe(adapterVersion);
      const versions = [...sources[name].matchAll(/@kaptures\/cli@([^\s]+)/g)];
      expect(versions.length).toBeGreaterThan(0);
      for (const [, version] of versions) expect(version).toBe('$KAPTURE_CLI_VERSION"');
    }
  });

  test("fails download digest mismatches through the pinned Node 24 action", () => {
    const downloads = Object.values(workflows.capture.jobs)
      .flatMap((job) => job.steps ?? [])
      .filter((step) => step.uses?.startsWith("actions/download-artifact@"));
    expect(downloads.length).toBeGreaterThan(0);
    for (const step of downloads) {
      expect(step.uses).toBe("actions/download-artifact@3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c");
    }
  });

  test("keeps execution diagnostics out of visual approval evidence and uploads only exported caches", () => {
    const steps = executionSteps(workflows.capture.jobs.capture);
    const diagnostics = steps.find(
      (step) =>
        step.with?.name === "kapture-execution-${{ needs.context.outputs.artifact-suffix }}",
    );
    expect(diagnostics?.with.path).toBe("${{ runner.temp }}/kapture-result/execution.json");
    const report = steps.find((step) => step.id === "report-artifact");
    expect(report?.with.path).not.toContain("execution.json");
    const cache = steps.find(
      (step) => step.with?.name === "${{ steps.capture-cache.outputs.head-cache-name }}",
    );
    expect(cache?.if).toBe(
      "env.KAPTURE_CAPTURE_CACHE == 'true' && steps.capture.outputs.capture-cache-exported == 'true' && steps.capture-cache.outputs.head-cache-name != ''",
    );
  });

  test("all inline shell and github-script blocks parse", () => {
    const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
    for (const workflow of Object.values(workflows)) {
      for (const job of Object.values(workflow.jobs)) {
        for (const step of job.steps ?? []) {
          if (step.run) {
            const result = spawnSync("bash", ["-n"], {
              input: step.run.replace(/\$\{\{[\s\S]*?\}\}/g, "placeholder"),
              encoding: "utf8",
            });
            expect({ status: result.status, stderr: result.stderr }).toEqual({
              status: 0,
              stderr: "",
            });
          }
          if (step.uses?.startsWith("actions/github-script")) {
            expect(
              () => new AsyncFunction("github", "context", "core", "require", step.with.script),
            ).not.toThrow();
          }
        }
      }
    }
  });

  test("does not run privileged PR-target or scheduled jobs", () => {
    for (const workflow of Object.values(workflows)) {
      expect(workflow.on.schedule).toBeUndefined();
      expect(workflow.on.pull_request_target).toBeUndefined();
    }
  });

  test("checks final Pages output before deployment without checkout", () => {
    const steps = executionSteps(workflows.publish.jobs.publish);
    const check = steps.findIndex((step) => step.id === "upload-limits");
    expect(check).toBeGreaterThan(steps.findIndex((step) => step.id === "review"));
    expect(check).toBeLessThan(steps.findIndex((step) => step.id === "deploy"));
    expect(steps[check].env?.KAPTURE_REPORT_DIRECTORY).toBe("${{ runner.temp }}/kapture-review");
  });

  test("Pages preflight accepts boundaries and rejects overflow, empty output and symlinks", async () => {
    const preflight = executionSteps(workflows.publish.jobs.publish).find(
      (step) => step.id === "upload-limits",
    );
    assert(preflight);
    const script = preflight.with.script;
    const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
    const run = new AsyncFunction("require", "core", "process", script);
    async function check(count: number, size: number, symlink = false) {
      let summaries = 0;
      const summary = {
        addHeading: () => summary,
        addTable: () => summary,
        write: async () => {
          summaries++;
        },
      };
      await run(
        (name: string) =>
          name === "node:path"
            ? { join: (a: string, b: string) => `${a}/${b}` }
            : {
                readdir: async () => Array.from({ length: count }, (_, i) => `${i}.png`),
                lstat: async (path: string) => ({
                  size,
                  isSymbolicLink: () => symlink,
                  isDirectory: () => path === "/report",
                  isFile: () => path !== "/report",
                }),
              },
        { summary },
        { env: { KAPTURE_REPORT_DIRECTORY: "/report" } },
      );
      expect(summaries).toBe(1);
    }
    await check(20000, 1);
    await check(1, 25 * 1024 * 1024);
    await expect(check(20001, 1)).rejects.toThrow("exceeds limits");
    await expect(check(1, 25 * 1024 * 1024 + 1)).rejects.toThrow("exceeds limits");
    await expect(check(0, 0)).rejects.toThrow("empty");
    await expect(check(1, 1, true)).rejects.toThrow("Symlinks");
  });
});
