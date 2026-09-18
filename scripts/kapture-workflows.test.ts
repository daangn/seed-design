import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
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
  jobs: Record<string, { if: string; steps: Step[]; permissions?: Record<string, string> }>;
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
  test("prepares Bun once before CLI calls while retaining Node 24", () => {
    for (const workflow of Object.values(workflows)) {
      for (const job of Object.values(workflow.jobs)) {
        const firstCli = job.steps.findIndex((step) => step.run?.includes("bunx @kaptures/cli"));
        if (firstCli < 0) continue;
        const bunSteps = job.steps.filter((step) => step.uses?.startsWith("oven-sh/setup-bun@"));
        expect(bunSteps).toHaveLength(1);
        expect(bunSteps[0]).not.toHaveProperty("if");
        expect(job.steps.indexOf(bunSteps[0])).toBeLessThan(firstCli);
        expect(
          job.steps.find((step) => step.uses?.startsWith("actions/setup-node@"))?.with["node-version"],
        ).toBe("24");
        for (const step of job.steps) {
          expect(step.run ?? "").not.toContain("npx ");
          expect(step.run ?? "").not.toContain("bunx --bun");
        }
      }
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
    expect(sources.capture).toContain("cache_args=()");
    expect(sources.capture).toContain("--capture-cache-output");
  });
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
      "bunx @kaptures/cli@0.9.0 github validate-build --root . --directory docs/.kapture/storybook-static",
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

  test("initial adoption captures only head and retains artifacts without publishing", () => {
    expect(sources.capture).toContain(
      "--allow-initial-adoption --adapter-package-json docs/package.json",
    );
    expect(workflows.capture.jobs["build-base"].if).toBe(
      "needs.context.outputs.integration-mode == 'compare'",
    );
    expect(workflows.capture.jobs["build-head"].if).toContain(
      "integration-mode == 'initial-adoption'",
    );
    const setup = workflows.capture.jobs["setup-capture"];
    expect(setup.if).toBe("needs.context.outputs.integration-mode == 'initial-adoption'");
    const capture = setup.steps.find((step) => step.id === "capture");
    expect(capture?.run).toContain("setup capture");
    expect(capture?.run).toContain("--locale ko-KR --timezone Asia/Seoul");
    expect(capture?.run).not.toContain("--base-dir");
    const artifact = setup.steps.find((step) => step.id === "artifact");
    expect(artifact?.with.path).toContain("setup.json");
    expect(artifact?.with.path).toContain("images/*.png");
    expect(artifact?.with["retention-days"]).toBe(1);
    expect(setup.steps.some((step) => step.run?.includes("GITHUB_STEP_SUMMARY"))).toBe(true);
    expect(setup.steps.at(-1)?.run).toBe("exit 1");
    expect(JSON.stringify(setup)).not.toMatch(/wrangler|publish-setup|publish-run|statuses: write/);
    for (const job of ["publish", "finalize"]) {
      expect(workflows.report.jobs[job].permissions?.contents).toBe("read");
      expect(
        workflows.report.jobs[job].steps.some((step) =>
          step.run?.includes("--allow-initial-adoption --adapter-package-json docs/package.json"),
        ),
      ).toBe(true);
    }
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
      expect(versions.length).toBeGreaterThan(0);
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

  test("does not schedule cleanup or promise automatic preview deletion", () => {
    expect(existsSync(new URL(".github/workflows/kapture-retention.yml", root))).toBe(false);
    expect(existsSync(new URL("scripts/kapture-retention.mjs", root))).toBe(false);
    expect(sources.report).not.toContain("seed-kapture-retention-policy");
    expect(sources.report).not.toContain("7일");
    for (const workflow of Object.values(workflows)) {
      expect(workflow.on.schedule).toBeUndefined();
      expect(workflow.on.pull_request_target).toBeUndefined();
    }
    expect(workflows.capture.on.pull_request.types).toEqual([
      "opened",
      "synchronize",
      "reopened",
      "edited",
    ]);
  });

  test("checks final Pages output before deployment without checkout", () => {
    const steps = workflows.report.jobs.publish.steps;
    const check = steps.findIndex((step) => step.id === "upload-limits");
    expect(check).toBeGreaterThan(steps.findIndex((step) => step.id === "review"));
    expect(check).toBeLessThan(steps.findIndex((step) => step.id === "deploy"));
    expect(steps[check].env?.KAPTURE_REPORT_DIRECTORY).toBe("${{ runner.temp }}/kapture-review");
  });

  test("Pages preflight accepts boundaries and rejects overflow, empty output and symlinks", async () => {
    const script = workflows.report.jobs.publish.steps.find((step) => step.id === "upload-limits")!
      .with.script;
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
