---
"@seed-design/tailwind3-plugin": major
"@seed-design/tailwind4-theme": major
"@seed-design/lynx-css": major
"@seed-design/rootage-artifacts": major
"@seed-design/css": major
"@seed-design/react": major
---

Solid 배경 전용 전경색 토큰을 추가하고 기존 직접 참조를 정리합니다.

- `$color.fg.on-brand-solid`, `$color.fg.on-critical-solid`, `$color.fg.on-informative-solid`, `$color.fg.on-neutral-solid`, `$color.fg.on-positive-solid`, `$color.fg.on-warning-solid`을 추가합니다.
- Solid 배경을 사용하는 컴포넌트가 팔레트 색상이나 `$color.fg.neutral-inverted` 대신 새 전경색 토큰을 참조하도록 변경합니다.
- 서버 토큰 마이그레이션의 하위 호환성을 위해 `$color.fg.neutral-inverted`를 deprecated 상태로 유지하며, `@seed-design/css@4.0.0`에서 제거할 예정입니다.
