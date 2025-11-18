---
"@seed-design/tailwind3-plugin": patch
"@seed-design/tailwind4-theme": patch
"@seed-design/rootage-artifacts": patch
"@seed-design/css": patch
---

transparent 상태 컬러 추가, 컴포넌트 상태 컬러 변경, transition 추가

- `$color.bg.transparent-pressed` 컬러와 `$color.bg.transparent` 컬러가 추가되었습니다.
- 다음 컴포넌트들의 색상이 transparent 관련 토큰으로 변경되었습니다.
  - `Chip` (outlineStrong, outlineWeak)
  - `Action Button` (neutralOutline, brandOutline, ghost)
  - `Checkmark`
  - `Tabs` (outline)
  - `List Item`
  - `Radiomark`
  - `Reaction Button`
  - `Select Box`
- 다음 컴포넌트들의 color transition이 추가되었습니다. (duration: $duration.d3, timing-function: $timing-function.easing)
  - `Checkmark`
  - `Radiomark`
  - `Reaction Button`
  - `Select Box`
