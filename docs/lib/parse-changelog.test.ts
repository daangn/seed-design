import { describe, expect, it } from "bun:test";
import { parseChangelogSources } from "./parse-changelog";

describe("parseChangelogSources", () => {
  it("패키지와 버전을 기준으로 changelog entry를 파싱한다", async () => {
    const entries = await parseChangelogSources([
      {
        packageName: "@seed-design/react",
        raw: `# @seed-design/react

## 1.2.6

### Patch Changes

- 77cdc0e: IdentityPlaceholder의 스타일과 글리프를 업데이트합니다.
`,
      },
    ]);

    expect(entries).toHaveLength(1);
    expect(entries[0].package).toEqual({
      name: "@seed-design/react",
      version: "1.2.6",
      url: "https://npmjs.com/package/@seed-design/react/v/1.2.6",
    });
    expect(entries[0].contentHtml).toContain("IdentityPlaceholder의 스타일과 글리프를 업데이트합니다.");
    expect(entries[0].contentHtml).toContain("/commit/77cdc0e");
    expect(entries[0].contentHtml).not.toContain("77cdc0e:");
  });

  it("section title을 유지한다", async () => {
    const entries = await parseChangelogSources([
      {
        packageName: "@seed-design/cli",
        raw: `# @seed-design/cli

## 1.2.0

### Minor Changes

- 21c6ca8: CLI add/add-all 명령 실행 시 파일 변경사항을 보여줍니다.
`,
      },
    ]);

    expect(entries[0].section).toBe("Minor Changes");
  });

  it("Updated dependencies의 관련 패키지를 파싱한다", async () => {
    const entries = await parseChangelogSources([
      {
        packageName: "@seed-design/react",
        raw: `# @seed-design/react

## 1.2.6

### Patch Changes

- Updated dependencies [fe1cdb3]
  - @seed-design/react-slider@1.0.2
  - @seed-design/react-toggle@1.0.1
`,
      },
    ]);

    expect(entries[0].relatedPackages).toEqual([
      {
        name: "@seed-design/react-slider",
        version: "1.0.2",
        url: "https://npmjs.com/package/@seed-design/react-slider/v/1.0.2",
      },
      {
        name: "@seed-design/react-toggle",
        version: "1.0.1",
        url: "https://npmjs.com/package/@seed-design/react-toggle/v/1.0.1",
      },
    ]);
    expect(entries[0].isDependencyOnly).toBe(true);
    expect(entries[0].commitRefs).toEqual(["fe1cdb3"]);
  });

  it("한 버전의 여러 bullet을 개별 entry로 분리한다", async () => {
    const entries = await parseChangelogSources([
      {
        packageName: "@seed-design/css",
        raw: `# @seed-design/css

## 1.2.4

### Patch Changes

- cd9a46c: Android 환경 문제를 수정합니다.
- 23e369d: pressed 상태 스타일을 조정합니다.
`,
      },
    ]);

    expect(entries).toHaveLength(2);
    expect(entries[0].order).toBeLessThan(entries[1].order);
  });

  it("일반 변경 항목의 commit ref를 파싱한다", async () => {
    const entries = await parseChangelogSources([
      {
        packageName: "@seed-design/css",
        raw: `# @seed-design/css

## 1.2.4

### Patch Changes

- cd9a46c: Android 환경 문제를 수정합니다.
`,
      },
    ]);

    expect(entries[0].commitRefs).toEqual(["cd9a46c"]);
    expect(entries[0].isDependencyOnly).toBe(false);
  });

  it("여러 패키지 source를 함께 파싱한다", async () => {
    const entries = await parseChangelogSources([
      {
        packageName: "@seed-design/react",
        raw: `# @seed-design/react

## 1.2.6

### Patch Changes

- react 변경사항
`,
      },
      {
        packageName: "@seed-design/css",
        raw: `# @seed-design/css

## 1.2.4

### Patch Changes

- css 변경사항
`,
      },
    ]);

    expect(entries.map((entry) => entry.package.name)).toEqual([
      "@seed-design/react",
      "@seed-design/css",
    ]);
  });
});
