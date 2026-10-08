import { describe, expect, it } from "bun:test";
import type { ChangelogSource } from "./parse-changelog";
import { buildChangelogLlmData, createChangelogLlmDataLoader } from "./changelog-llms";
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
  {
    packageName: "@seed-design/lynx-react",
    raw: "# @seed-design/lynx-react\n\n## 0.10.0\n\n### Minor Changes\n\n- aaa1111: Lynx 컴포넌트를 추가합니다.\n",
  },
  {
    packageName: "@seed-design/lynx-css",
    raw: "# @seed-design/lynx-css\n\n## 0.10.0\n\n### Patch Changes\n\n- bbb2222: Lynx 스타일을 추가합니다.\n",
  },
  {
    packageName: "@seed-design/rsbuild-plugin-lynx-icon",
    raw: "# @seed-design/rsbuild-plugin-lynx-icon\n\n## 0.1.0\n\n### Patch Changes\n\n- ccc3333: Lynx 아이콘 플러그인을 추가합니다.\n",
  },
];

describe("buildChangelogLlmData", () => {
  it("패키지별 버전 순서와 렌더링 결과를 한 번에 만든다", async () => {
    const data = await buildChangelogLlmData(sources, "react");
    const react = data.packages.get("@seed-design/react");

    expect(data.entries).toHaveLength(3);
    expect(react?.versions).toEqual(["2.0.0", "1.0.0"]);
    expect(react?.versionIndex.get("2.0.0")).toBe(0);
    expect(react?.versionIndex.get("1.0.0")).toBe(1);
    expect(react?.renderedBlocks[0]).toContain("React 2를 출시합니다.");
    expect(react?.renderedBlocks[1]).toContain("CSS 토큰을 추가합니다.");
  });

  it("React와 Lynx의 패키지와 항목을 분리한다", async () => {
    const react = await buildChangelogLlmData(sources, "react");
    const lynx = await buildChangelogLlmData(sources, "lynx");
    expect([...react.packages.keys()]).toEqual(["@seed-design/react", "@seed-design/css"]);
    expect([...lynx.packages.keys()]).toEqual([
      "@seed-design/lynx-react",
      "@seed-design/lynx-css",
      "@seed-design/rsbuild-plugin-lynx-icon",
    ]);
    expect(react.entries.every((entry) => !entry.package.name.includes("lynx"))).toBe(true);
    expect(lynx.entries.map((entry) => entry.package.name)).toEqual([...lynx.packages.keys()]);
  });
});

describe("createChangelogLlmDataLoader", () => {
  it("동시에 호출해도 같은 초기화 Promise를 공유한다", async () => {
    let loadCount = 0;
    const load = createChangelogLlmDataLoader(async () => {
      loadCount += 1;
      return sources;
    });

    const first = load("react");
    const second = load("react");
    const lynx = load("lynx");
    const [firstData, secondData, lynxData] = await Promise.all([first, second, lynx]);

    expect(first).toBe(second);
    expect(firstData).toBe(secondData);
    expect(firstData.packages.has("@seed-design/lynx-react")).toBe(false);
    expect(lynxData.packages.has("@seed-design/react")).toBe(false);
    expect(lynxData.packages.has("@seed-design/lynx-react")).toBe(true);
    expect(loadCount).toBe(2);
  });
});

describe("buildChangelogLlmOutputFiles", () => {
  it("플랫폼별 경로와 URL을 만들고 해당 버전 이후의 변경을 포함한다", async () => {
    const react = await buildChangelogLlmData(sources, "react");
    const lynx = await buildChangelogLlmData(sources, "lynx");
    const baseUrl = new URL("https://seed-design.io");
    const files = [
      ...buildChangelogLlmOutputFiles(react, baseUrl),
      ...buildChangelogLlmOutputFiles(lynx, baseUrl),
    ];
    const output = new Map(files.map((file) => [file.path, file.content]));
    expect(output.get("llms/react/updates/changelog.txt")).toContain(
      "URL: https://seed-design.io/react/updates/changelog",
    );
    expect(output.get("llms/react/updates/changelog.txt")).not.toContain("@seed-design/lynx-");
    expect(output.get("llms/react/updates/changelog.txt")).not.toContain(
      "@seed-design/rsbuild-plugin-lynx-icon",
    );
    expect(output.get("llms/lynx/updates/changelog.txt")).toContain(
      "URL: https://seed-design.io/lynx/updates/changelog",
    );
    expect(output.get("llms/lynx/updates/changelog.txt")).not.toContain("## @seed-design/react");
    expect(output.get("llms/lynx/updates/changelog/lynx-react/llms.txt")).toContain(
      "https://seed-design.io/llms/lynx/updates/changelog/lynx-react/0.10.0.txt",
    );
    expect(output.get("llms/lynx/updates/changelog/lynx-react/0.10.0.txt")).toContain(
      "Lynx 컴포넌트를 추가합니다.",
    );
    expect(output.has("llms/react/updates/changelog/lynx-react/llms.txt")).toBe(false);
    expect(output.get("llms/react/updates/changelog/react/1.0.0.txt")).toContain(
      "React 2를 출시합니다.",
    );
    expect(output.get("llms/react/updates/changelog/react/1.0.0.txt")).toContain(
      "CSS 토큰을 추가합니다.",
    );
    expect(output.get("llms/react/updates/changelog/react/2.0.0.txt")).not.toContain(
      "CSS 토큰을 추가합니다.",
    );
  });
});
