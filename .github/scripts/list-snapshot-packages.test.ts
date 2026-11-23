import { afterEach, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { selectSnapshotPackages } from "./list-snapshot-packages";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const dir of temporaryDirectories.splice(0)) rmSync(dir, { recursive: true, force: true });
});

test("바뀐 공개 패키지와 그 패키지에 런타임 의존하는 공개 패키지를 고른다", () => {
  const root = mkdtempSync(path.join(tmpdir(), "list-snapshot-packages-"));
  temporaryDirectories.push(root);

  const manifests = {
    "package.json": { private: true, workspaces: ["packages/*", "packages/headless/*", "tools/*"] },
    "packages/headless/sheet/package.json": { name: "@fixture/sheet" },
    "packages/react/package.json": {
      name: "@fixture/react",
      dependencies: { "@fixture/sheet": "^1.0.0" },
    },
    "packages/app/package.json": {
      name: "@fixture/app",
      peerDependencies: { "@fixture/react": "^1.0.0" },
    },
    "packages/docs-kit/package.json": {
      name: "@fixture/docs-kit",
      devDependencies: { "@fixture/sheet": "^1.0.0" },
    },
    "packages/internal/package.json": {
      name: "@fixture/internal",
      private: true,
      dependencies: { "@fixture/sheet": "^1.0.0" },
    },
    "packages/css/package.json": { name: "@fixture/css" },
    "tools/cli/package.json": {
      name: "@fixture/cli",
      dependencies: { "@fixture/sheet": "^1.0.0" },
    },
  };
  for (const [file, manifest] of Object.entries(manifests)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), JSON.stringify(manifest));
  }

  expect(
    selectSnapshotPackages(root, [
      "packages/headless/sheet/src/index.ts",
      "packages/css-extra/README.md",
      "bun.lock",
    ]),
  ).toEqual(["packages/app", "packages/headless/sheet", "packages/react"]);
  expect(selectSnapshotPackages(root, ["docs/index.md"])).toEqual([]);
});
