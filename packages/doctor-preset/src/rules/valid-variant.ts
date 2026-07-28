import { getNodePosition, Node, SyntaxKind, type StaticRule } from "@seed-design/doctor-core";

import { REFERENCE_PATHS, docsReference } from "../guidance";
import type { ComponentVariantSpec, SeedDoctorKnowledge } from "../knowledge/types";

export interface ValidVariantOptions {
  /** 프레임워크별 컴포넌트 패키지. 예: "@seed-design/react" */
  componentPackage: string;
  /** 참조 문서 URL을 만들 base. 예: "https://seed-design.io" */
  baseUrl: string;
}

/**
 * 존재하지 않는 variant 값 사용을 감지한다 (rootage ComponentSpec 기준).
 * 오탐 제로 원칙:
 * - import 이름이 rootage name과 정확히 일치할 때만 적용한다 — compound 서브 컴포넌트
 *   (ActionSheetRoot 등)는 variant 스키마가 다를 수 있어 제외.
 * - 문자열 리터럴 값만 판정한다. 표현식(variant={x})·스프레드는 건너뛴다.
 */
export function createValidVariantRule(
  knowledge: SeedDoctorKnowledge,
  options: ValidVariantOptions,
): StaticRule {
  const specByBase = new Map<string, ComponentVariantSpec>();
  for (const spec of knowledge.componentVariantSpecs) {
    specByBase.set(spec.name.replace(/[\s-]/g, ""), spec);
  }

  return {
    id: "seed/valid-variant",
    kind: "static",
    description: "최신 컴포넌트 스펙에 없는 variant 값 사용을 감지해요.",
    defaultSeverity: "error",
    guidance: {
      context:
        "variant 값은 최신 컴포넌트 스펙과 대조해요. TypeScript는 설치된 버전 기준으로만 검사하므로, 지금은 통과하지만 최신 버전에서는 사라진 값일 수 있어요 — 업그레이드할 때 걸리는 지점이에요.",
      references: [
        docsReference(options.baseUrl, REFERENCE_PATHS.deprecations, "Deprecated 현황"),
        docsReference(options.baseUrl, REFERENCE_PATHS.upgradeV2, "SEED React 2 업그레이드 가이드"),
      ],
      howToFix:
        "finding에 표시된 유효 값 중 하나로 바꾸세요. 대체값이 디자인을 바꾸는 경우가 있으니 컴포넌트 문서의 variant 설명을 함께 확인하세요.",
    },
    match: (filePath) => /\.(tsx|jsx)$/.test(filePath),
    check(context) {
      if (!context.file.content.includes(options.componentPackage)) return;

      const sourceFile = context.sourceFile();

      // 로컬 이름(alias 반영) → 컴포넌트 스펙
      const specByLocalName = new Map<string, ComponentVariantSpec>();
      for (const importDeclaration of sourceFile.getImportDeclarations()) {
        if (importDeclaration.getModuleSpecifierValue() !== options.componentPackage) continue;

        for (const namedImport of importDeclaration.getNamedImports()) {
          const spec = specByBase.get(namedImport.getName());
          if (!spec) continue;

          const localName = namedImport.getAliasNode()?.getText() ?? namedImport.getName();
          specByLocalName.set(localName, spec);
        }
      }

      if (specByLocalName.size === 0) return;

      const jsxElements = [
        ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
        ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
      ];

      for (const element of jsxElements) {
        const spec = specByLocalName.get(element.getTagNameNode().getText());
        if (!spec) continue;

        for (const attribute of element.getAttributes()) {
          if (!Node.isJsxAttribute(attribute)) continue;

          const attributeName = attribute.getNameNode().getText();
          const validValues = spec.variants[attributeName];
          if (!validValues) continue;

          const initializer = attribute.getInitializer();
          if (!initializer || !Node.isStringLiteral(initializer)) continue;

          const value = initializer.getLiteralText();
          if (validValues.includes(value)) continue;

          const position = getNodePosition(attribute);
          context.report({
            message: `\`${value}\`은(는) ${spec.name}의 유효한 ${attributeName} 값이 아니에요.`,
            line: position.line,
            column: position.column,
            remediation: `유효한 값: ${validValues.join(", ")}`,
            data: { componentId: spec.id, prop: attributeName, value },
          });
        }
      }
    },
  };
}
