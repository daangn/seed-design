import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { parse } from "yaml";

const root = new URL("../", import.meta.url);
const adapterVersion = JSON.parse(readFileSync(new URL("docs/package.json", root), "utf8"))
  .devDependencies["@kaptures/storybook"];
const names = ["capture", "report", "approve"] as const;
const sources = Object.fromEntries(
  names.map((name) => [
    name,
    readFileSync(new URL(`.github/workflows/kapture-${name}.yml`, root), "utf8"),
  ]),
);
const workflows = Object.fromEntries(names.map((name) => [name, parse(sources[name])])) as Record<
  string,
  any
>;

describe("Kapture consumer workflows", () => {
  test("allows the adoption branch as an explicit stacked PR base", () => {
    expect(workflows.capture.on.pull_request.branches).toEqual([
      "dev",
      "codex/kapture-shadow-experiment",
    ]);
    expect(sources.capture).toContain('--base-branch "$KAPTURE_BASE_BRANCH"');
    expect(sources.capture).toContain("dev|codex/kapture-shadow-experiment)");
    expect(workflows.capture.jobs.context.if).toContain("head.repo.full_name == github.repository");
  });

  test("compares original revisions without copying head instrumentation into base", () => {
    expect(sources.capture).not.toContain(".kapture/instrumentation");
    expect(sources.capture).not.toContain("perl -0pi");
    expect(sources.capture).toContain("installed ? 'compare' : 'bootstrap-skip'");
    expect(sources.capture).toContain("--workers 4");
    expect(sources.capture).toContain("--max-changed-pixel-percentage 0.1");
    expect(workflows.capture.jobs["build-base"].steps[0].with.ref).toBe(
      "${{ needs.context.outputs.base-sha }}",
    );
  });

  test("does not hold a runner open for review", () => {
    for (const source of Object.values(sources)) {
      expect(source).not.toContain("setTimeout");
      expect(source).not.toContain("timeout-minutes: 25");
      expect(source).not.toContain("Timed out waiting");
    }
    expect(workflows.approve.on.issue_comment.types).toEqual(["created"]);
    expect(sources.approve).toContain("github approve");
  });

  test("keeps preview publication separate from the trusted approval gate", () => {
    const preview = workflows.capture.jobs.preview;
    expect(preview.if).toContain("base.ref == 'codex/kapture-shadow-experiment'");
    expect(preview.if).toContain("head.repo.full_name == github.repository");
    expect(sources.capture).toContain("Kapture Preview");
    expect(sources.capture).toContain("KAPTURE_UNSTABLE");
    expect(sources.capture).not.toContain("/kapture approve");
    expect(sources.capture).toContain("livePr.head.sha !== process.env.KAPTURE_HEAD_SHA");
    expect(sources.capture).toContain("comment.user?.login === 'github-actions[bot]'");
  });

  test("delegates production report trust and approval to the released CLI", () => {
    expect(workflows.report.on.workflow_run.workflows).toEqual(["Kapture Capture"]);
    expect(workflows.report.on.workflow_run.types).toEqual(["in_progress", "completed"]);
    for (const command of [
      "reconcile-run",
      "prepare-run",
      "prepare-storybook-run",
      "publish-run",
      "finalize-run",
    ]) {
      expect(sources.report).toContain(`github ${command}`);
    }
    expect(workflows.report.jobs.finalize.if).toContain("always()");
    for (const name of ["report", "approve"]) {
      expect(sources[name]).not.toContain("actions/checkout");
      expect(sources[name]).toContain('"Kapture Visual Review"');
      expect(workflows[name].permissions).toEqual({});
    }
  });

  test("pins every CLI invocation to the installed adapter version", () => {
    expect(adapterVersion).toMatch(/^\d+\.\d+\.\d+$/);
    for (const name of names) {
      const versions = [...sources[name].matchAll(/@kaptures\/cli@([^\s]+)/g)];
      expect(versions.length).toBeGreaterThan(0);
      for (const [, version] of versions) expect(version).toBe(adapterVersion);
    }
  });

  test("all inline shell and github-script blocks parse", () => {
    const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
    for (const workflow of Object.values(workflows)) {
      for (const job of Object.values(workflow.jobs) as any[]) {
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
});
