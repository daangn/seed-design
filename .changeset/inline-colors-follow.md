---
"@seed-design/tailwind4-theme": patch
---

하위 영역에서 색상 모드를 덮어쓸 때(`data-seed-color-mode="dark-only"`, Lynx의 `seed-color-mode-dark-only` 등) 색상·shadow·gradient 유틸리티가 그 영역의 값을 따르지 않던 문제를 수정합니다.

- 색상·shadow·gradient 유틸리티가 `var(--seed-color-*)` 등 SEED 토큰을 직접 참조합니다.
- `--color-*`, `--shadow-*`, `--gradient-*` theme 변수는 Tailwind가 처리하는 CSS에서 참조할 때만 `:root`에 출력됩니다. 인라인 `style` 등 Tailwind 밖에서 이 변수를 참조했다면 `--seed-color-*` 등 SEED 토큰을 직접 사용하세요.
