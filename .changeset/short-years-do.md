---
"@seed-design/tailwind3-plugin": minor
"@seed-design/migration-index": minor
"@seed-design/tailwind4-theme": minor
"@seed-design/stackflow": minor
"@seed-design/rootage-artifacts": minor
"@seed-design/figma": minor
"@seed-design/react": minor
"@seed-design/css": minor
"@seed-design/mcp": minor
---

1.2에서 Deprecate된 옵션을 제거합니다.

- 색상 토큰
  - `$color.bg.layer-fill`: 라이트 및 다크 모드에서 모두 테스트 후 `$color.bg.neutral-weak`으로 대체할 수 있습니다.
- 그라디언트 토큰
  - `$gradient.fade-layer-floating`
  - `$gradient.fade-layer-default`
- Chip Tabs의 `brandSolid` variant
- Image Frame의 `rounded` variant
- Switch의 `small` 및 `medium` size: 각각 `16`과 `32`를 사용해주세요.
- Checkbox의 `default` 및 `stronger` weight: 각각 `regular`와 `bold`를 사용해주세요.
- `<Box display="inlineFlex" />` 등 유틸리티 컴포넌트 레이아웃 프로퍼티의 camelCase 옵션: kebab-case 옵션을 사용해주세요.
  - `display`, `justifyContent`, `justify`, `alignItems`, `align`, `alignContent`, `alignSelf`, `flexDirection`, `direction`
