/**
 * camelCaseToKebabCase 함수는 camelCase 형식을 kebab-case로 변환합니다.
 * 예: divider1 -> divider-1, paperDefault -> paper-default
 */
export function camelCaseToKebabCase(camelCase: string): string {
  // 대문자 앞에 - 추가하고 소문자로 변환
  let kebabCase = camelCase.replace(/([A-Z])/g, "-$1").toLowerCase();

  // 숫자 앞에 - 추가 (divider1 -> divider-1)
  kebabCase = kebabCase.replace(/([a-z])(\d+)/g, "$1-$2");

  return kebabCase;
}
