/**
 * vars.$scale.color.carrot500 -> $scale.color.carrot-500
 * vars.$scale.color.grayAlpha50 -> $scale.color.gray-alpha-50
 */
export function toKebabCaseWithNumbers(name: string): string {
  const result = name
    .replace(/^vars\./, "")
    .replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
    .replace(/(\d+)/g, "-$1");

  return result;
}

/**
 * $scale.color.carrot-500 -> vars.$scale.color.carrot500
 * $scale.color.gray-alpha-50 -> vars.$scale.color.grayAlpha50
 */
export function fromKebabCaseWithNumbers(name: string): string {
  const result = `vars.${name
    .replace(/-(\d+)/g, "$1")
    .replace(/-([a-z])/g, (_, char) => char.toUpperCase())}`;

  return result;
}

/**
 * Typography token mapping helper for formatting token names
 *
 * Takes a mapped token name like 't5Bold' and formats it for use in the codebase
 * as typoVars.textStyleT5Bold.enabled.root
 *
 * @param tokenName The mapped token name (e.g. 't5Bold', 'screenTitle', 'articleBody', etc.)
 * @returns Formatted token path including necessary prefixes
 */
export function formatTypographyToken(tokenName: string): string {
  if (!tokenName) {
    throw new Error("Token name cannot be null or empty");
  }

  // t1Bold, t2Bold와 같은 기본 타입 토큰 처리
  if (/^t\d/.test(tokenName)) {
    // t1Bold, t5Bold는 그대로 사용 (결과: typoVars.textStyleT1Bold.enabled.root)
    const result = `typoVars.textStyle${tokenName.charAt(0).toUpperCase()}${tokenName.slice(1)}.enabled.root`;
    return result;
  }

  // screenTitle, articleBody와 같은 특수 토큰 처리 (모두 소문자)
  if (!/[A-Z]/.test(tokenName)) {
    // 첫 글자를 대문자로 변환 (PascalCase)
    const pascalCase = tokenName.charAt(0).toUpperCase() + tokenName.slice(1);
    const result = `typoVars.textStyle${pascalCase}.enabled.root`;
    return result;
  }

  // 일반적인 camelCase 토큰 처리 (첫 글자만 대문자로)
  const pascalCase = tokenName.charAt(0).toUpperCase() + tokenName.slice(1);
  const result = `typoVars.textStyle${pascalCase}.enabled.root`;
  return result;
}
