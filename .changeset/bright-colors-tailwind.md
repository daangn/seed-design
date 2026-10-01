---
"@seed-design/tailwind3-plugin": major
"@seed-design/tailwind4-theme": major
---

(BREAKING CHANGE: `@seed-design/css` 3.0.0과 함께 사용하면 `bg-neutral-solid`의 색상이 바뀌므로, 이 색상을 직접 사용하는 화면에서 라이트·다크 모드의 배경색과 전경색 대비를 확인해야 합니다.) Solid 배경에 쓰는 색상을 추가합니다.

- Solid 배경 위 전경색 `fg-on-brand-solid`, `fg-on-critical-solid`, `fg-on-informative-solid`, `fg-on-neutral-solid`, `fg-on-positive-solid`, `fg-on-warning-solid`를 추가합니다(예: `text-fg-on-neutral-solid`).
- 눌린 상태의 Neutral Solid 배경색 `bg-neutral-solid-pressed`를 추가합니다(예: `bg-bg-neutral-solid-pressed`).
- 새 색상은 `@seed-design/css` 3.0.0 이상, Lynx에서는 `@seed-design/lynx-css` 0.14.0 이상이 제공하는 CSS 변수를 참조합니다. 새 색상을 사용하려면 해당 패키지를 함께 업그레이드하세요.
- `bg-neutral-solid`는 `@seed-design/css` 3.0.0의 `$color.bg.neutral-solid` 값 변경에 따라 라이트 모드에서 `gray-900`, 다크 모드에서 `gray-1000`으로 표시됩니다.
- `bg-neutral-inverted`, `bg-neutral-inverted-pressed`, `fg-neutral-inverted`는 그대로 제공합니다. 세 색상 모두 `@seed-design/css`에서 deprecated된 토큰이므로 같은 값의 `bg-neutral-solid`, `bg-neutral-solid-pressed`, `fg-on-neutral-solid`로 교체하세요.
