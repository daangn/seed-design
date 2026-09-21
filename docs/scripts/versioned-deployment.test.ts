import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

const expression = (value: string) => `\${{ ${value} }}`;

const workflow = parse(
  readFileSync(
    new URL("../../.github/workflows/deploy-seed-design-docs-alpha-pages.yml", import.meta.url),
    "utf8",
  ),
);
const steps = workflow.jobs.deploy.steps as {
  name: string;
  id?: string;
  if?: string;
  uses?: string;
  "continue-on-error"?: boolean;
  with?: Record<string, string>;
}[];

describe("versioned docs deployment", () => {
  it("blocks 2.0 deployment when the exported docs have broken links", () => {
    const deployment = steps.findIndex((step) => step.id === "deploy");
    const guard = steps.findIndex(
      (step) =>
        step.uses === "./.github/actions/check-docs-links" &&
        step.if === expression("github.ref_name == '2.0'"),
    );
    expect(guard).toBeGreaterThanOrEqual(0);
    expect(guard).toBeLessThan(deployment);
    expect(steps[guard]?.["continue-on-error"]).not.toBe(true);
    expect(steps[deployment]?.if).toBeUndefined();
    expect(steps[deployment]?.with?.command).toContain(`--branch=${expression("github.ref_name")}`);
    expect(steps[deployment]?.with?.command).toContain("--project-name=seed-design-v3");
  });

  it("still deploys ordinary PR previews before checking links", () => {
    const deployment = steps.findIndex((step) => step.id === "deploy");
    const links = steps.findIndex((step) => step.id === "links");
    expect(links).toBeGreaterThan(deployment);
    expect(steps[links]?.if).toBe(expression("github.ref_name != '2.0'"));
    expect(steps[links]?.["continue-on-error"]).toBe(true);
    expect(steps.some((step) => step.if === expression("steps.links.outcome == 'failure'"))).toBe(
      true,
    );
    expect(workflow.on.push.branches).toContain("**");
    expect(workflow.on.push.branches).not.toContain("!2.0");
    expect(workflow.on.workflow_dispatch).toBeDefined();
  });
});
