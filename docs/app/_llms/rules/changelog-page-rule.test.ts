import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { createChangelogPageRule } from "./changelog-page-rule";

const sources = [
  { packageName: "@seed-design/react", raw: "# @seed-design/react\n\n## 3.0.0\n\nReact release" },
  {
    packageName: "@seed-design/lynx-react",
    raw: "# @seed-design/lynx-react\n\n## 0.10.0\n\nLynx release",
  },
  {
    packageName: "@seed-design/rsbuild-plugin-lynx-icon",
    raw: "# @seed-design/rsbuild-plugin-lynx-icon\n\n## 0.1.0\n\nIcon release",
  },
];

describe("changelogPageRule", () => {
  it("동일한 룰 인스턴스에서 platform 속성에 따라 패키지를 분리한다", async () => {
    const rule = createChangelogPageRule(async () => sources);
    await rule.init?.();
    const react = normalizeLLMBodyWithRules('<ChangelogPage platform="react" />', [rule]);
    const lynx = normalizeLLMBodyWithRules('<ChangelogPage platform="lynx" />', [rule]);
    expect(react).toContain("## @seed-design/react");
    expect(react).not.toContain("@seed-design/lynx-react");
    expect(react).not.toContain("@seed-design/rsbuild-plugin-lynx-icon");
    expect(lynx).toContain("## @seed-design/lynx-react");
    expect(lynx).toContain("## @seed-design/rsbuild-plugin-lynx-icon");
    expect(lynx).not.toContain("## @seed-design/react");
  });
});
