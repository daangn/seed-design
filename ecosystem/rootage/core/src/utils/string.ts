/**
 * 문자열을 kebab-case로 변환하는 유틸리티 함수
 *
 * 특징:
 * - t1, t2와 같은 타이포그래피 식별자는 특별 처리
 * - 숫자와 문자 사이에 하이픈 추가
 * - 대문자 앞에 하이픈 추가하고 소문자로 변환
 * - 중복 하이픈 제거
 */
export function convertToKebabCase(input: string): string {
  // t1, t2와 같은 타이포그래피 식별자는 특별 처리
  if (/^t\d+$/.test(input)) {
    return input;
  }

  // 나머지 일반적인 케이스는 기존 로직 사용
  // 숫자와 문자가 붙어있는 경우 분리 (t1 패턴 제외)
  const withLetterDigitSplit = input.replace(/([A-Za-z])(\d)/g, (_match, p1, p2) => {
    // t1, t2 등의 패턴은 제외
    if (p1 === "t") return `${p1}${p2}`;
    return `${p1}-${p2}`;
  });

  const withDigitLetterSplit = withLetterDigitSplit.replace(/(\d)([A-Za-z])/g, "$1-$2");

  // 대문자를 소문자로 변환하고 대문자 앞에 하이픈 추가
  return withDigitLetterSplit
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "") // 맨 앞의 하이픈 제거
    .replace(/-+/g, "-"); // 중복된 하이픈 제거
}
