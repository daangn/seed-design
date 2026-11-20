---
"@seed-design/tailwind4-theme": patch
---

`@seed-design/tailwind3-plugin`에서 쓰던 SEED 토큰 유틸리티 클래스 일부가 `@seed-design/tailwind4-theme`에서 생성되지 않던 문제를 수정합니다.

- dimension 토큰을 `--spacing-*`로 제공해 `top-x2`·`inset-x4` 같은 위치, `-mt-x2` 같은 음수 값, `ms-*`·`me-*`·`ps-*`·`pe-*`, `min-w-*`·`max-w-*`, `space-x-*`, `translate-x-*`, `basis-*`, `indent-*`, `scroll-m-*`·`scroll-p-*`, `border-spacing-*`에 SEED 값을 쓸 수 있습니다.
- font-size 토큰을 `--text-*`로 제공해 `text-t5`, `text-t5-static`을 쓸 수 있습니다.
- timing-function 토큰을 `--ease-*`로 제공해 `ease-enter`, `ease-easing`, `ease-pressed-scale`을 쓸 수 있습니다.
- `p-x2`, `m-x2`, `w-x2`, `size-x2`, `gap-x2` 등 기존 크기·여백 클래스는 그대로 쓸 수 있으며, 이제 `var(--dimension-*)` 대신 `var(--spacing-*)`를 참조합니다. `--spacing-*`는 `--dimension-*`를 가리키므로 `@theme`에서 `--dimension-*`를 바꿨다면 같은 값이 적용됩니다.
- `px-*`·`py-*`·`mx-*`·`my-*`는 기존 physical 선언(`padding-left`·`padding-right` 등)을 유지하며, Tailwind의 logical 선언(`padding-inline` 등)이 함께 출력됩니다.
