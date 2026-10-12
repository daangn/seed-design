---
"@seed-design/lynx-react": patch
---

포커스된 `TextField.Input`·`TextField.Textarea`를 제거한 뒤 `blur` 이벤트가 오지 않으면 포커스 상태가 남던 문제를 수정해, 입력을 제거할 때 `TextField`와 상위 `Field`의 포커스 상태도 해제합니다.
