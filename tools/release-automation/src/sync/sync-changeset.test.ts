import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { normalizeChangesetBumps, normalizeChangesetsInDirectory } from "./sync-changeset";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

describe("sync changeset bump normalization", () => {
  test("frontmatter bump만 target lane으로 바꾸고 body와 줄바꿈을 보존한다", () => {
    const source = [
      "---\r",
      '"@seed-design/react": patch # direct\r',
      "'@seed-design/css': minor\r",
      "---\r",
      "\r",
      "patch와 minor라는 본문 단어는 그대로 둡니다.\r",
      "",
    ].join("\n");
    const expected = source
      .replace('"@seed-design/react": patch', '"@seed-design/react": major')
      .replace("'@seed-design/css': minor", "'@seed-design/css': major");

    expect(normalizeChangesetBumps(source, "major")).toBe(expected);
    expect(normalizeChangesetBumps(expected, "major")).toBe(expected);
  });

  test("directory wrapper는 README를 건너뛰고 변경 파일만 보고한다", async () => {
    const root = await mkdtemp(join(tmpdir(), "seed-sync-changeset-test-"));
    temporaryDirectories.push(root);
    const directory = join(root, ".changeset");
    await mkdir(directory);
    await writeFile(join(directory, "README.md"), "not frontmatter\n");
    await writeFile(
      join(directory, "one.md"),
      '---\n"@seed-design/react": patch\n---\n\n사용자 설명\n',
    );
    await writeFile(
      join(directory, "two.md"),
      '---\n"@seed-design/css": minor\n---\n\n이미 정규화됨\n',
    );

    expect(await normalizeChangesetsInDirectory(root, "minor")).toEqual([".changeset/one.md"]);
    expect(await normalizeChangesetsInDirectory(root, "minor")).toEqual([]);
    expect(await readFile(join(directory, "README.md"), "utf8")).toBe("not frontmatter\n");
  });

  test("release line mapping이 아닌 frontmatter는 fail-closed다", () => {
    expect(() => normalizeChangesetBumps("---\n[]\n---\nbody\n", "minor")).toThrow();
    expect(() => normalizeChangesetBumps("---\nfoo: banana\n---\nbody\n", "minor")).toThrow();
  });
});
