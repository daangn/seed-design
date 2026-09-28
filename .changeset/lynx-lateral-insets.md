---
"@seed-design/lynx-react": minor
---

`AppBar`가 좌우 safe area inset을 반영합니다.

- `AppBar`의 내용이 좌우 inset만큼 안쪽으로 들어가서, 좌우 inset이 있는 화면에서도 디스플레이 컷아웃에 가려지지 않습니다. cupertino 테마의 가운데 타이틀은 safe area 안에서 가운데에 옵니다.
- cupertino 테마에서 가운데 타이틀이 길면 좌우 버튼과 겹치던 문제를 고칩니다.
- `useSafeArea`가 호스트 앱의 `lynx.__globalProps`에서 좌우 inset을 읽어 `safeAreaInsetLeft`, `safeAreaInsetRight`로 반환합니다. 호스트가 값을 주지 않으면 `env(safe-area-inset-*)`로 fallback합니다.
- 내용을 좌우 inset만큼 안쪽으로 넣어야 하는 영역은 `Box`의 `pl`, `pr`에 `"safeArea"`를 지정합니다.
