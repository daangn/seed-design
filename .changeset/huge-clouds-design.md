---
"@seed-design/react-snackbar": patch
---

Snackbar 타이머가 멈추는 기준을 `focus`에서 `focus-visible`로 수정하여 `pauseOnInteraction={true}`인 경우 Snackbar가 닫히지 않는 문제를 수정합니다.
