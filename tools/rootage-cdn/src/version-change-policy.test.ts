import { describe, expect, test } from "bun:test";
import { findUnexpectedVersionChanges, isAllowedVersionChange } from "./version-change-policy";

describe("version change policy", () => {
  test.each([
    ".changeset/example.md",
    ".changeset/pre.json",
    "bun.lock",
    "packages/react/package.json",
    "tools/example/CHANGELOG.md",
    "packages/rootage/__generated__/index.json",
  ])("allows %s", (filePath) => {
    expect(isAllowedVersionChange(filePath)).toBe(true);
  });

  test("관련 없는 변경과 다른 Rootage 생성물을 거부한다", () => {
    expect(
      findUnexpectedVersionChanges([
        "README.md",
        ".github/workflows/release-publish.yml",
        "packages/rootage/artifacts/token.yaml",
        "packages/rootage/components/button.json",
        "packages/css/vars/color/bg.mjs",
        "packages/react/src/index.ts",
        "packages\\rootage\\__generated__\\index.json",
        "README.md",
      ]),
    ).toEqual([
      ".github/workflows/release-publish.yml",
      "README.md",
      "packages/css/vars/color/bg.mjs",
      "packages/react/src/index.ts",
      "packages/rootage/artifacts/token.yaml",
      "packages/rootage/components/button.json",
      "packages\\rootage\\__generated__\\index.json",
    ]);
  });
});
