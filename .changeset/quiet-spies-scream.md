---
"@seed-design/tailwind3-plugin": major
"@seed-design/tailwind4-theme": major
"@seed-design/lynx-css": major
"@seed-design/rootage-artifacts": major
"@seed-design/css": major
"@seed-design/react": major
---

Neutral Solid 배경 색상과 이를 사용하는 컴포넌트 스타일을 업데이트합니다.

- `$color.bg.neutral-solid`을 light mode에서는 `gray-900`, dark mode에서는 `gray-1000`으로 변경합니다.
- pressed 상태에 사용할 `$color.bg.neutral-solid-pressed`를 추가합니다.
- Neutral Solid 스타일을 사용하는 컴포넌트가 `$color.bg.neutral-solid`과 `$color.bg.neutral-solid-pressed`를 참조하도록 변경합니다.

업그레이드할 때 `$color.bg.neutral-solid`을 직접 사용하는 화면의 배경색과 전경색 대비를 확인하고, `@seed-design/css`를 함께 사용하는 패키지는 3.x로 업데이트해 주세요.
