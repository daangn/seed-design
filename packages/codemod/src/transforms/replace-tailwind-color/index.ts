import type { Transform } from "jscodeshift";
import { allColorMappings } from "./mappings.js";
import { TokenMigrationReporter } from "../../utils/reporter.js";
import type { z } from "zod";
import type { transformOptionsSchema } from "../../schema.js";

// 미리 정의된 border 방향 접두사를 포함한 토큰을 처리하기 위한 정규식
const borderRegex = /^(border(?:-[trblxys])?)-(.+)$/;

// 단일 유틸리티 토큰(예: border-t-gray200, bg-blue-500 등)에 대해 매핑 로직 적용
function transformUtilityToken(token: string): string {
  // border 관련 토큰 처리 (예: border-t-, border-x- 등)
  const borderMatch = token.match(borderRegex);
  if (borderMatch) {
    const directionPrefix = borderMatch[1]; // 예: "border-t"
    const colorPart = borderMatch[2]; // 예: "gray200" 또는 "gray-200" (사용자의 네이밍에 따라 다름)
    const baseToken = `border-${colorPart}`;
    const mapping = allColorMappings.find((m) => m.previous === baseToken);
    if (mapping && mapping.next.length === 1) {
      // 매핑된 토큰은 일반적으로 "border-..." 형태로 나옴.
      const mapped = mapping.next[0].replace(/^border-/, "");
      return `${directionPrefix}-${mapped}`;
    }
    return token;
  }

  // bg, text, border 등 일반 접두사 처리
  const mapping = allColorMappings.find((m) => m.previous === token);
  if (mapping && mapping.next.length === 1) return mapping.next[0];

  return token;
}

// 콜론(:)이 포함된 토큰 예) after:border-t-gray200, hover:bg-blue-500 등
// modifier(예: after, hover 등)들은 유지하고 마지막 실제 색상 토큰만 변환
function transformTailwindColorToken(token: string): string {
  if (token.includes(":")) {
    const parts = token.split(":");
    // 마지막 요소가 실제 색상 토큰
    const utilityToken = parts.pop()!;
    const transformedUtility = transformUtilityToken(utilityToken);
    // 기존 modifier들을 다시 붙임
    return parts.concat(transformedUtility).join(":");
  }
  return transformUtilityToken(token);
}

// Tailwind 클래스 문자열 전체를 변환할 때
function transformTailwindClasses(classStr: string): string {
  const classNames = classStr.split(" ");
  const newClassNames = classNames.map((className) => transformTailwindColorToken(className));
  return newClassNames.join(" ");
}

const transform: Transform = (file, api, options) => {
  const inferredOptions = options as z.infer<typeof transformOptionsSchema>;
  const { reporter } = inferredOptions;

  const j = api.jscodeshift;
  const root = j(file.source);

  let reporterInstance: TokenMigrationReporter | null = null;
  if (reporter) {
    reporterInstance = new TokenMigrationReporter("replace-tailwind-color");
    reporterInstance.startNewFile(file.path);
  }

  // 파일 내의 모든 StringLiteral 노드를 검사하여 Tailwind 클래스가 포함된 경우 변환
  root.find(j.StringLiteral).forEach((path) => {
    const original = path.node.value;
    const transformed = transformTailwindClasses(original);
    if (original !== transformed && reporterInstance) {
      reporterInstance.addResult({
        previousToken: original,
        nextToken: transformed,
        status: "success",
        line: path.node.loc?.start.line,
      });
    }
    path.node.value = transformed;
  });

  // TemplateLiteral 내부의 문자(quasis) 처리
  root.find(j.TemplateLiteral).forEach((path) => {
    path.node.quasis.forEach((elem) => {
      const original = elem.value.raw;
      const transformed = transformTailwindClasses(original);
      if (original !== transformed && reporterInstance) {
        reporterInstance.addResult({
          previousToken: original,
          nextToken: transformed,
          status: "success",
          line: elem.loc?.start.line,
        });
      }
      elem.value.raw = transformed;
      elem.value.cooked = transformed;
    });
  });

  if (reporterInstance) {
    reporterInstance.finishFile();
    reporterInstance.writeReport();
  }

  return root.toSource();
};

export default transform;
