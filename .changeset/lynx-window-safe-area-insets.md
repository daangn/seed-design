---
"@seed-design/lynx-react": minor
"@seed-design/lynx-react-use-safe-area": minor
"@seed-design/lynx-react-floating": minor
"@seed-design/lynx-react-select": minor
"@seed-design/lynx-react-menu": minor
"@seed-design/lynx-react-popover": minor
---

`SeedProvider`에 화면 전체(window) 기준 Safe Area를 넘기는 `windowSafeAreaInsets`를 추가합니다.

- `container`를 지정해 native overlay에 그리는 Bottom Sheet·Menu Sheet·Dialog·Alert Dialog·Menu·Select·Help Bubble은 `windowSafeAreaInsets`로 여백과 위치 경계를 정합니다. LynxView가 탭이나 채팅 화면 상단에 임베드되어 `safeAreaInsets`가 `0`이어도 시트가 home indicator 영역과 겹치지 않습니다.
- `windowSafeAreaInsets`를 넘기지 않거나 `container`가 없는 레이어는 지금처럼 `safeAreaInsets`를 씁니다.
- `useSeedContext()`가 `windowSafeAreaInsets`를 반환합니다.
