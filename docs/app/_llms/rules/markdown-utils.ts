/**
 * @description `|` 기호를 `\|`로 변환합니다.
 */
export function escapeCell(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

/**
 * @description 행을 마크다운 테이블 형식으로 포맷합니다.
 */
export function markdownRow(cells: string[]): string {
  return `| ${cells.join(" | ")} |`;
}
