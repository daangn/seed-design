---
"@seed-design/cli": patch
---

- `seed-design compat` 명령어를 추가해 현재 프로젝트의 스니펫과 `@seed-design/react`, `@seed-design/css` 버전 호환성을 비대화형으로 점검할 수 있도록 개선합니다.
- `add`, `add-all` 실행 시 스니펫의 요구 버전과 프로젝트 버전을 semver로 비교해, 호환되지 않는 항목을 경고하도록 개선합니다.
