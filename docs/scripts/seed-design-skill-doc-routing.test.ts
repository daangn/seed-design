import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dir, "../..");

function read(relativePath: string) {
  return readFileSync(path.join(root, relativePath), "utf-8");
}

const routedSourcePaths = [
  "skills/seed-design/SKILL.md",
  "skills/seed-design/references/doctor.md",
  "skills/seed-design/references/doctor-react.md",
  "skills/seed-design/references/doctor-lynx.md",
  "skills/seed-design/references/migration.md",
  "skills/seed-design/references/upgrade.md",
  "skills/seed-design/rules/project-config.md",
  "skills/seed-design/rules/package-compatibility.md",
  "skills/seed-design/rules/project-setup.md",
  "skills/seed-design/rules/snippet-compatibility.md",
  "skills/seed-design/rules/foundation-contract.md",
  "skills/seed-design/rules/library-authors.md",
  "skills/seed-design/rules/outdated-version.md",
  "skills/seed-design/rules/snippet-generation.md",
  "skills/seed-design/rules/no-deprecated-component.md",
  "skills/seed-design/rules/component-guidelines.md",
  "docs/content/ai-integration/skill/doctor.mdx",
  "docs/content/ai-integration/skill/index.mdx",
];

const routedSources = routedSourcePaths.map((relativePath) => ({
  relativePath,
  content: read(relativePath),
}));

describe("SEED skill document routing", () => {
  it("uses the root and platform llms indexes as the maintained entrypoints", () => {
    const skill = read("skills/seed-design/SKILL.md");

    expect(skill).toContain("https://seed-design.io/llms.txt");
    expect(skill).toContain("https://seed-design.io/react/llms.txt");
    expect(skill).toContain("https://seed-design.io/lynx/llms.txt");
  });

  it("does not pin platform leaf document routes in skill instructions", () => {
    const hardcodedLeafRoute =
      /https:\/\/seed-design\.io\/(?:llms\/(?:react|lynx)\/|(?:react|lynx)\/(?!llms(?:-full)?\.txt))/g;
    const violations = routedSources.flatMap(({ relativePath, content }) =>
      [...content.matchAll(hardcodedLeafRoute)].map((match) => ({
        relativePath,
        route: match[0],
      })),
    );

    expect(violations).toEqual([]);
  });

  it("keeps changing support inventories out of platform profiles and user docs", () => {
    const reactProfile = read("skills/seed-design/references/doctor-react.md");
    const lynxProfile = read("skills/seed-design/references/doctor-lynx.md");
    const doctorReference = read("skills/seed-design/references/doctor.md");
    const doctorDocs = read("docs/content/ai-integration/skill/doctor.mdx");

    for (const content of [reactProfile, lynxProfile]) {
      expect(content).not.toContain("## capability와 공식 근거");
      expect(content).not.toContain("## 컴포넌트 id 매핑");
      expect(content).not.toContain("## 적용 룰");
    }
    expect(doctorReference).not.toContain("## 지원 범위");
    expect(doctorDocs).not.toContain("## 지원 범위");
  });
});
