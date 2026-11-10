---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

`SeedProvider`에 `supportsLiquidGlass`와 `glassEffect`를 추가합니다. 두 값이 모두 켜진 트리에서 Chip과 FloatingActionButton이 iOS Liquid Glass(`<blur-view blur-effect="glass">`)로 그려지고, 현재 상태의 배경색이 glass tint가 됩니다. 값을 넘기지 않으면 지금과 같이 그려집니다.
