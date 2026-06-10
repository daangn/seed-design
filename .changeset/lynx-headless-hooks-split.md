---
"@seed-design/lynx-react-use-controllable-state": minor
"@seed-design/lynx-react-use-press-tap": minor
"@seed-design/lynx-react": patch
---

Lynx 컴포넌트용 headless 훅을 별도 패키지로 분리했습니다.

- `@seed-design/lynx-react-use-controllable-state`: controlled/uncontrolled 상태 패턴
- `@seed-design/lynx-react-use-press-tap`: 터치 기반 press/tap 인터랙션

`@seed-design/lynx-react` 컴포넌트는 이 훅들을 내부적으로 사용합니다. 훅을 직접 쓰려면 각 패키지에서 import하세요. (`@seed-design/react`가 유틸 훅을 메인 export하지 않는 것과 동일한 정책)
