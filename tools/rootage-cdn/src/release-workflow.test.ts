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
    expect(workflow).not.toContain("uses: ./.github/workflows/rootage-release-contract.yml");

    const publishStart = workflow.indexOf("  publish-rootage:");
    const notifyStart = workflow.indexOf("  notify-rootage:");
    const publishJob = workflow.slice(publishStart, notifyStart);
    expect(publishJob).toContain("runs-on: ubuntu-latest");
    expect(publishJob).toContain("environment: rootage-production");
    expect(publishJob).toContain("group: rootage-cdn-production-mutation");
    expect(publishJob).toContain("ref: dev");
    expect(publishJob).toContain(
      `ref: ${githubExpression("needs.prepare-rootage.outputs.control-sha")}`,
    );
    expect(publishJob).toContain("git merge-base --is-ancestor");
    expect(publishJob).toContain("CF_ACCOUNT_ID: ${{ secrets.CF_ACCOUNT_ID }}");
    expect(publishJob).toContain(
      "ROOTAGE_R2_ACCESS_KEY_ID: ${{ secrets.ROOTAGE_R2_ACCESS_KEY_ID }}",
    );
    expect(publishJob).toContain(
      "ROOTAGE_R2_SECRET_ACCESS_KEY: ${{ secrets.ROOTAGE_R2_SECRET_ACCESS_KEY }}",
    );
    expect(publishJob).toContain(
      `ROOTAGE_VERSION: ${githubExpression("needs.prepare-rootage.outputs.version")}`,
    );
    expect(publishJob).toContain(
      `ROOTAGE_NPM_INTEGRITY: ${githubExpression("needs.prepare-rootage.outputs.integrity")}`,
    );
    expect(publishJob).toContain(
      `ROOTAGE_SOURCE_SHA: ${githubExpression("needs.prepare-rootage.outputs.source-sha")}`,
    );
    expect(publishJob).toContain(
      `ROOTAGE_STABLE: ${githubExpression("needs.prepare-rootage.outputs.stable")}`,
    );
    expect(publishJob).toContain("cli.ts publish");
    expect(publishJob).not.toContain("secrets: inherit");

    const prepareIndex = workflow.indexOf("  prepare-rootage:");
    expect(prepareIndex).toBeGreaterThan(0);
    const releaseJob = workflow.slice(0, prepareIndex);
    expect(releaseJob).not.toContain("slackapi/slack-github-action");
    expect(workflow).toContain("notify-rootage:");
    expect(workflow).toContain("continue-on-error: true");
  });
});
