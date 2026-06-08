---
"@seed-design/lynx-use-controllable-state": minor
"@seed-design/lynx-use-press-tap": minor
"@seed-design/lynx-react": patch
---

Lynx 컴포넌트용 headless 훅을 별도 패키지로 분리했습니다.

- `@seed-design/lynx-use-controllable-state`: controlled/uncontrolled 상태 패턴
- `@seed-design/lynx-use-press-tap`: 터치 기반 press/tap 인터랙션

`@seed-design/lynx-react`는 두 훅을 계속 re-export하므로 기존 import는 그대로 동작합니다.
