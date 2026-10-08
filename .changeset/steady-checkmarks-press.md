---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: `checkmark` Recipe의 `pressed` variant를 제거합니다. `checkmark({ pressed })`를 쓰던 코드는 `pressed`를 지워야 합니다.) Lynx Checkbox의 눌림 색을 Main Thread `:active`로만 적용합니다. ghost variant는 놓는 순간 선택이 바뀌어도 사라지는 눌림 색이 바뀌지 않습니다.
