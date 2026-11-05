const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  // 정적 export는 UTC로 렌더되므로, KST 자정 기준 publishedAt이 하루 빠르게 표시되지 않도록 고정.
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

// "2026. 6. 17" 형태(YYYY. M. D, 월·일 앞자리 0 없음, 끝 마침표 없음). ko-KR numeric은 로케일에 따라
// 트레일링 마침표를 붙이므로, formatToParts로 숫자만 뽑아 원하는 구분자로 다시 조립한다.
// Updates 상세(`[slug]/page.tsx`)와 목록(`page.tsx`) 카드가 같은 날짜 표기를 쓰도록 공유한다.
export function formatPublishedDate(date: Date): string {
  const parts = dateFormatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}. ${get("month")}. ${get("day")}`;
}
