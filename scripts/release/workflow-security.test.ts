import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { parse } from "yaml";

interface WorkflowJob {
  permissions?: Record<string, string> | string;
  steps?: Array<{ uses?: string; with?: Record<string, string> }>;
}

interface Workflow {
  permissions?: Record<string, string> | string;
  jobs: Record<string, WorkflowJob>;
}

async function workflow(path: string): Promise<Workflow> {
  return parse(await readFile(path, "utf8")) as Workflow;
}

describe("릴리즈 workflow 권한 경계", () => {
  test("일반 PR 검증은 read-only다", async () => {
    const validation = await workflow(".github/workflows/release-pr-validation.yml");
    expect(validation.permissions).toEqual({ contents: "read" });
    expect(validation.jobs.validate.permissions).toBeUndefined();
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
      ".github/workflows/release-transition.yml",
      ".github/workflows/release-publish.yml",
      ".github/workflows/release-sync.yml",
      ".github/workflows/release-sync-merge.yml",
      ".github/workflows/release-sync-alert.yml",
      ".github/workflows/release-promotion.yml",
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

  test("DES-2201 계약은 승인된 소스와 production 환경에서만 R2를 갱신한다", async () => {
    const contract = await readFile(".github/workflows/rootage-release-contract.yml", "utf8");
    expect(contract).toContain("environment: rootage-production");
    expect(contract).toContain("ref: $" + "{{ inputs.source-sha }}");
    expect(contract).toContain(
      "ROOTAGE_R2_SECRET_ACCESS_KEY: $" + "{{ secrets.ROOTAGE_R2_SECRET_ACCESS_KEY }}",
    );
    expect(contract).not.toContain("pull_request_target");
  });
});
