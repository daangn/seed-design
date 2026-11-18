export const digitsOnly = (value: string) => value.replace(/\D/g, "");

const SEPARATED_DATE = /^\s*(\d{4})\D+(\d{1,2})\D+(\d{1,2})\D*$/;
const COMPACT_DATE = /^\s*(\d{4})(\d{2})(\d{2})\s*$/;

/**
 * 붙여넣은 날짜(`yyyy-MM-dd`, `yyyy. MM. dd.`, `yyyyMMdd` 등)를 Segment 길이에 맞춥니다.
 * length 6 → `yyMMdd`, 8 → `yyyyMMdd`. 날짜 형태가 아니면 null을 반환합니다.
 */
export function normalizeBirthDate(value: string, length: number) {
  if (length !== 6 && length !== 8) return null;

  const match = SEPARATED_DATE.exec(value) ?? COMPACT_DATE.exec(value);
  if (!match) return null;

  const [, year, month, day] = match as unknown as [string, string, string, string];
  const date = `${year}${month.padStart(2, "0")}${day.padStart(2, "0")}`;

  return length === 6 ? date.slice(2) : date;
}
