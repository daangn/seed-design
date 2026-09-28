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
  concurrency: { group: string; queue?: string; "cancel-in-progress": boolean };
  jobs: Record<string, { if: string; steps: Step[]; permissions?: Record<string, string> }>;
}
const workflows = Object.fromEntries(names.map((name) => [name, parse(sources[name])])) as Record<
  string,
  Workflow
>;
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
    expect(commandText(cli)).toMatch(/\bbunx\s+"?@kaptures\/cli@/);
    const preceding = steps.slice(0, steps.indexOf(cli));
    for (const action of ["oven-sh/setup-bun@", "actions/setup-node@"]) {
      const setup = preceding.find((step) => step.uses?.startsWith(action));
      expect(setup).toBeDefined();
      expect(setup?.if === undefined || setup.if === true || setup.if === cli.if).toBe(true);
      if (action.startsWith("actions/setup-node")) {
        expect(Boolean(setup?.with?.["node-version"] || setup?.with?.["node-version-file"])).toBe(
          true,
        );
      }
    }
  }
  return cliSteps.length;
}

describe("Kapture consumer workflows", () => {
  test("prepares Bun and an explicit Node runtime before every CLI call", () => {
    let checked = 0;
    for (const workflow of Object.values(workflows)) {
      for (const job of Object.values(workflow.jobs)) {
        checked += assertCliRuntimes(job.steps);
      }
    }
    expect(checked).toBeGreaterThan(0);
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
    const step = workflows.capture.jobs.capture.steps.find((step) => step.id === "capture")!;
    const result = spawnSync(
      "bash",
      [
        "-c",
        `bunx() { printf '%s\\n' "$@"; }\n${step.run!.replace(/\$\{\{[\s\S]*?\}\}/g, "fixture")}`,
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
      tests.steps.some((step) => step.run?.includes("bun test scripts/kapture-workflows.test.ts")),
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
      workflows.capture.jobs["build-base"].steps.find((step) =>
        step.uses?.startsWith("actions/checkout@"),
      )?.with.ref,
    ).toBe("${{ needs.context.outputs.base-sha }}");
  });

  test("delegates build restoration and safely falls back to exact-base builds", () => {
    const capture = parse(sources.capture);
    const job = capture.jobs["build-base"];
    const steps: Step[] = job.steps;
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
    const artifact = steps.find((step) => step.id === "artifact")!;
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
      commandText(workflows.capture.jobs.context.steps.find((step) => step.id === "context")),
    ).toContain("--allow-initial-adoption");
    expect(workflows.capture.jobs["build-base"].if).toBe(
      "needs.context.outputs.integration-mode == 'compare'",
    );
    expect(workflows.capture.jobs["build-head"].if).toContain(
      "integration-mode == 'initial-adoption'",
    );
    const setup = workflows.capture.jobs["setup-capture"];
    expect(setup.if).toBe("needs.context.outputs.integration-mode == 'initial-adoption'");
    const capture = setup.steps.find((step) => step.id === "capture");
    expect(commandText(capture)).toContain("setup capture");
    expect(capture?.run).not.toContain("--base-dir");
    const artifact = setup.steps.find((step) => step.id === "artifact");
    expect(artifact?.with.path).toContain("setup.json");
    expect(artifact?.with.path).toContain("images/*.png");
    expect(Number(artifact?.with["retention-days"])).toBeGreaterThan(0);
    expect(setup.steps.some((step) => step.run?.includes("GITHUB_STEP_SUMMARY"))).toBe(true);
    expect(setup.steps.some((step) => commandText(step) === "exit 1" && Boolean(step.if))).toBe(
      true,
    );
    expect(JSON.stringify(setup)).not.toMatch(/wrangler|publish-setup|publish-run|statuses: write/);
    for (const job of ["publish", "finalize"]) {
      expect(workflows.report.jobs[job].permissions?.contents).toBe("read");
      expect(
        workflows.report.jobs[job].steps.some(
          (step) =>
            commandText(step).includes("--allow-initial-adoption") &&
            commandText(step).includes("--adapter-package-json"),
        ),
      ).toBe(true);
    }
  });

  test("delegates production report trust and approval to the released CLI", () => {
    expect(workflows.report.on.workflow_run.workflows).toContain(workflows.capture.name);
    expect(new Set(workflows.report.on.workflow_run.types)).toEqual(
      new Set(["in_progress", "completed"]),
    );
    expect(commands(workflows.report.jobs.publish.steps)).toEqual([
      "prepare-review",
      "publish-run",
    ]);
    expect(commands(workflows.report.jobs.finalize.steps)).toEqual(["finalize-run"]);
    expect(commands(workflows.approve.jobs.approve.steps)).toEqual(["approve"]);
    expect(workflows.report.jobs.finalize.if).toContain("always()");
    for (const name of ["report", "approve"]) {
      expect(sources[name]).not.toContain("actions/checkout");
      expect(workflows[name].concurrency.group).toBe(workflows.report.concurrency.group);
      expect(workflows[name].concurrency.group).toContain("github.repository");
      expect(workflows[name].concurrency["cancel-in-progress"]).toBe(false);
      expect(workflows[name].concurrency.queue).toBe("max");
      expect(workflows[name].permissions).toEqual({});
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
    expect(new Set(workflows.capture.on.pull_request.types)).toEqual(
      new Set(["opened", "synchronize", "reopened", "edited"]),
    );
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
