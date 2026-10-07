---
"@seed-design/rootage-artifacts": patch
---

화면 끝을 기준으로 위치를 잡는 컴포넌트의 스펙에 safe area 요구사항을 반영합니다.

- `bottom-sheet`, `menu-sheet` 컴포넌트 스펙의 `content`에 최대 높이 비율을 나타내는 `maxHeightFraction` 속성(기본값 `0.9`)을 추가합니다.
- `dialog`, `alert-dialog`, `bottom-sheet`, `menu-sheet`, `side-panel`, `popover`, `help-bubble`, `menu`, `select`, `snackbar` 컴포넌트 스펙에 safe area 경계를 기준으로 배치하고 크기를 계산하는 방식을 설명으로 추가합니다.
