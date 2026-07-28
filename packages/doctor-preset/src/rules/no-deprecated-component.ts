import { getNodePosition, type StaticRule } from "@seed-design/doctor-core";

import { REFERENCE_PATHS, docsReference } from "../guidance";
import type { DeprecatedSnippetItem, SeedDoctorKnowledge } from "../knowledge/types";

export interface NoDeprecatedComponentOptions {
  /** 프레임워크별 컴포넌트 패키지. 예: "@seed-design/react" */
  componentPackage: string;
  /** 스캔 루트 기준 스니펫 디렉토리 posix 상대 경로. 없으면 스니펫 검사(Detection B)를 건너뛴다. */
  snippetRoot?: string;
  /** 참조 문서 URL을 만들 base. 예: "https://seed-design.io" */
  baseUrl: string;
}

interface MatcherEntry {
  /** rootage name에서 공백·하이픈을 제거한 export 매칭용 접두어. 예: "Action Sheet" → "ActionSheet" */
  base: string;
  componentId: string;
  message?: string;
}

function normalizeRoot(root?: string): string | undefined {
  if (root === undefined) return undefined;
  return root.replace(/^\.\//, "").replace(/\/+$/, "");
}

function isUnder(path: string, root: string): boolean {
  if (root === "") return true;
  return path === root || path.startsWith(`${root}/`);
}

/**
 * deprecated 컴포넌트 사용을 감지한다.
 * - Detection A: 컴포넌트 패키지에서 deprecated 컴포넌트를 import하는 코드
 * - Detection B: 프로젝트에 설치된 deprecated 스니펫 파일
 * 스니펫 디렉토리 내부 파일은 A에서 제외한다 — 스니펫이 패키지를 감싸는 건 정당한 사용이다.
 */
export function createNoDeprecatedComponentRule(
  knowledge: SeedDoctorKnowledge,
  options: NoDeprecatedComponentOptions,
): StaticRule {
  // 최장 일치 우선 — ActionSheetItem은 action-sheet가 아니라 action-sheet-item으로 매칭돼야 한다.
  const entries: MatcherEntry[] = knowledge.deprecatedComponents
    .map((component) => ({
      base: component.name.replace(/[\s-]/g, ""),
      componentId: component.id,
      message: component.message,
    }))
    .sort((a, b) => b.base.length - a.base.length);

  const snippetRoot = normalizeRoot(options.snippetRoot);

  const snippetItemByPath = new Map<string, DeprecatedSnippetItem>();
  for (const item of knowledge.deprecatedSnippetItems) {
    for (const snippetPath of item.snippetPaths) {
      snippetItemByPath.set(`${item.registryId}/${snippetPath}`, item);
    }
  }

  function matchSpecifier(name: string): MatcherEntry | undefined {
    return entries.find(
      (entry) =>
        name === entry.base ||
        (name.startsWith(entry.base) && /[A-Z]/.test(name.charAt(entry.base.length))),
    );
  }

  return {
    id: "seed/no-deprecated-component",
    kind: "static",
    description: "deprecated 컴포넌트 import와 설치된 deprecated 스니펫을 감지해요.",
    defaultSeverity: "warn",
    guidance: {
      context:
        "deprecated 컴포넌트는 다음 메이저에서 제거돼요. 지금 당장 동작이 깨지진 않지만, 업그레이드하려면 먼저 정리해야 해요. 어떤 버전에서 제거되는지와 대체안은 deprecation 현황 문서에 정리돼 있어요.",
      references: [
        docsReference(options.baseUrl, REFERENCE_PATHS.deprecations, "Deprecated 현황"),
        docsReference(options.baseUrl, REFERENCE_PATHS.upgradeV2, "SEED React 2 업그레이드 가이드"),
      ],
      howToFix:
        "각 항목의 대체 컴포넌트로 교체하세요. 스니펫이 deprecated인 경우 대체 스니펫을 설치하고(`npx @seed-design/cli@latest add --on-diff backup <item>`) 기존 파일의 커스터마이징을 옮기세요.",
    },
    match: (filePath) => /\.(ts|tsx|js|jsx)$/.test(filePath),
    check(context) {
      const filePath = context.file.path;

      // Detection B — 스니펫 디렉토리 내부는 파일 경로로만 판정한다.
      if (snippetRoot !== undefined && isUnder(filePath, snippetRoot)) {
        const relativePath = snippetRoot === "" ? filePath : filePath.slice(snippetRoot.length + 1);
        const item = snippetItemByPath.get(relativePath);
        if (item) {
          context.report({
            message: `\`${item.registryId}:${item.itemId}\` 스니펫은 deprecated 상태예요.`,
            line: 1,
            remediation: item.message ?? "seed-design.io에서 대체 컴포넌트를 확인해주세요.",
            data: { registryId: item.registryId, itemId: item.itemId },
          });
        }
        return;
      }

      // Detection A — deprecated 컴포넌트 import 감지
      if (!context.file.content.includes(options.componentPackage)) return;

      const sourceFile = context.sourceFile();
      for (const importDeclaration of sourceFile.getImportDeclarations()) {
        if (importDeclaration.getModuleSpecifierValue() !== options.componentPackage) continue;

        // named import만 검사한다. namespace import(import * as Seed)는 사용 지점 추적이
        // 필요해 v1에서 제외, default export는 컴포넌트 패키지에 존재하지 않는다.
        for (const namedImport of importDeclaration.getNamedImports()) {
          const importedName = namedImport.getName();
          const entry = matchSpecifier(importedName);
          if (!entry) continue;

          const position = getNodePosition(namedImport);
          context.report({
            message: `\`${importedName}\`은(는) deprecated 상태예요.`,
            line: position.line,
            column: position.column,
            remediation: entry.message,
            data: { componentId: entry.componentId, specifier: importedName },
          });
        }
      }
    },
  };
}
