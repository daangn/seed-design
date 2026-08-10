import { describe, expect, test } from "bun:test";
import { assertLegacyMigrationFiles, assertLegacyMigrationIdentity } from "./legacy-pr-validation";

function event(
  overrides: {
    author?: string;
    base?: string;
    body?: string;
    head?: string;
    headRepository?: string;
  } = {},
) {
  const repository = "daangn/seed-design";
  return {
    repository: { full_name: repository },
    pull_request: {
      body: overrides.body ?? "ordinary migration pull request",
      user: { login: overrides.author ?? "maintainer" },
      base: { ref: overrides.base ?? "dev", repo: { full_name: repository } },
      head: {
        ref: overrides.head ?? "refactor-release-pipeline",
        repo: { full_name: overrides.headRepository ?? repository },
      },
    },
  };
}

describe("legacy dev validator migration compatibility", () => {
  test("일반 dev 구조 변경 PR만 허용한다", () => {
    expect(assertLegacyMigrationIdentity(event())).toBe("dev");
    expect(() => assertLegacyMigrationIdentity(event({ base: "minor" }))).toThrow(
      "이번 dev 구조 변경 PR만",
    );
    expect(() =>
      assertLegacyMigrationIdentity(
        event({ author: "github-actions[bot]", head: "changeset-release/dev" }),
      ),
    ).toThrow("generated PR");
  });

  test("상태 파일 변경과 changeset 삭제를 거부한다", () => {
    expect(() =>
      assertLegacyMigrationFiles(["tools/release-automation/package.json"], []),
    ).not.toThrow();
    expect(() => assertLegacyMigrationFiles([".github/release/control.json"], [])).toThrow(
      "릴리즈 상태 파일",
    );
    expect(() => assertLegacyMigrationFiles([], [".changeset/removed.md"])).toThrow(
      "changeset을 삭제",
    );
  });
});
