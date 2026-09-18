---
"@seed-design/stackflow": patch
---

peer dependency가 검증하지 않은 Stackflow 메이저 버전까지 허용하던 문제를 수정합니다. 이제 `@stackflow/react`는 `^1.4.1 || ^2.0.0`, `@stackflow/core`는 `^1.1.0 || ^2.0.0 || ^3.0.0` 범위를 지원합니다.
