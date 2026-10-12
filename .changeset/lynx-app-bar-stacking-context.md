---
"@seed-design/lynx-css": major
---

(BREAKING CHANGE: `--z-index-app-bar`를 제거하고 `.seed-app-bar__root` 또는 `AppBar.Root`에 `z-index`를 직접 지정해야 합니다.)

`AppBar`가 scroll container 안에서 배경과 좌우 버튼을 함께 스크롤하도록 자체 stacking context를 만듭니다.

- 이전에는 `--z-index-app-bar`로 쌓임 순서를 조정했지만, 이제 이 변수는 사용하지 않고 Root의 `z-index`를 직접 적용합니다.
