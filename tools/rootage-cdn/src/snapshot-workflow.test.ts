import { describe, expect, test } from "bun:test";
import { join } from "node:path";

const repositoryRoot = join(import.meta.dir, "../../..");

describe("Rootage snapshot workflows", () => {
  test("PR source 실행과 CDN credential을 서로 다른 job으로 격리한다", async () => {
    const workflow = await Bun.file(
      join(repositoryRoot, ".github/workflows/continuous-releases.yml"),
    ).text();
    const releaseStart = workflow.indexOf("  release:");
    const publishStart = workflow.indexOf("  publish-rootage:");
    const releaseJob = workflow.slice(releaseStart, publishStart);

    expect(workflow).toContain("startsWith(github.event.comment.body, '/snapshot')");
    expect(releaseJob).toContain("persist-credentials: false");
    expect(releaseJob).toContain("snapshot-input.ts detect");
    expect(releaseJob).toContain("snapshot-input.ts prepare");
    expect(releaseJob).toContain("bun run pkg-pr-new publish");
    expect(releaseJob).not.toContain("bunx pkg-pr-new");
    expect(releaseJob).not.toContain("ROOTAGE_R2_ACCESS_KEY_ID");
    expect(releaseJob).not.toContain("ROOTAGE_R2_SECRET_ACCESS_KEY");
    expect(workflow).toContain("uses: ./.github/workflows/rootage-snapshot-contract.yml");
    expect(workflow).toContain("if: needs.release.outputs.rootage-changed == 'true'");
  });

  test("snapshot 게시기는 trusted dev control SHA와 production environment에 결속된다", async () => {
    const workflow = await Bun.file(
      join(repositoryRoot, ".github/workflows/rootage-snapshot-contract.yml"),
    ).text();

    expect(workflow).toContain("environment: rootage-production");
    expect(workflow).toContain("ref: dev");
    expect(workflow).toContain("ref: ${{ inputs.control-sha }}");
    expect(workflow).toContain("git merge-base --is-ancestor");
    expect(workflow).toContain("cli.ts publish-snapshot");
    expect(workflow).not.toContain("secrets: inherit");
    expect(workflow).not.toContain("--stable");
  });

  test("정기 정리는 dev와 production environment에서 snapshot 명령만 실행한다", async () => {
    const workflow = await Bun.file(
      join(repositoryRoot, ".github/workflows/rootage-snapshot-cleanup.yml"),
    ).text();

    expect(workflow).toContain("github.ref == 'refs/heads/dev'");
    expect(workflow).toContain("environment: rootage-production");
    expect(workflow).toContain("cli.ts cleanup-snapshots");
    expect(workflow).toContain('--older-than-days "30"');
    expect(workflow).toContain('--confirm "DELETE-SNAPSHOTS"');
    expect(workflow).not.toContain("cleanup-incomplete");
  });

  test("pkg-pr-new CLI는 검토된 exact 개발 의존성으로 고정한다", async () => {
    const packageJson = (await Bun.file(join(repositoryRoot, "package.json")).json()) as {
      devDependencies: Record<string, string>;
    };
    expect(packageJson.devDependencies["pkg-pr-new"]).toBe("0.0.87");
  });
});
