---
"@seed-design/cli": minor
---

Lynx 프레임워크 스니펫 시스템 지원 추가

- `seed-design.json`에 `framework` 필드 추가 (`"react"` | `"lynx"`, 기본값 `"react"`)
- `init` 시 `@lynx-js/react` 또는 `@seed-design/lynx-react` 의존성 감지를 통한 프레임워크 자동 감지
- 모든 CLI 명령(`add`, `add-all`, `compat`)에 `--framework`/`-f` 플래그 추가
- 프레임워크별 호환성 패키지 검사 지원 (`@seed-design/lynx-react`, `@seed-design/lynx-css`)
