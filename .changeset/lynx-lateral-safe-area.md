---
"@seed-design/lynx-react": minor
---

`useSafeArea`와 `Box`가 좌우 safe area inset을 지원합니다.

- `useSafeArea`가 호스트 앱의 `lynx.__globalProps`에서 좌우 inset을 읽어 `safeAreaInsetLeft`, `safeAreaInsetRight`로 반환합니다. 호스트가 값을 주지 않으면 `env(safe-area-inset-*)`로 fallback합니다.
- 내용을 좌우 inset만큼 안쪽으로 넣어야 하는 영역은 `Box`의 `pl`, `pr`에 `"safeArea"`를 지정합니다.
