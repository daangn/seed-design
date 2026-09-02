---
"@seed-design/rootage-artifacts": minor
"@seed-design/css": patch
"@seed-design/lynx-css": patch
---

Top Navigation의 좌우 여백을 아이콘 크기가 아니라 버튼 크기 기준으로 정리하고, `root.titleMinGap`을 추가합니다.

- `root.paddingX`가 `$dimension.x4`에서 `$dimension.x1_5`로 바뀝니다. 버튼 내부 여백 10px과 합쳐지므로 아이콘 기준 시각적 여백은 기존과 같은 16px입니다.
- `theme=android`의 `main.paddingLeft`도 같은 이유로 `$dimension.x1_5`가 됩니다.
- `root.titleMinGap`은 가운데 정렬된 title이 좌우 영역과 겹치지 않도록 보장하는 최소 간격입니다.
- 웹과 Lynx의 App Bar recipe는 아직 이 스펙 변경을 반영하지 않고 기존 값에 고정해 두었으므로, 생성되는 CSS가 달라지지 않습니다. 두 플랫폼의 App Bar 구현 차이를 정리한 뒤에 함께 반영할 예정입니다.
