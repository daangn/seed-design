---
"@seed-design/stackflow": minor
"@seed-design/css": minor
---

`AppScreen` 액티비티 push 시, 해당 `AppScreen`으로 키보드 포커스가 이동되도록 수정하고, 가장 마지막에 등장한 `AppScreen` 안에서만 포커스가 유지되도록 수정합니다. `AlertDialog` 등 모달 컴포넌트 위에 `AppScreen`을 push하는 경우에도 `AlertDialog`에 포커스가 남아 있는 문제를 수정합니다.
