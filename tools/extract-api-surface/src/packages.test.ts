import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "bun:test";
import {
  findCondition,
  resolveEntrypoints,
  sourceCandidates,
  type PackageManifest,
} from "./packages";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const dir of temporaryDirectories.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function createPackage(manifest: PackageManifest, files: string[]) {
  const dir = mkdtempSync(path.join(tmpdir(), "extract-api-surface-package-"));
  temporaryDirectories.push(dir);
  for (const file of files) {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    writeFileSync(path.join(dir, file), "");
  }

  return { name: manifest.name ?? "", dir, manifest };
}

describe("entrypoint 해석", () => {
  test("빌드 디렉터리의 선언은 src로, 커밋된 선언은 그대로 해석하고 wildcard를 펼친다", () => {
    const pkg = createPackage(
      {
        name: "@fixture/pkg",
        exports: {
          ".": { types: "./lib/index.d.ts", import: "./lib/index.js" },
          "./sub": { types: "./dist/sub/index.d.ts" },
          "./theming": { types: "./theming/index.d.ts", import: "./theming/index.mjs" },
          "./recipes/*": { types: "./recipes/*.d.ts", default: { import: "./recipes/*.mjs" } },
          "./*.css": "./*.css",
          "./reset.css": "./reset.css",
          "./missing": { types: "./lib/missing.d.ts" },
          "./package.json": "./package.json",
        },
      },
      [
        "src/index.ts",
        "src/sub/index.tsx",
        "theming/index.d.ts",
        "recipes/a.d.ts",
        "recipes/b.d.ts",
        "base.css",
        "all.css",
      ],
    );

    expect(resolveEntrypoints(pkg)).toEqual([
      { kind: "types", subpath: ".", file: path.join(pkg.dir, "src/index.ts") },
      { kind: "asset", subpath: "./*.css", targets: ["all.css", "base.css"] },
      { kind: "unresolved", subpath: "./missing", target: "./lib/missing.d.ts" },
      { kind: "types", subpath: "./recipes/a", file: path.join(pkg.dir, "recipes/a.d.ts") },
      { kind: "types", subpath: "./recipes/b", file: path.join(pkg.dir, "recipes/b.d.ts") },
      { kind: "asset", subpath: "./reset.css", targets: ["./reset.css"] },
      { kind: "types", subpath: "./sub", file: path.join(pkg.dir, "src/sub/index.tsx") },
      { kind: "types", subpath: "./theming", file: path.join(pkg.dir, "theming/index.d.ts") },
    ]);
  });

  test("exports가 없으면 types 필드를 루트 entrypoint로 쓴다", () => {
    const pkg = createPackage({ name: "@fixture/legacy", types: "./lib/index.d.ts" }, [
      "src/index.ts",
    ]);

    expect(resolveEntrypoints(pkg)).toEqual([
      { kind: "types", subpath: ".", file: path.join(pkg.dir, "src/index.ts") },
    ]);
  });

  test("빌드 디렉터리의 선언은 src 후보로 바꾸고 밖의 선언은 그대로 둔다", () => {
    expect(sourceCandidates("./lib/a/index.d.ts")).toEqual([
      "src/a/index.ts",
      "src/a/index.tsx",
      "src/a/index/index.ts",
      "src/a/index/index.tsx",
    ]);
    expect(sourceCandidates("./vars/index.d.ts")).toEqual(["vars/index.d.ts"]);
  });

  test("중첩된 조건에서도 types를 찾는다", () => {
    expect(findCondition({ import: { types: "./a.d.ts", default: "./a.js" } }, "types")).toBe(
      "./a.d.ts",
    );
    expect(findCondition("./a.js", "types")).toBeUndefined();
  });
});
