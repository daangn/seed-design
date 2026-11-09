---
"@seed-design/react-date-picker": minor
"@seed-design/react": minor
"@seed-design/css": minor
---

Date Picker에 두 주를 두 줄로 표시하는 `visibleRange: "twoWeeks"` 레이아웃을 추가합니다.

- 이전·다음 버튼과 `PageUp`·`PageDown`은 두 주씩 이동합니다. 제목은 첫 줄에서 더 많은 날짜를 차지하는 월을 표시합니다.
- Continuous를 제외한 모든 레이아웃에서 표시 구간이 바뀌면 새 날짜 줄이 이동한 방향에서 20px 밀려 들어오며 나타납니다. `prefers-reduced-motion: reduce` 환경에서는 페이드만 적용합니다.
- `npx @seed-design/cli@latest add ui:date-picker`로 `TwoWeekDatePicker`가 포함된 Registry 컴포넌트를 설치할 수 있습니다.
