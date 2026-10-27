export const digitsOnly = (value: string) => value.replace(/\D/g, "");

const SEPARATED_DATE = /^\s*(\d{4})\D+(\d{1,2})\D+(\d{1,2})\D*$/;
const COMPACT_DATE = /^\s*(\d{4})(\d{2})(\d{2})\s*$/;

/**
 * OS 자동완성이 넣은 날짜(`yyyy-MM-dd`, `yyyy. MM. dd.`, `yyyyMMdd` 등)를 Segment 길이에 맞춘다.
 * length 6 → `yyMMdd`, 8 → `yyyyMMdd`. 날짜 형태가 아니면 null을 반환한다.
 */
export function normalizeBirthDate(
  value: string,
  length: number,
  { allowCompact = true }: { allowCompact?: boolean } = {},
) {
  if (length !== 6 && length !== 8) return null;

  const match = SEPARATED_DATE.exec(value) ?? (allowCompact ? COMPACT_DATE.exec(value) : null);
  if (!match) return null;

  const [, year, month, day] = match as unknown as [string, string, string, string];
  const date = `${year}${month.padStart(2, "0")}${day.padStart(2, "0")}`;

  return length === 6 ? date.slice(2) : date;
}
