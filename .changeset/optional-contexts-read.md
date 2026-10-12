---
"@seed-design/lynx-react": minor
---

`useAttachmentInputContext`·`useAttachmentInputItemContext`·`useAttachmentDisplayContext`·`useAttachmentDisplayItemContext`에 `{ strict: false }` 옵션을 추가해, Provider 안팎에서 함께 쓰는 컴포넌트가 context 유무를 확인할 수 있도록 합니다.

- 이전에는 Provider 밖에서 호출하면 항상 오류가 발생했습니다. 이제 `{ strict: false }`를 전달하면 `null`을 반환하며, 옵션을 생략하면 기존처럼 오류가 발생합니다.
