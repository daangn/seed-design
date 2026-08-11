import { describe, expect, it } from "bun:test";
import type { ChangelogSource } from "./parse-changelog";
import {
  buildChangelogLlmData,
  createChangelogLlmDataLoader,
  renderVersionMarkdown,
} from "./changelog-llms";
import { buildChangelogLlmOutputFiles } from "./changelog-llms-output";

const sources: ChangelogSource[] = [
  {
    packageName: "@seed-design/react",
    raw: `# @seed-design/react

## 2.0.0

### Major Changes

- abc1234: React 2를 출시합니다.

## 1.0.0

### Patch Changes

- Updated dependencies [def5678]
  - @seed-design/css@1.0.0
`,
  },
  {
    packageName: "@seed-design/css",
    raw: `# @seed-design/css

## 1.0.0

### Patch Changes

- def5678: CSS 토큰을 추가합니다.
`,
  },
];

describe("buildChangelogLlmData", () => {
  it("패키지별 버전 순서와 렌더링 결과를 한 번에 만든다", async () => {
    const data = await buildChangelogLlmData(sources);
    const react = data.packages.get("@seed-design/react");

    expect(data.entries).toHaveLength(3);
    expect(react?.versions).toEqual(["2.0.0", "1.0.0"]);
    expect(react?.versionIndex.get("2.0.0")).toBe(0);
    expect(react?.versionIndex.get("1.0.0")).toBe(1);
    expect(react?.renderedBlocks[0]).toContain("React 2를 출시합니다.");
    expect(react?.renderedBlocks[1]).toContain("CSS 토큰을 추가합니다.");
  });

  it("기존 버전 렌더링과 같은 결과를 만든다", async () => {
    const data = await buildChangelogLlmData(sources);
    const react = data.packages.get("@seed-design/react");
    const entries = data.entries.filter(
      (entry) => entry.package.name === "@seed-design/react" && entry.package.version === "1.0.0",
    );

    expect(react?.renderedBlocks[1]).toBe(renderVersionMarkdown("1.0.0", entries, data.lookup));
  });
});

describe("createChangelogLlmDataLoader", () => {
  it("동시에 호출해도 같은 초기화 Promise를 공유한다", async () => {
    let loadCount = 0;
    const load = createChangelogLlmDataLoader(async () => {
      loadCount += 1;
      return sources;
    });

    const first = load();
    const second = load();
    const [firstData, secondData] = await Promise.all([first, second]);

    expect(first).toBe(second);
    expect(firstData).toBe(secondData);
    expect(loadCount).toBe(1);
  });
});

describe("buildChangelogLlmOutputFiles", () => {
  it("Next route와 같은 전체, 패키지별, 버전별 파일을 만든다", async () => {
    const data = await buildChangelogLlmData(sources);
    const files = buildChangelogLlmOutputFiles(data, new URL("https://seed-design.io"));
    const output = new Map(files.map((file) => [file.path, file.content]));

    expect(files).toHaveLength(6);
    expect(output.get("llms/react/updates/changelog.txt")).toStartWith(
      "# Changelog\nURL: https://seed-design.io/react/updates/changelog",
    );
    expect(output.get("llms/react/updates/changelog/react/llms.txt")).toBe(
      `# @seed-design/react Changelog

## Versions

- [2.0.0](https://seed-design.io/llms/react/updates/changelog/react/2.0.0.txt) — changes since this version
- [1.0.0](https://seed-design.io/llms/react/updates/changelog/react/1.0.0.txt) — changes since this version

---

${data.packages.get("@seed-design/react")?.renderedBlocks.join("\n\n---\n\n")}
`,
    );
    expect(output.get("llms/react/updates/changelog/react/1.0.0.txt")).toBe(
      `# @seed-design/react — Changes since 1.0.0

${data.packages.get("@seed-design/react")?.renderedBlocks.join("\n\n---\n\n")}
`,
    );
  });
});
