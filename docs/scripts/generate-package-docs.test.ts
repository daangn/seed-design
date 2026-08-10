import { describe, expect, it } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// generate-package-docs.ts가 커밋한 산출물(packages/*/docs)의 무결성을 검증한다.
// 산출물이 스테일하거나(재생성 누락), props 추출이 실패한 채(미빌드 워크스페이스)
// 커밋되는 회귀를 CI에서 잡는 게 목적이다.

const REPO_ROOT = path.join(import.meta.dir, "../..");
const PACKAGE_DOCS_DIRS = ["packages/react/docs", "packages/stackflow/docs"];

function listMarkdownFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".md") && file !== "index.md")
    .sort();
}

describe.each(PACKAGE_DOCS_DIRS)("%s", (docsDir) => {
  const absDir = path.join(REPO_ROOT, docsDir);

  it("산출물이 존재한다", () => {
    expect(existsSync(path.join(absDir, "index.md"))).toBe(true);
    expect(listMarkdownFiles(absDir).length).toBeGreaterThan(0);
  });

  it("index.md가 모든 문서를 링크하고, 링크된 문서가 모두 존재한다", () => {
    const index = readFileSync(path.join(absDir, "index.md"), "utf8");
    const linked = [...index.matchAll(/\]\(\.\/(.+?\.md)\)/g)].map((match) => match[1]).sort();

    expect(linked).toEqual(listMarkdownFiles(absDir));
  });
});

describe("packages/react/docs 내용 스팟체크", () => {
  const actionButton = readFileSync(
    path.join(REPO_ROOT, "packages/react/docs/action-button.md"),
    "utf8",
  );

  it("예제 코드가 인라인되어 있다 (doc-gen 경로 참조가 아니라)", () => {
    expect(actionButton).toContain("```tsx");
    expect(actionButton).not.toContain("doc-gen:file");
  });

  it("props 타입이 추출되어 있다 (미빌드 워크스페이스에서 생성하면 비어버린다)", () => {
    expect(actionButton).toContain("- `variant`");
  });
});

describe("packages/stackflow/docs 내용 스팟체크", () => {
  it("예제 코드가 인라인되어 있다", () => {
    const appScreen = readFileSync(
      path.join(REPO_ROOT, "packages/stackflow/docs/app-screen.md"),
      "utf8",
    );
    expect(appScreen).toContain("```tsx");
    expect(appScreen).not.toContain("doc-gen:file");
  });
});
