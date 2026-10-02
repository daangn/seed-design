---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": patch
---

(BREAKING CHANGE: `reaction-button` Recipe의 `pressed` variant를 제거합니다. `reactionButton({ pressed })`를 쓰던 코드는 `pressed`를 지워야 합니다.) Lynx ReactionButton의 눌림 색을 Main Thread `:active`로만 적용합니다. 눌림 색을 바꾸려고 Background에서 다시 렌더링하지 않습니다.
