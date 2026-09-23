import { afterEach, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { findPublicPackages } from "./list-public-packages";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const dir of temporaryDirectories.splice(0)) rmSync(dir, { recursive: true, force: true });
});

test("workspace에서 private이 아니고 이름이 있는 패키지를 이름순으로 고른다", () => {
  const root = mkdtempSync(path.join(tmpdir(), "list-public-packages-"));
  temporaryDirectories.push(root);

  const manifests = {
    "package.json": { private: true, workspaces: ["packages/*", "tools/*"] },
    "packages/react/package.json": { name: "@fixture/react" },
    "packages/css/package.json": { name: "@fixture/css", private: false },
    "packages/unnamed/package.json": {},
    "tools/internal/package.json": { name: "@fixture/internal", private: true },
    "docs/package.json": { name: "@fixture/docs" },
  };
  for (const [file, manifest] of Object.entries(manifests)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), JSON.stringify(manifest));
  }

  expect(findPublicPackages(root)).toEqual(["@fixture/css", "@fixture/react"]);
});
