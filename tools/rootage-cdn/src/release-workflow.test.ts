import { describe, expect, test } from "bun:test";
import { join } from "node:path";

const repositoryRoot = join(import.meta.dir, "../../..");
const githubExpression = (expression: string): string => ["$", "{{ ", expression, " }}"].join("");

describe("release publish workflow", () => {
  test("protected dev에서만 현재 Trusted Publisher identity로 Changesets를 실행한다", async () => {
    const workflow = await Bun.file(
      join(repositoryRoot, ".github/workflows/release-publish.yml"),
    ).text();

    expect(workflow).toContain("name: Release publish");
    expect(workflow).toContain("      - dev");
    expect(workflow).not.toContain("      - main");
    expect(workflow).toContain("if: github.ref == 'refs/heads/dev'");
    expect(workflow).toContain("group: release-publish");
    expect(workflow).toContain("cancel-in-progress: false");
    expect(workflow).not.toContain("environment: npm-production");
    expect(workflow).toContain("id-token: write");
    expect(workflow).toContain("publish: bun release");
    expect(workflow).toContain("version: bun version");
    expect(workflow).toContain("changesets/action@3841a0683d3cfa6dae0f9bb335290003010fe3f0");
    expect(workflow).toContain('registry-url: "https://registry.npmjs.org"');
    expect(workflow).toContain("package-manager-cache: false");
    expect(workflow).not.toContain("NPM_TOKEN");
    expect(workflow).not.toContain("NODE_AUTH_TOKEN");
    expect(workflow).not.toContain("tools/release-automation");

    const identityIndex = workflow.indexOf("Bind release execution to the protected dev commit");
    const changesetsIndex = workflow.indexOf("Create or update the Version Packages PR");
    expect(identityIndex).toBeGreaterThan(0);
    expect(changesetsIndex).toBeGreaterThan(identityIndex);
  });

  test("Changesets version 명령이 같은 commit에 Rootage JSON을 결정적으로 생성한다", async () => {
    const workflow = await Bun.file(
      join(repositoryRoot, ".github/workflows/release-publish.yml"),
    ).text();
    const packageJson = (await Bun.file(join(repositoryRoot, "package.json")).json()) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts.version).toContain("changeset version");
    expect(packageJson.scripts.version).toContain("bun rootage:build");
    expect(packageJson.scripts.version).toContain(
      "bun --filter @seed-design/rootage-artifacts rootage:generate",
    );
    expect(packageJson.scripts.version).toContain("version-change-policy.ts");
    expect(workflow).not.toContain("update-rootage-version-pr:");
    expect(workflow).not.toContain("changeset-release/");
  });

  test("부분 게시와 재실행에서도 registry gitHead를 기준으로 Rootage 계약을 조정한다", async () => {
    const workflow = await Bun.file(
      join(repositoryRoot, ".github/workflows/release-publish.yml"),
    ).text();

    expect(workflow).toContain("prepare-rootage:");
    expect(workflow).toContain("always() &&");
    expect(workflow).toContain("needs.release.result != 'cancelled'");
    expect(workflow).toContain("ROOTAGE_SOURCE_SHA:");
    expect(workflow).toContain("run: bun tools/rootage-cdn/src/release-input.ts");
    expect(workflow).toContain("uses: ./.github/workflows/rootage-release-contract.yml");
    expect(workflow).toContain(
      `version: ${githubExpression("needs.prepare-rootage.outputs.version")}`,
    );
    expect(workflow).toContain(
      `npm-integrity: ${githubExpression("needs.prepare-rootage.outputs.integrity")}`,
    );
    expect(workflow).toContain(
      `source-sha: ${githubExpression("needs.prepare-rootage.outputs.source-sha")}`,
    );
    expect(workflow).toContain(
      `control-sha: ${githubExpression("needs.prepare-rootage.outputs.control-sha")}`,
    );
    expect(workflow).not.toContain("secrets: inherit");

    const releaseJob = workflow.slice(0, workflow.indexOf("  prepare-rootage:"));
    expect(releaseJob).not.toContain("slackapi/slack-github-action");
    expect(workflow).toContain("notify-rootage:");
    expect(workflow).toContain("continue-on-error: true");
  });
});
