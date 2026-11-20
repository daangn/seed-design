---
"@seed-design/tailwind4-theme": minor
---

Tailwind CSS 4에서 dimension 토큰으로 위치를 지정하고 음수 값을 쓸 수 있습니다.

- `top`·`right`·`bottom`·`left`·`inset`·`inset-x`·`inset-y` 유틸리티를 추가합니다. `right-[var(--seed-dimension-x2)]` 대신 `right-x2`로 씁니다.
- 위치와 margin 유틸리티에 음수 값을 씁니다. 예: `-right-x2`, `-mt-x2`
