---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

Chip과 FloatingActionButton을 iOS Liquid Glass(`<blur-view blur-effect="glass">`)로 그릴 수 있습니다. `SeedProvider`의 `supportsLiquidGlass`가 켜져 있을 때, `SeedProvider`나 컴포넌트의 `glassEffect`로 적용하며 컴포넌트 값이 `SeedProvider` 값을 덮어씁니다. glass일 때는 현재 상태의 Recipe 배경색이 glass tint가 됩니다. tint는 Rootage 토큰에서 테마별로 생성한 값(Chip·FloatingActionButton Recipe 모듈의 `glassTint`)이며, 반투명 색도 alpha를 유지합니다. `className`으로 바꾼 배경은 tint에 반영되지 않습니다. 값을 넘기지 않으면 지금과 같이 그려집니다.
