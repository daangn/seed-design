import { describe, expect, it } from "bun:test";
import { parseChangelogSources } from "./parse-changelog";

describe("parseChangelogSources", () => {
  it("패키지와 버전을 기준으로 changelog entry를 파싱한다", async () => {
    const entries = await parseChangelogSources([
      {
        packageName: "@ride-developer/react",
        raw: `# @ride-developer/react

## 1.2.6

### Patch Changes

- 77cdc0e: IdentityPlaceholder의 스타일과 글리프를 업데이트합니다.
`,
      },
    ]);

    expect(entries).toHaveLength(1);
    expect(entries[0].package).toEqual({
      name: "@ride-developer/react",
      version: "1.2.6",
      url: "https://npmjs.com/package/@ride-developer/react/v/1.2.6",
    });
    expect(entries[0].contentBlocks[0]).toMatchObject({
      type: "markdown",
    });
    expect(entries[0].contentBlocks[0]?.type === "markdown" && entries[0].contentBlocks[0].html).toContain(
      "IdentityPlaceholder의 스타일과 글리프를 업데이트합니다.",
    );
    expect(entries[0].contentBlocks[0]?.type === "markdown" && entries[0].contentBlocks[0].html).toContain(
      "/commit/77cdc0e",
    );
    expect(entries[0].contentBlocks[0]?.type === "markdown" && entries[0].contentBlocks[0].html).not.toContain(
      "77cdc0e:",
    );
  });

  it("section title을 유지한다", async () => {
    const entries = await parseChangelogSources([
      {
        packageName: "@ride-developer/cli",
        raw: `# @ride-developer/cli

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
        packageName: "@ride-developer/react",
        raw: `# @ride-developer/react

## 1.2.6

### Patch Changes

- Updated dependencies [fe1cdb3]
  - @ride-developer/react-slider@1.0.2
  - @ride-developer/react-toggle@1.0.1
`,
      },
    ]);

    expect(entries[0].relatedPackages).toEqual([
      {
        name: "@ride-developer/react-slider",
        version: "1.0.2",
        url: "https://npmjs.com/package/@ride-developer/react-slider/v/1.0.2",
      },
      {
        name: "@ride-developer/react-toggle",
        version: "1.0.1",
        url: "https://npmjs.com/package/@ride-developer/react-toggle/v/1.0.1",
      },
    ]);
    expect(entries[0].isDependencyOnly).toBe(true);
    expect(entries[0].commitRefs).toEqual(["fe1cdb3"]);
  });

  it("한 버전의 여러 bullet을 개별 entry로 분리한다", async () => {
    const entries = await parseChangelogSources([
      {
        packageName: "@ride-developer/css",
        raw: `# @ride-developer/css

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
        packageName: "@ride-developer/css",
        raw: `# @ride-developer/css

## 1.2.4

### Patch Changes

- cd9a46c: Android 환경 문제를 수정합니다.
`,
      },
    ]);

    expect(entries[0].commitRefs).toEqual(["cd9a46c"]);
    expect(entries[0].isDependencyOnly).toBe(false);
  });

  it("markdown code block을 별도 content block으로 분리한다", async () => {
    const entries = await parseChangelogSources([
      {
        packageName: "@ride-developer/react",
        raw: `# @ride-developer/react

## 1.2.6

### Patch Changes

- 77cdc0e: 사용 예시를 추가합니다.

  \`\`\`tsx
  <IdentityPlaceholder identity="business" />
  \`\`\`
`,
      },
    ]);

    expect(entries[0].contentBlocks).toEqual([
      expect.objectContaining({ type: "markdown" }),
      {
        type: "code",
        lang: "tsx",
        code: '<IdentityPlaceholder identity="business" />',
      },
    ]);
  });

  it("여러 패키지 source를 함께 파싱한다", async () => {
    const entries = await parseChangelogSources([
      {
        packageName: "@ride-developer/react",
        raw: `# @ride-developer/react

## 1.2.6

### Patch Changes

- react 변경사항
`,
      },
      {
        packageName: "@ride-developer/css",
        raw: `# @ride-developer/css

## 1.2.4

### Patch Changes

- css 변경사항
`,
      },
    ]);

    expect(entries.map((entry) => entry.package.name)).toEqual([
      "@ride-developer/react",
      "@ride-developer/css",
    ]);
  });
});
