---
"@seed-design/lynx-react": minor
---

Lynx에서 좌우 safe area inset을 반영합니다.

- `useSafeArea`가 호스트 앱의 `lynx.__globalProps.safeAreaInsetLeft`, `safeAreaInsetRight`를 읽어 `safeAreaInsetLeft`, `safeAreaInsetRight`를 반환합니다. 호스트가 `0`을 주입하면 `0px`를 그대로 사용하고, 값이 없으면 `env(safe-area-inset-*)`로 fallback합니다.
- `AppBar`의 좌우 padding에 inset을 더하고, cupertino 테마의 가운데 타이틀이 safe area 안에서 가운데에 오도록 맞춥니다.
- cupertino 테마의 가운데 타이틀이 길어도 좌우 버튼과 겹치지 않도록, 타이틀 여백에 `AppBar`의 좌우 padding을 포함합니다.
- `Box`의 `pl`, `pr`에 `"safeArea"` 값을 지정할 수 있습니다.
