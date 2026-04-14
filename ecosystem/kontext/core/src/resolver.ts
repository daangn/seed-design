import { basename, relative } from "node:path";

/**
 * {id} → kebab-case, {Id} → PascalCase 템플릿을 실제 파일명으로 확장.
 *
 * @example
 * expandTemplate("packages/react/src/components/{Id}/", "action-button")
 * // → "packages/react/src/components/ActionButton/"
 *
 * expandTemplate("packages/qvism-preset/src/recipes/{id}.ts", "action-button")
 * // → "packages/qvism-preset/src/recipes/action-button.ts"
 */
export function expandTemplate(template: string, id: string): string {
  return template.replace(/\{id\}/g, id).replace(/\{Id\}/g, toPascalCase(id));
}

/**
 * 파일 경로에서 컴포넌트 ID(kebab-case)를 추출.
 *
 * @example
 * extractId("packages/rootage/components/action-button.yaml", "components/*.yaml")
 * // → "action-button"
 *
 * extractId("packages/react/src/components/ActionButton/ActionButton.tsx", "src/components/** /*")
 * // → "action-button"
 */
export function extractId(
  filePath: string,
  watchPattern: string,
  packageDir: string,
): string | null {
  const relPath = relative(packageDir, filePath);
  const patternParts = watchPattern.split("/");
  const pathParts = relPath.split("/");

  // glob에서 * 위치를 찾아 해당 부분에서 이름 추출
  for (let i = 0; i < patternParts.length; i++) {
    const pp = patternParts[i];
    if (pp === undefined || pathParts[i] === undefined) continue;

    if (pp.includes("*") && !pp.includes("**")) {
      // "*.yaml" → 파일명에서 확장자 제거
      const name = basename(pathParts[i]!, getExtFromGlob(pp));
      return toKebabCase(name);
    }
  }

  // ** 패턴이면 첫 번째 디렉토리명을 ID로 사용
  if (watchPattern.includes("**")) {
    const afterStatic = getStaticPrefixLength(watchPattern);
    const segment = pathParts[afterStatic];
    if (segment) {
      return toKebabCase(basename(segment, getExtFromPath(segment)));
    }
  }

  return null;
}

/**
 * 템플릿 경로에 {id} 또는 {Id} 플레이스홀더가 있는지 확인
 */
export function hasTemplate(path: string): boolean {
  return path.includes("{id}") || path.includes("{Id}");
}

function toPascalCase(kebab: string): string {
  return kebab
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function toKebabCase(name: string): string {
  // PascalCase → kebab-case
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function getExtFromGlob(pattern: string): string {
  const dotIdx = pattern.lastIndexOf(".");
  return dotIdx >= 0 ? pattern.slice(dotIdx) : "";
}

function getExtFromPath(filename: string): string {
  const dotIdx = filename.lastIndexOf(".");
  return dotIdx >= 0 ? filename.slice(dotIdx) : "";
}

function getStaticPrefixLength(pattern: string): number {
  const parts = pattern.split("/");
  let count = 0;
  for (const p of parts) {
    if (p.includes("*")) break;
    count++;
  }
  return count;
}
