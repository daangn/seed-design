import { expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import YAML from "yaml";

const workflow = YAML.parse(
  readFileSync(
    new URL("../../.github/workflows/deploy-docs-archive-worker.yml", import.meta.url),
    "utf8",
  ),
);

it("does not give PRs or archive branches a production deployment trigger", () => {
  expect(Object.keys(workflow.on).sort()).toEqual(["push", "workflow_dispatch"]);
  expect(workflow.on.push.branches).toEqual(["major"]);
  expect(workflow.jobs.archive.if).toContain("github.repository == 'daangn/seed-design'");
  expect(workflow.jobs.archive.if).toContain("github.ref == 'refs/heads/major'");
  expect(workflow.on.workflow_dispatch.inputs.operation.default).toBe("verify");
  expect(workflow.permissions).toEqual({ contents: "read" });
  expect(workflow.concurrency).toEqual({
    group: "docs-archive-worker-production",
    "cancel-in-progress": false,
  });
});

it("keeps Cloudflare write credentials out of tests and verify-only operations", () => {
  const steps = workflow.jobs.archive.steps as Array<{ name?: string; if?: string; run?: string }>;
  const privilegedSteps = steps.filter((step) =>
    JSON.stringify(step).includes("secrets.CF_API_TOKEN"),
  );
  expect(privilegedSteps).toHaveLength(1);
  expect(privilegedSteps[0].if).toBe("github.event_name == 'push' || inputs.operation == 'deploy'");
  const guard = steps.find(
    (step) => step.name === "Require explicit activation and current operational branch",
  );
  if (!guard) throw new Error("Deployment activation guard is missing");
  expect(guard.run).toContain('test "$DOCS_ARCHIVE_DEPLOY_ENABLED" = "true"');
  expect(guard.run).toContain('test "$current_sha" = "$GITHUB_SHA"');
  expect(steps.indexOf(guard)).toBeLessThan(steps.indexOf(privilegedSteps[0]));
  expect(privilegedSteps[0].run).toContain("bun scripts/docs-archive/deploy.ts");
  expect(privilegedSteps[0].run).not.toContain("wrangler deploy");
});
