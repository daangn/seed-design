---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": patch
---

(BREAKING CHANGE: `badge` Recipe의 `pressed` variant를 제거합니다. `badge({ pressed })`를 쓰던 코드는 `pressed`를 지워야 합니다.) Lynx Badge Action의 눌림 표현을 React Badge와 같은 Scale Feedback으로 바꿉니다. 축소는 Main Thread에서 실행되며, `GlobalProps.motion`이 `"reduced"`이면 축소하지 않습니다.
