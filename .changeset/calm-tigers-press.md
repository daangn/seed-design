---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": minor
---

Lynx 컴포넌트의 pressed 색상 피드백을 개선합니다.

기존 Background Thread의 상태 갱신에 의존하던 pressed 색상 반응을
Main Thread의 `:active` 기반으로 개선하고, React와 동일한 색상 transition을 적용합니다.
짧은 탭에서도 색상 피드백이 빠르게 시작됩니다.

disabled·loading 상태의 입력 제한과 기존 pressed 상태 처리는 유지합니다.
