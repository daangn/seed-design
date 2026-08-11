import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "bun:test";
import {
  createRootageSnapshotVersion,
  hasRootageChanges,
  parseRootageSnapshotVersion,
  writeRootageSnapshotVersion,
} from "./snapshot";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

describe("Rootage snapshot 입력", () => {
  test("PR 번호와 exact source SHA로 불변 SemVer를 만든다", () => {
    const sourceSha = "a".repeat(40);
    const version = createRootageSnapshotVersion("123", sourceSha);
    expect(version).toBe(`0.0.0-snapshot.pr-123.sha-${sourceSha}`);
    expect(parseRootageSnapshotVersion(version)).toEqual({ prNumber: 123, sourceSha });
  });

  test("잘못된 PR 번호, SHA와 다른 prerelease 버전을 거부한다", () => {
    expect(() => createRootageSnapshotVersion("0", "a".repeat(40))).toThrow("PR 번호");
    expect(() => createRootageSnapshotVersion("1", "main")).toThrow("source SHA");
    expect(parseRootageSnapshotVersion("2.5.0-beta.1")).toBeNull();
  });

  test("packages/rootage 아래의 정규 Git 경로만 변경으로 판단한다", () => {
    expect(hasRootageChanges(["packages/react/Button.tsx", "packages/rootage/color.yaml"])).toBe(
      true,
    );
    expect(hasRootageChanges(["ecosystem/rootage/core/index.ts"])).toBe(false);
    expect(hasRootageChanges(["packages\\rootage\\color.yaml"])).toBe(false);
  });

  test("Rootage package identity를 보존하며 snapshot 버전만 쓴다", async () => {
    const directory = await mkdtemp(join(tmpdir(), "rootage-snapshot-test-"));
    temporaryDirectories.push(directory);
    const packageJsonPath = join(directory, "package.json");
    await writeFile(
      packageJsonPath,
      `${JSON.stringify({ name: "@seed-design/rootage-artifacts", version: "2.4.0", files: ["a"] }, null, 2)}\n`,
    );
    const version = createRootageSnapshotVersion("77", "b".repeat(40));
    await writeRootageSnapshotVersion(packageJsonPath, version);
    expect(JSON.parse(await readFile(packageJsonPath, "utf8"))).toEqual({
      name: "@seed-design/rootage-artifacts",
      version,
      files: ["a"],
    });
  });
});
