---
"@seed-design/css": minor
"@seed-design/lynx-css": minor
"@seed-design/rootage-artifacts": minor
---

Solid 배경 위에 쓰는 전경색 토큰을 추가하고, SEED 컴포넌트가 이 토큰을 사용하도록 변경합니다.

- `$color.fg.on-brand-solid`, `$color.fg.on-critical-solid`, `$color.fg.on-informative-solid`, `$color.fg.on-neutral-solid`, `$color.fg.on-positive-solid`, `$color.fg.on-warning-solid`를 추가합니다.
- Solid 배경을 사용하는 컴포넌트가 팔레트 색상이나 `$color.fg.neutral-inverted` 대신 새 전경색 토큰을 참조하도록 변경합니다. 기존과 값이 같아 화면은 그대로이며, Action Button `variant="neutralSolid"`의 로딩 인디케이터 색만 다크 모드에서 달라집니다.
- `$color.fg.neutral-inverted`는 기존 사용처의 하위 호환성을 위해 deprecated 상태로 유지하며, 각 패키지의 다음 major 버전에서 제거할 예정입니다.
