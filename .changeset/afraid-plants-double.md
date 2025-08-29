---
"@seed-design/tailwind3-plugin": patch
"@seed-design/tailwind4-theme": patch
"@seed-design/rootage-artifacts": patch
"@seed-design/react": patch
"@seed-design/css": patch
---

시맨틱 색상 토큰을 추가합니다.

- `$color.stroke.control-selected`

Chip 컴포넌트를 업데이트합니다.

- 아이콘에 트랜지션 효과가 적용되지 않던 현상을 수정합니다.
- Button, Toggle 등 사용되는 방식에 따라 적절한 data prop을 받도록 수정합니다.
- `$color.stroke.field-focused` 대신 `$color.stroke.control-selected` 색상을 사용합니다.
