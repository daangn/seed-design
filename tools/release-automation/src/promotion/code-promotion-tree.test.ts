import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, test } from "bun:test";
import { computeCodePromotionTrees, type CodePromotionSourceEffect } from "./code-promotion-tree";

const repositories: string[] = [];

async function git(repository: string, ...args: string[]): Promise<string> {
  const child = Bun.spawn(["git", ...args], {
    cwd: repository,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`git ${args.join(" ")} 실패: ${stderr.trim()}`);
  return stdout.trim();
}

async function write(repository: string, path: string, value: string): Promise<void> {
  await mkdir(dirname(join(repository, path)), { recursive: true });
  await writeFile(join(repository, path), value);
}

async function json(repository: string, path: string, value: unknown): Promise<void> {
  await write(repository, path, `${JSON.stringify(value, null, 2)}\n`);
}

async function commit(repository: string, message: string): Promise<string> {
  await git(repository, "add", "--all");
  await git(repository, "commit", "-m", message);
  return git(repository, "rev-parse", "HEAD");
}

async function repository(): Promise<{ path: string; common: string }> {
  const path = await mkdtemp(join(tmpdir(), "seed-code-promotion-test-"));
  repositories.push(path);
  await git(path, "init", "-b", "dev");
  await git(path, "config", "user.name", "Test");
  await git(path, "config", "user.email", "test@example.com");
  await json(path, "package.json", {
    name: "fixture",
    version: "1.0.0",
    dependencies: { alpha: "1.0.0" },
  });
  await json(path, ".changeset/config.json", { access: "restricted" });
  await write(path, "bun.lock", "lock-v1\n");
  await json(path, "packages/rootage/__generated__/index.json", { version: "1.0.0" });
  await write(path, "src/value.ts", "export const value = 'old';\n");
  const common = await commit(path, "initial");
  return { path, common };
}

async function show(repository: string, ref: string, path: string): Promise<string> {
  return git(repository, "show", `${ref}:${path}`);
}

afterEach(async () => {
  await Promise.all(
    repositories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

describe("code promotion tree", () => {
  test("ordered source effect를 재생하고 target state를 보존한 채 baseline final tree를 계산한다", async () => {
    const fixture = await repository();
    await git(fixture.path, "switch", "-c", "source", fixture.common);
    await write(fixture.path, "source-lane.txt", "source\n");
    const sourceBetaBase = await commit(fixture.path, "version beta");

    await json(fixture.path, "package.json", {
      name: "fixture",
      version: "1.0.0",
      dependencies: { alpha: "1.0.0", bravo: "2.0.0" },
    });
    await write(fixture.path, "src/new-component.ts", "export const component = true;\n");
    await write(
      fixture.path,
      ".changeset/brave-cats.md",
      "---\nfixture: minor\n---\n\nAdd component.\n",
    );
    const firstMerge = await commit(fixture.path, "feat: add component (#101)");

    await write(fixture.path, "bun.lock", "lock-with-bravo\n");
    await json(fixture.path, "packages/rootage/__generated__/index.json", {
      version: "1.0.0",
      tokens: ["new-token"],
    });
    const secondMerge = await commit(fixture.path, "feat: generate rootage (#102)");

    await json(fixture.path, "package.json", {
      name: "fixture",
      version: "2.0.0",
      dependencies: { alpha: "1.0.0", bravo: "^2.0.0" },
    });
    await write(fixture.path, "bun.lock", "lock-stable\n");
    await write(fixture.path, "CHANGELOG.md", "# fixture\n\n## 2.0.0\n");
    const stableHead = await commit(fixture.path, "chore(release): version packages");

    await git(fixture.path, "switch", "-c", "target", fixture.common);
    await write(fixture.path, ".changeset/target-draft.md", "---\nfixture: patch\n---\n\nDraft.\n");
    await write(fixture.path, "target-only.txt", "keep\n");
    const targetBase = await commit(fixture.path, "target work");

    const result = await computeCodePromotionTrees({
      repositoryPath: fixture.path,
      targetBaseSha: targetBase,
      sourceEffects: [
        { sourcePr: 101, parentSha: sourceBetaBase, mergeSha: firstMerge },
        { sourcePr: 102, parentSha: firstMerge, mergeSha: secondMerge },
      ],
      projectedBaseline: { baseSha: secondMerge, headSha: stableHead },
    });

    expect(result.noOp).toBe(false);
    expect(result.patchSha256).toMatch(/^[0-9a-f]{64}$/);
    expect(result.changedFiles).toEqual([
      "bun.lock",
      "package.json",
      "packages/rootage/__generated__/index.json",
      "src/new-component.ts",
    ]);
    expect(result.sourceEffects.map((effect) => effect.disposition)).toEqual([
      "applied",
      "applied",
    ]);
    expect(result.sourceEffects[0]?.excludedChangesets).toEqual([".changeset/brave-cats.md"]);
    expect(JSON.parse(await show(fixture.path, result.codeTreeSha, "package.json"))).toEqual({
      name: "fixture",
      version: "1.0.0",
      dependencies: { alpha: "1.0.0", bravo: "2.0.0" },
    });
    expect(await show(fixture.path, result.codeTreeSha, ".changeset/target-draft.md")).toContain(
      "Draft.",
    );
    expect(result.projectedBaseline?.files).toEqual(["CHANGELOG.md", "bun.lock", "package.json"]);
    expect(
      JSON.parse(await show(fixture.path, result.projectedBaseline?.treeSha ?? "", "package.json")),
    ).toEqual({
      name: "fixture",
      version: "2.0.0",
      dependencies: { alpha: "1.0.0", bravo: "^2.0.0" },
    });
    expect(
      await show(
        fixture.path,
        result.projectedBaseline?.treeSha ?? "",
        ".changeset/target-draft.md",
      ),
    ).toContain("Draft.");
  });

  test.each([
    ["package version", "package.json", "package version"],
    ["CHANGELOG", "CHANGELOG.md", "CHANGELOG"],
    ["prerelease state", ".changeset/pre.json", "정상 신규 Changeset"],
    ["release state", ".github/release/promotion.json", "금지된 릴리즈 제어 파일"],
    ["release workflow", ".github/workflows/release.yml", "금지된 릴리즈 제어 파일"],
  ])("source PR의 금지 변경을 거부한다: %s", async (kind, path, message) => {
    const fixture = await repository();
    await git(
      fixture.path,
      "switch",
      "-c",
      `source-${path.replaceAll(/[^a-z0-9]+/g, "-")}`,
      fixture.common,
    );
    if (path === "package.json") {
      await json(fixture.path, path, { name: "fixture", version: "2.0.0" });
    } else {
      await write(fixture.path, path, `${kind}\n`);
    }
    const head = await commit(fixture.path, `change ${kind}`);
    await expect(
      computeCodePromotionTrees({
        repositoryPath: fixture.path,
        targetBaseSha: fixture.common,
        sourceEffects: [{ sourcePr: 201, parentSha: fixture.common, mergeSha: head }],
      }),
    ).rejects.toThrow(message);
  });

  test("정상 신규 Changeset만 제외하고 수정된 Changeset은 거부한다", async () => {
    const fixture = await repository();
    await git(fixture.path, "switch", "-c", "source", fixture.common);
    await write(fixture.path, ".changeset/new-entry.md", "---\nfixture: patch\n---\n\nNew.\n");
    const added = await commit(fixture.path, "add changeset");
    const noOp = await computeCodePromotionTrees({
      repositoryPath: fixture.path,
      targetBaseSha: fixture.common,
      sourceEffects: [{ sourcePr: 301, parentSha: fixture.common, mergeSha: added }],
    });
    expect(noOp.noOp).toBe(true);
    expect(noOp.sourceEffects[0]?.disposition).toBe("changeset-only");

    await write(fixture.path, ".changeset/new-entry.md", "modified\n");
    const modified = await commit(fixture.path, "modify changeset");
    await expect(
      computeCodePromotionTrees({
        repositoryPath: fixture.path,
        targetBaseSha: fixture.common,
        sourceEffects: [{ sourcePr: 302, parentSha: added, mergeSha: modified }],
      }),
    ).rejects.toThrow("정상 신규 Changeset");
  });

  test("완전히 적용된 effect만 no-op이고 partial already-applied는 남은 변경을 적용한다", async () => {
    const fixture = await repository();
    await git(fixture.path, "switch", "-c", "source", fixture.common);
    await write(fixture.path, "src/value.ts", "export const value = 'new';\n");
    await write(fixture.path, "src/other.ts", "export const other = 'new';\n");
    const mergeSha = await commit(fixture.path, "change two files");
    const effect: CodePromotionSourceEffect = {
      sourcePr: 401,
      parentSha: fixture.common,
      mergeSha,
    };

    await git(fixture.path, "switch", "-c", "exact", fixture.common);
    await write(fixture.path, "src/value.ts", "export const value = 'new';\n");
    await write(fixture.path, "src/other.ts", "export const other = 'new';\n");
    const exactBase = await commit(fixture.path, "already applied exactly");
    const exact = await computeCodePromotionTrees({
      repositoryPath: fixture.path,
      targetBaseSha: exactBase,
      sourceEffects: [effect],
    });
    expect(exact.noOp).toBe(true);
    expect(exact.sourceEffects[0]?.disposition).toBe("already-applied");

    await git(fixture.path, "switch", "-c", "partial", fixture.common);
    await write(fixture.path, "src/value.ts", "export const value = 'new';\n");
    const partialBase = await commit(fixture.path, "partially applied");
    const partial = await computeCodePromotionTrees({
      repositoryPath: fixture.path,
      targetBaseSha: partialBase,
      sourceEffects: [effect],
    });
    expect(partial.noOp).toBe(false);
    expect(partial.sourceEffects[0]?.disposition).toBe("applied");
    expect(await show(fixture.path, partial.codeTreeSha, "src/other.ts")).toContain("'new'");
  });

  test("source effect의 ancestry 순서와 exact single-parent를 요구한다", async () => {
    const fixture = await repository();
    await git(fixture.path, "switch", "-c", "source", fixture.common);
    await write(fixture.path, "first.txt", "first\n");
    const first = await commit(fixture.path, "first");
    await write(fixture.path, "second.txt", "second\n");
    const second = await commit(fixture.path, "second");

    await expect(
      computeCodePromotionTrees({
        repositoryPath: fixture.path,
        targetBaseSha: fixture.common,
        sourceEffects: [
          { sourcePr: 502, parentSha: first, mergeSha: second },
          { sourcePr: 501, parentSha: fixture.common, mergeSha: first },
        ],
      }),
    ).rejects.toThrow("first-parent 순서");

    await expect(
      computeCodePromotionTrees({
        repositoryPath: fixture.path,
        targetBaseSha: fixture.common,
        sourceEffects: [{ sourcePr: 503, parentSha: second, mergeSha: second }],
      }),
    ).rejects.toThrow("exact squash/single-parent");
  });
});
