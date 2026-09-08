import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { parse } from "yaml";

const root = new URL("../", import.meta.url);
const adapterVersion = JSON.parse(readFileSync(new URL("docs/package.json", root), "utf8"))
  .devDependencies["@kaptures/storybook"];
const names = ["capture", "report", "approve", "retention"] as const;
const sources = Object.fromEntries(
  names.map((name) => [
    name,
    readFileSync(new URL(`.github/workflows/kapture-${name}.yml`, root), "utf8"),
  ]),
);
interface Step {
  id?: string;
  run?: string;
  uses?: string;
  env?: Record<string, string>;
  with: Record<string, string>;
}
interface Workflow {
  on: Record<string, { branches?: string[]; types?: string[]; workflows?: string[] }>;
  permissions: Record<string, string>;
  concurrency: { queue?: string; "cancel-in-progress": boolean };
  jobs: Record<string, { if: string; steps: Step[] }>;
}
const workflows = Object.fromEntries(names.map((name) => [name, parse(sources[name])])) as Record<
  string,
  Workflow
>;
const commands = (steps: Step[]) =>
  steps.flatMap((step) =>
    [...(step.run ?? "").matchAll(/github ([a-z-]+)/g)].map((match) => match[1]),
  );

describe("Kapture consumer workflows", () => {
  test("supports all release lanes without special stacked branches", () => {
    expect(workflows.capture.on.pull_request.branches).toEqual(["dev", "minor", "major"]);
    expect(sources.capture).toContain('--base-branch "$KAPTURE_BASE_BRANCH"');
    expect(sources.capture).toContain("dev|minor|major)");
    expect(workflows.capture.jobs.context.if).toContain("head.repo.full_name == github.repository");
  });

  test("compares original revisions without copying head instrumentation into base", () => {
    expect(sources.capture).not.toContain(".kapture/instrumentation");
    expect(sources.capture).not.toContain("perl -0pi");
    expect(sources.capture).not.toContain("bootstrap-skip");
    expect(sources.capture).toContain("--workers 4");
    expect(sources.capture).toContain("--max-changed-pixel-percentage 0.1");
    expect(workflows.capture.jobs["build-base"].steps[0].with.ref).toBe(
      "${{ needs.context.outputs.base-sha }}",
    );
  });

  test("restored builds are validated and republished as current-run artifacts", () => {
    const steps = workflows.capture.jobs["build-base"].steps;
    expect(steps.find((s) => s.id === "restore")?.with["run-id"]).toBe(
      "${{ steps.cache.outputs.run-id }}",
    );
    expect(steps.find((s) => s.id === "restored-build")?.run).toBe(
      "npx --yes @kaptures/cli@0.7.0 github validate-build --root . --directory docs/.kapture/storybook-static",
    );
    expect(steps.find((s) => s.id === "artifact")?.with["retention-days"]).toBe(1);
    expect(steps.filter((s) => s.with?.["retention-days"] === 7).length).toBe(1);
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

  test("removes the adoption-only preview job", () => {
    expect(workflows.capture.jobs.preview).toBeUndefined();
    expect(sources.capture).not.toContain("codex/kapture-shadow-experiment");
  });

  test("delegates production report trust and approval to the released CLI", () => {
    expect(workflows.report.on.workflow_run.workflows).toEqual(["Kapture Capture"]);
    expect(workflows.report.on.workflow_run.types).toEqual(["in_progress", "completed"]);
    expect(commands(workflows.report.jobs.publish.steps)).toEqual([
      "prepare-review",
      "publish-run",
    ]);
    expect(commands(workflows.report.jobs.finalize.steps)).toEqual(["finalize-run"]);
    expect(commands(workflows.approve.jobs.approve.steps)).toEqual(["approve"]);
    expect(workflows.report.jobs.finalize.if).toContain("always()");
    for (const name of ["report", "approve"]) {
      expect(sources[name]).not.toContain("actions/checkout");
      expect(workflows[name].concurrency).toEqual({
        group: "kapture-review-${{ github.repository }}",
        "cancel-in-progress": false,
        queue: "max",
      });
      expect(workflows[name].permissions).toEqual({});
    }
  });

  test("pins every CLI invocation to the installed adapter version", () => {
    expect(adapterVersion).toMatch(/^\d+\.\d+\.\d+$/);
    for (const name of names) {
      const versions = [...sources[name].matchAll(/@kaptures\/cli@([^\s]+)/g)];
      if (name !== "retention") expect(versions.length).toBeGreaterThan(0);
      for (const [, version] of versions) expect(version).toBe(adapterVersion);
    }
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

  test("cleanup shares the review lock and never checks out a PR head", () => {
    expect(workflows.retention.concurrency).toEqual(workflows.report.concurrency);
    const cleanup = workflows.retention.jobs.cleanup;
    expect(cleanup.steps[0].with.ref).toBe("$" + "{{ github.event.repository.default_branch }}");
    expect(cleanup.if).toContain("github.event.repository.default_branch");
    expect(workflows.retention.on.pull_request_target).toEqual({
      types: ["closed"],
      branches: ["dev", "minor", "major"],
    });
    expect(workflows.capture.on.pull_request.types).toEqual([
      "opened",
      "synchronize",
      "reopened",
      "edited",
    ]);
  });
});
