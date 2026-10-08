---
"@seed-design/lynx-react": patch
---

포커스된 `TextField.Input`·`TextField.Textarea`를 제거한 뒤 `blur` 이벤트가 오지 않으면 `TextField`와 상위 `Field`의 포커스 상태가 해제되지 않던 문제를 수정합니다.
