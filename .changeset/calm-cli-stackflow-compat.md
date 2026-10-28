---
"@seed-design/cli": patch
---

`add`·`add-all`·`compat`이 스니펫의 버전 요구를 더 정확히 검사합니다.

- 스니펫이 요구하는 `@seed-design/stackflow` 버전도 검사합니다. 설치된 Stackflow가 `ui:app-screen` 스니펫의 요구 범위보다 낮으면 경고를 보여줍니다.
- `package.json`의 선언 범위(예: `^2.0.6`)보다 실제 설치된 버전을 먼저 사용합니다. 선언 범위가 요구 범위와 겹쳐도 설치된 버전이 낮으면 경고합니다. 설치본이 없으면 기존처럼 선언을 사용합니다.
