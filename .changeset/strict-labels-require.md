---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `Field.Root` 밖의 `Field.Label`·`FieldLabel`을 `Field.Root` 안으로 옮겨야 합니다.)

`Field.Label`을 필드 상태를 읽는 파트로 변경해, 이전과 달리 `Field.Root` 밖에서 렌더링하면 오류가 발생합니다.
