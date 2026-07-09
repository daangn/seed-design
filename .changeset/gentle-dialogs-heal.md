---
"@seed-design/react-dialog": patch
---

Dialog Content가 `DialogTitle`/`DialogDescription`이 실제로 렌더된 경우에만 각각 `aria-labelledby`/`aria-describedby`를 노출하도록 수정합니다.

- 기존에는 `DialogTitle` 또는 `DialogDescription` 없이 Dialog를 사용해도 content가 존재하지 않는 id를 가리켜 dangling 참조가 되는 접근성 문제가 있었습니다. 이제 해당 파트가 렌더된 동안에만 대응하는 aria 속성이 부여됩니다.
