---
"@seed-design/cli": patch
---

CLI 텔레메트리 수집을 개선합니다.

- `add`, `add-all`, `compat`, `docs`, `init` 명령어의 실행 결과를 `completed`, `cancelled`, `failed`로 구분해 수집합니다.
- `compat` 명령어는 `compatible`, `incompatible`, `empty` 결과를 추가로 구분해 수집합니다.
- 텔레메트리 실패 테스트를 보강하고, 실패 시에는 상세 메시지 대신 안전한 에러 타입만 전송하도록 정리합니다.
