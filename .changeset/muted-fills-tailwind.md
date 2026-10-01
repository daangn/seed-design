---
"@seed-design/tailwind3-plugin": major
"@seed-design/tailwind4-theme": major
---

(BREAKING CHANGE: `bg-layer-fill` 색상을 같은 값의 `bg-neutral-muted`로 교체해야 합니다.) deprecated 상태였던 `bg-layer-fill` 색상을 제거하고 `bg-neutral-muted`를 추가합니다.

- `bg-bg-layer-fill` 같은 클래스를 `bg-bg-neutral-muted`로 교체하세요. 제거된 클래스는 빌드 에러 없이 스타일만 적용되지 않습니다.
- 새 색상은 `@seed-design/css` 3.0.0 이상, Lynx에서는 `@seed-design/lynx-css` 0.14.0 이상이 제공하는 CSS 변수를 참조합니다.
