---
"@seed-design/css": major
"@seed-design/lynx-css": minor
"@seed-design/rootage-artifacts": major
---

(BREAKING CHANGE: `$color.bg.neutral-solid`를 직접 사용하는 화면에서 라이트·다크 모드의 배경색과 전경색 대비를 확인해야 합니다.) Neutral Solid 배경 색상과 이를 사용하는 컴포넌트 스타일을 변경합니다.

- `$color.bg.neutral-solid`를 라이트 모드에서는 `gray-1000`에서 `gray-900`으로, 다크 모드에서는 `gray-300`에서 `gray-1000`으로 변경합니다.
- 눌린 상태에 사용할 `$color.bg.neutral-solid-pressed`를 추가합니다.
- Neutral Solid 스타일을 사용하는 컴포넌트가 `$color.bg.neutral-solid`와 `$color.bg.neutral-solid-pressed`를 참조하도록 변경합니다.
