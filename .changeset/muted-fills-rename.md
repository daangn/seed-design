---
"@seed-design/css": major
"@seed-design/lynx-css": minor
"@seed-design/rootage-artifacts": major
---

(BREAKING CHANGE: `$color.bg.layer-fill`을 같은 값의 `$color.bg.neutral-muted`로 교체해야 합니다.) deprecated 상태였던 `$color.bg.layer-fill`을 제거하고 같은 값의 `$color.bg.neutral-muted`를 추가합니다.

- `$color.bg.neutral-muted`는 라이트 모드에서 `gray-100`, 다크 모드에서 `gray-200`으로, 기존 `$color.bg.layer-fill`과 값이 같습니다.
- `--seed-color-bg-layer-fill`을 `--seed-color-bg-neutral-muted`로, `vars.$color.bg.layerFill`을 `vars.$color.bg.neutralMuted`로 교체하세요.
- CSS 변수를 직접 쓴 코드나 `bg="bg.layerFill"` 같은 style prop 값은 에러 없이 배경색만 사라지므로 문자열로 검색해 확인하세요.
