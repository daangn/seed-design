---
"@seed-design/tailwind3-plugin": patch
"@seed-design/tailwind4-theme": patch
"@seed-design/rootage-artifacts": patch
"@seed-design/css": patch
---

`$color.bg.layer-basement` 위에서 컴포넌트의 가시성을 보장하기 위해 `$color.bg.neutral-weak-alpha` 토큰을 추가합니다.

- Chip `variant=solid`에 적용
- ChipTab `variant=neutralSolid`에 적용
- SegmentedControl root에 적용
