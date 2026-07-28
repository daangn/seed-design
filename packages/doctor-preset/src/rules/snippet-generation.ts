import type { StaticRule } from "@seed-design/doctor-core";

import { REFERENCE_PATHS, docsReference } from "../guidance";
import type { SeedDoctorKnowledge } from "../knowledge/types";

export interface SnippetGenerationOptions {
  /** 스캔 루트 기준 스니펫 디렉토리 posix 상대 경로. 없으면 룰이 동작하지 않는다. */
  snippetRoot?: string;
  baseUrl: string;
}

/** 설치된 스니펫 헤더의 `@requires @seed-design/react@^2.0.0` 선언을 읽는다. */
function parseRequires(content: string): Record<string, string> {
  const requires: Record<string, string> = {};
  // 헤더 JSDoc 안에만 있으므로 앞부분만 훑어도 충분하다.
  for (const match of content.slice(0, 1000).matchAll(/@requires\s+(\S+)@(\S+)/g)) {
    requires[match[1]] = match[2];
  }
  return requires;
}

function formatSpecs(specs: Record<string, string>): string {
  return Object.entries(specs)
    .map(([name, range]) => `${name}@${range}`)
    .join(", ");
}

function normalizeRoot(root?: string): string | undefined {
  if (root === undefined) return undefined;
  return root.replace(/^\.\//, "").replace(/\/+$/, "");
}

/**
 * 설치된 스니펫이 어느 세대에서 왔는지 알려준다.
 *
 * 스니펫은 복사본이라 패키지를 올려도 자동으로 갱신되지 않는다. 설치 파일 헤더의
 * `@requires` 범위와 현재 registry의 범위를 비교하면 세대 차이를 **해시 없이 정확히**
 * 알 수 있다. 로컬 수정 여부는 판정하지 않는다 — 그건 rsc/tsx 변환 때문에 단순 비교로는
 * 오탐이 나므로 별도 작업으로 미뤄뒀다.
 */
export function createSnippetGenerationRule(
  knowledge: SeedDoctorKnowledge,
  options: SnippetGenerationOptions,
): StaticRule {
  const snippetRoot = normalizeRoot(options.snippetRoot);

  // `{registryId}/{snippetPath}` → canonical @requires
  const canonicalByPath = new Map<string, Record<string, string>>();
  for (const item of knowledge.snippetItems) {
    for (const snippetPath of item.snippetPaths) {
      canonicalByPath.set(`${item.registryId}/${snippetPath}`, item.requires);
    }
  }

  return {
    id: "seed/snippet-generation",
    kind: "static",
    description: "설치된 스니펫이 최신 세대인지 알려줘요.",
    defaultSeverity: "info",
    guidance: {
      context:
        "스니펫은 프로젝트로 복사되는 코드라서 패키지를 업그레이드해도 자동으로 갱신되지 않아요. 설치 당시 버전에 맞춰진 구현이 그대로 남아 있으면, 최신 패키지와 조합했을 때 의도한 동작이나 스타일이 나오지 않을 수 있어요.",
      references: [
        docsReference(options.baseUrl, REFERENCE_PATHS.cliCommands, "CLI 명령어 (add · compat)"),
        docsReference(options.baseUrl, REFERENCE_PATHS.upgradeV2, "SEED React 2 업그레이드 가이드"),
      ],
      howToFix:
        "`npx @seed-design/cli@latest add --on-diff backup <registryId>:<itemId>`로 다시 설치하세요. `backup`을 쓰면 기존 파일이 `legacy-<파일명>-<timestamp>`로 남아서 커스터마이징을 옮길 수 있어요. 설치 후 `compat`으로 패키지 버전과 맞는지 확인하세요.",
    },
    match: (filePath) =>
      snippetRoot !== undefined &&
      (snippetRoot === "" || filePath.startsWith(`${snippetRoot}/`)) &&
      /\.(ts|tsx|js|jsx)$/.test(filePath),
    check(context) {
      if (snippetRoot === undefined) return;

      const relativePath =
        snippetRoot === "" ? context.file.path : context.file.path.slice(snippetRoot.length + 1);
      const canonical = canonicalByPath.get(relativePath);
      if (!canonical || Object.keys(canonical).length === 0) return;

      const installed = parseRequires(context.file.content);
      if (Object.keys(installed).length === 0) return;

      const outdated = Object.entries(canonical).filter(
        ([name, range]) => installed[name] !== undefined && installed[name] !== range,
      );
      if (outdated.length === 0) return;

      context.report({
        // "현재 X"라고 쓰면 프로젝트에 설치된 패키지 버전으로 오해된다. 이 룰이 비교하는 건
        // 스니펫 세대(설치 시점 기준 vs 최신 registry 기준)이지 프로젝트 버전이 아니다.
        message: `구버전 스니펫이에요 (${formatSpecs(installed)} 기준으로 설치됨, 최신 스니펫은 ${formatSpecs(canonical)} 기준).`,
        line: 1,
        data: { installed, canonical, snippetPath: relativePath },
      });
    },
  };
}
