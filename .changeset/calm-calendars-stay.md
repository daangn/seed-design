---
"@seed-design/react-date-picker": minor
"@seed-design/react": minor
"@seed-design/css": minor
"@seed-design/rootage-artifacts": minor
"@seed-design/lynx-css": patch
---

Date Picker에서 시작일을 유지하고 종료일만 변경할 수 있는 기능을 추가합니다.

- `selectionMode="range"`에서 `rangeStartReadOnly` prop을 사용할 수 있습니다.
- 시작일보다 늦은 날짜만 새 종료일로 선택할 수 있습니다.
- 읽기 전용 시작일의 시각적 상태와 접근성 이름을 제공합니다.

```tsx
<DatePicker
  selectionMode="range"
  rangeStartReadOnly
  value={{
    start: { year: 2026, month: 8, day: 7 },
    end: { year: 2026, month: 8, day: 9 },
  }}
/>
```
